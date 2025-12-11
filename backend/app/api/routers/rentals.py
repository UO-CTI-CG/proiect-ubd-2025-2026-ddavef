from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.rental import RentalCreate, RentalUpdate, Rental as RentalSchema
from app.services.rental_service import RentalService

router = APIRouter()
rental_service = RentalService()

@router.post("/rentals/", response_model=RentalSchema)
def create_rental(rental: RentalCreate, db: Session = Depends(get_db)):
    return rental_service.create_rental(db=db, rental=rental)

@router.get("/rentals/{rental_id}", response_model=RentalSchema)
def read_rental(rental_id: int, db: Session = Depends(get_db)):
    rental = rental_service.get_rental(db=db, rental_id=rental_id)
    if rental is None:
        raise HTTPException(status_code=404, detail="Rental not found")
    return rental

@router.put("/rentals/{rental_id}", response_model=RentalSchema)
def update_rental(rental_id: int, rental: RentalUpdate, db: Session = Depends(get_db)):
    updated_rental = rental_service.update_rental(db=db, rental_id=rental_id, rental_update=rental)
    if updated_rental is None:
        raise HTTPException(status_code=404, detail="Rental not found")
    return updated_rental

@router.delete("/rentals/{rental_id}", response_model=dict)
def delete_rental(rental_id: int, db: Session = Depends(get_db)):
    success = rental_service.delete_rental(db=db, rental_id=rental_id)
    if not success:
        raise HTTPException(status_code=404, detail="Rental not found")
    return {"detail": "Rental deleted successfully"}