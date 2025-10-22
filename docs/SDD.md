# Software Design Document (SDD)
## ScholarLink - Platform Informasi Beasiswa

---

## 1. Introduction

### 1.1 Purpose
Dokumen ini menjelaskan desain arsitektur dan komponen sistem ScholarLink, platform informasi beasiswa yang mendukung SDGs ke-10 tanpa user login.

### 1.2 Scope
Dokumen ini mencakup:
- Arsitektur sistem secara keseluruhan
- Desain komponen dan modul
- Database design dengan schema terbaru
- Interface design
- Security design
- Deployment architecture

### 1.3 Definitions
- **MVC**: Model-View-Controller
- **API**: Application Programming Interface
- **ORM**: Object-Relational Mapping
- **JWT**: JSON Web Token
- **CRUD**: Create, Read, Update, Delete

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (SvelteKit)   │◄──►│   (SvelteKit)   │◄──►│   (Posgresql)       │
│                 │    │                 │    │                 │
│ - UI Components │    │ - API Routes    │    │ - Admin Data    │
│ - State Mgmt    │    │ - Business Logic│    │ - Beasiswa Data │
│ - Routing       │    │ - Authentication│    │ - Subscription  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 2.2 Technology Stack

#### Frontend
- **Framework**: SvelteKit 5
- **Styling**: TailwindCSS + DaisyUI
- **Icons**: Lucide Svelte
- **Language**: TypeScript

#### Backend
- **Runtime**: SvelteKit (Node.js)
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt (Admin only)
- **Database**: Posgresql

---

## 3. Component Design

### 3.1 Frontend Components

#### 3.1.1 Layout Components
```typescript
// +layout.svelte
- AppLayout: Main application layout
- AuthLayout: Authentication pages layout (Admin only)
- LandingLayout: Landing page layout
```

#### 3.1.2 Page Components
```typescript
// Pages
- LandingPage: Home page with hero section
- BeasiswaPage: List of scholarships
- BeasiswaDetail: Scholarship details
- AdminLogin: Admin authentication
- AdminDashboard: Admin management
```

#### 3.1.3 UI Components
```typescript
// Reusable Components
- SearchBar: Search functionality
- FilterPanel: Filter options
- BeasiswaCard: Scholarship card
- LoadingSpinner: Loading states
- NotificationBell: Notification indicator
```

### 3.2 Backend Components

#### 3.2.1 API Routes
```typescript
// API Structure
/api/v1/
├── auth/
│   └── logout
├── beasiswa/
│   ├── GET / (list)
│   ├── GET /:id (detail)
│   ├── POST / (create - admin)
│   ├── PUT /:id (update - admin)
│   └── DELETE /:id (delete - admin)
└── subscriptions/
    ├── POST / (subscribe)
    └── DELETE / (unsubscribe)
```

#### 3.2.2 Service Layer
```typescript
// Services
- AuthService: Admin authentication logic
- BeasiswaService: Scholarship management
- SubscriptionService: Email subscription handling
- SearchService: Search functionality
```

#### 3.2.3 Utility Functions
```typescript
// Utils
- jwt.ts: JWT token management
- passport.ts: Password hashing
- validation.ts: Input validation
- email.ts: Email sending
```

---

## 4. Database Design

### 4.1 Entity Relationship Diagram

```
Admin (1) ──── (N) Beasiswa
  │
  │ (role: admin/super_admin)
  │
  │ (1) ──── (N) Admin (super_admin manages admin)

Subscription (Standalone)
```

### 4.2 Database Schema

#### 4.2.1 Admin Table
```sql
CREATE TABLE Admin (
    id_admin INT PRIMARY KEY AUTO_INCREMENT,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 4.2.2 Beasiswa Table
```sql
CREATE TABLE Beasiswa (
    id_beasiswa VARCHAR(255) PRIMARY KEY,
    id_admin INT NOT NULL,
    judul VARCHAR(255) NOT NULL,
    penyelenggara VARCHAR(255) NOT NULL,
    lokasi VARCHAR(255) NOT NULL,
    kategori VARCHAR(100) NOT NULL,
    deadline DATETIME NOT NULL,
    tipe_pendanaan VARCHAR(100) NOT NULL,
    deskripsi TEXT NOT NULL,
    link_pendaftaran VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_admin) REFERENCES Admin(id_admin)
);
```

#### 4.2.3 Subscription Table
```sql
CREATE TABLE Subscription (
    id_subscription INT PRIMARY KEY AUTO_INCREMENT,
    email_user VARCHAR(255) NOT NULL,
    tanggal_daftar TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 5. Interface Design

### 5.1 User Interface Design

#### 5.1.1 Design Principles
- **Mobile-First**: Responsive design untuk semua device
- **Accessibility**: WCAG 2.1 compliance
- **Consistency**: Consistent UI patterns
- **Performance**: Fast loading dan smooth interactions

#### 5.1.2 Color Scheme
```css
:root {
  --primary: #3B82F6;      /* Blue */
  --secondary: #F59E0B;     /* Amber */
  --success: #10B981;       /* Green */
  --warning: #F59E0B;       /* Amber */
  --error: #EF4444;         /* Red */
  --gray-50: #F9FAFB;
  --gray-900: #111827;
}
```

#### 5.1.3 Typography
```css
/* Font Stack */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Heading Sizes */
h1: 2.5rem (40px)
h2: 2rem (32px)
h3: 1.5rem (24px)
h4: 1.25rem (20px)
```



