# 🛒 Online Store - MERN Project 🛒

## Group members 👨‍💻 👨‍💻 👨‍💻
(names and surnames, email addresses):

- **Bartłomiej Szubiak** bszubiak@student.agh.edu.pl
- **Szymon Kubiczek** kubiczek@student.agh.edu.pl
- **Konrad Armaty**s karmatys@student.agh.edu.pl

## Project topic 📋

**Online store**

[PL version](./README_pl.md)

[Link to the repository](https://github.com/Simsoftcik/BD2Projekt)

[Documentation](https://github.com/Simsoftcik/BD2Projekt/tree/main/docs)

## Technologies and tools 🛠️

### Database 📂
- **MongoDB** 🍃

### Backend 💻
- **Node.js** 🚀
- **Express.js** 🌐
- **Mongoose** 🗃️

### Middleware and Frameworks 🔧
- **multer** 📸 (file transfer)
- **cors** 🌍 (access from different sources)
- **bcrypt** 🔐 (password hashing)
- **jsonwebtoken** 🛡️ (JWT authorization)
- **async-mutex** ⏳ (concurrency management)

#### Security 🔒
- **helmet** 🪖 (HTTP header security)
- **hpp** 🛡️ (protection against HTTP Parameter Pollution attacks)
- **express-mongo-sanitize** 🧹 (MongoDB query sanitization)
- **xss-clean** 🧼 (protection against XSS)

### Frontend 🖥️
- **React** ⚛️

## Project description 📜

As part of this project, we have created a comprehensive online store using the MERN technology stack (MongoDB, Express.js, React, Node.js). The project assumes the creation of an intuitive user interface and an efficient backend that supports all the necessary functions of an online store, such as:

- 🛍️ Browsing products
- 🛒 Adding products to the cart
- 👤 User registration and login
- 🛡️ Secure data storage

## Functions and modules 🚀

### Backend 🛠️
- **Authorization and authentication** 🔒
- **File handling** 📦
- **HTTP request handling** 🌐

### Frontend 🎨
- **Dynamic user interfaces** 🖥️
- **Responsiveness** 📱
- **Integration with the backend** 🔗

## Features 📦

### User 😊

- Registration 👤
- Login 🔑
- Logout 🔒
- Browsing products 👀
- Adding products to the cart 🛒
- Viewing the cart 📝
- Removing products from the cart ❌
- Placing an order 📦

### Admin 👨‍💼

- Adding products ➕
- Viewing product sales 📊
- Viewing user data (without sensitive data) 👥

## Installation and launch 🚀

0. **Environment preparation**:
    - **MongoDB**: [MongoDB Installation](https://docs.mongodb.com/manual/installation/)
    - **Node.js**: [Node.js Installation](https://nodejs.org/en/download/)

1. **Repository cloning**:
   ```bash
   git clone https://github.com/Simsoftcik/BD2Projekt.git
   cd BD2Projekt
   ```
2. **Dependency installation**:
    - **Backend**:
       ```bash
       cd backend
       npm install
       ```
    - **Frontend for Client**:
       ```bash
       cd frontend
       npm install
       ```

    - **Frontend for Admin**:
       ```bash
       cd admin
       npm install
       ```

3. **Server launch**:
    - **Backend**:
       ```bash
       cd backend
       npm run start
       ```
    - **Frontend for Client**:
       ```bash
       cd frontend
       npm run build
       ```
    - **Frontend for Admin**:
       ```bash
       cd admin
       npm run build
       ```

# Summary 🎉
The online store project based on the MERN technology stack is an example of a modern, 
scalable web application that combines advanced features and care for data security. 
Thanks to the use of popular tools and libraries, our application is both efficient and easy to maintain.