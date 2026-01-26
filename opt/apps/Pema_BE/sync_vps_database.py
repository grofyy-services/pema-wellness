#!/usr/bin/env python3
"""
Sync VPS database schema with main database
"""

import asyncio
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from app.core.config import settings

async def sync_vps_database():
    """Sync the VPS database schema with the main database"""

    # Connect to main database
    main_engine = create_async_engine(settings.DATABASE_URL.replace("55432", "55432"))
    main_session = sessionmaker(main_engine, class_=AsyncSession, expire_on_commit=False)

    # Connect to VPS database
    vps_engine = create_async_engine(settings.DATABASE_URL.replace("55432", "5434"))
    vps_session = sessionmaker(vps_engine, class_=AsyncSession, expire_on_commit=False)

    async with main_session() as main_db, vps_session() as vps_db:
        try:
            print("🔍 Analyzing database differences...")

            # Get tables from main database
            main_tables_result = await main_db.execute(text("""
                SELECT tablename FROM pg_tables
                WHERE schemaname = 'public'
                ORDER BY tablename
            """))
            main_tables = {row.tablename for row in main_tables_result}

            # Get tables from VPS database
            vps_tables_result = await vps_db.execute(text("""
                SELECT tablename FROM pg_tables
                WHERE schemaname = 'public'
                ORDER BY tablename
            """))
            vps_tables = {row.tablename for row in vps_tables_result}

            missing_tables = main_tables - vps_tables
            print(f"📋 Main DB has {len(main_tables)} tables")
            print(f"📋 VPS DB has {len(vps_tables)} tables")
            print(f" Missing tables in VPS: {missing_tables}")

            # Create missing tables
            for table in missing_tables:
                print(f"🛠️ Creating table: {table}")

                # Get CREATE TABLE statement from main database
                create_result = await main_db.execute(text(f"""
                    SELECT
                        'CREATE TABLE ' || tablename || ' (' ||
                        string_agg(
                            column_name || ' ' ||
                            data_type ||
                            CASE WHEN character_maximum_length IS NOT NULL
                                 THEN '(' || character_maximum_length || ')'
                                 ELSE '' END ||
                            CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END,
                            ', '
                        ) || ');' as create_stmt
                    FROM information_schema.columns
                    WHERE table_name = '{table}' AND table_schema = 'public'
                    GROUP BY tablename
                """))

                create_stmt = create_result.scalar()
                if create_stmt:
                    # Clean up the statement
                    create_stmt = create_stmt.replace('character varying', 'VARCHAR')
                    create_stmt = create_stmt.replace('timestamp with time zone', 'TIMESTAMP WITH TIME ZONE')
                    create_stmt = create_stmt.replace('boolean', 'BOOLEAN')
                    create_stmt = create_stmt.replace('integer', 'INTEGER')
                    create_stmt = create_stmt.replace('text', 'TEXT')
                    create_stmt = create_stmt.replace('json', 'JSON')

                    print(f"Executing: {create_stmt}")
                    await vps_db.execute(text(create_stmt))
                    await vps_db.commit()

                # Create indexes
                index_result = await main_db.execute(text(f"""
                    SELECT indexdef
                    FROM pg_indexes
                    WHERE tablename = '{table}' AND schemaname = 'public'
                    AND indexname NOT LIKE '%_pkey'
                """))

                for row in index_result:
                    index_stmt = row.indexdef
                    print(f"Creating index: {index_stmt}")
                    await vps_db.execute(text(index_stmt))
                    await vps_db.commit()

                # Create primary key constraint
                pk_result = await main_db.execute(text(f"""
                    SELECT conname, pg_get_constraintdef(c.oid) as constraint_def
                    FROM pg_constraint c
                    JOIN pg_class cl ON c.conrelid = cl.oid
                    WHERE cl.relname = '{table}' AND c.contype = 'p'
                """))

                for row in pk_result:
                    pk_stmt = f"ALTER TABLE {table} ADD CONSTRAINT {row.conname} {row.constraint_def};"
                    print(f"Creating primary key: {pk_stmt}")
                    await vps_db.execute(text(pk_stmt))
                    await vps_db.commit()

                print(f" Created table: {table}")

            # Special handling for room_availability schema update
            if 'room_availability' in vps_tables:
                print("🔄 Updating room_availability schema...")

                # Check if room_id column exists
                room_id_check = await vps_db.execute(text("""
                    SELECT column_name FROM information_schema.columns
                    WHERE table_name = 'room_availability' AND column_name = 'room_id'
                """))

                if room_id_check.scalar():
                    print("Removing room_id column and adding room_code...")
                    await vps_db.execute(text("ALTER TABLE room_availability DROP COLUMN room_id"))
                    await vps_db.commit()

                # Check if room_code column exists
                room_code_check = await vps_db.execute(text("""
                    SELECT column_name FROM information_schema.columns
                    WHERE table_name = 'room_availability' AND column_name = 'room_code'
                """))

                if not room_code_check.scalar():
                    await vps_db.execute(text("ALTER TABLE room_availability ADD COLUMN room_code VARCHAR(50)"))
                    await vps_db.commit()

                print(" Updated room_availability schema")

            # Copy data for missing tables
            for table in missing_tables:
                print(f"📋 Copying data for table: {table}")

                # Get data from main database
                data_result = await main_db.execute(text(f"SELECT * FROM {table}"))
                columns = data_result.keys()

                # Insert data into VPS database
                inserted_count = 0
                for row in data_result:
                    # Create INSERT statement
                    placeholders = ', '.join([':' + col for col in columns])
                    columns_str = ', '.join(columns)

                    insert_stmt = f"INSERT INTO {table} ({columns_str}) VALUES ({placeholders})"

                    # Convert row to dict
                    row_dict = dict(zip(columns, row))

                    await vps_db.execute(text(insert_stmt), row_dict)
                    inserted_count += 1

                await vps_db.commit()
                print(f" Copied {inserted_count} records for {table}")

            print("🎉 Database sync completed successfully!")

            # Final verification
            final_vps_tables_result = await vps_db.execute(text("""
                SELECT tablename FROM pg_tables
                WHERE schemaname = 'public'
                ORDER BY tablename
            """))
            final_vps_tables = {row.tablename for row in final_vps_tables_result}

            print("
📊 Final status:"            print(f"Main DB: {len(main_tables)} tables")
            print(f"VPS DB: {len(final_vps_tables)} tables")
            print(f"Remaining differences: {main_tables - final_vps_tables}")

        except Exception as e:
            print(f" Error during sync: {e}")
            await vps_db.rollback()
            raise
        finally:
            await main_db.close()
            await vps_db.close()

if __name__ == "__main__":
    asyncio.run(sync_vps_database())
