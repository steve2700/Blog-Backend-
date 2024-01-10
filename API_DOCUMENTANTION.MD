# API Documentation

## User Endpoints

### signup User

- **URL:** `/api/users/signup`
- **Method:** `POST`
- **Request:**
  - Body:
    - `username` (string): User's username
    - `email` (string): User's email
    - `password` (string - strong password with one uppercase one special character): User's password

- **Response:**
  - Status Code: `201 Created`
  - Body: `{ "message": "User created successfully" }`

### Login User

- **URL:** `/api/users/login`
- **Method:** `POST`
- **Request:**
  - Body:
    - `email` (string): User's email
    - `password` (string): User's password

- **Response:**
  - Status Code: `200 OK`
  - Body: `{ token: 'jwt-token' }`
## Forgot Password

- **URL:** `/api/users/forgot-password`
- **Method:** `POST`
- **Request:**
  - Body:
    - `email` (string): User's registered email address

- **Response:**
  - Status Code: `200 OK`
  - Body: `{ message: "Password reset instructions sent to your email." }`
  - Status Code: `404 Not Found`
  - Body: `{ message: "User not found." }`
  - Status Code: `500 Internal Server Error`
  - Body: `{ message: "Internal Server Error" }`
