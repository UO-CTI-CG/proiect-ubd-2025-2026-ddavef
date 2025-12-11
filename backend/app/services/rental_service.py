from sqlalchemy.orm import Session
from app.models.rental import Rental
from app.schemas.rental import RentalCreate, RentalUpdate


class RentalService:
    def create_rental(self, db: Session, rental: RentalCreate) -> Rental:
        db_rental = Rental(**rental.model_dump())
        db.add(db_rental)
        db.commit()
        db.refresh(db_rental)
        return db_rental

    def get_rental(self, db: Session, rental_id: int) -> Rental:
        return db.query(Rental).filter(Rental.id == rental_id).first()

    def update_rental(self, db: Session, rental_id: int, rental_update: RentalUpdate) -> Rental:
        db_rental = self.get_rental(db, rental_id)
        if db_rental:
            for key, value in rental_update.model_dump(exclude_unset=True).items():
                setattr(db_rental, key, value)
            db.commit()
            db.refresh(db_rental)
        return db_rental

    def delete_rental(self, db: Session, rental_id: int) -> bool:
        db_rental = self.get_rental(db, rental_id)
        if db_rental:
            db.delete(db_rental)
            db.commit()
            return True
        return False

    def get_all_rentals(self, db: Session) -> list[Rental]:
        return db.query(Rental).all()