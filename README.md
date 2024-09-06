# Heroes API

## Overview

This project is a API built to manage a collection of heroes. It allows authenticated users to perform CRUD operations (Create, Read, Update, and Delete) on a MongoDB database. User authentication and authorization are handled via a PostgreSQL database.

The API is designed with a focus on scalability, security, and maintainability, ensuring that only authenticated users can manage the data. It is fully tested with high code coverage, guaranteeing the quality and reliability of the application.

## Features

- **CRUD Operations**: Create, Read, Update, and Delete heroes.
- **Authentication**: Secure user authentication using PostgreSQL.
- **MongoDB Integration**: Heroes are stored and managed in a MongoDB database.
- **Test Coverage**: Comprehensive test suite ensuring high-quality code.
- **Scalable**: Built to handle large datasets and numerous users.

## Tech Stack

- **Node.js**: Backend framework.
- **MongoDB**: For storing hero data.
- **PostgreSQL**: For user authentication.
- **Mocha**: For unit and integration tests.
- **JWT**: For securing API endpoints.
- **Hapi**: Web framework for routing and middleware.
- **Swagger**: Documentation.

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/heroes-api.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables for MongoDB, PostgreSQL, and JWT.

4. Run docker containers:

- Client for PostgreSQL
   ```bash
   docker run \
    --name postgres \
    -e POSTGRES_USER=victorFranco \
    -e POSTGRES_PASSWORD=mySecretPassword \
    -e POSTGRES_DB=heroes \
    -p 5432:5432 \
    -d \
    postgres

   docker exec -it postgres /bin/bash
   ```

- Client for PostgreSQL
```bash
docker run \
 --name adminer \
 -p 9090:8080 \
 --link postgres \
 -d \
 adminer
```

- MongoDB
```bash
docker run \
 --name mongodb \
 -p 27017:27017 \
 -e MONGO_INITDB_ROOT_USERNAME=admin \
 -e MONGO_INITDB_ROOT_PASSWORD=mySecretPassword \
 -d \
 mongo:4
```

- Client for MongoDB
```bash
docker run \
 --name mongoclient \
 -p 3000:3000 \
 --link mongodb:mongodb \
 -d \
 mongoclient/mongoclient
```

5. Run the application:
   ```bash
   npm run prod
   ```
6. Run tests:
   ```bash
   npm test
   ```

## API Endpoints

<!-- - **POST** `/heroes` - Create a new hero.
- **GET** `/heroes` - Get a list of heroes.
- **GET** `/heroes/:id` - Get a specific hero by ID.
- **PUT** `/heroes/:id` - Update hero information.
- **DELETE** `/heroes/:id` - Delete a hero. -->

The API endpoints can be view on swagger, starting the API and navigating to `/documentation` endpoint.

## Testing

The API is covered by automated tests that verify the correctness of each feature. Tests ensure that user authentication, data validation, and all CRUD operations are working as expected.

Run the tests using:

```bash
npm test
```

## Contributions

Contributions are welcome! Feel free to fork the repository, create a new branch, and submit a pull request for review.
