"""
Test database module with SQLite configuration
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.database import Base

# Test database engine using SQLite
test_engine = create_async_engine(
    "sqlite+aiosqlite:///./test.db",
    echo=False
)

TestAsyncSessionLocal = sessionmaker(
    test_engine, class_=AsyncSession, expire_on_commit=False
)


async def get_test_async_session():
    """Get test database session."""
    async with TestAsyncSessionLocal() as session:
        yield session


async def init_test_db():
    """Initialize test database."""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def cleanup_test_db():
    """Clean up test database."""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
