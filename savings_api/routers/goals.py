from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from starlette import status
from database import db_dependency
from models import Goal, Deposit
from typing import Optional
from datetime import date
from .user import user_dependency

router = APIRouter(
    prefix="/goals", tags=["goals"]
)  # or


class GoalRequest(BaseModel):
    name: str = Field(min_length=3, max_length=100)
    target: float = Field(gt=0)
    initial_amount: Optional[float] = Field(default=0, ge=0)
    is_featured: Optional[bool] = Field(default=False)
    deadline: Optional[date] = None

    model_config = {
        "json_schema_extra": {
            "example": {
                "name": "Mechanical Keyboard",
                "target": 350,
                'initial_amount': 100,
                "is_featured": False,
                "deadline": None,
            }
        }
    }

def set_new_attributes(item, todo_request):
    for key, value in todo_request.model_dump().items():
        setattr(item, key, value)
    return item


@router.get("/", status_code=status.HTTP_200_OK)
def read_all_by_user(user:user_dependency, db: db_dependency):
    if user is None:
     raise HTTPException(status_code=401, detail="Auth Failed")
    return db.query(Goal).filter(Goal.user_id == user.get("id")).all()


@router.get("/{goal_id}", status_code=status.HTTP_200_OK)
def get_goal_by_id(user:user_dependency, db: db_dependency, goal_id:str):
    if user is None:
     raise HTTPException(status_code=401, detail="Auth Failed")
    
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == user.get("id") ).first()
    
    if goal is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    return goal
  

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_goal(user: user_dependency, db: db_dependency, goal: GoalRequest):
    if user is None:
        raise HTTPException(status_code=401, detail="Auth Failed")
    
    new_goal = Goal(**goal.model_dump(exclude={'initial_amount'}), user_id=user.get('id'))
    db.add(new_goal)
    db.flush()  # gets the new_goal.id without committing

    if goal.initial_amount:
        initial_deposit = Deposit(
            goal_id=new_goal.id,
            user_id=user.get('id'),
            amount=goal.initial_amount,
            note="Initial deposit"
        )
        db.add(initial_deposit)

    db.commit()
    db.refresh(new_goal)
    return get_goal_by_id(user, db, new_goal.id)

@router.put("/{goal_id}", status_code=status.HTTP_200_OK)
def update_goal(user:user_dependency, db: db_dependency, goal_id: str, goal: GoalRequest):
   
    if user is None:
     raise HTTPException(status_code=401, detail="Auth Failed")
    
    item = db.query(Goal).filter(Goal.id == goal_id,Goal.user_id == user.get('id')).first()

    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    updated_goal = set_new_attributes(item, goal)
    db.commit()
    db.refresh(updated_goal) 

    return updated_goal


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(user: user_dependency, db: db_dependency, goal_id: str):
    if user is None:
        raise HTTPException(status_code=401, detail="Auth Failed")
    
    item = db.query(Goal).filter(Goal.id == goal_id).filter(Goal.user_id == user.get('id')).first()

    if item is None:
        raise HTTPException(status_code=404, detail="Goal not found")

    db.delete(item)
    db.commit()