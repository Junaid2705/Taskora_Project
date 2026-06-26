# Taskora – Freelancer Social Networking Platform

> Connect • Collaborate • Grow

Taskora is a full-stack freelancing and social networking platform designed for freelancers, employers, creators, and recruiters. Built with **React JS** and **Spring Boot**, it enables professional networking, job posting, project bidding, real-time messaging, subscription monetization, and complete platform administration.

---

## 📋 Table of Contents

- [Technology Stack](#technology-stack)
- [Features](#features)
- [User Roles](#user-roles)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Test Accounts](#test-accounts)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Screenshots](#screenshots)
- [Deployment](#deployment)
- [Contributors](#contributors)

---

## 🛠 Technology Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React JS | 19.x | UI Framework |
| Vite | 8.x | Build Tool |
| Bootstrap 5 | 5.3 | CSS Framework |
| Axios | 1.18 | HTTP Client |
| React Router | 7.x | Routing |
| @stomp/stompjs | Latest | WebSocket Client |
| SockJS | Latest | WebSocket Fallback |
| react-helmet-async | Latest | SEO Meta Tags |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Java | 21 (LTS) | Language |
| Spring Boot | 3.3.0 | Framework |
| Spring Security | 6.3 | Authentication & Authorization |
| Spring Data JPA | 3.3 | ORM / Database Access |
| Spring WebSocket | 6.1 | Real-time Messaging |
| JWT (jjwt) | 0.11.5 | Token Authentication |
| Lombok | Latest | Boilerplate Reduction |
| MySQL Connector | 8.x | Database Driver |

### Database
| Technology | Version | Purpose |
|-----------|---------|---------|
| MySQL | 8.0 | Relational Database |

### DevOps
| Tool | Purpose |
|------|---------|
| Git / GitHub | Version Control |
| Maven | Build & Dependency Management |

---

## ✨ Features

### 🔐 Authentication & Security
- User registration with email verification
- JWT-based stateless authentication
- Login with email OR username
- Forgot/Reset password via email
- Change password, change username
- BCrypt password encryption
- Role-based access control (4 roles)

### 👤 User Profile Management
- Upload avatar & cover images
- Full profile editing (bio, skills, experience, education, social links)
- Location (city, state, country)
- Account deletion

### 💼 Job Management
- Create, edit, delete jobs (Employer)
- Search jobs with filters (keyword, category, location, budget range)
- Apply for jobs with cover letter & resume (Freelancer)
- Application tracking with status flow: PENDING → SHORTLISTED → HIRED/REJECTED
- Employer reviews and manages applicants

### 📁 Project Management
- Create, edit, delete projects
- Search projects with filters
- Project lifecycle: OPEN → IN_PROGRESS → COMPLETED

### 🔨 Bid Management
- Submit, update, withdraw bids (Freelancer)
- Accept/Reject bids (Project Owner)
- Accepting a bid auto-rejects others and moves project to IN_PROGRESS

### 🖼️ Portfolio Module
- Upload portfolio items with images, videos, documents
- Portfolio categories (Web Dev, Mobile, UI/UX, AI/ML, etc.)
- Full CRUD with file type support
- Grid view with category filter tabs

### 📰 Social Feed
- Create posts (text + images)
- Edit and delete own posts
- Like/Unlike posts
- Comment on posts
- Infinite scroll pagination
- Real-time notifications on likes/comments

### 💬 Real-Time Messaging
- WebSocket/STOMP real-time chat
- Online/Offline presence indicators
- Unread message count badges
- Start new conversations (user search)
- Edit & delete sent messages
- Emoji picker
- Image attachments in chat
- Read receipts

### 🔔 Notification System
- Real-time push via WebSocket
- Notifications for: New Message, New Bid, New Job Application, New Subscriber, New Like, New Comment
- Notification page with mark-all-read
- Unread count badge

### ⭐ Subscription Module
- Creator sets monthly subscription fee
- One-click subscribe at creator's fixed price
- Browse all creators with their plans
- My Subscriptions / My Subscribers views
- Revenue tracking for creators
- Unsubscribe functionality

### 🔍 Search & Discovery
- Unified search (Users + Jobs + Projects)
- Search by username, name, skills, job title, project title
- Filters: category, budget range, location
- Tabbed results view

### 🏷️ Category Management (Admin)
- Add, edit, delete categories
- Active/Inactive status
- Used across jobs and projects

### 📄 CMS Module
- Admin creates/edits/deletes pages (About Us, Privacy Policy, Terms, Contact)
- Public pages accessible at `/page/{slug}`
- Rich content with HTML support

### 🚩 Reporting System
- Report users, posts, jobs, projects, messages
- Report type selection
- Admin views, resolves reports, suspends users

### 🛡️ Admin Panel
- Dashboard with real stats (users, freelancers, jobs, projects, revenue, active subscriptions)
- User management (view, edit status, suspend, activate, delete)
- Content management (posts, jobs, projects, categories)
- Subscription management (view, edit pricing, change status, delete)
- Application management (view, change status, delete)
- Creator verification (review documents, approve/reject)
- Reports management (view, resolve, suspend user)
- CMS Pages (CRUD)
- Site Settings (name, logo, favicon, SMTP)
- SEO (meta tags, sitemap.xml, robots.txt)

### 🌐 SEO Module
- Dynamic meta tags per page (React Helmet)
- Auto-generated sitemap.xml
- robots.txt configuration
- Open Graph tags

---

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **Freelancer** | Create profile, portfolio, bid on projects, apply for jobs, subscribe to creators, send messages |
| **Employer** | Post jobs, post projects, review bids, hire freelancers, manage applicants |
| **Creator** | Publish posts, set subscription plans, manage subscribers, track revenue |
| **Administrator** | Full platform control — manage users, content, reports, categories, settings, verification |

---

## 📂 Project Structure

```
Taskora_Project/
├── taskora-backend/          # Spring Boot Backend
│   ├── src/main/java/com/example/taskora_backend/
│   │   ├── config/           # Security, WebSocket, WebMvc configs
│   │   ├── controller/       # REST + WebSocket controllers
│   │   ├── dto/              # Request/Response DTOs
│   │   ├── exception/        # Global exception handler
│   │   ├── model/            # JPA Entities (18 tables)
│   │   ├── repository/       # Spring Data JPA Repositories
│   │   ├── security/         # JWT, Auth Filter, UserDetails
│   │   └── service/          # Business logic services
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── uploads/              # Uploaded files (avatars, covers, etc.)
│   └── pom.xml
├── taskora-frontend/
│   └── taskora-frontend/     # React Frontend
│       ├── src/
│       │   ├── components/   # Shared components (AppLayout, AdminLayout, Avatar, etc.)
│       │   ├── pages/        # All page components
│       │   │   └── admin/    # Admin panel pages
│       │   ├── services/     # API service classes
│       │   └── lib/          # Utility functions
│       ├── public/           # Static assets
│       ├── index.html
│       ├── vite.config.js
│       └── package.json
├── Taskora Documents/        # Project documentation (SRS, Architecture, etc.)
├── Taskora Database.sql      # Full database schema
└── README.md                 # This file
```

---

## 📦 Prerequisites

Ensure the following are installed:

| Software | Version | Download |
|----------|---------|----------|
| Java JDK | 21+ | [Adoptium](https://adoptium.net/) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org/) |
| MySQL | 8.0 | [MySQL Community](https://dev.mysql.com/downloads/) |
| Git | Any | [git-scm.com](https://git-scm.com/) |

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Taskora_Project
```

### 2. Database Setup

Open MySQL Workbench or terminal:

```sql
CREATE DATABASE taskora_db;
USE taskora_db;
```

Then import the schema:

```bash
mysql -u root -p taskora_db < "Taskora Database.sql"
```

### 3. Backend Configuration

Edit `taskora-backend/src/main/resources/application.properties`:

```properties
# Update with YOUR MySQL credentials
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# Server port
server.port=8081
```

### 4. Frontend Dependencies

```bash
cd taskora-frontend/taskora-frontend
npm install
```

---

## ▶️ Running the Application

### Start Backend

```bash
cd taskora-backend

# Windows (PowerShell)
$env:JAVA_HOME='C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot'
.\mvnw.cmd spring-boot:run

# Mac/Linux
./mvnw spring-boot:run
```

Backend starts on **http://localhost:8081**

### Start Frontend

```bash
cd taskora-frontend/taskora-frontend
npm run dev
```

Frontend starts on **http://localhost:5173**

### First Run

On the first run, Maven downloads all dependencies (2-3 minutes). Hibernate auto-creates/updates tables via `ddl-auto=update`.

---

## 🔑 Test Accounts

Seed these accounts by running this SQL after schema import:

```sql
INSERT INTO users (full_name, username, email, mobile, password, role, email_verified, status) VALUES
('Alice Employer', 'employer', 'employer@taskora.com', '9000000001', '$2a$10$LZduT6cSeGlX0yr0JUiM8ORPqSJZ76nEFbC4szCPG..5F3jbYeJIW', 'EMPLOYER', 1, 'ACTIVE'),
('Frank Freelancer', 'freelancer', 'freelancer@taskora.com', '9000000002', '$2a$10$LZduT6cSeGlX0yr0JUiM8ORPqSJZ76nEFbC4szCPG..5F3jbYeJIW', 'FREELANCER', 1, 'ACTIVE'),
('Grace Freelancer', 'freelancer2', 'freelancer2@taskora.com', '9000000003', '$2a$10$LZduT6cSeGlX0yr0JUiM8ORPqSJZ76nEFbC4szCPG..5F3jbYeJIW', 'FREELANCER', 1, 'ACTIVE'),
('Cara Creator', 'creator', 'creator@taskora.com', '9000000004', '$2a$10$LZduT6cSeGlX0yr0JUiM8ORPqSJZ76nEFbC4szCPG..5F3jbYeJIW', 'CREATOR', 1, 'ACTIVE'),
('Adam Admin', 'admin', 'admin@taskora.com', '9000000005', '$2a$10$LZduT6cSeGlX0yr0JUiM8ORPqSJZ76nEFbC4szCPG..5F3jbYeJIW', 'ADMIN', 1, 'ACTIVE');

INSERT INTO categories (category_name, description, status) VALUES
('Web Development', 'Websites and web applications', 1),
('Mobile Development', 'iOS and Android apps', 1),
('AI & ML', 'Artificial Intelligence and Machine Learning', 1),
('Cloud Computing', 'AWS, Azure, GCP services', 1),
('UI/UX Design', 'Interface and experience design', 1);
```

| Role | Username | Email | Password |
|------|----------|-------|----------|
| Employer | `employer` | `employer@taskora.com` | `secret123` |
| Freelancer | `freelancer` | `freelancer@taskora.com` | `secret123` |
| Freelancer | `freelancer2` | `freelancer2@taskora.com` | `secret123` |
| Creator | `creator` | `creator@taskora.com` | `secret123` |
| Admin | `admin` | `admin@taskora.com` | `secret123` |

> Login works with either username or email.

---

## 📡 API Documentation

### Base URL: `http://localhost:8081/api`

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login (returns JWT) |
| POST | `/auth/verify-email` | Verify email with token |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password with token |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile/me` | Get my profile |
| PUT | `/profile/update` | Update profile fields |
| PUT | `/profile/change-password` | Change password |
| PUT | `/profile/change-username` | Change username |
| POST | `/profile/upload-avatar` | Upload avatar image |
| POST | `/profile/upload-cover` | Upload cover image |
| DELETE | `/profile/delete-account` | Delete account |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/jobs/feed` | Public job feed |
| GET | `/jobs/search` | Search with filters |
| GET | `/jobs/{id}` | Job details |
| GET | `/jobs/my-jobs` | My posted jobs |
| POST | `/jobs/create` | Create job |
| PUT | `/jobs/{id}` | Update job |
| DELETE | `/jobs/{id}` | Delete job |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/applications/apply` | Apply for a job |
| GET | `/applications/job/{id}` | View applicants |
| GET | `/applications/my-applications` | My applications |
| PUT | `/applications/{id}/status` | Update status |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects/feed` | Open projects |
| GET | `/projects/search` | Search projects |
| POST | `/projects` | Create project |
| PUT | `/projects/{id}` | Update project |
| DELETE | `/projects/{id}` | Delete project |

### Bids
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/bids` | Submit bid |
| PUT | `/bids/{id}` | Update bid |
| DELETE | `/bids/{id}` | Withdraw bid |
| GET | `/bids/project/{id}` | Bids on a project |
| GET | `/bids/my-bids` | My bids |
| PUT | `/bids/{id}/accept` | Accept bid |
| PUT | `/bids/{id}/reject` | Reject bid |

### Portfolio
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/portfolio` | My portfolio |
| GET | `/portfolio/user/{id}` | User's portfolio |
| POST | `/portfolio` | Create item |
| PUT | `/portfolio/{id}` | Update item |
| DELETE | `/portfolio/{id}` | Delete item |

### Posts (Social Feed)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/posts/feed` | Feed with pagination |
| POST | `/posts` | Create post |
| PUT | `/posts/{id}` | Edit post |
| DELETE | `/posts/{id}` | Delete post |
| POST | `/posts/{id}/like` | Toggle like |
| GET | `/posts/{id}/comments` | Get comments |
| POST | `/posts/{id}/comments` | Add comment |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/messages/send/{id}` | Send message |
| GET | `/messages/conversation/{id}` | Chat history |
| GET | `/messages/contacts` | Contact list |
| GET | `/messages/unread-count` | Unread count |
| PUT | `/messages/{id}` | Edit message |
| DELETE | `/messages/{id}` | Delete message |
| POST | `/messages/upload` | Upload chat attachment |

### WebSocket
| Endpoint | Description |
|----------|-------------|
| `/ws` (SockJS) | WebSocket handshake |
| `/app/chat.send` | Send message via STOMP |
| `/user/queue/messages` | Receive messages |
| `/user/queue/notifications` | Receive notifications |

### Subscriptions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/subscriptions/creators` | List all creators |
| POST | `/subscriptions/subscribe/{id}` | Subscribe |
| POST | `/subscriptions/unsubscribe/{id}` | Unsubscribe |
| GET | `/subscriptions/my-subscriptions` | My subscriptions |
| GET | `/subscriptions/my-subscribers` | My subscribers |
| POST/PUT/DELETE | `/subscriptions/plans` | Manage plan |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications` | Recent notifications |
| GET | `/notifications/unread-count` | Unread count |
| PUT | `/notifications/mark-read` | Mark all read |

### Admin (all require ADMIN role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/stats` | Dashboard statistics |
| GET/DELETE | `/admin/users` | Manage users |
| PUT | `/admin/users/{id}/status` | Suspend/Activate |
| GET/DELETE | `/admin/jobs` | Manage jobs |
| GET/DELETE | `/admin/projects` | Manage projects |
| GET/DELETE | `/admin/posts` | Manage posts |
| GET/PUT/DELETE | `/admin/subscriptions` | Manage subscriptions |
| GET/PUT/DELETE | `/admin/applications` | Manage applications |

---

## 🗄️ Database Schema

**18 Tables:**

| Table | Purpose |
|-------|---------|
| users | User accounts |
| user_profiles | Extended profile data |
| categories | Job/Project categories |
| jobs | Job listings |
| job_applications | Job applications |
| projects | Freelance projects |
| project_bids | Project bids |
| posts | Social feed posts |
| post_likes | Post likes |
| post_comments | Post comments |
| portfolios | Portfolio items |
| portfolio_items | Legacy portfolio (linked to user) |
| subscriptions | Creator subscriptions |
| messages | Chat messages |
| notifications | Activity notifications |
| reports | User reports |
| cms_pages | CMS static pages |
| site_settings | Platform settings |
| user_verifications | Identity verification docs |

---

## 🖥️ Screenshots

The UI follows a modern design with:
- Blue primary (`#2563EB`) + Orange accent color scheme
- Left sidebar navigation (desktop) + Bottom tab bar (mobile)
- White cards on light-gray background
- Inter font family
- Responsive design (desktop + mobile)

Key screens:
1. Landing Page (Connect. Collaborate. Grow.)
2. Login / Register (split layout)
3. Dashboard (stat cards + recommended jobs)
4. Jobs Listing (search + filter + tabs)
5. Job Details (description + apply + overview)
6. Project Details (with bid submission)
7. Messaging (real-time chat with presence)
8. Profile (cover + avatar + skills + portfolio)
9. Admin Dashboard (stats + recent users)
10. Admin Management (tables with CRUD)

---

## 🚀 Deployment

### Production Build

**Frontend:**
```bash
cd taskora-frontend/taskora-frontend
npm run build
# Output in dist/ folder — serve with Nginx
```

**Backend:**
```bash
cd taskora-backend
./mvnw package -DskipTests
# JAR at target/taskora-backend-0.0.1-SNAPSHOT.jar
java -jar target/taskora-backend-0.0.1-SNAPSHOT.jar
```

### Environment Variables (Production)

Replace hardcoded values in `application.properties` with environment variables:
```properties
spring.datasource.password=${DB_PASSWORD}
taskora.app.jwtSecret=${JWT_SECRET}
spring.mail.password=${SMTP_PASSWORD}
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| `No compiler` error | Set `JAVA_HOME` to JDK (not JRE) path |
| Port in use | Change `server.port` in application.properties |
| CORS error | Ensure SecurityConfig allows frontend origin |
| Upload images not showing | Check `uploads/` folder exists in backend root |
| WebSocket not connecting | Verify backend is running and `/ws` is whitelisted |
| Login fails | Try both username and email; check password is `secret123` |

---

## 👨‍💻 Contributors

- **Full Stack Developer** — Taskora Development Team
- **Technology**: Java 21 + Spring Boot 3 + React 19
- **Architecture**: Modular Monolith (Microservices-ready)
- **Duration**: 20 Days (09/06/2026 – 29/06/2026)

---

## 📄 License

This project is developed for educational and professional portfolio purposes.

---

**Taskora v1.0** — Connect • Collaborate • Grow
