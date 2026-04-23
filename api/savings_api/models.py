from sqlalchemy import Column, String, Numeric, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime


class Goal(Base):
    __tablename__ = "goals"

    id = Column(String(36), primary_key=True)
    name = Column(String(255), nullable=False)
    target = Column(Numeric(10, 2), nullable=False)
    deadline = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    deposits = relationship("Deposit", back_populates="goal", cascade="all, delete")


class Deposit(Base):
    __tablename__ = "deposits"

    id = Column(String(36), primary_key=True)
    goal_id = Column(String(36), ForeignKey("goals.id"), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    goal = relationship("Goal", back_populates="deposits")