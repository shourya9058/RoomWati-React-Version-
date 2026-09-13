# 🏠 RoomWati — Modern Zero-Brokerage Rental Platform

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21.2-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?style=flat-square&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![EmailJS](https://img.shields.io/badge/EmailJS-Transactional_OTP-FF6C37?style=flat-square)](https://www.emailjs.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-lightgrey?style=flat-square)](https://opensource.org/licenses/ISC)

> **RoomWati** is a full-stack, zero-brokerage room rental and property discovery platform connecting tenants with verified hosts directly. Built with a modern **React 19 Single Page Application (SPA)** and a scalable **Express REST API**, RoomWati features passwordless OTP authentication, instant visit scheduling, in-app messaging, dynamic listing management, and personalized notifications.

---

## 🌟 Key Features

### 🔐 Dual-Mode Authentication & Security
- **Email Verification on Signup**: Mandatory OTP verification prevents disposable or unverified accounts.
- **Passwordless OTP Login**: Instant login using secure 6-digit one-time passcodes sent via EmailJS.
- **Traditional Password Login**: Salting and hashing powered by `passport-local-mongoose` (PBKDF2).
- **Purpose-Isolated OTP Engine**: Strict separation of scopes (`SIGNUP_VERIFICATION`, `LOGIN`, `PASSWORD_RESET`) with a 10-minute validity window, SHA-256 in-memory hashing, rate limiting (60s cooldown), and attempt limits.
- **Two-Step Password Reset**: Cryptographic single-use reset token emitted only upon OTP verification.
- **Persistent Sessions**: Cross-origin session cookies stored in MongoDB Atlas via `connect-mongo`.

### 🏘️ Property Discovery & Listing Management
- **Smart Filtering & Search**: Instant filter by location, category (Rooms, 1BHK, 2BHK, Flats, Villas), amenities, and budget range.
- **Comprehensive Listing Details**: Pricing, security deposit, house rules, amenity badges, host details, and interactive map geolocation.
- **Host Dashboard**: Create, edit, and manage rental listings with image upload directly to **Cloudinary**.
- **User Wishlist / Favorites**: Save favorite properties with real-time UI counters.

### 📅 Free Visit Scheduling
- Book in-person property visits with selected time slots and dates.
- Manage upcoming, completed, and rescheduled visits with host/tenant notifications.

### 💬 Direct Messaging & Real-Time Alerts
- Built-in chat system allowing tenants and landlords to communicate directly without third-party apps.
- Unread message counters, tab title badges, and dynamic notification center.

### 🎨 Modern UI & Responsive Design
- Glassmorphism effects, fluid animations, dynamic modals, toast feedback, and skeleton loading states.
- Fully responsive across mobile (360px+), tablet, and desktop viewports.

---

## 🧰 Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, React Router DOM v7, Lucide React Icons, Vanilla CSS Design System |
| **Backend** | Node.js (v20+), Express.js 4.21, Passport.js, express-session, connect-mongo |
| **Database** | MongoDB Atlas (Production) / Mongoose ODM |
| **Media Storage** | Cloudinary v2 SDK + Multer Storage |
| **Email & OTP** | EmailJS REST API (Single universal template: `roomwati_otp`), crypto module |
| **Deployment** | **Vercel** (Frontend SPA) + **AWS EC2** (Backend API / Nginx / PM2) |

---

## 🗂️ Project Architecture

```
RoomWati/
├── client/                               # React 19 + Vite Frontend SPA
│   ├── public/                           # Static assets (favicons, default-cover.png)
│   ├── src/
│   │   ├── components/                   # UI components (auth, common, home, listings, messages, visits)
│   │   │   ├── auth/                     # Auth modals (Login, Signup, OTP Verification)
│   │   │   ├── common/                   # Navbar, Footer, ProtectedRoute, Toast
│   │   │   ├── home/                     # Hero sections, feature cards, testimonials
│   │   │   ├── listings/                 # Listing cards, forms, filters, reviews
│   │   │   ├── messages/                 # Chat windows and thread list
│   │   │   ├── profile/                  # User profile and edit dialogs
│   │   │   └── visits/                   # Visit booking and schedule management
│   │   ├── context/                      # AuthContext, ChatContext, VisitContext, NotificationContext
│   │   ├── pages/                        # Page views (Home, Listings, Details, Profile, Visits, Static)
│   │   ├── services/                     # Centralized API service layer (api.js)
│   │   ├── App.jsx                       # Client-side router configuration
│   │   └── main.jsx                      # DOM mount point
│   ├── package.json                      # Client dependencies & scripts
│   └── vite.config.js                    # Vite bundler configuration & local proxy
│
├── controllers/                          # Express controllers (listings, reviews, users)
├── init/                                 # Sample data & database seeding scripts
├── middleware.js                         # Passport authentication & ownership authorization middleware
├── models/                               # Mongoose Schemas (user, listing, review, chat, visit)
├── routes/
│   ├── api/                              # JSON REST API routes (/api/auth, /api/listings, /api/chats, /api/visits)
│   └── ...                               # Backward-compatible routes
├── services/
│   ├── email/                            # Universal EmailJS single-template transactional engine
│   └── otp/                              # Purpose-isolated cryptographic OTP store
├── cloudConfig.js                        # Cloudinary media storage setup
├── app.js                                # Express backend entrypoint
├── package.json                          # Backend dependencies & server scripts
└── .env.example                          # Environment template
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20.x or higher
- **npm**: v9.x or higher
- **MongoDB**: MongoDB Atlas connection URI or local MongoDB instance
- **Cloudinary Account**: Cloud name, API key, and API secret
- **EmailJS Account**: Service ID, Public Key, Private Key, and universal template `roomwati_otp`

---

### Installation & Local Setup

#### 1. Clone the Repository
```bash
git clone <YOUR_NEW_REPOSITORY_URL>
cd RoomWati
```

#### 2. Configure Backend Environment
Copy the example environment file and configure your keys:
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=8080
NODE_ENV=development
ATLASDB_URL="mongodb+srv://<username>:<password>@cluster0.yourcluster.mongodb.net/roomwati?retryWrites=true&w=majority"
SECRET="your_secure_session_secret_key"

CLOUD_NAME="your_cloudinary_cloud_name"
CLOUD_API_KEY="your_cloudinary_api_key"
CLOUD_API_SECRET="your_cloudinary_api_secret"
CLOUDINARY_FOLDER="Roomwati_DEV"

EMAILJS_SERVICE_ID="your_emailjs_service_id"
EMAILJS_TEMPLATE_ID="roomwati_otp"
EMAILJS_PUBLIC_KEY="your_emailjs_public_key"
EMAILJS_PRIVATE_KEY="your_emailjs_private_key"

FRONTEND_URL="http://localhost:5173"
```

#### 3. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

#### 4. Run Locally in Development Mode
Start the backend server:
```bash
npm run dev
```

In a second terminal, start the React frontend:
```bash
cd client
npm run dev
```

Open your browser and navigate to **`http://localhost:5173`**.

---

## ⚙️ Available Scripts

### Root Directory (Backend)
- `npm run dev`: Starts the Express server with automatic file watching (`node --watch app.js`).
- `npm start`: Starts the Express server in production mode (`node app.js`).
- `npm run seed`: Seeds sample listings and a default host user into the database.

### Client Directory (Frontend)
- `npm run dev`: Starts the Vite local development server on port 5173 with API proxying.
- `npm run build`: Bundles the React application into optimized production assets in `client/dist/`.
- `npm run lint`: Runs Oxlint static code analysis across the frontend codebase.
- `npm run preview`: Previews the local production build.

---

## 📧 EmailJS Universal Template Configuration

RoomWati is optimized for the **EmailJS Free Plan** by operating on **ONE universal email template** (`roomwati_otp`).

### Template Variables
Ensure your EmailJS template contains the following dynamic variables:
- `{{to_name}}` — Recipient's name
- `{{otp}}` — 6-digit numeric verification code
- `{{expires_in}}` — Expiration string (`10 minutes`)
- `{{email_title}}` — Dynamic heading (e.g. *Verify your RoomWati account*)
- `{{eyebrow}}` — Header badge text (e.g. *ACCOUNT VERIFICATION*)
- `{{eyebrow_text}}` — Subheading tag
- `{{message}}` — Flow-specific instructions
- `{{code_label}}` — Label for code block (e.g. *Verification Code*)
- `{{security_message}}` — Security disclaimer
- `{{ignore_message}}` — Ignore instruction if unintended
- `{{roomwati_url}}` — App URL
- `{{year}}` — Current calendar year

---

## ☁️ Production Deployment Guide

### Architecture Overview
- **Frontend SPA**: Deployed to **Vercel** with global CDN.
- **Backend API**: Deployed to **AWS EC2** (Ubuntu Linux), managed by **PM2** and reverse-proxied with **Nginx** and **Let's Encrypt SSL**.
- **Database**: **MongoDB Atlas**.
- **Storage**: **Cloudinary**.

### 1. Deploy Frontend to Vercel
1. Import your GitHub repository into Vercel.
2. Set **Root Directory** to `client`.
3. Set **Framework Preset** to `Vite`.
4. Add Environment Variable:
   - `VITE_API_URL` = `https://api.yourdomain.com` (or your EC2 backend domain).
5. Deploy.

### 2. Deploy Backend to AWS EC2
1. Launch an `Ubuntu 24.04` EC2 instance (t2.micro / t3.micro).
2. Attach an **Elastic IP** and open security groups for ports `22`, `80`, and `443`.
3. SSH into your instance and install Node.js 20+, Git, PM2, and Nginx:
   ```bash
   sudo apt update && sudo apt install -y nginx git
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   sudo npm install -g pm2
   ```
4. Clone the repository and configure `.env`:
   ```bash
   git clone <YOUR_REPO_URL> RoomWati
   cd RoomWati
   npm install --production
   nano .env
   ```
5. Start backend with PM2:
   ```bash
   pm2 start app.js --name "roomwati-api"
   pm2 save
   pm2 startup
   ```
6. Configure Nginx reverse proxy forwarding port `80` / `443` to `http://localhost:8080`.
7. Install SSL certificate with Certbot:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d api.yourdomain.com
   ```

---

## 🔒 Security & Best Practices
- **Strict CORS Protection**: Rejects unauthorized cross-origin requests while allowing pre-configured frontend domains.
- **SameSite None & Secure Cookies**: Enables secure cross-domain authentication when frontend (Vercel) and backend (AWS) reside on different domains.
- **Zero Secret Exposure**: Server keys and credentials are never shipped to the client bundle.
- **Rate-Limited OTP**: Limits brute-force verification attempts and enforces a 60-second cooldown between code dispatches.

---

## 📄 License
This project is licensed under the **ISC License**.

---

<div align="center">
  <sub>Built with ❤️ for hassle-free, zero-brokerage home rentals.</sub>
</div>
