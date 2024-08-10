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

## Folder Structure

├── controllers
│ ├── chat.controller.js
│ ├── message.controller.js
│ └── user.controller.js
├──DB
│ ├── index.js 
├── middlewares
│ ├── auth.middleware.js
│ ├── multer.middleware.js
├── models
│ ├── chat.model.js
│ ├── message.model.js
│ └── user.model.js
├── routes
│ ├── chat.route.js
│ ├── message.route.js
│ └── user.route.js
├── utils
│ └── ApiError.js
│ └── ApiResponse.js
│ └── asyncHandler.js
│ └── cloudinary.js
│ └── getUsers.js
├── app.js
├── constants.js
├── index.js
└── .env




