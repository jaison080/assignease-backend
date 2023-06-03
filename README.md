# AssignEase Backend

## Description

This is the backend for the AssignEase project. It is a RESTful API built with Node.js, Express, and MongoDB. It is hosted on Render and uses MongoDB Atlas for the database.

## API Documentation

Link : [API Documentation](https://github.com/jaison080/assignease-backend/blob/master/Documentation.pdf)

## Installation

1. Clone the repository.
2. Add .env file of the format below. Replace the values with your own.
3. Run `npm install` to install dependencies.
4. Run `npm start` to start the server.

## .env file

```
PORT = <Port Number>
MONGODB_URI = <MongoDB URI>
JWT_SECRET = <JWT Secret>
JWT_EXPIRY = <JWT Expiry>
SALT = <Salt for Password Hashing>
```

## Run on Docker Compose

```
docker compose up --build -d
```

## Run on Docker

```
docker build -t assignease-backend .
docker run -p 3000:3000 assignease-backend
```