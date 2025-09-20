# 🚀 **DEPLOYMENT GUIDE - luisalban.xyz**

## 📋 **Pre-Deployment Checklist:**

### **1. Update Database Password:**
You need to update the MySQL password in the config file:

**File:** `LAMPAPI/config.php`
**Line 4:** Change `'your_mysql_password'` to your actual MySQL root password

```php
define('DB_PASS', 'your_actual_mysql_password'); // Replace this!
```

### **2. Verify Database Structure:**
Make sure your `CONTACTS` database has the correct tables:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS Users (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Login VARCHAR(50),
    Password VARCHAR(50)
);

-- Contacts table  
CREATE TABLE IF NOT EXISTS Contacts (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Phone VARCHAR(20),
    Email VARCHAR(100),
    UserID INT,
    FOREIGN KEY (UserID) REFERENCES Users(ID)
);
```

## 🔧 **Deployment Steps:**

### **Step 1: Upload Files to Server**
```bash
# Upload the entire project to your server
scp -r /Users/luisalban/Code/POOSD-Small-Project/* luisalban@luisalban.xyz:/path/to/your/web/directory/
```

### **Step 2: Set Permissions**
```bash
# SSH into your server
ssh luisalban@luisalban.xyz

# Set proper permissions for PHP files
chmod 644 LAMPAPI/*.php
chmod 755 LAMPAPI/
```

### **Step 3: Configure Web Server**
Make sure your web server (Apache/Nginx) is configured to:
- Serve PHP files
- Allow CORS requests
- Point to your project directory

### **Step 4: Build React App for Production**
```bash
# In your local project directory
npm run build

# Upload the dist folder to your server
scp -r dist/* luisalban@luisalban.xyz:/path/to/your/web/directory/
```

## 🌐 **Production URLs:**

### **Frontend (React App):**
- **URL:** `https://luisalban.xyz/`
- **Login:** `https://luisalban.xyz/`
- **Signup:** `https://luisalban.xyz/signup`
- **Contacts:** `https://luisalban.xyz/contacts`

### **Backend APIs:**
- **Login:** `https://luisalban.xyz/LAMPAPI/Login.php`
- **Register:** `https://luisalban.xyz/LAMPAPI/Register.php`
- **Search Contacts:** `https://luisalban.xyz/LAMPAPI/SearchContacts.php`
- **Add Contact:** `https://luisalban.xyz/LAMPAPI/AddContact.php`
- **Edit Contact:** `https://luisalban.xyz/LAMPAPI/EditContacts.php`
- **Delete Contact:** `https://luisalban.xyz/LAMPAPI/DeleteContact.php`

## 🔒 **Security Considerations:**

### **1. Database Security:**
- ✅ **User Isolation:** Each user only sees their own contacts
- ✅ **SQL Injection Protection:** All queries use prepared statements
- ✅ **CORS Headers:** Properly configured for your domain

### **2. Production Recommendations:**
- **HTTPS Only:** All API calls use HTTPS
- **Password Hashing:** Consider implementing password hashing
- **Rate Limiting:** Add rate limiting to prevent abuse
- **Input Validation:** Server-side validation on all inputs

## 🧪 **Testing Production:**

### **1. Test Database Connection:**
```bash
# SSH into your server
ssh luisalban@luisalban.xyz

# Test database connection
mysql -u root -p
use CONTACTS;
SELECT * FROM Users;
SELECT * FROM Contacts;
```

### **2. Test API Endpoints:**
```bash
# Test login API
curl -X POST https://luisalban.xyz/LAMPAPI/Login.php \
  -H "Content-Type: application/json" \
  -d '{"login":"testuser","password":"testpass"}'
```

### **3. Test Frontend:**
1. Open `https://luisalban.xyz/`
2. Try logging in with existing credentials
3. Test all contact management features

## 📁 **File Structure on Server:**
```
/your/web/directory/
├── index.html              # React app entry point
├── assets/                 # Built React assets
├── LAMPAPI/
│   ├── config.php         # Database configuration
│   ├── Login.php          # Login API
│   ├── Register.php       # Registration API
│   ├── SearchContacts.php # Contact search API
│   ├── AddContact.php     # Add contact API
│   ├── EditContacts.php   # Edit contact API
│   └── DeleteContact.php  # Delete contact API
└── src/                   # Source files (optional)
```

## ⚠️ **Important Notes:**

1. **Update Password:** You MUST update the MySQL password in `config.php`
2. **HTTPS Required:** The React app expects HTTPS for API calls
3. **CORS Configuration:** Already set to allow all origins (`*`)
4. **Database Access:** Make sure your web server can access MySQL

## 🎉 **Ready for Production!**

Once deployed, your contact manager will be available at:
**https://luisalban.xyz**

Users can register, login, and manage their contacts with full CRUD functionality!
