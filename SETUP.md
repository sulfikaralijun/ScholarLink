# ScholarLink Setup Guide

## 🚀 Quick Start

### 1. Environment Setup
```bash
# Copy environment variables
cp .env.example .env

# Edit .env file with your database credentials
DATABASE_URL="mysql://user:password@localhost:3306/scholarlink"
JWT_SECRET="your-super-secret-jwt-key-here"
TOKEN_EXPIRY="7d"
```

### 2. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed database with super admin
pnpm run seed
```

### 3. Start Development Server
```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

## 🔐 Admin Access

After running the seed script, you can login with:

- **Email**: `admin@scholarlink.com`
- **Password**: `admin123`
- **Role**: `super_admin`

## 📋 Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run seed` - Seed database with super admin
- `pnpm run db:seed` - Alternative seed command

## 🗄️ Database Commands

- `npx prisma generate` - Generate Prisma client
- `npx prisma migrate dev` - Run migrations
- `npx prisma studio` - Open database GUI
- `npx prisma db push` - Push schema changes

## 🔧 Troubleshooting

### Database Connection Issues
1. Make sure MySQL is running
2. Check DATABASE_URL in .env file
3. Verify database credentials

### Seed Script Issues
1. Make sure database is migrated
2. Check if admin already exists
3. Verify Prisma client is generated

### Authentication Issues
1. Check JWT_SECRET in .env file
2. Verify token expiry settings
3. Check browser cookies

## 📁 Project Structure

```
src/
├── routes/
│   ├── (auth)/          # Authentication pages
│   │   ├── login/       # Admin login
│   │   └── logout/      # Admin logout
│   ├── (app)/           # Protected admin pages
│   │   └── dashboard/   # Admin dashboard
│   └── (landing-page)/  # Public pages
├── lib/
│   └── server/
│       ├── prisma.ts    # Database client
│       └── utils/       # Server utilities
└── prisma/
    ├── schema.prisma    # Database schema
    └── seed.ts          # Database seeding
```

## 🎯 Features

### ✅ Implemented
- Admin authentication (login/logout)
- JWT token management
- Protected dashboard routes
- Database seeding
- Responsive UI

### 🚧 Coming Soon
- Beasiswa CRUD operations
- Admin management
- Email notifications
- Analytics dashboard

## 📞 Support

If you encounter any issues, check the console logs and ensure all dependencies are installed correctly.

