# 🔐 Authentication System - Mobile ↔ Backend Integration Guide

## 📋 Overview

This guide explains the complete authentication flow between the Shabaka mobile app and the NestJS backend, including all API endpoints, data structures, and step-by-step integration.

---

## 🎯 Quick Start

### 1. **Backend Setup**
```bash
cd backend
npm install
npm run start:dev  # Backend runs on http://localhost:3001
```

### 2. **Mobile Setup**
```bash
cd mobile
npm install

# Update .env with your local IP
# Find your IP:
# Windows: ipconfig
# Mac/Linux: ifconfig
# Update EXPO_PUBLIC_API_URL in .env file

npx expo start
```

### 3. **Test Connection**
```bash
# Test backend is running
curl http://192.168.1.180:3001/api/docs
# Should return Swagger documentation
```

---

## 🔄 Complete Authentication Flow

### **Flow Diagram**
```
┌─────────────────────────────────────────────────────────────────┐
│  MOBILE APP                    BACKEND API                      │
└─────────────────────────────────────────────────────────────────┘

1. LOGIN REQUEST
   Mobile                         Backend
   ──────────────────────────────────────────────────────
   POST /api/auth/login    →      Validate credentials
   {                               Generate 6-digit code
     email,                        Save to DB (expires 10min)
     password,                     Send email with code
     remember_me                   
   }                        ←      { requires2FA: true }


2. USER RECEIVES EMAIL
   ──────────────────────────────────────────────────────
   📧 Email: "Your verification code is: 123456"


3. 2FA VERIFICATION
   Mobile                         Backend
   ──────────────────────────────────────────────────────
   POST /api/auth/verify-2fa →    Verify code in DB
   {                               Check expiration
     email,                        Generate JWT tokens
     verificationCode              Track login activity
   }                        ←      {
                                     access_token,
                                     refresh_token,
                                     user: {
                                       _id, name, email, role
                                     }
                                   }


4. STORE TOKENS SECURELY
   Mobile
   ──────────────────────────────────────────────────────
   SecureStore.setItemAsync('access_token', token)
   SecureStore.setItemAsync('refresh_token', token)
   SecureStore.setItemAsync('user_data', JSON.stringify(user))


5. AUTHENTICATED REQUESTS
   Mobile                         Backend
   ──────────────────────────────────────────────────────
   GET /api/auth/me        →      Verify JWT token
   Header: Authorization:          Check blacklist
     Bearer {access_token}         Fetch user from DB
                          ←      { user: {...} }


6. TOKEN REFRESH (when expired)
   Mobile                         Backend
   ──────────────────────────────────────────────────────
   POST /api/auth/refresh  →      Verify refresh token
   {                               Check blacklist
     refresh_token                 Generate new access token
   }                       ←      { access_token }


7. LOGOUT
   Mobile                         Backend
   ──────────────────────────────────────────────────────
   POST /api/auth/logout   →      Add tokens to blacklist
   {                               Mark as revoked in DB
     refresh_token          
   }                       ←      { message: "Logout successful" }
   
   Clear local tokens
   Delete SecureStore items
```

---

## 🌐 API Endpoints Reference

### **Base URL**: `http://YOUR_IP:3001/api`

### 1️⃣ **Register** (Sign Up)
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "numtel": "12345678",           // Optional
  "date_naissance": "1990-01-01"  // Optional
}

✅ SUCCESS (201):
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "user": {
    "_id": "64a1b2c3d4e5f6789abcdef0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}

❌ ERROR (400):
{
  "statusCode": 400,
  "message": ["email must be an email", "password must be at least 8 characters"],
  "error": "Bad Request"
}

❌ ERROR (409):
{
  "statusCode": 409,
  "message": "Un utilisateur avec cet email existe déjà"
}
```

### 2️⃣ **Login** (Step 1 - Request 2FA Code)
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123",
  "remember_me": true  // Optional, extends token lifetime
}

✅ SUCCESS (200):
{
  "access_token": "",
  "refresh_token": "",
  "requires2FA": true,
  "message": "Code de vérification envoyé par email. Utilisez /auth/verify-2fa pour compléter la connexion."
}

❌ ERROR (401):
{
  "statusCode": 401,
  "message": "Email ou mot de passe incorrect",
  "error": "Unauthorized"
}
```

### 3️⃣ **Verify 2FA** (Step 2 - Complete Login)
```http
POST /api/auth/verify-2fa
Content-Type: application/json

{
  "email": "john@example.com",
  "verificationCode": "123456"
}

✅ SUCCESS (200):
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64a1b2c3d4e5f6789abcdef0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-15T10:00:00.000Z"
  },
  "rememberMe": true,
  "message": "Connexion réussie avec authentification à deux facteurs"
}

❌ ERROR (400):
{
  "statusCode": 400,
  "message": "Code de vérification invalide ou expiré",
  "error": "Bad Request"
}
```

### 4️⃣ **Get Profile**
```http
GET /api/auth/me
Authorization: Bearer {access_token}

✅ SUCCESS (200):
{
  "user": {
    "sub": "64a1b2c3d4e5f6789abcdef0",
    "email": "john@example.com",
    "role": "user",
    "iat": 1688123456,
    "exp": 1688130656
  },
  "message": "Token valide"
}

❌ ERROR (401):
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 5️⃣ **Refresh Token**
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

✅ SUCCESS (200):
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 7200
}

❌ ERROR (401):
{
  "error": "Refresh token manquant"
}
```

### 6️⃣ **Logout**
```http
POST /api/auth/logout
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

✅ SUCCESS (200):
{
  "message": "Déconnexion réussie. 2 token(s) révoqué(s).",
  "revokedTokens": 2,
  "details": "Tokens révoqués côté serveur et cookies supprimés côté client"
}
```

---

## 💾 Data Structures

### **User Object** (Returned from backend)
```typescript
interface User {
  _id: string;           // MongoDB ObjectId
  sub?: string;          // Same as _id (JWT subject)
  name: string;          // Full name
  email: string;         // Email address
  role: 'user' | 'creator';
  createdAt: Date;       // Registration date
  
  // Optional fields
  numtel?: string;
  date_naissance?: Date;
  sexe?: string;
  pays?: string;
  ville?: string;
  photo_profil?: string;
  bio?: string;
}
```

### **JWT Payload Structure**
```typescript
interface JWTPayload {
  sub: string;           // User ID
  email: string;         // User email
  role: string;          // User role
  jti: string;           // JWT ID (for blacklist tracking)
  iat: number;           // Issued at (timestamp)
  exp: number;           // Expiration (timestamp)
}
```

### **Token Lifetimes**
```typescript
// Normal login (remember_me = false)
access_token: 2 hours
refresh_token: 30 days

// Remember me login (remember_me = true)
access_token: 4 hours
refresh_token: 90 days
```

---

## 📱 Mobile Implementation

### **File Structure**
```
mobile/
├── lib/
│   ├── auth.ts           # Core auth functions
│   └── auth-api.ts       # Action wrappers
├── hooks/
│   └── use-auth.ts       # React hook for auth state
└── app/(auth)/
    └── signin/
        └── index.tsx     # Login screen
```

### **Usage Example**
```typescript
import { useAuth } from '@/hooks/use-auth';
import { loginAction, verifyTwoFactorAction } from '@/lib/auth-api';

export default function LoginScreen() {
  const { login, refetch } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  // Step 1: Initial login
  const handleLogin = async () => {
    const result = await loginAction({ 
      email, 
      password, 
      remember_me: true 
    });
    
    if (result.success && result.requires2FA) {
      console.log('✅ 2FA code sent to email');
      setRequires2FA(true);
    } else if (result.error) {
      console.error('❌ Login failed:', result.error);
    }
  };

  // Step 2: Verify 2FA
  const handleVerify2FA = async () => {
    const result = await verifyTwoFactorAction({ 
      email, 
      verificationCode 
    });
    
    if (result.success && result.user) {
      console.log('✅ Login successful:', result.user);
      login(result.user);
      await refetch();
      router.replace('/(tabs)');
    } else {
      console.error('❌ 2FA failed:', result.error);
    }
  };

  return (
    <View>
      {!requires2FA ? (
        <LoginForm onSubmit={handleLogin} />
      ) : (
        <TwoFactorForm onSubmit={handleVerify2FA} />
      )}
    </View>
  );
}
```

---

## 🧪 Testing Guide

### **1. Test Backend is Running**
```bash
# Check health endpoint
curl http://192.168.1.180:3001/api/docs

# Should return Swagger UI HTML
```

### **2. Test Registration**
```bash
curl -X POST http://192.168.1.180:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Should return user object with _id
```

### **3. Test Login (2FA)**
```bash
# Step 1: Request 2FA code
curl -X POST http://192.168.1.180:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "remember_me": true
  }'

# Should return { requires2FA: true }
# Check your email for the 6-digit code

# Step 2: Verify code
curl -X POST http://192.168.1.180:3001/api/auth/verify-2fa \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "verificationCode": "123456"
  }'

# Should return access_token, refresh_token, and user object
```

### **4. Test Protected Endpoint**
```bash
# Replace YOUR_TOKEN with the access_token from step 3
curl http://192.168.1.180:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"

# Should return user profile
```

---

## 🔍 Debugging

### **Enable Verbose Logging**

**Mobile app logs**:
```typescript
// Already enabled in auth.ts and auth-api.ts
// Look for emojis in console:
// 🚀 = Start of operation
// ✅ = Success
// ❌ = Failure
// 📡 = Network request
// 📨 = Network response
// 💥 = Exception
```

**Backend logs**:
```typescript
// Check backend console for:
console.log('✅ MongoDB connected!')
console.log('🚀 Application démarrée sur le port 3001')
```

### **Common Issues**

#### **1. Cannot connect to backend**
```bash
# Solution 1: Check if backend is running
cd backend
npm run start:dev

# Solution 2: Check your IP address
# Windows:
ipconfig
# Look for "IPv4 Address" under your active network

# Mac/Linux:
ifconfig
# Look for "inet" under your active network

# Solution 3: Update .env file
# mobile/.env
EXPO_PUBLIC_API_URL=http://YOUR_ACTUAL_IP:3001
```

#### **2. CORS errors**
```typescript
// Backend main.ts already configured for CORS
// Ensure frontend URL is in allowedOrigins array:
const allowedOrigins = [
  'http://localhost:3000',
  'http://192.168.1.180:3000',
  // Add your mobile app origin if needed
]
```

#### **3. 2FA code not received**
```bash
# Check backend email configuration in .env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Test email service
# Check backend logs for email sending confirmation
```

#### **4. Token expired immediately**
```typescript
// Check system time synchronization
// JWT tokens depend on accurate system time
// Ensure mobile device and backend server have correct time
```

---

## 🔒 Security Best Practices

### **1. Secure Token Storage**
```typescript
// ✅ DO: Use Expo SecureStore
import * as SecureStore from 'expo-secure-store';
await SecureStore.setItemAsync('access_token', token);

// ❌ DON'T: Use AsyncStorage for tokens
// AsyncStorage is NOT encrypted
```

### **2. Token Transmission**
```typescript
// ✅ DO: Always use HTTPS in production
const API_URL = __DEV__ 
  ? 'http://192.168.1.180:3001'
  : 'https://api.production.com';

// ❌ DON'T: Use HTTP in production
```

### **3. Password Handling**
```typescript
// ✅ DO: Never log passwords
console.log('Login attempt:', { email }); // ✅

// ❌ DON'T: Log sensitive data
console.log('Login:', { email, password }); // ❌
```

---

## 📊 Flow Checklist

Use this checklist to verify your integration:

- [ ] Backend running on port 3001
- [ ] MongoDB connected successfully
- [ ] Email service configured
- [ ] Mobile .env file updated with correct IP
- [ ] Can register new user
- [ ] Registration returns user object with _id
- [ ] Login sends 2FA code to email
- [ ] 2FA code received in inbox (check spam)
- [ ] 2FA verification returns tokens
- [ ] Tokens stored in SecureStore
- [ ] Profile endpoint returns user data
- [ ] Token refresh works when access token expires
- [ ] Logout revokes tokens
- [ ] Tokens cleared from SecureStore on logout

---

## 🎯 Next Steps

After successful authentication integration:

1. **Implement Protected Routes**
   - Community creation
   - Course enrollment
   - Profile management

2. **Add Error Boundaries**
   - Network error handling
   - Token expiration handling
   - Session timeout handling

3. **Implement Auto-refresh**
   - Refresh token before expiration
   - Retry failed requests
   - Queue requests during refresh

4. **Add Analytics**
   - Track login success/failure
   - Monitor token refresh rate
   - Log authentication errors

---

## 📞 Support

If you encounter issues:

1. Check console logs (mobile + backend)
2. Verify network connectivity
3. Test with curl commands
4. Check Swagger docs at `/api/docs`
5. Review this guide's debugging section

**Swagger Documentation**: `http://YOUR_IP:3001/api/docs`

---

## 🎉 Success Indicators

You know the integration is working when:

✅ Login form submits successfully  
✅ Console shows: `📱 [AUTH-API] 2FA requis`  
✅ Email received with 6-digit code  
✅ 2FA form accepts code  
✅ Console shows: `✅ [AUTH-API] 2FA vérifié avec succès`  
✅ App navigates to main screen  
✅ User data appears in UI  
✅ Restarting app keeps user logged in  
✅ Logout clears session properly  

---

**Built with ❤️ for Shabaka Platform**
