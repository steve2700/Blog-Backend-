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
