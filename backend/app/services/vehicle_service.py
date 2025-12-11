from sqlalchemy.orm import Session
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate, VehicleUpdate


class VehicleService:
    def create_vehicle(self, db: Session, vehicle: VehicleCreate) -> Vehicle:
        db_vehicle = Vehicle(**vehicle.model_dump())
        db.add(db_vehicle)
        db.commit()
        db.refresh(db_vehicle)
        return db_vehicle

    def get_vehicle(self, db: Session, vehicle_id: int) -> Vehicle | None:
        return db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()

    def update_vehicle(self, db: Session, vehicle_id: int, vehicle: VehicleUpdate) -> Vehicle | None:
        db_vehicle = self.get_vehicle(db, vehicle_id)
        if db_vehicle:
            for key, value in vehicle.model_dump(exclude_unset=True).items():
                setattr(db_vehicle, key, value)
            db.commit()
            db.refresh(db_vehicle)
        return db_vehicle

    def delete_vehicle(self, db: Session, vehicle_id: int) -> bool:
        db_vehicle = self.get_vehicle(db, vehicle_id)
        if db_vehicle:
            db.delete(db_vehicle)
            db.commit()
            return True
        return False

    def get_all_vehicles(self, db: Session) -> list[Vehicle]:
        return db.query(Vehicle).all()