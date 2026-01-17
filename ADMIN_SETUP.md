# Admin Setup Guide

## Creating an Admin User

To access the admin dashboard at `/admin`, you need to create an admin user first.

### Method 1: Using the Script (Recommended)

Run the following command to create an admin user:

```bash
npm run create-admin
```

This will create an admin user with the following credentials:
- **Username**: `admin123`
- **Email**: `admin@thinkcraftlabs.com`
- **Password**: `123456`

### Method 2: Manual Database Update

If you already have a user account and want to make it an admin:

1. Connect to your MongoDB database
2. Run this command:

```javascript
db.users.updateOne(
  { username: "your_username" },
  { $set: { isAdmin: true } }
)
```

## Accessing the Admin Dashboard

1. Go to `/login` and sign in with your admin credentials
2. Once logged in, navigate to `/admin`
3. You'll see the admin dashboard with:
   - Total users count
   - Total events count
   - Total registrations across all events
   - Live events count
   - Full events management table
   - View registrations for each event
   - Delete events

## Security Notes

- The admin check is done server-side using session authentication
- Only users with `isAdmin: true` in the database can access the admin panel
- The admin credentials are stored securely with bcrypt hashing
- **Important**: Change the default admin password after first login in production!

## Features

- **Dashboard Statistics**: Overview of platform metrics
- **Event Management**: View all events with details
- **Registration Tracking**: See who registered for each event
- **Event Deletion**: Remove events as needed
- **Live Event Monitoring**: Track currently active events
