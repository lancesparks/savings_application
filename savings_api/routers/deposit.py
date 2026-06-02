from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from pydantic import BaseModel, Field
from starlette import status
from database import db_dependency
from models import Deposit,Goal
from typing import Optional
from datetime import date
from .user import user_dependency

router = APIRouter(
    prefix="/deposits", tags=["deposit"]
)  # or


class DepositRequest(BaseModel):
    amount: float = Field(gt=0)
    note: Optional[str]  = Field(min_length=3, max_length=100)
    model_config = {
        "json_schema_extra": {
            "example": {
                "amount": "1000",
                "note": "test note",
            }
        }
    }


@router.get("/", status_code=status.HTTP_200_OK)
def read_all_deposits_by_user(user:user_dependency, db: db_dependency):
    if user is None:
     raise HTTPException(status_code=401, detail="Auth Failed")
    return db.query(Deposit).filter(Deposit.user_id == user.get("id")).order_by(Deposit.created_at.desc()).all()


@router.post("/{goal_id}", status_code=status.HTTP_201_CREATED)
def add_new_deposit(user:user_dependency, db: db_dependency, goal_id: str,deposit: DepositRequest):
    if user is None:
     raise HTTPException(status_code=401, detail="Auth Failed")
    
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == user.get('id')).first()
   
    if goal is None:
     raise HTTPException(status_code=404, detail="Goal not found")
    
    new_deposit = Deposit(**deposit.model_dump(exclude={'goal_id'}), user_id=user.get('id'), goal_id=goal_id)

    db.add(new_deposit)
    db.commit()
    db.refresh(new_deposit) 

    return new_deposit



@router.delete("/{deposit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_deposit(user:user_dependency, db: db_dependency, deposit_id: str):
    if user is None:
     raise HTTPException(status_code=401, detail="Auth Failed")
    
    deposit = db.query(Deposit).filter(
        Deposit.id == deposit_id,
        Deposit.user_id == user.get('id')
    ).first()

    if deposit is None:
        raise HTTPException(status_code=404, detail="Deposit not found")

    db.delete(deposit)
    db.commit()
  


@router.get("/summary", status_code=status.HTTP_200_OK)
def get_monthly_summary(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Auth Failed")

    results = (
        db.query(
            func.date_format(Deposit.created_at, "%Y-%m").label("month"),
            func.sum(Deposit.amount).label("total")
        )
        .filter(Deposit.user_id == user.get("id"))
        .group_by("month")
        .order_by("month")
        .all()
    )

    return [{"month": r.month, "total": float(r.total)} for r in results]


