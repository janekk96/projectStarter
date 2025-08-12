from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from sqlalchemy.sql import func
from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTableUUID
from .database import Base


class User(SQLAlchemyBaseUserTableUUID, Base):
    __tablename__ = 'users'
