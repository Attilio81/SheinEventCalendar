<div align="center">

# 📅 Shein Event Calendar

A collaborative, real-time calendar application for creating, managing, and sharing events across multiple users.

**[Live Demo](#) • [Features](#features) • [Setup](#quick-start) • [Architecture](#architecture)**

---

</div>

## ✨ Features

- 📱 **Multiple Calendar Views** - Month, Week, and Day views for flexible event management
- 🔐 **Secure Authentication** - Email/password authentication with Supabase
- 🌍 **Location Autocomplete** - Integrated location search powered by Geoapify API
- 📡 **Real-time Synchronization** - Live updates across all connected clients
- 🎨 **Intuitive UI** - Modern dark theme with responsive design
- 👥 **Collaborative Events** - View events from all users with individual ownership control
- ✏️ **Full Event Management** - Create, edit, and delete multi-day events
- 📍 **Event Details** - Support for titles, descriptions, locations, and color coding

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend/Database**: Supabase (PostgreSQL + Auth + Realtime)
- **Location Search**: Geoapify API
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/SheinEventCalendar.git
   cd SheinEventCalendar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env.local`
   - Add your API keys:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     VITE_GEOAPIFY_API_KEY=your_geoapify_api_key
     ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

## 📋 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Calendar.tsx     # Month view
│   ├── WeekView.tsx     # Week view
│   ├── DayView.tsx      # Day view
│   ├── EventModal.tsx   # Create/edit events
│   ├── Header.tsx
│   └── ...
├── contexts/
│   └── AuthContext.tsx  # Authentication state
├── lib/
│   └── supabase.ts      # Supabase client
├── types.ts             # TypeScript types
├── styles/
│   └── index.css        # Tailwind styles
└── App.tsx
```

## 🗄️ Database Schema

### Events Table
```sql
- id (UUID, primary key)
- title (text)
- start_date (date)
- end_date (date)
- location (text)
- description (text, optional)
- color (text)
- user_id (UUID, foreign key to auth.users)
```

**Row-Level Security (RLS) Policies:**
- All authenticated users can view all events
- Users can only edit/delete their own events

## 🔄 Data Flow

1. **Authentication** → User logs in via Supabase Auth
2. **Event Loading** → Fetch events from database (respecting RLS)
3. **Real-time Updates** → Supabase subscriptions push changes instantly
4. **Event Mutations** → Create/update/delete events with ownership checks

## 📲 Deployment

### Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Project Settings
4. Deploy automatically on push

### Self-hosted

Set up environment variables and run:
```bash
npm run build
npm start
```

## 🔧 Configuration

### Supabase Setup

Complete the setup by running the SQL script in Supabase Dashboard:
1. Go to SQL Editor
2. Run `supabase-setup-complete.sql`
3. This configures:
   - Events table schema
   - Row-Level Security (RLS) policies
   - Realtime subscriptions
   - Performance indexes

## 📖 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋 Support

If you have any questions or issues, please [open an issue](https://github.com/yourusername/SheinEventCalendar/issues) on GitHub.

---

<div align="center">
  Made with ❤️ by Attilio Pregnolato
</div>
