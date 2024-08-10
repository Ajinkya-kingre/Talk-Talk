# Real-Time Chat App Backend

## Overview

This is the backend for a real-time chat application backend built using Node.js, Express.js, MongoDB, Multer, and Cloudinary. It handles user authentication, real-time messaging, file uploads, and media storage.

## Features

- User Authentication (JWT)
- Real-Time Messaging (Socket.IO)
- File Uploads (Multer)
- Cloud Storage (Cloudinary)
- Scalable Architecture

## Tech Stack

- **Node.js**: JavaScript runtime for server-side development.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database for data storage.
- **Socket.IO**: Real-time communication library.
- **Multer**: Middleware for handling `multipart/form-data`.
- **Cloudinary**: Cloud-based image and video management service.

## Installation

### Prerequisites

- Node.js
- MongoDB
- Cloudinary account

### Steps

1. Clone the repository

    ```sh
    git clone https://github.com/Ajinkya-kingre/Talk-Talk.git
    ```

2. Navigate to the project directory

    ```sh
    cd talk-talk
    ```

3. Install dependencies

    ```sh
    npm install
    ```

4. Create a `.env` file in the root directory and add your environment variables

    ```env
    PORT=
    MONGODB_URI=
    JWT_SECRET=
    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
    ```

5. Start the server

    ```sh
    npm start
    ```


