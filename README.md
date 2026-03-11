# StayBuddy - Premium Rental Marketplace

Modern, animated, and fully responsive rental marketplace platform built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## Features

### Navbar
✨ Smooth fade + slide animations on page load
🎯 Sticky navbar with scroll effects (transparent → white with shadow)
🎨 Gradient logo with hover scale animation
🔗 Navigation links with underline grow animation
🎭 Buttons with hover glow and scale effects
📱 Fully responsive mobile menu with slide-down animation

### Authentication Pages
🔐 Modern Login page with form validation
📝 Sign Up page with role selection (Tenant/Owner)
✅ React Hook Form + Zod validation
🎨 Smooth animations and transitions
📱 Fully responsive design
🔑 Password visibility toggle
🌐 Social login options (Google, Facebook)

## Installation

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- React Hook Form
- Zod (validation)
- Lucide React Icons

## Project Structure

```
components/
  └── Navbar.tsx              # Animated navbar component
app/
  ├── layout.tsx              # Root layout with navbar
  ├── page.tsx                # Home page
  ├── login/
  │   └── page.tsx            # Login page
  ├── signup/
  │   └── page.tsx            # Sign up page with role selection
  ├── forgot-password/
  │   └── page.tsx            # Password reset page
  ├── browse-pg/
  │   └── page.tsx            # Browse PG listings
  ├── rental-homes/
  │   └── page.tsx            # Rental homes listings
  ├── post-property/
  │   └── page.tsx            # Post property page
  ├── about/
  │   └── page.tsx            # About page
  └── globals.css             # Global styles
```

## Pages

- `/` - Home page
- `/login` - Login page with email/password
- `/signup` - Sign up page with role selection (Tenant/Owner)
- `/forgot-password` - Password reset page
- `/browse-pg` - Browse PG listings
- `/rental-homes` - Rental homes listings
- `/post-property` - Post property page
- `/about` - About page

## Form Validation

### Login
- Email: Valid email format required
- Password: Minimum 6 characters

### Sign Up
- Full Name: Minimum 2 characters
- Email: Valid email format required
- Phone: Minimum 10 digits
- Password: Minimum 6 characters
- Confirm Password: Must match password
- Role: Tenant or Owner selection required

## Customization

### Navbar
Edit `components/Navbar.tsx` to customize:
- Navigation links
- Colors and gradients
- Animation timings
- Button styles

### Auth Pages
Edit `app/login/page.tsx` and `app/signup/page.tsx` to customize:
- Form fields
- Validation rules
- Social login providers
- Color schemes

## Color Palette

- Primary: Indigo (#4F46E5) to Blue (#3B82F6) gradient
- Background: Soft gradient from indigo-50 to blue-50
- Text: Gray-700 for body, Gray-900 for headings
- Borders: Gray-300 with indigo-500 focus rings
