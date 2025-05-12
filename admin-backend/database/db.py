import os
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv

ENV = os.getenv('ENV', 'development')
if ENV == 'production':
    # In production, set environment variables in the container
    if not all([os.getenv('POSTGRES_USER'), os.getenv('POSTGRES_PASSWORD'),
                os.getenv('POSTGRES_HOST'), os.getenv('POSTGRES_PORT'),
                os.getenv('POSTGRES_DB')]):
        raise Exception("Missing required database environment variables in production")
else:
    # In development, load from .env file
    load_dotenv()

DATABASE_URL = (
    f"postgresql+asyncpg://"
    f"{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}"
    f"@{os.getenv('POSTGRES_HOST')}:{os.getenv('POSTGRES_PORT')}"
    f"/{os.getenv('POSTGRES_DB')}"
)
engine = create_async_engine(DATABASE_URL, echo=True)

# Create async session factory
AsyncSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=AsyncSession,
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
