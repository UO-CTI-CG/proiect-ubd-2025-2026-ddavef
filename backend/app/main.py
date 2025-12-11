from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers import rentals, users, vehicles

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rentals.router, prefix="/rentals", tags=["Rentals"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(vehicles.router, prefix="/vehicles", tags=["Vehicles"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Bike and Scooter Rental API!"}