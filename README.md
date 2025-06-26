# Dynamic Survey Builder

A web application for creating and managing interactive surveys with advanced features like drag-and-drop question reordering, real-time previews, and response analytics.

## Tech Stack

- **Frontend**: Next.js (App Router)
- **State Management**: Redux Toolkit
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Styling**: Tailwind CSS + Material UI
- **Drag and Drop**: @dnd-kit/core
- **Charts**: Recharts

## Features

- User authentication (login/register)
- Survey creation with multiple question types:
  - Multiple Choice
  - Text Input
  - Rating (1-5 scale)
- Drag-and-drop question reordering
- Real-time survey preview
- Public shareable survey links
- Response collection and analytics
- Mobile-responsive design

## Project Structure

```
.
├── app/                  # Next.js App Router pages
├── components/           # Reusable components
├── features/             # Redux slices for auth, survey, and responses
├── lib/                  # Redux store configuration
├── firebase/             # Firebase configuration
└── utils/                # Helper functions
```

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env.local` file with your Firebase configuration:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```
4. Run the development server: `npm run dev`

## Current Progress

- [x] Project setup with Next.js, Redux, Firebase, and Tailwind CSS
- [x] Authentication slice and components
- [x] Survey creation and management slice
- [x] Response handling slice
- [x] Dashboard layout and navigation
- [x] Survey creation interface with drag-and-drop
- [ ] Public survey response page
- [ ] Survey results analytics dashboard
- [ ] Mobile optimization



