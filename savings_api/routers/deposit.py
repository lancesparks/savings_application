from fastapi import APIRouter, Depends, HTTPException
from starlette import status
from database import db_dependency
from models import Deposit

router = APIRouter(
    prefix="/deposit", tags=["deposit"]
)  # or




@router.get("/", status_code=status.HTTP_200_OK)
def read_all( db: db_dependency):
    return db.query(Deposit).all()