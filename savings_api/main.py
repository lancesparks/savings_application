from fastapi import FastAPI
import models
from database import engine
from routers import goals, user


app = FastAPI()

models.Base.metadata.create_all(bind=engine)

app.include_router(goals.router)
app.include_router(user.router)
