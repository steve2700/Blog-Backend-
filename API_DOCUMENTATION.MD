# API Documentation


## Table of Contents
- [User Endpoints](#user-endpoints)
  - [Signup User](#signup-user)
  - [Login User](#login-user)
  - [Forgot Password](#forgot-password)
  - [Update Profile](#update-profile)
  - [Delete Account](#delete-account)
  - [Google Signup](#google-signup)
  - [Google Callback](#google-callback)
  - [Error Handling](#error-handling)
  - [Upload Profile Image](#upload-profile-image)
  - [Endpoint](#endpoint)
  - [Request](#request)
    - [Headers](#headers)
    - [Body](#body)
  - [Response](#response)
    - [Success Response](#success-response)

- [Category Endpoints](#category-endpoints)
  - [Create Category](#create-category)
  - [Update Category](#update-category)
  - [List Categories](#list-categories)
  - [Delete Category](#delete-category)
  
- [Comment Endpoints](#comment-endpoints)
  - [Create Comment](#create-comment)
  - [Update Comment](#update-comment)
  - [Delete Comment](#delete-comment)
  - [List Comments for a Post](#list-comments-for-a-post)

- [Express.js Endpoints](#expressjs-endpoints)
  - [Overview](#overview)
  - [Endpoints](#endpoints)
    - [Like a Post or Comment](#like-a-post-or-comment)
    - [Unlike a Post or Comment](#unlike-a-post-or-comment)
    - [List Likes for a Post or Comment](#list-likes-for-a-post-or-comment)
  - [Usage](#usage)
  - [Example](#example)

[Bookmarks](#bookmarks)
   - [Bookmark a Post](#bookmark-a-post)
   - [Unbookmark a Post](#unbookmark-a-post)
   - [List Bookmarks for a User](#list-bookmarks-for-a-user)

[Create Tag](#create-tag)
   - [Endpoint](#endpoint)
   - [Authentication](#authentication)
   - [Request Body](#request-body)
   - [Responses](#responses)

2. [List Tags](#list-tags)
   - [Endpoint](#endpoint-1)
   - [Responses](#responses-1)

3. [Update Tag](#update-tag)
   - [Endpoint](#endpoint-2)
   - [Authentication](#authentication-1)
   - [Request Parameters](#request-parameters)
   - [Request Body](#request-body-1)
   - [Responses](#responses-2)

4. [Delete Tag](#delete-tag)
   - [Endpoint](#endpoint-3)
   - [Authentication](#authentication-2)
   - [Request Parameters](#request-parameters-1)
   - [Responses](#responses-3)

 [Activity Logging API Documentation](#activity-logging-api-documentation)
  - [List User's Activity Logs](#list-users-activity-logs)
    - [Endpoint](#endpoint)
    - [Description](#description)
    - [Request](#request)
    - [Response](#response)
  - [Authentication](#authentication)
  - [Error Responses](#error-responses)
- [Rating API Documentation](#rating-api-documentation)
  - [Overview](#overview)
  - [Base URL](#base-url)
  - [Endpoints](#endpoints)
    - [Rate a Post](#rate-a-post)
      - [Endpoint](#endpoint)
      - [Description](#description)
      - [Request](#request)
      - [Response](#response)
  - [Authentication](#authentication)
  - [Error Responses](#error-responses)

1. [Search API](#search-api)
    1.1 [Search Posts](#search-posts)
        1.1.1 [Endpoint](#endpoint)
        1.1.2 [Description](#description)
        1.1.3 [Parameters](#parameters)
        1.1.4 [Headers](#headers)
        1.1.5 [Example](#example)
        1.1.6 [Response](#response)
        1.1.7 [Error Responses](#error-responses)
    1.2 [Autocomplete Suggestions](#autocomplete-suggestions)
        1.2.1 [Endpoint](#endpoint-1)
        1.2.2 [Description](#description-1)
        1.2.3 [Parameters](#parameters-1)
        1.2.4 [Headers](#headers-1)
        1.2.5 [Example](#example-1)
        1.2.6 [Response](#response-1)
        1.2.7 [Error Responses](#error-responses-1)
2. [Error Handling](#error-handling)
    2.1 [400 Bad Request](#400-bad-request)
    2.2 [401 Unauthorized](#401-unauthorized)
    2.3 [404 Not Found](#404-not-found)

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

- **URL:** `/api/users/delete-account`
- **Method:** `DELETE`
- **Authorization:** Bearer Token (Include the user's JWT token in the Authorization header)
- **Response:**
  - Status Code: `200 OK`
  - Body: `{ message: "Account deleted successfully." }`
  - Status Code: `500 Internal Server Error`
  - Body: `{ message: "Internal Server Error" }`
# Profile Picture Upload
Upload a profile picture for a user.
## Endpoint

```plaintext
POST /api/users/upload-profile-image
```
## Request

- **Headers**
  - Content-Type: `multipart/form-data`
  - Authorization: Bearer `<access_token>`

- **Body**
  - **form-data**
    - key: `image`, type: File
      - Choose the profile image file to upload.

## Response

- **Success Response: 200 OK**

  ```json
  {
    "message": "Profile image uploaded successfully.",
    "imageUrl": "https://storage.googleapis.com/profile-image-url.appspot.com/profile-images/{userId}/{filename}?GoogleAccessId={GoogleAccessId}&Expires={Expires}&Signature={Signature}"
  }
```


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


{
  "error": "Invalid credentials. Please check your username and password."
}

## Category Endpoints
### Create Category
**URL:** `/api/categories/create`

**Method: `POST**

-Authorization: Bearer Token Required

Request:

**Body:**
-name (string): Category name
**Response:**

-Status Code: 201 Created
-Body:

**{ "category": { "_id": "65a62d275192616d58e6eab1", "name": "Technology", "createdAt": "2024-01-16T07:15:51.558Z", "updatedAt": "2024-01-16T07:15:51.558Z", "__v": 0 } }**

### Update Category
- **URL:** `/api/categories/:categoryId`
- **Method:** `PUT`
- **Authorization:** Bearer Token Required
- **Request:**
  - **Params:**
    - `categoryId` (string): ID of the category to be updated
  - **Body:**
    - `name` (string): New category name
- **Response:**
  - **Status Code:** `200 OK`
  - **Body:**
    ```json
    { "category": { "_id": "65a62d6c5192616d58e6eaba", "name": "News", "createdAt": "2024-01-16T07:17:00.254Z", "updatedAt": "2024-01-16T07:20:00.000Z", "__v": 0 } }
    ```

### List Categories

- **URL:** `/api/categories/list`
- **Method:** `GET`
- **Authorization:** Bearer Token Required
- **Response:**
  - **Status Code:** `200 OK`
  - **Body:**
    
    { "categories": [
        { "_id": "65a62d275192616d58e6eab1", "name": "Technology", "createdAt": "2024-01-16T07:15:51.558Z", "updatedAt": "2024-01-16T07:15:51.558Z", "__v": 0 },
        { "_id": "65a62d455192616d58e6eab4", "name": "Science", "createdAt": "2024-01-16T07:16:21.073Z", "updatedAt": "2024-01-16T07:16:21.073Z", "__v": 0 },
        { "_id": "65a62d565192616d58e6eab7", "name": "Sports and culture", "createdAt": "2024-01-16T07:16:38.100Z", "updatedAt": "2024-01-16T07:16:38.100Z", "__v": 0 },
        { "_id": "65a62d6c5192616d58e6eaba", "name": "NEWS AND HISTORY", "createdAt": "2024-01-16T07:17:00.254Z", "updatedAt": "2024-01-16T07:17:00.254Z", "__v": 0 }
      ]
    }
### Update Category

- **URL:** `/api/categories/:categoryId/update`
- **Method:** `PUT`
- **Authorization:** Bearer Token Required
- **Request:**
  - **Params:**
    - `categoryId` (string): ID of the category to be updated
  - **Body:**
    - `name` (string): New category name
- **Response:**
  - **Status Code:** `200 OK`
  - **Body:**
    ```json
    { "category": { "_id": "65a62d6c5192616d58e6eaba", "name": "News", "createdAt": "2024-01-16T07:17:00.254Z", "updatedAt": "2024-01-16T07:20:00.000Z", "__v": 0 } }

### Update Category

- **URL:** `/api/categories/:categoryId`
- **Method:** `PUT`
- **Authorization:** Bearer Token Required
- **Request:**
  - **Params:**
    - `categoryId` (string): ID of the category to be updated
  - **Body:**
    - `name` (string): New category name
- **Response:**
  - **Status Code:** `200 OK`
  - **Body:**
    ```json
    { "category": { "_id": "65a62d6c5192616d58e6eaba", "name": "News", "createdAt": "2024-01-16T07:17:00.254Z", "updatedAt": "2024-01-16T07:20:00.000Z", "__v": 0 } }
### Delete Category

- **URL:** `/api/categories/:categoryId`
- **Method:** `DELETE`
- **Authorization:** Bearer Token Required
- **Request:**
  - **Params:**
    - `categoryId` (string): ID of the category to be deleted
- **Response:**
  - **Status Code:** `200 OK`
  - **Body:**
    ```json
    { "message": "Category deleted successfully." }
    
 ### Create Comment

- **URL:** `/api/comments`
- **Method:** `POST`
- **Request:**
  - Body:
    - `postId` (string): ID of the post where the comment will be created
    - `text` (string): Text content of the comment

- **Response:**
  - Status Code: `201 Created`
  - Body:
    ```json
    {
      "comment": {
        "text": "string",
        "author": "userId",
        "post": "postId"
      }
    }
### Update Comment

- **URL:** `/api/comments/:commentId`
- **Method:** `PUT`
- **Request:**
  - Body:
    - `text` (string): New text content of the comment

- **Response:**
  - Status Code: `200 OK`
  - Body:
    ```json
    {
      "comment": {
        "text": "string",
        "author": "userId",
        "post": "postId"
      }
    }
### Delete Comment

- **URL:** `/api/comments/:commentId`
- **Method:** `DELETE`

- **Response:**
  - Status Code: `200 OK`
  - Body:
    ```json
    {
      "message": "Comment deleted successfully."
    }
### List Comments for a Post

- **URL:** `/api/comments/:postId`
- **Method:** `GET`

- **Response:**
  - Status Code: `200 OK`
  - Body:
    ```json
    {
      "comments": [
        {
          "text": "string",
          "author": {
            // User details
          }
        },
        // Additional comments...
      ]
    }


## Like

This module defines Express.js endpoints for handling likes on posts and comments. The routes are secured using authentication middleware.

## Endpoints

### Like a Post or Comment

- **Method:** POST
- **URL:** `/posts/:postId/like`
- **Middleware:** `authMiddleware`
- **Controller:** `likeController.like`

- **Method:** POST
- **URL:** `/comments/:commentId/like`
- **Middleware:** `authMiddleware`
- **Controller:** `likeController.like`

### Unlike a Post or Comment

- **Method:** DELETE
- **URL:** `/posts/:postId/unlike`
- **Middleware:** `authMiddleware`
- **Controller:** `likeController.unlike`

- **Method:** DELETE
- **URL:** `/comments/:commentId/unlike`
- **Middleware:** `authMiddleware`
- **Controller:** `likeController.unlike`

### List Likes for a Post or Comment

- **Method:** GET
- **URL:** `/posts/:postId/likes`
- **Controller:** `likeController.listLikes`

- **Method:** GET
- **URL:** `/comments/:commentId/likes`
- **Controller:** `likeController.listLikes`

## Usage

1. **Like a Post or Comment:**
   - Send a POST request to the respective endpoint with the `postId` or `commentId`.
   - Requires authentication using the `authMiddleware`.

2. **Unlike a Post or Comment:**
   - Send a DELETE request to the respective endpoint with the `postId` or `commentId`.
   - Requires authentication using the `authMiddleware`.

3. **List Likes for a Post or Comment:**
   - Send a GET request to the respective endpoint with the `postId` or `commentId`.
   - No authentication required for listing likes.

## Example
# Like a post
curl -X POST -H "Authorization: Bearer YOUR_ACCESS_TOKEN" http://your-api-url/posts/123/like
 http://localhost:3001/api/posts/:postID/like
{
	"like": {
		"post": null,
		"comment": "65a686b289e21e2171288317",
		"user": "65a8f1a40dfe587b8565631c",
		"_id": "65aa2ec173bca0845b2744d4",
		"createdAt": "2024-01-19T08:11:45.923Z",
		"updatedAt": "2024-01-19T08:11:45.923Z",
		"__v": 0
	}
}
http://localhost:3001/api/likes/comments/65a686b289e21e2171288317/like
# Unlike a comment
curl -X DELETE -H "Authorization: Bearer YOUR_ACCESS_TOKEN" http://your-api-url/comments/456/unlike
# List likes for a post
curl http://your-api-url/posts/123/likes
# Bookmark a Post
## Explanation

- **Endpoint:** `/posts/:postId/bookmark`: This is the API endpoint to bookmark a specific post. Replace `:postId` with the ID of the post you want to bookmark.

- **Description:** This endpoint allows the authenticated user to bookmark a post. After making a successful request, the API will respond with a JSON object containing details about the newly created bookmark.

- **Response:** The response will include the following information:

  - `"_id"`: The unique identifier for the newly created bookmark.
  - `"post"`: The ID of the post that has been bookmarked.
  - `"user"`: The ID of the authenticated user who bookmarked the post.
  - `"createdAt"`: The timestamp indicating when the bookmark was created.


# Unbookmark a Post

**Endpoint:** `DELETE /posts/:postId/unbookmark`

**Description:** Remove a bookmark for the authenticated user.

# List Bookmarks for a User

**Endpoint:** `GET /bookmarks`

**Description:** Retrieve a list of bookmarks for the authenticated user.

**Response:**
```json
GET http://localhost:3001/api/bookmarks/bookmarks
```
## Tag API
### Create Tag

Create a new tag.

- **Endpoint**: `POST /api/tags`
- **Authentication**: Required
- **Request Body**:

```json
{
  "name": "Tag Name"
}
```
## Response
201 Created: Tag created successfully.
## List Tags

Retrieve a list of all tags.

- **Endpoint**: `GET /api/tags`
- **Responses**:
  - **200 OK**: Successfully retrieved the list of tags.
    ```json
    {
      "tags": [
        {
          "_id": "tagId1",
          "name": "Tag 1"
        },
        {
          "_id": "tagId2",
          "name": "Tag 2"
        },
        // ... more tags
      ]
    }
    ```
  - **500 Internal Server Error**: An error occurred on the server.
## Update Tag

Update an existing tag.

- **Endpoint**: `PUT /api/tags/:tagId`
- **Authentication**: Required
- **Request Parameters**:
  - `tagId`: ID of the tag to be updated.
- **Request Body**:

```json
{
  "name": "Updated Tag Name"
}
```
## Response 
- **200 OK: Tag updated successfully.**
`json
{
  "tag": {
    "_id": "tagId",
    "name": "Updated Tag Name"
  }
}
```
- **404 Not Found: Tag not found.
```json
{
  "message": "Tag not found."
}
```
-**500 Internal Server Error: An error occurred on the server.**
## Delete Tag

Delete an existing tag.

- **Endpoint**: `DELETE /api/tags/:tagId`
- **Authentication**: Required
- **Request Parameters**:
  - `tagId`: ID of the tag to be deleted.
- **Responses**:
  - **200 OK**: Tag deleted successfully.
    ```json
    {
      "message": "Tag deleted successfully."
    }
    ```
  - **404 Not Found**: Tag not found.
    ```json
    {
      "message": "Tag not found."
    }
    ```
  - **500 Internal Server Error**: An error occurred on the server.
# Activity Logging API Documentation

## Overview

This API allows users to log their activities and retrieve their activity logs.

### Base URL

`

## Endpoints

### Log Activity

#### Endpoint

`POST /activity/log`

#### Description

Logs a user's activity.

#### Request

- **Headers:**
  - Authorization: Bearer \<JWT_TOKEN\>

- **Body:**
  ```json
  {
    "action": "string", // The action performed by the user
    "details": "string" // Additional details or description of the activity
  }
## Response
-**Status Code: 201 Created**
```json
{
  "activityLog": {
    "user": "<USER_ID>",
    "action": "<ACTION>",
    "details": "<DETAILS>",
    "_id": "<LOG_ID>",
    "createdAt": "<TIMESTAMP>"
  }
}
```
# Activity Logging API Documentation

## List User's Activity Logs

### Endpoint

`GET /activity/logs`

### Description

Retrieves activity logs for the authenticated user.

### Request

- **Headers:**
  - Authorization: Bearer \<JWT_TOKEN\>

### Response

- **Status Code:** 200 OK
- **Body:**
  ```json
  {
    "activityLogs": [
      {
        "user": "<USER_ID>",
        "action": "<ACTION>",
        "details": "<DETAILS>",
        "_id": "<LOG_ID>",
        "createdAt": "<TIMESTAMP>"
      },
      // Additional activity log entries...
    ]
  }
```
-**Status Code: 500 Internal Server Error**
```
# Rating API Documentation

## Overview

This API allows users to rate posts and retrieve ratings for specific posts.

### Base URL

`/api`

## Endpoints

### Rate a Post

#### Endpoint

`POST /ratePost`

#### Description

Allows users to rate a post.

#### Request

- **Headers:**
  - Authorization: Bearer \<JWT_TOKEN\>

- **Body:**
  ```json
  {
    "postId": "string", // ID of the post to be rated
    "value": "number"    // Rating value (e.g., 1 to 5)
  }
```
## Response
-**Status Code: 201 Created**
```json
{
  "rating": {
    // Details of the new rating
    "post": "<POST_ID>",
    "user": "<USER_ID>",
    "value": "<RATING_VALUE>",
    "_id": "<RATING_ID>",
    "createdAt": "<TIMESTAMP>"
  }
}
```
-**Status code 500 internal server error



## Search API

### Search Posts

#### Endpoint

`GET /search/posts`

#### Description

Search for posts based on various criteria such as text query, author, category, and tag.

#### Parameters

- `query` (string, required): The search query.
- `author` (string, optional): Filter by author.
- `category` (string, optional): Filter by category.
- `tag` (string, optional): Filter by tag.
- `sortBy` (string, optional): Sort the results by a specific field.
- `sortOrder` (string, optional): Sort order, either "asc" (ascending) or "desc" (descending).

#### Headers

- `Authorization` (string, required): Token for user authentication.

#### Example

```GET /search/posts?query=programming&author=john_doe&sortBy=date&sortOrder=desc
Authorization: Bearer YOUR_ACCESS_TOKEN
```
```json
{
  "results": [
    {
      // Post details
    },
    // more info like additional posts
  ]
}
```
## Error Responses
- 500 Internal Server Error
```json
{
  "message": "Internal Server Error"
}
```
### Autocomplete Suggestions

#### Endpoint

`GET /search/autocomplete/:query`

#### Description

Get autocomplete suggestions for a given query.

#### Parameters

- `query` (string, required): The autocomplete query.

#### Headers

- `Authorization` (string, required): Token for user authentication.

#### Example

```http
GET /search/autocomplete/progra
Authorization: Bearer YOUR_ACCESS_TOKEN
```
## Response
```json
{
  "suggestions": [
    {
      "title": "Programming Basics"
    },
    // Additional suggestions
  ]
}
```
- Error Responses
- `500 Internal Server Error`
- `400 Bad Request`
```json
{
  "message": "Invalid request. Please check your parameters."
}
```
-`401 Unauthorized`
```json
{
  "message": "Unauthorized. Please provide a valid access token."
}
```
- `404 Not Found`
```json
{
"message": "Post /resources not found".
}
```
# Post

## Create Post

### `POST /api/posts/`

Create a new post.

#### Request

- **Body Parameters:**
  - `title` (string): Title of the post.
  - `content` (string): Content of the post.
  - `categories` (array of ObjectId): Categories associated with the post.
  - `imageUrl` (string): URL of the image attached to the post.

#### Response

- **Status: 201 Created**
  - Returns the created post object.

- **Status: 400 Bad Request**
  - One or more categories do not exist.

- **Status: 500 Internal Server Error**
  - Server encountered an error.

## Get Single Post

### `GET /api/posts/:postId`

Retrieve a single post by ID.

#### Request

- **Path Parameters:**
  - `postId` (string): ID of the post.

#### Response

- **Status

















