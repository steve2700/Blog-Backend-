# Table of Contents

- [Blog Application](#blog-application)
- [Tech Stack](#tech-stack)
- [Third Party Api](#third-party-api)
- [Getting Started](#getting-started)
  - [Clone the Repository](#1-clone-the-repository)
  - [Install Dependencies](#2-install-dependencies)
  - [Set up Environment Variables](#3-set-up-environment-variables)
  - [Start the Server](#4-start-the-server)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

# Blog Application

Welcome to the Blog Application! This application allows users to create, manage, and share blog posts.

## Tech Stack

The backend of this application is built using the following technologies:

- Node.js: JavaScript runtime for server-side development.
- Express: Fast, unopinionated, minimalist web framework for Node.js.
- MongoDB: NoSQL database for storing blog posts, users, and related data.
- Mongoose: MongoDB object modeling for Node.js.
- Multer: Middleware for handling file uploads.
- Sharp: High-performance image resizing library.
- JSON Web Tokens (JWT): Authentication and authorization mechanism.
- Nodemailer: Module for sending emails (used for user registration, etc.).

## Third-Party APIs

The Blog Application integrates with the following third-party APIs:

- Google OAuth: Used for user authentication.
- Firebase Storage: Cloud storage service for storing profile images.
  


## Getting Started

1. Clone the repository:

    ```bash
    git clone https://github.com/steve2700/Blog-Backend-
    cd Blog-Backend-
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables:

    Create a `.env` file in the root directory with the following content:

    ```env
    PORT=3001
    MONGODB_URI=<your_mongodb_connection_uri>
    SECRET_KEY=<your_secret_key>
    CLIENT_URL=http://localhost:3000  # Replace with your client application URL
    GOOGLE_CLIENT_ID=<your_google_client_id>
    GOOGLE_CLIENT_SECRET=<your_google_client_secret>
    GOOGLE_CALLBACK_URL=<your_google_callback_url>
    EMAIL_USERNAME=<your_email_username>
    EMAIL_PASSWORD=<your_email_password>
    EMAIL_APP_PASSWORD=<your_email_app_password>
    FIREBASE_PROJECT_ID=<your_firebase_project_id>
    FIREBASE_PRIVATE_KEY=<your_firebase_private_key>
    FIREBASE_CLIENT_EMAIL=<your_firebase_client_email>
    ```

4. Start the server:

    ```bash
    npm start
    ```

The server will run on port 3001.

## API Documentation

Explore the API endpoints and learn how to integrate with the Blog Application by referring to our [API Documentation](https://github.com/steve2700/Blog-Backend-/blob/main/API_DOCUMENTATION.MD).

## Contributing

If you would like to contribute to the development of this application, please follow our [Contribution Guidelines](CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [MIT LICENSE](https://github.com/steve2700/Blog-Backend-/blob/main/LICENSE) file for details.

