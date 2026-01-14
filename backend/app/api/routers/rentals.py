from typing import List

from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.schemas.rental import RentalCreate, RentalUpdate, Rental as RentalSchema
from app.services.rental_service import RentalService
from app.models.user import User

router = APIRouter()
rental_service = RentalService()

@router.get("/", response_model=List[RentalSchema])
def list_rentals(db: Session = Depends(get_db)):
    return rental_service.get_all_rentals(db=db)


@router.post("/", response_model=RentalSchema, status_code=status.HTTP_201_CREATED)
def create_rental(
    rental: RentalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rental.user_id = current_user.id
    return rental_service.create_rental(db=db, rental=rental)


@router.get("/{rental_id}", response_model=RentalSchema)
def read_rental(rental_id: int, db: Session = Depends(get_db)):
    rental = rental_service.get_rental(db=db, rental_id=rental_id)
    if rental is None:
        raise HTTPException(status_code=404, detail="Rental not found")
    return rental


@router.put("/{rental_id}", response_model=RentalSchema)
def update_rental(
    rental_id: int,
    rental: RentalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    updated_rental = rental_service.update_rental(db=db, rental_id=rental_id, rental_update=rental)
    if updated_rental is None:
        raise HTTPException(status_code=404, detail="Rental not found")
    return updated_rental


@router.delete("/{rental_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_rental(
    rental_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    success = rental_service.delete_rental(db=db, rental_id=rental_id)
    if not success:
        raise HTTPException(status_code=404, detail="Rental not found")
    return None