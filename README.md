# MediConnect - Healthcare Platform

MediConnect is a comprehensive telehealth platform that connects patients with healthcare providers through a digital ecosystem.

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```

### Running the Application
To start the development server:
```
npm run dev
```

The application will be available at `http://localhost:5173`

## User Roles

### 1. Admin
- Default credentials: 
  - Email: `admin@gmail.com`
  - Password: `medi@123`
- Access at: `/admin`
- Responsibilities:
  - Manage hospitals (add, edit, approve/reject)
  - Monitor doctors and patients
  - Generate reports
  - Send announcements

### 2. Hospital
- Credentials provided by admin when hospital is registered
- Access at: `/hospital`
- Responsibilities:
  - Manage hospital profile
  - Register doctors
  - Track appointments
  - Internal communications

### 3. Patient
- Registration through public interface
- Access at: `/patient`
- Responsibilities:
  - Book appointments
  - View medical history
  - Communicate with doctors

## Creating Test Hospitals

To create a test hospital for development/testing:

```
npm run create-hospital
```

This will create a hospital with the following credentials:
- Email: `test@hospital.com`
- Password: `hospital123`

## Fixing Existing Hospital Accounts

If you have existing hospital data in Firestore but the Firebase Authentication users are missing (which causes login errors), you can fix this by running:

```
npm run fix-hospital-auth
```

This script will:
1. Fetch all hospitals from the `adminHospitals` collection in Firestore
2. Create Firebase Authentication users for any hospitals that don't have them
3. Use the `tempPassword` field from Firestore or a default password if not set

### Fixing a Specific Hospital

To fix just one hospital account:

```
npm run fix-hospital-auth -- --email hosp@gmail.com
```

### Checking if a Hospital Exists

To check if a hospital exists in Firestore:

```
npm run fix-hospital-auth -- --check hosp@gmail.com
```

### Alternative Solution for Permission Issues

If you encounter permission issues with Firestore (common in development), you can manually create the missing Firebase Authentication users:

```
npm run create-missing-auth
```

This script creates Firebase Auth users for known hospitals without needing to read from Firestore.

## Firebase Configuration

The application uses Firebase for authentication and data storage. The configuration is set in `backend/firebase.js`.

## Project Structure

```
src/
├── admin/          # Admin dashboard
├── components/     # Shared components
├── hospital/       # Hospital dashboard
├── pages/          # Main pages (login, etc.)
├── patient/        # Patient dashboard
└── main.jsx        # Entry point
```

## Troubleshooting

### Authentication Issues
If you encounter authentication errors:
1. Ensure you're using the correct credentials
2. Check that the user exists in Firebase Authentication
3. Verify that the hospital data exists in the `adminHospitals` collection
4. Run `npm run fix-hospital-auth` to fix missing Firebase Auth users
5. If there are permission issues, try `npm run create-missing-auth`

### Common Error Messages
- "Invalid email or password" - Check credentials or run the fix script
- "No hospital workspace found" - Hospital data missing from Firestore