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
## Update Profile

- **URL:** `/api/users/update-profile`
- **Method:** `PUT`
- **Authorization:** Bearer Token (Include the user's JWT token in the Authorization header)

- **Request:**
  - Body:
    - `username` (string): New username for the user
    - `email` (string): New email for the user
    - `profile` (string): New profile information for the user

- **Response:**
  - Status Code: `200 OK`
  - Body: `{ user: { updated user object } }`
  - Status Code: `400 Bad Request`
  - Body: `{ message: "Username or email already exists." }`
  - Status Code: `500 Internal Server Error`
  - Body: `{ message: "Internal Server Error" }`

## Delete Account

- **URL:** `/api/user/delete-account`
- **Method:** `DELETE`
- **Authorization:** Bearer Token (Include the user's JWT token in the Authorization header)

- **Response:**
  - Status Code: `200 OK`
  - Body: `{ message: "Account deleted successfully." }`
  - Status Code: `500 Internal Server Error`
  - Body: `{ message: "Internal Server Error" }`

## Google Signup

- **Endpoint:** `/api/users/google/signup`
- **Method:** `GET`

Initiates the Google Sign Up process.

Redirect to Google's authentication page.

## Google Callback

- **Endpoint:** `/api/users/google/callback`
- **Method:** `GET`

Handles the callback after a successful Google authentication.

Redirects to the home page.

### Error Handling

In case of an error, the API will return a JSON response with an appropriate error message.

Example:

```json
{
  "error": "Invalid credentials. Please check your username and password."
}

