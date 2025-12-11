# Bike and Scooter Rental FastAPI

## Overview

This project is a bike and scooter rental application built using FastAPI. It provides a RESTful API for managing rentals, users, and vehicles. The application allows users to register, rent vehicles, and manage their profiles.

## Features

- User registration and authentication
- Vehicle management (add, update, retrieve)
- Rental management (create, update, delete, retrieve)
- Secure password handling and token-based authentication

## Project Structure

```
bike-scooter-rental-fastapi
├── app
│   ├── main.py                # Entry point of the FastAPI application
│   ├── api
│   │   ├── dependencies.py     # Dependency functions for the application
│   │   └── routers
│   │       ├── rentals.py      # Routes for rental management
│   │       ├── users.py        # Routes for user management
│   │       └── vehicles.py      # Routes for vehicle management
│   ├── core
│   │   ├── config.py           # Configuration settings
│   │   └── security.py         # Security-related functions
│   ├── db
│   │   ├── base.py             # Base model for the database
│   │   └── session.py          # Database session management
│   ├── models
│   │   ├── rental.py           # Rental model
│   │   ├── user.py             # User model
│   │   └── vehicle.py          # Vehicle model
│   ├── schemas
│   │   ├── rental.py           # Pydantic schemas for rental validation
│   │   ├── user.py             # Pydantic schemas for user validation
│   │   └── vehicle.py          # Pydantic schemas for vehicle validation
│   └── services
│       ├── rental_service.py    # Business logic for rentals
│       └── vehicle_service.py    # Business logic for vehicles
├── scripts
│   └── init_db.py              # Script for initializing the database
├── tests
│   ├── __init__.py             # Marks the tests directory as a package
│   └── test_rentals.py         # Unit tests for rental functionality
├── requirements.txt             # Project dependencies
├── pyproject.toml               # Project configuration
├── .env.example                 # Example environment variables
└── README.md                    # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd bike-scooter-rental-fastapi
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install the dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up the environment variables by copying `.env.example` to `.env` and updating the values as needed.

5. Initialize the database:
   ```
   python scripts/init_db.py
   ```

## Usage

To run the application, use the following command:
```
uvicorn app.main:app --reload
```

Visit `http://127.0.0.1:8000/docs` to access the interactive API documentation.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.