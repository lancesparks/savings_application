from fastapi import APIRouter
from fastapi import APIRouter, Depends, HTTPException, Path
from pydantic import BaseModel, Field
from typing import Annotated
from starlette import status
from db_dependency import db_dependency
from models import Deposit


router = APIRouter()

@router.get("/deposits", status_code=status.HTTP_200_OK)
def get_all_deposits(db: db_dependency):
    return db.query(Deposit).all()