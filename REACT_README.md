# Contact Manager - React Version

This is a React-based contact manager application that replicates the functionality of the original HTML/JavaScript version.

## Features Implemented

### Login Page (`/`)
- Username and password input fields
- Login button with loading state
- Error handling and validation
- Integration with PHP API (`/LAMPAPI/Login.php`)
- Redirects to contact page on successful login

### Signup Page (`/signup`)
- First name, last name, username, and password fields
- Signup button with loading state
- Error handling and validation
- Integration with PHP API (`/LAMPAPI/Register.php`)
- Redirects to contact page on successful registration

## Technical Details

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: CSS modules with matching design from original HTML
- **API Integration**: Fetch API calls to existing PHP endpoints

## File Structure

```
src/
├── App.tsx          # Main app with routing
├── App.css          # Styling for login/signup pages
├── index.css        # Global styles
├── Login.tsx        # Login component
└── Signup.tsx       # Signup component
```

## Running the Application

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Open browser to `http://localhost:5173`

## API Endpoints Used

- `POST /LAMPAPI/Login.php` - User authentication
- `POST /LAMPAPI/Register.php` - User registration

## Next Steps

The login and signup functionality is complete. The next step would be to create the contact management page that users are redirected to after successful login/registration.
