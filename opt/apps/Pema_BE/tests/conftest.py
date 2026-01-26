"""
Test configuration and fixtures
"""

import pytest
import asyncio
from typing import AsyncGenerator
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.db.postgresql import get_db, Base
from app.core.config import settings


# Test database URL (in-memory SQLite for testing)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

# Create test engine
test_engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestSessionLocal = async_sessionmaker(
    test_engine,
    class_=AsyncSession,
    expire_on_commit=False
)


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """Create a test database session."""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with TestSessionLocal() as session:
        yield session
    
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture(scope="function")
def client() -> TestClient:
    """Create a test client with DB override using the in-memory test engine."""
    import asyncio

    async def _create_schema():
        async with test_engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    async def _drop_schema():
        async with test_engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)

    asyncio.get_event_loop().run_until_complete(_create_schema())

    async def override_get_db():
        async with TestSessionLocal() as session:
            yield session

    # Disable startup/shutdown DB initialization to avoid hitting non-test DB
    try:
        app.router.on_startup.clear()
        app.router.on_shutdown.clear()
    except Exception:
        pass

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        try:
            yield test_client
        finally:
            app.dependency_overrides.clear()
            asyncio.get_event_loop().run_until_complete(_drop_schema())


@pytest.fixture
async def test_user(db_session: AsyncSession):
    """Create a test user."""
    from app.models.user import User
    
    user = User(
        name="Test User",
        email="test@example.com",
        phone="+1234567890",
        hashed_password="",
        role="user",
        is_active=True,
        is_verified=True
    )
    
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    
    return user


@pytest.fixture
async def test_admin(db_session: AsyncSession):
    """Create a test admin user."""
    from app.models.user import User
    
    admin = User(
        name="Test Admin",
        email="admin@example.com",
        phone="+1234567891",
        hashed_password="",
        role="admin",
        is_active=True,
        is_verified=True
    )
    
    db_session.add(admin)
    await db_session.commit()
    await db_session.refresh(admin)
    
    return admin


@pytest.fixture
async def test_program(db_session: AsyncSession):
    """Create a test program."""
    from app.models.program import Program
    
    program = Program(
        slug="test-wellness-program",
        title="Test Wellness Program",
        description="A test wellness program",
        program_type="wellness",
        duration_days_min=3,
        duration_days_max=7,
        price_base=50000,  # ₹500 in paise
        published=True,
        medical_form_required=True,
        doctor_approval_required=True
    )
    
    db_session.add(program)
    await db_session.commit()
    await db_session.refresh(program)
    
    return program


@pytest.fixture
def test_room():
    """Create a test room (sync wrapper)."""
    import asyncio
    from app.models.room import Room
    
    async def _create():
        room = Room(
            name="Test Premium Garden Room",
            category="Premium Garden",
            pricing_category="Premium Garden",  # Set pricing_category for estimate endpoint
            description="A comfortable premium garden room",
            occupancy_max_adults=2,
            occupancy_max_children=2,
            occupancy_max_total=4,
            price_per_night_single=64000,  # Match pricing tables
            price_per_night_double=107000,
            inventory_count=5,
            is_active=True,
            maintenance_mode=False
        )
        async with TestSessionLocal() as session:
            session.add(room)
            await session.commit()
            await session.refresh(room)
        return room
    return asyncio.get_event_loop().run_until_complete(_create())


@pytest.fixture
def test_suite_room():
    """Create a test suite room (requires full payment)."""
    import asyncio
    from app.models.room import Room
    
    async def _create():
        room = Room(
            name="Executive Suite Test",
            category="Executive Suite",
            pricing_category="Executive Suite",  # Set pricing_category for estimate endpoint
            description="Executive Suite",
            occupancy_max_adults=2,
            occupancy_max_children=2,
            occupancy_max_total=4,
            price_per_night_single=130000,  # matches pricing tables
            price_per_night_double=177000,
            inventory_count=3,
            is_active=True,
            maintenance_mode=False
        )
        async with TestSessionLocal() as session:
            session.add(room)
            await session.commit()
            await session.refresh(room)
        return room
    return asyncio.get_event_loop().run_until_complete(_create())


@pytest.fixture
def test_executive_room():
    """Create a test executive room."""
    import asyncio
    from app.models.room import Room

    async def _create():
        room = Room(
            name="Executive Room Test",
            category="Executive",
            pricing_category="Executive",
            description="Executive Room",
            occupancy_max_adults=2,
            occupancy_max_children=2,
            occupancy_max_total=4,
            price_per_night_single=84000,  # matches pricing tables
            price_per_night_double=130000,
            inventory_count=3,
            is_active=True,
            maintenance_mode=False
        )
        async with TestSessionLocal() as session:
            session.add(room)
            await session.commit()
            await session.refresh(room)
        return room
    return asyncio.get_event_loop().run_until_complete(_create())


@pytest.fixture
def test_pema_suite_room():
    """Create a test Pema Suite room."""
    import asyncio
    from app.models.room import Room

    async def _create():
        room = Room(
            name="Pema Suite Test",
            category="Pema Suite",
            pricing_category="Pema Suite",
            description="Pema Suite",
            occupancy_max_adults=2,
            occupancy_max_children=2,
            occupancy_max_total=4,
            price_per_night_single=290000,  # matches pricing tables
            price_per_night_double=370000,
            inventory_count=2,
            is_active=True,
            maintenance_mode=False
        )
        async with TestSessionLocal() as session:
            session.add(room)
            await session.commit()
            await session.refresh(room)
        return room
    return asyncio.get_event_loop().run_until_complete(_create())


@pytest.fixture
def test_elemental_villa_room():
    """Create a test Elemental Villa room."""
    import asyncio
    from app.models.room import Room

    async def _create():
        room = Room(
            name="Elemental Villa Test",
            category="Elemental Villa",
            pricing_category="Elemental Villa",
            description="Elemental Villa",
            occupancy_max_adults=2,
            occupancy_max_children=2,
            occupancy_max_total=4,
            price_per_night_single=200000,  # matches pricing tables
            price_per_night_double=260000,
            inventory_count=1,
            is_active=True,
            maintenance_mode=False
        )
        async with TestSessionLocal() as session:
            session.add(room)
            await session.commit()
            await session.refresh(room)
        return room
    return asyncio.get_event_loop().run_until_complete(_create())


@pytest.fixture
def auth_headers(test_user):
    """No authentication headers used (auth removed)."""
    return {}


@pytest.fixture
def admin_headers(test_admin):
    """No authentication headers used (auth removed)."""
    return {}
