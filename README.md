# Face Recognition Brain Backend

This document provides an overview of the Face Recognition Brain Backend, which is responsible for handling requests related to face recognition and user authentication.

## Table of Contents
1. [Project Structure](#project-structure)
2. [Dependencies](#dependencies)
3. [Scripts](#scripts)
4. [How It Works](#how-it-works)
5. [API Endpoints](#api-endpoints)
6. [Authentication](#authentication)
7. [Database](#database)

## Project Structure
The project structure is organized as follows:
- `index.js`: The main entry point of the application.
- `server.js`: The server setup and configuration.
- Other project files and directories.

## Dependencies
The backend relies on various dependencies, listed in the `package.json` file:
- `argon2`: Password hashing library for securely storing user passwords.
- `cors`: Middleware for handling Cross-Origin Resource Sharing.
- `express`: Web application framework for handling HTTP requests.
- `knex`: SQL query builder for database interactions.
- `pg`: PostgreSQL database driver.
- `nodemon` (DevDependency): Automatically restarts the server during development.

## Scripts
- `start`: Use `nodemon` to start the server. Automatically restarts the server on code changes.
- `test`: Placeholder script for running tests.

## How It Works
The Face Recognition Brain Backend is built using Node.js and Express.js. It provides a RESTful API for user authentication, profile management, and face recognition. Here's a brief overview of how it works:

- The server is started using `express` and listens for incoming HTTP requests.
- User passwords are securely hashed using the `argon2` library before being stored in the database.
- The `knex` library is used for interacting with the PostgreSQL database.

## API Endpoints
The backend provides the following API endpoints:

1. `POST /signin`: Allows users to sign in by providing their email and password. It returns either a success or failure response.
2. `POST /register`: Allows users to register by providing their name, email, and password. Upon successful registration, it returns user data.
3. `GET /profile/:id`: Retrieves user profile information by user ID.
4. `PUT /image`: Increments the number of entries for a user, typically used for face recognition.

## Authentication
User authentication is handled using secure password hashing with `argon2`. User passwords are hashed before being stored in the database to ensure their security.

## Database
The backend uses a PostgreSQL database named "brain-db" with the following schema:
- Users table: Stores user information including name, email, and the number of entries.
- Login table: Stores user login information, including email and hashed passwords.

## Usage
To run the backend locally, make sure you have PostgreSQL installed and configured with the correct connection settings in `server.js`. Then, follow these steps:
1. Install project dependencies using `npm install`.
2. Start the server using `npm start`.

The server will listen on the specified port (default is 5000) and can be accessed via API requests.

## Conclusion
The Face Recognition Brain Backend provides essential functionality for user authentication, profile management, and face recognition. This documentation serves as a guide for understanding the backend's structure and functionality.

---

Feel free to provide additional details or make any necessary modifications to this documentation. If you have any specific questions or need further assistance, please let me know.
