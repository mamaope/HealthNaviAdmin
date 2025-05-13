import os
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.pool import AsyncAdaptedQueuePool
from dotenv import load_dotenv

ENV = os.getenv('ENV', 'development')

if ENV != 'production':
    load_dotenv()

# Get database configuration from environment variables
db_config = {
    'host': os.environ.get('POSTGRES_HOST'),
    'port': os.environ.get('POSTGRES_PORT'),
    'name': os.environ.get('POSTGRES_DB'),
    'user': os.environ.get('POSTGRES_USER'),
    'password': os.environ.get('POSTGRES_PASSWORD')
}

# Validate that all required variables are present
missing_vars = [key for key, value in db_config.items() if not value]
if missing_vars:
    raise Exception(f"Missing required database environment variables: {', '.join(f'POSTGRES_{key.upper()}' for key in missing_vars)}")

DATABASE_URL = (
    f"postgresql+asyncpg://"
    f"{db_config['user']}:{db_config['password']}"
    f"@{db_config['host']}:{db_config['port']}"
    f"/{db_config['name']}"
)

engine = create_async_engine(
    DATABASE_URL,
    echo=ENV != 'production',
    pool_size=20,  # Increased pool size for production
    max_overflow=30,  # Allow more connections when pool is full
    pool_timeout=30,  # Timeout for getting a connection from pool
    pool_pre_ping=True,  # Enable connection health checks
    poolclass=AsyncAdaptedQueuePool,  # Use async-compatible pool
    pool_recycle=1800  # Recycle connections every 30 minutes
)

# Create async session factory
AsyncSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False  # Prevent expired objects after commit
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
