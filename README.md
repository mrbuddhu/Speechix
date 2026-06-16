# Speechix

## Enterprise-Grade AI Voice Cloning & Text-to-Speech Platform

A comprehensive, production-grade SaaS platform for AI voice cloning and text-to-speech generation with advanced voice management, history tracking, and admin controls.

---

## ⚠️ Important Notice

**This project is proprietary and confidential.**
This is the exclusive intellectual property of mrbuddhu. **This project should not be copied, distributed, reproduced, or used in any form without explicit written permission.** All rights reserved.

---

## 🏗️ Architecture Overview

### Full-Stack Architecture
- **Frontend**: Next.js 14 with App Router and TypeScript
- **Backend**: Python FastAPI backend
- **Styling**: Tailwind CSS with Radix UI components
- **Database**: SQLAlchemy ORM
- **Storage**: Cloud storage integration
- **Security**: JWT-based authentication

---

## 🚀 Core Features & Modules

### 1. User-Facing Features
- **Landing Page**: Professional marketing page with features, pricing, testimonials, and FAQ
- **User Authentication**: Secure login and registration
- **Voice Generation**: AI-powered text-to-speech with custom voices
- **Voice Studio**: Manage and customize cloned voices
- **Generation History**: Track and access all voice generations
- **Usage Overview**: Analytics and usage statistics
- **Account Management**: User profile and settings

### 2. Admin Features
- **Admin Dashboard**: Comprehensive admin panel
- **User Management**: Manage platform users
- **System Monitoring**: Platform health and usage
- **Analytics Overview**: Business intelligence dashboard

### 3. Backend Services
- **TTS Engine**: Advanced text-to-speech generation
- **Voice Cloning**: AI voice cloning capabilities
- **User Management**: User accounts and profiles
- **Storage Service**: File and media storage
- **Security & Auth**: JWT authentication and authorization

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 14.2** - Full-stack React framework with App Router
- **React 18.3** - Modern React with latest features
- **TypeScript 5.5** - Type-safe development
- **Tailwind CSS 3.4** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **React Icons** - Additional icon support

### Backend
- **Python** - Backend language
- **FastAPI** - Modern, fast web framework
- **SQLAlchemy** - ORM for database interactions
- **Pydantic** - Data validation and settings management
- **JWT** - JSON Web Tokens for authentication
- **Python-dotenv** - Environment variable management

---

## 📁 Project Structure

```
Speechix/
├── app/
│   ├── admin/
│   │   └── page.tsx
│   ├── app/
│   │   └── page.tsx
│   ├── landing/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── endpoints/
│   │   │       ├── auth.py
│   │   │       ├── tts.py
│   │   │       └── users.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   ├── db/
│   │   │   ├── base.py
│   │   │   └── session.py
│   │   ├── models/
│   │   │   ├── tts.py
│   │   │   └── user.py
│   │   ├── schemas/
│   │   │   ├── base.py
│   │   │   ├── tts.py
│   │   │   └── user.py
│   │   ├── services/
│   │   │   ├── storage.py
│   │   │   ├── tts.py
│   │   │   └── user.py
│   │   └── main.py
│   ├── .env
│   ├── .env.example
│   └── requirements.txt
├── components/
│   ├── landing/
│   │   ├── faq.tsx
│   │   ├── features.tsx
│   │   ├── footer.tsx
│   │   ├── pricing.tsx
│   │   └── testimonials.tsx
│   ├── ui/
│   │   ├── alert.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── progress.tsx
│   │   ├── select.tsx
│   │   └── textarea.tsx
│   ├── AccountSection.tsx
│   ├── GenerationHistory.tsx
│   ├── ProtectedRoute.tsx
│   ├── Sidebar.tsx
│   ├── Toast.tsx
│   ├── ToastProvider.tsx
│   ├── UsageOverview.tsx
│   ├── VoiceGeneration.tsx
│   └── VoiceStudio.tsx
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   └── utils.ts
├── public/
│   └── (assets
├── .env.example
├── .gitignore
├── README.md
├── components.json
├── next.config.js
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── run.bat
├── start-dev.bat
└── start-dev.sh
```

---

## 🛠️ Installation & Setup

### Frontend Setup
1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

### Backend Setup
1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**
   ```bash
   # Windows
   venv\Scripts\activate
   # Linux/Mac
   source venv/bin/activate
   ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

6. **Run backend server**
   ```bash
   python app/main.py
   ```

---

## 📋 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Backend
- `python app/main.py` - Start backend server

---

## 🚀 Key Differentiators

- **AI Voice Cloning** - Create custom AI voices that sound like you
- **Professional TTS** - High-quality text-to-speech generation
- **Voice Management** - Easy voice studio for managing all your voices
- **History & Analytics** - Track usage and generation history
- **Admin Panel** - Full-featured admin dashboard
- **Enterprise-Grade** - Production-ready architecture
- **Type-Safe** - Full TypeScript coverage

---

## 📄 License & Confidentiality

This project and all associated materials are confidential and proprietary.
© 2026 mrbuddhu. All Rights Reserved.

No part of this project may be reproduced, distributed, or transmitted in any form or by any means without the prior written permission of mrbuddhu.

---

## 📞 Contact

For inquiries regarding this project, please contact the owner directly.

---

**This is a high-value enterprise project with an estimated development cost exceeding $60,000 USD.**