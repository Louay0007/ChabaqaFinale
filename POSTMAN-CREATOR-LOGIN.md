# 🚀 Postman Guide: Creator Login & Signup

**Date:** October 22, 2025  
**Backend URL:** `http://192.168.1.112:3000`

---

## 📋 Step-by-Step Guide

### Step 1: Create Creator Account

**Endpoint:** `POST /api/user/signup`

```
Method: POST
URL: http://192.168.1.112:3000/api/user/signup
Headers:
  Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Jane Creator",
  "email": "jane.creator@example.com",
  "password": "SecurePassword123!",
  "role": "creator",
  "bio": "Content creator passionate about education",
  "pays": "Tunisia"
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Compte créé avec succès",
  "user": {
    "_id": "64a1b2c3d4e5f6789abcdef0",
    "name": "Jane Creator",
    "email": "jane.creator@example.com",
    "role": "creator",
    "createdAt": "2025-10-22T14:30:00.000Z"
  }
}
```

---

### Step 2: Login as Creator

**Endpoint:** `POST /api/auth/login`

```
Method: POST
URL: http://192.168.1.112:3000/api/auth/login
Headers:
  Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "jane.creator@example.com",
  "password": "SecurePassword123!",
  "remember_me": true
}
```

**Expected Response - Case 1: No 2FA (200 OK):**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "sub": "64a1b2c3d4e5f6789abcdef0",
    "email": "jane.creator@example.com",
    "name": "Jane Creator",
    "role": "creator"
  }
}
```

**Expected Response - Case 2: 2FA Required (200 OK):**
```json
{
  "success": true,
  "requires2FA": true,
  "message": "Code de vérification envoyé par email"
}
```

---

### Step 3: Verify 2FA (If Required)

**Endpoint:** `POST /api/auth/verify-2fa`

```
Method: POST
URL: http://192.168.1.112:3000/api/auth/verify-2fa
Headers:
  Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "jane.creator@example.com",
  "verificationCode": "123456"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Authentification réussie",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "sub": "64a1b2c3d4e5f6789abcdef0",
    "email": "jane.creator@example.com",
    "name": "Jane Creator",
    "role": "creator"
  }
}
```

---

### Step 4: Start Free Trial (Creator Only)

**Endpoint:** `POST /api/subscription/start-trial`

```
Method: POST
URL: http://192.168.1.112:3000/api/subscription/start-trial
Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Body:** None (empty)

**Expected Response (200 OK):**
```json
{
  "message": "Période d'essai commencée",
  "subscription": {
    "_id": "64a1b2c3d4e5f6789abcdef1",
    "creatorId": "64a1b2c3d4e5f6789abcdef0",
    "plan": "STARTER",
    "status": "trialing",
    "trialEndsAt": "2025-10-29T14:30:00.000Z",
    "createdAt": "2025-10-22T14:30:00.000Z"
  }
}
```

---

### Step 5: Get Profile

**Endpoint:** `GET /api/auth/me`

```
Method: GET
URL: http://192.168.1.112:3000/api/auth/me
Headers:
  Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "_id": "64a1b2c3d4e5f6789abcdef0",
    "name": "Jane Creator",
    "email": "jane.creator@example.com",
    "role": "creator",
    "bio": "Content creator passionate about education",
    "pays": "Tunisia",
    "createdAt": "2025-10-22T14:30:00.000Z",
    "updatedAt": "2025-10-22T14:30:00.000Z"
  }
}
```

---

## 📦 Postman Collection JSON

Copy and paste this into Postman (Import → Raw text):

```json
{
  "info": {
    "name": "Creator Authentication",
    "description": "Complete flow for creator account creation and login",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. Create Creator Account",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Jane Creator\",\n  \"email\": \"jane.creator@example.com\",\n  \"password\": \"SecurePassword123!\",\n  \"role\": \"creator\",\n  \"bio\": \"Content creator passionate about education\",\n  \"pays\": \"Tunisia\"\n}"
        },
        "url": {
          "raw": "http://192.168.1.112:3000/api/user/signup",
          "protocol": "http",
          "host": ["192", "168", "1", "112"],
          "port": "3000",
          "path": ["api", "user", "signup"]
        }
      }
    },
    {
      "name": "2. Login as Creator",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "// Save access token for next requests",
              "if (pm.response.code === 200) {",
              "    var jsonData = pm.response.json();",
              "    if (jsonData.access_token) {",
              "        pm.environment.set('access_token', jsonData.access_token);",
              "        pm.environment.set('refresh_token', jsonData.refresh_token);",
              "    }",
              "}"
            ]
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"jane.creator@example.com\",\n  \"password\": \"SecurePassword123!\",\n  \"remember_me\": true\n}"
        },
        "url": {
          "raw": "http://192.168.1.112:3000/api/auth/login",
          "protocol": "http",
          "host": ["192", "168", "1", "112"],
          "port": "3000",
          "path": ["api", "auth", "login"]
        }
      }
    },
    {
      "name": "3. Verify 2FA (if required)",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "// Save access token",
              "if (pm.response.code === 200) {",
              "    var jsonData = pm.response.json();",
              "    if (jsonData.access_token) {",
              "        pm.environment.set('access_token', jsonData.access_token);",
              "        pm.environment.set('refresh_token', jsonData.refresh_token);",
              "    }",
              "}"
            ]
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"jane.creator@example.com\",\n  \"verificationCode\": \"123456\"\n}"
        },
        "url": {
          "raw": "http://192.168.1.112:3000/api/auth/verify-2fa",
          "protocol": "http",
          "host": ["192", "168", "1", "112"],
          "port": "3000",
          "path": ["api", "auth", "verify-2fa"]
        }
      }
    },
    {
      "name": "4. Start Free Trial",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "Authorization",
            "value": "Bearer {{access_token}}"
          }
        ],
        "url": {
          "raw": "http://192.168.1.112:3000/api/subscription/start-trial",
          "protocol": "http",
          "host": ["192", "168", "1", "112"],
          "port": "3000",
          "path": ["api", "subscription", "start-trial"]
        }
      }
    },
    {
      "name": "5. Get Profile",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{access_token}}"
          }
        ],
        "url": {
          "raw": "http://192.168.1.112:3000/api/auth/me",
          "protocol": "http",
          "host": ["192", "168", "1", "112"],
          "port": "3000",
          "path": ["api", "auth", "me"]
        }
      }
    }
  ]
}
```

---

## 🔑 Using the Access Token

After successful login, copy the `access_token` from the response and use it in subsequent requests:

**Header Format:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎯 Quick Test Sequence

1. **Create Account** → Get user ID
2. **Login** → Get access token
3. **Start Trial** (optional) → Activate creator features
4. **Get Profile** → Verify you're logged in

---

## ⚙️ Postman Environment Variables

Create a new environment in Postman with:

```
Variable Name       | Initial Value              | Current Value
-------------------|----------------------------|------------------
base_url           | http://192.168.1.112:3000  | http://192.168.1.112:3000
access_token       | (empty)                    | (auto-set by login)
refresh_token      | (empty)                    | (auto-set by login)
creator_email      | jane.creator@example.com   | jane.creator@example.com
creator_password   | SecurePassword123!         | SecurePassword123!
```

Then use `{{base_url}}` in your requests!

---

## 🐛 Troubleshooting

### Error: "Email already exists"
**Solution:** The account was already created. Skip step 1 and go directly to login.

### Error: "Invalid credentials"
**Solution:** Check email/password spelling. Make sure password has at least 8 characters.

### Error: "Unauthorized" or 401
**Solution:** Your access token expired. Login again to get a new token.

### Error: Connection refused
**Solution:** 
- Check backend is running: `npm run start:dev`
- Verify URL: `http://192.168.1.112:3000`
- Check firewall settings

---

## 🎉 Success!

Once you successfully login, you'll have:
- ✅ Creator account in database
- ✅ Access token for API calls
- ✅ Ability to create communities, courses, etc.
- ✅ 7-day free trial available

**Happy creating!** 🚀
