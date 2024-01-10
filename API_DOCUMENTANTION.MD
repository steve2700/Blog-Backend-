# Blog Post Backend API Documentation

## Users

### Sign Up

Endpoint: `POST /api/users/signup`

Creates a new user account.

#### Request Body

- `username` (string, required, 6 to 20 characters)
- `email` (string, required, valid email format)
- `password` (string, required, at least 6 characters)

#### Sample Request

```json
POST /api/users/signup
{
  "username": "exampleUser",
  "email": "user@example.com",
  "password": "strongPassword123"
}
Response
A successful signup will return a token and user information.
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "exampleUser",
    "email": "user@example.com",
    "profile": "No profile information available.",
    "role": "user",
    "_id": "uniqueUserId",
    "createdAt": "timestamp",
    "updatedAt": "timestamp",
    "__v": 0
  }
}

### Login User

- **URL:** `/api/user/login`
- **Method:** `POST`
- **Request:**
  - Body:
    - `email` (string): User's email
    - `password` (string): User's password

- **Response:**
  - Status Code: `200 OK`
  - Body: `{ token: 'jwt-token' }`

