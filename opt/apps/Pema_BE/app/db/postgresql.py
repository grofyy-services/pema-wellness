"""
PostgreSQL database configuration and connection management
"""

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import MetaData, text
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

# Database engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=300,
)

# Session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Base class for SQLModel
class Base(DeclarativeBase):
    metadata = MetaData(
        naming_convention={
            "ix": "ix_%(column_0_label)s",
            "uq": "uq_%(table_name)s_%(column_0_name)s",
            "ck": "ck_%(table_name)s_%(constraint_name)s",
            "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
            "pk": "pk_%(table_name)s"
        }
    )

async def get_db() -> AsyncSession:
    """Dependency to get database session"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception as e:
            await session.rollback()
            logger.error(f"Database session error: {e}")
            raise
        finally:
            await session.close()

async def get_db_with_retry(max_retries: int = 3) -> AsyncSession:
    """Dependency to get database session with retry logic"""
    for attempt in range(max_retries):
        try:
            async with AsyncSessionLocal() as session:
                # Test the connection
                await session.execute(text("SELECT 1"))
                yield session
                return
        except Exception as e:
            if attempt == max_retries - 1:
                logger.error(f"Database connection failed after {max_retries} attempts: {e}")
                raise
            else:
                logger.warning(f"Database connection attempt {attempt + 1} failed, retrying: {e}")
                import asyncio
                await asyncio.sleep(1)  # Wait 1 second before retry

async def init_db():
    """Initialize database connection"""
    try:
        # Test connection
        async with engine.begin() as conn:
            # Import all models to ensure they are registered
            from app.models import user, program, room, booking, payment, medical_form, notification, cms  # noqa

            # Create tables (in production, use Alembic migrations)
            if settings.DEBUG:
                await conn.run_sync(Base.metadata.create_all)
                logger.info("Database tables created successfully")

        logger.info("Database connection initialized successfully")
    except Exception as e:
        # In production/deployment, don't fail if database is temporarily unavailable
        # This allows the app to start and retry connections later
        if settings.DEBUG:
            logger.error(f"Failed to initialize database: {e}")
            raise
        else:
            logger.warning(f"Database not available during startup (this is normal during deployment): {e}")
            logger.info("Application will continue starting and retry database connections as needed")

async def close_db():
    """Close database connections"""
    await engine.dispose()
    logger.info("Database connections closed")
