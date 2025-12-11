# Oradea2Wheels

## Overview

This project is a bike and scooter rental application built using FastAPI. It provides a RESTful API for managing rentals, users, and vehicles. The application allows users to register, rent vehicles, and manage their profiles.

## Features

- User registration and authentication
- Vehicle management (add, update, retrieve)
- Rental management (create, update, delete, retrieve)
- Secure password handling and token-based authentication

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd backend
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

## License

This project is licensed under the MIT License. See the LICENSE file for more details.