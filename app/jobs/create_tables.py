from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from models import Base  # Assuming Base is where your models are declared
import asyncio

DATABASE_URL = "postgresql+asyncpg://omarayadi:yourpassword@localhost:5432/gearfinderdb"
engine = create_async_engine(DATABASE_URL, echo=True)
async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

asyncio.run(create_tables())
