*File: `README.md`**

```markdown
# eConsult - Patient & Clinic Management Application

A comprehensive web application for managing patient appointments, clinic operations, and administrative tasks.

## Features

- **Multi-role Authentication**: Admin, Patient, and Staff login
- **Admin Dashboard**: Full access management with role-based permissions
- **Patient Portal**: Book appointments (Clinic Visit, Home Visit, Virtual Meeting, Ambulance)
- **Staff Dashboard**: Manage appointments, patients, and billing
- **Dynamic Access Control**: Add/remove roles and permissions without code changes
- **Weekly Analytics**: Visual charts for performance tracking
- **Persistent Storage**: All data saved and editable

## Technologies Used

- React 18
- React Router DOM
- Recharts (for charts)
- Lucide React (for icons)
- Tailwind CSS
- Browser Storage API

## Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd econsult

# Install dependencies
npm install

# Start development server
npm start
```

## Usage

### Default Login Credentials

**Admin:**
- Email: admin@econsult.com
- Password: admin123

**Patient:**
- Email: patient@econsult.com
- Password: patient123

**Staff:**
- Email: staff@econsult.com
- Password: staff123

## Project Structure

- `/src/components/auth` - Authentication components
- `/src/components/admin` - Admin dashboard and management
- `/src/components/patient` - Patient portal
- `/src/components/staff` - Staff dashboard
- `/src/components/shared` - Reusable UI components
- `/src/context` - React Context for state management
- `/src/hooks` - Custom React hooks
- `/src/utils` - Utility functions and constants

## Deployment

```bash
# Build for production
npm run build

# Deploy the build folder to your hosting service
```

## License

MIT License

## Author

Your Name

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
```
