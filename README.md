# Blog Application

Welcome to the Blog Application! This application allows users to create, manage, and share blog posts.

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

Explore the API endpoints and learn how to integrate with the Blog Application by referring to our [API Documentation](<link_to_api_documentation>).

## Contributing

If you would like to contribute to the development of this application, please follow our [Contribution Guidelines](CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

