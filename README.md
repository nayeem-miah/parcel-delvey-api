
# 📦 Parcel Delivery API

A secure, modular, and role-based backend API for a parcel delivery
system (inspired by Pathao Courier or Sundarban) built using
**Express.js**, **TypeScript**, and **Mongoose**.

---

## 🚀 Project Overview

This project enables users to register as **Senders** or **Receivers**
and perform parcel delivery operations such as:  
- Creating parcel requests  
- Tracking parcel status  
- Canceling or confirming parcel deliveries  

**Admins** can manage users, parcels, and overall system operations.

---

## 🛠️ Tech Stack

- **Backend Framework**: Express.js (with TypeScript)  
- **Database**: MongoDB with Mongoose  
- **Authentication**: JWT (JSON Web Tokens)  
- **Password Security**: Bcrypt  
- **Validation**: Zod / Custom Middlewares  
- **Other Tools**: dotenv, ESLint, Prettier  

---

## 🎯 Features

- **Authentication**: JWT-based login with roles (Admin, Sender,
  Receiver)  
- **Authorization**: Role-based access control  
- **Parcel Management**:
  - Senders can create, view, and cancel parcels  
  - Receivers can confirm delivery and view history  
  - Admins can view/manage all parcels, block/unblock users, update
    statuses  
- **Status Tracking**: Embedded status logs (history of status changes
  with timestamps)  
- **Secure Passwords**: Hashed using bcrypt  
- **Tracking ID System**: Unique tracking ID for every parcel (format:
  `TRK-YYYYMMDD-xxxxxx`)  

---

## 📂 Project Structure

```bash
src/
├── app/
│   ├── config/        # Configurations (DB, env)
│   ├── helpers/       # Helper functions
│   ├── interfaces/    # TypeScript interfaces
│   ├── middlewares/   # Authentication & authorization middleware
│   ├── modules/
│   │   ├── auth/      # Auth module (register, login)
│   │   ├── user/      # User module (admin, sender, receiver)
│   │   ├── parcel/    # Parcel module with status logs
│   ├── routes/        # All routes combined
│   ├── utils/         # Utility functions
│   ├── app.ts         # Main app file
│   └── server.ts      # Server entry point
````

---

## 📌 Minimum Functional Requirements Implemented

✅ JWT-based login system (Admin, Sender, Receiver)
✅ Secure password hashing with bcrypt
✅ Sender: Create, cancel, view parcels + status logs
✅ Receiver: View incoming parcels, confirm delivery, history
✅ Admin: Manage all users, parcels, block/unblock users
✅ Status logs stored in parcel schema (with timestamp + updatedBy)
✅ Role-based route protection implemented

---

## 🔑 API Endpoints Summary

| Role         | Method | Endpoint               | Description                         |
| ------------ | ------ | ---------------------- | ----------------------------------- |
| **Auth**     | POST   | `/auth/register`       | Register new user (sender/receiver) |
|              | POST   | `/auth/login`          | Login and get JWT                   |
| **Sender**   | POST   | `/parcels`             | Create parcel request               |
|              | GET    | `/parcels/me`          | View all my parcels                 |
|              | PATCH  | `/parcels/cancel/:id`  | Cancel parcel (if not dispatched)   |
| **Receiver** | GET    | `/parcels/incoming`    | View incoming parcels               |
|              | PATCH  | `/parcels/confirm/:id` | Confirm parcel delivery             |
|              | GET    | `/parcels/history`     | Delivery history                    |
| **Admin**    | GET    | `/parcels/all`         | View all parcels                    |
|              | PATCH  | `/parcels/status/:id`  | Update delivery status              |
|              | PATCH  | `/users/block/:id`     | Block/unblock user                  |

---

## ⚙️ Setup & Installation

```bash
# Clone repository
git clone https://github.com/nayeem-miah/parcel-delivery-api.git

# Navigate to project folder
cd parcel-delivery-api

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run server (development)
npm run dev

# Build project
npm run build
```

---

## 🌍 Environment Variables

Create a `.env` file in the root directory and add:

```env
PORT=5000
MONGODB_URI=PORT=5000
MONGODB_URI=mongodb://localhost:27017/parcelDB
NODE_ENV=development

BCRYPT_SLOT_ROUND=10

ADMIN_EMAIL=your.admin.create@gmail
ADMIN_PASS=your pass

# jwt 
JWT_SECRET=your secret
JWT_EXPIRE=expire time
NODE_ENV=development

BCRYPT_SLOT_ROUND=your_slot_round

```

---

## 🧪 Testing

* Use **Postman** for testing endpoints
* Collection includes auth, sender, receiver, and admin routes

---

## 🎥 Demo Video (Required)
* waiting ......
<!-- * Introduction (Name, project purpose)
* Folder structure explanation
* Auth flow demo
* Sender, Receiver, Admin features demo
* Postman testing demo
* Wrap-up (README, thanks) -->

---

## 🤝 Contribution

Contributions are welcome!

* Fork the repo
* Create a feature branch (`git checkout -b feature-name`)
* Commit changes (`git commit -m "Add new feature"`)
* Push branch and open a PR

---

