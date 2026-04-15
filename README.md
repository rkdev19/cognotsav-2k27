# COGNOTSAV 2K27 – College Event Management System

A full-stack web application for managing college technical events, student registrations, team coordination, and results display. Built with React 19, Express, tRPC, MySQL, and Tailwind CSS with a Blue/White/Gold theme.

## 🎨 Features

### Public Features
- **Home Page**: Landing page with countdown timer, event highlights, and smooth animations
- **Events Listing**: Browse all technical and non-technical events with filtering by type
- **Student Registration**: Register as a participant with name, roll number, department, year, email, and phone
- **Event Registration**: Sign up for individual or team-based events with duplicate prevention
- **Results & Leaderboard**: View winners, rankings, and scores for all events with podium display
- **Responsive Design**: Fully mobile-friendly interface with Blue/White/Gold color palette

### Admin Features
- **Admin Login**: Secure authentication with admin credentials
- **Event Management**: Create, view, and delete events with full details
- **Student Management**: View all registered students and manage registrations
- **Registration Tracking**: Monitor all event registrations with participant details
- **Results Management**: Add and manage event results with rankings
- **Dashboard Analytics**: View statistics and participant counts

## 🗄️ Database Schema

The application uses MySQL with the following tables:

### Core Tables
- **students**: Student information (name, roll number, department, year, email, phone)
- **events**: Event details (name, description, date, venue, max participants, type, prize)
- **teams**: Team information (name, leader ID, creation date)
- **teamMembers**: Team membership mapping (team ID, student ID)
- **registrations**: Event registrations (event ID, student ID, team ID, registration date)
- **results**: Event results (event ID, position, student ID, team ID, score)
- **adminCredentials**: Admin login credentials (username, password hash)

## 🚀 Getting Started

### Prerequisites
- Node.js 22.x or higher
- pnpm 10.x or higher
- MySQL database (provided by Manus platform)

### Installation & Setup

1. **Install Dependencies**
   ```bash
   cd /home/ubuntu/cognotsav-2k27
   pnpm install
   ```

2. **Database Setup** (Already done)
   - The database schema has been created with all tables
   - Seed data with sample students, events, teams, and results is pre-loaded

3. **Start Development Server**
   ```bash
   pnpm dev
   ```
   The application will be available at `http://localhost:3000`

### Build & Production

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 📝 Demo Credentials

### Admin Login
- **Username**: `admin`
- **Password**: `admin123`

### Sample Students (Pre-loaded)
- Aarav Sharma (Roll: 2024001)
- Priya Patel (Roll: 2024002)
- Rohan Kumar (Roll: 2024003)
- Neha Singh (Roll: 2024004)
- Vikram Reddy (Roll: 2024005)
- Anjali Verma (Roll: 2024006)
- Arjun Nair (Roll: 2024007)
- Divya Gupta (Roll: 2024008)

### Sample Events (Pre-loaded)
1. **Code Sprint** (Individual) - Fast-paced coding competition
2. **Tech Quiz** (Individual) - Test your technical knowledge
3. **Hackathon** (Team) - Build innovative solutions in 24 hours
4. **Robotics Challenge** (Team) - Design and compete with robots

## 🎯 User Workflows

### Student Registration Flow
1. Visit home page
2. Click "Register Now" button
3. Fill in student details (name, roll number, department, year, email, phone)
4. Submit registration
5. Proceed to Events page to register for specific events

### Event Registration Flow
1. Go to Events page
2. Browse and filter events by type (Individual/Team)
3. Click "Register for Event" on desired event
4. Select student or team (must be pre-registered)
5. Complete registration
6. View confirmation and proceed to Results page

### Admin Workflow
1. Click "Admin" in navigation
2. Enter credentials (admin/admin123)
3. Access dashboard with tabs for:
   - **Events**: View, create, and delete events
   - **Students**: View and manage student registrations
   - **Registrations**: Monitor all event registrations
   - **Results**: Add and manage event results

## 🎨 Design & Theme

### Color Palette
- **Primary Blue**: `#3B82F6` (rgb(59, 130, 246))
- **Gold Accent**: `#F59E0B` (rgb(245, 158, 11))
- **White**: `#FFFFFF` (rgb(255, 255, 255))

### Animations
- **Fade In Up**: Smooth entrance from bottom
- **Slide In Left/Right**: Directional slide animations
- **Pulse Glow**: Glowing effect on interactive elements
- **Float**: Gentle floating animation
- **Hover Effects**: Scale and shadow transitions on cards and buttons

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 📱 Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with countdown timer and highlights |
| `/events` | Events listing with filtering |
| `/register` | Student registration form |
| `/event-register/:eventId` | Event-specific registration |
| `/results` | Results and leaderboard display |
| `/admin` | Admin login page |
| `/admin/dashboard` | Admin dashboard with management panels |

## 🔧 API Endpoints (tRPC)

### Public Procedures
- `student.create` - Register new student
- `student.list` - Get all students
- `event.list` - Get all events
- `event.getById` - Get event details
- `team.list` - Get all teams
- `registration.create` - Register for event
- `registration.list` - Get all registrations
- `result.list` - Get all results

### Admin Procedures
- `admin.login` - Authenticate admin
- `admin.logout` - Logout admin
- `event.create` - Create new event
- `event.update` - Update event details
- `event.delete` - Delete event
- `student.delete` - Delete student
- `result.create` - Add event result
- `result.update` - Update result
- `result.delete` - Delete result

## 🧪 Testing

### Manual Testing Checklist
- [ ] Register as a new student
- [ ] View all events and filter by type
- [ ] Register for an individual event
- [ ] Register for a team event
- [ ] View results and leaderboard
- [ ] Test admin login with demo credentials
- [ ] Create a new event from admin dashboard
- [ ] Delete a student from admin dashboard
- [ ] View all registrations in admin panel
- [ ] Test responsive design on mobile

### Running Tests
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch
```

## 📦 Technology Stack

### Frontend
- **React 19**: UI framework
- **Tailwind CSS 4**: Styling and animations
- **Wouter**: Lightweight routing
- **tRPC**: End-to-end type-safe APIs
- **Sonner**: Toast notifications
- **Lucide React**: Icon library

### Backend
- **Express 4**: Web server
- **tRPC 11**: RPC framework
- **Drizzle ORM**: Database abstraction
- **MySQL 2**: Database driver
- **bcryptjs**: Password hashing

### Development
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety
- **Vitest**: Unit testing framework
- **Prettier**: Code formatting

## 🔐 Security Features

- **Password Hashing**: Admin passwords hashed with bcryptjs
- **Duplicate Prevention**: System-level duplicate registration prevention
- **Admin Authentication**: Login-protected admin dashboard
- **Input Validation**: Zod schemas for all inputs
- **Type Safety**: End-to-end TypeScript for type safety

## 📊 Database Relationships

```
students (1) ──→ (many) registrations
students (1) ──→ (many) teamMembers
students (1) ──→ (many) teams (as leader)
events (1) ──→ (many) registrations
events (1) ──→ (many) results
teams (1) ──→ (many) teamMembers
teams (1) ──→ (many) registrations
teams (1) ──→ (many) results
```

## 🎯 Key Features Implemented

✅ **Complete Student Registration System**
- Form validation and database persistence
- All required fields (name, roll, department, year, email, phone)

✅ **Event Management**
- Full CRUD operations for events
- Support for individual and team-based events
- Event filtering and search

✅ **Team Coordination**
- Team creation and member management
- Team-based event registration

✅ **Event Registration**
- Individual and team registration support
- Duplicate registration prevention
- Real-time availability checking

✅ **Results & Leaderboard**
- Podium display for top 3 winners
- Full leaderboard with rankings
- Score tracking and display

✅ **Admin Dashboard**
- Secure login with credentials
- Event management interface
- Student and registration tracking
- Results management

✅ **Responsive Design**
- Mobile-first approach
- Fully responsive on all devices
- Touch-friendly interface

✅ **Blue/White/Gold Theme**
- Consistent color palette throughout
- Gradient backgrounds and accents
- Professional appearance

✅ **Smooth Animations**
- Fade-in animations on page load
- Hover effects on interactive elements
- Smooth transitions between states

## 📝 Development Notes

### Project Structure
```
cognotsav-2k27/
├── client/
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   ├── lib/            # Utilities and tRPC client
│   │   ├── App.tsx         # Main app with routes
│   │   └── index.css       # Global styles with theme
│   └── index.html
├── server/
│   ├── routers.ts          # tRPC procedures
│   ├── db.ts               # Database queries
│   └── _core/              # Core infrastructure
├── drizzle/
│   └── schema.ts           # Database schema
└── package.json
```

### Environment Variables
All required environment variables are automatically injected by the Manus platform:
- `DATABASE_URL`: MySQL connection string
- `JWT_SECRET`: Session signing secret
- `VITE_APP_ID`: OAuth application ID
- `OAUTH_SERVER_URL`: OAuth backend URL

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure `DATABASE_URL` environment variable is set correctly
- Check MySQL connection with proper SSL settings
- Verify database tables exist with correct schema

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Build Errors
```bash
# Clear build cache and reinstall
rm -rf node_modules .pnpm-store dist
pnpm install
```

## 📞 Support

For issues or questions, refer to the documentation or check the application logs:
- Server logs: Check console output from `pnpm dev`
- Client logs: Check browser console (F12)
- Database logs: Check MySQL error logs

## 📄 License

This project is part of COGNOTSAV 2K27 – State Level Technical Event.

---

**Last Updated**: April 15, 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅
