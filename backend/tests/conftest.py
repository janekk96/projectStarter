import asyncio
import pytest
from httpx import AsyncClient

from app.main import app
from app.users import get_async_session
from tests.test_db import get_test_async_session, init_test_db, cleanup_test_db


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="function")
async def test_db():
    """Create a clean database for each test."""
    await init_test_db()
    yield
    await cleanup_test_db()


@pytest.fixture(scope="function")
async def client(test_db):
    """Create an async test client with dependency overrides."""
    app.dependency_overrides[get_async_session] = get_test_async_session

    from httpx import ASGITransport
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        yield ac

    app.dependency_overrides.clear()
