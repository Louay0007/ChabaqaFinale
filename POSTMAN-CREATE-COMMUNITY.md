# 🏘️ Postman Guide: Create Community

**Date:** October 22, 2025  
**Backend URL:** `http://192.168.1.112:3000`  
**Endpoint:** `POST /api/community-aff-crea-join/create`

---

## 🔐 Prerequisites

**You must have:**
1. ✅ Creator account (role: "creator")
2. ✅ Valid access token (from login)
3. ✅ Active subscription (start 7-day trial)

---

## 📋 Method 1: Simple Community (Form-Data)

### **Configuration**

```
Method: POST
URL: http://192.168.1.112:3000/api/community-aff-crea-join/create
```

### **Headers**

```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: multipart/form-data
```

### **Body (form-data)**

Select **Body** tab → **form-data**

| Key | Value | Type |
|-----|-------|------|
| `name` | `JavaScript Developers Tunisia` | Text |
| `country` | `Tunisia` | Text |
| `status` | `public` | Text |
| `joinFee` | `free` | Text |
| `feeAmount` | `0` | Text |
| `currency` | `TND` | Text |
| `socialLinks[website]` | `https://jsdevs-tunisia.com` | Text |

### **Optional Fields (Add as needed)**

| Key | Value | Type |
|-----|-------|------|
| `bio` | `A community for JavaScript developers in Tunisia` | Text |
| `category` | `Technology` | Text |
| `tags[0]` | `JavaScript` | Text |
| `tags[1]` | `React` | Text |
| `tags[2]` | `Node.js` | Text |
| `longDescription` | `Join our vibrant community...` | Text |
| `coverImage` | `https://example.com/cover.jpg` | Text |
| `socialLinks[facebook]` | `https://facebook.com/jsdevs` | Text |
| `socialLinks[instagram]` | `https://instagram.com/jsdevs` | Text |
| `logo` | (select file) | File |

---

## 📋 Method 2: Complete Community (JSON Body)

**Note:** If you want to use JSON instead of form-data (without file upload):

### **Headers**

```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

### **Body (raw JSON)**

```json
{
  "name": "JavaScript Developers Tunisia",
  "bio": "A community for JavaScript developers in Tunisia to share knowledge and grow together",
  "country": "Tunisia",
  "category": "Technology",
  "tags": ["JavaScript", "React", "Node.js", "TypeScript"],
  "longDescription": "Welcome to JavaScript Developers Tunisia! This is the premier community for JavaScript enthusiasts in Tunisia. Whether you're a beginner or an expert, join us to learn, share, and grow together.",
  "status": "public",
  "joinFee": "free",
  "feeAmount": "0",
  "currency": "TND",
  "socialLinks": {
    "website": "https://jsdevs-tunisia.com",
    "facebook": "https://facebook.com/jsdevs",
    "instagram": "https://instagram.com/jsdevs",
    "twitter": "https://twitter.com/jsdevs"
  }
}
```

---

## 📋 Method 3: Paid Community

### **Body (form-data)**

| Key | Value | Type |
|-----|-------|------|
| `name` | `Premium Web Dev Bootcamp` | Text |
| `bio` | `Advanced web development training` | Text |
| `country` | `Tunisia` | Text |
| `status` | `public` | Text |
| `joinFee` | `paid` | Text |
| `feeAmount` | `99.00` | Text |
| `currency` | `TND` | Text |
| `socialLinks[website]` | `https://webdevbootcamp.com` | Text |
| `category` | `Education` | Text |

---

## ✅ Required Fields

**Minimum required to create a community:**

1. **`name`** - Community name (min 2 chars, max 100)
2. **`country`** - Location/country
3. **`status`** - `public` or `private`
4. **`joinFee`** - `free` or `paid`
5. **`feeAmount`** - Price (use "0" for free)
6. **`currency`** - `TND`, `USD`, or `EUR`
7. **`socialLinks`** - At least one social link required:
   - `socialLinks[website]`
   - `socialLinks[instagram]`
   - `socialLinks[facebook]`
   - `socialLinks[twitter]`
   - `socialLinks[linkedin]`
   - etc.

---

## 📤 Expected Response (Success - 201 Created)

```json
{
  "success": true,
  "message": "Communauté créée avec succès",
  "data": {
    "_id": "64a1b2c3d4e5f6789abcdef0",
    "name": "JavaScript Developers Tunisia",
    "slug": "javascript-developers-tunisia",
    "logo": "https://example.com/uploads/logo-1234567890.jpg",
    "photo_de_couverture": null,
    "short_description": "A community for JavaScript developers in Tunisia",
    "long_description": "Welcome to JavaScript Developers Tunisia...",
    "createur": {
      "_id": "64a1b2c3d4e5f6789abcdef1",
      "name": "Jane Creator",
      "email": "jane.creator@example.com"
    },
    "members": [
      {
        "_id": "64a1b2c3d4e5f6789abcdef1",
        "name": "Jane Creator",
        "email": "jane.creator@example.com"
      }
    ],
    "admins": [
      {
        "_id": "64a1b2c3d4e5f6789abcdef1",
        "name": "Jane Creator",
        "email": "jane.creator@example.com"
      }
    ],
    "fees_of_join": 0,
    "isPrivate": false,
    "isActive": true,
    "isVerified": false,
    "membersCount": 1,
    "rank": "bronze",
    "tags": ["JavaScript", "React", "Node.js"],
    "category": "Technology",
    "socialLinks": {
      "website": "https://jsdevs-tunisia.com",
      "facebook": "https://facebook.com/jsdevs"
    },
    "createdAt": "2025-10-22T14:45:00.000Z",
    "updatedAt": "2025-10-22T14:45:00.000Z"
  }
}
```

---

## ❌ Common Errors

### Error 401: Unauthorized
```json
{
  "success": false,
  "message": "Non autorisé",
  "error": {
    "statusCode": 401,
    "message": "Unauthorized"
  }
}
```
**Solution:** Check your access token. Login again if expired.

---

### Error 400: Missing Required Fields
```json
{
  "success": false,
  "message": "Données invalides",
  "error": {
    "statusCode": 400,
    "message": [
      "Le nom de la communauté est obligatoire",
      "Le pays est obligatoire",
      "Au moins un lien social est requis"
    ],
    "error": "Bad Request"
  }
}
```
**Solution:** Add all required fields.

---

### Error 409: Community Name Already Exists
```json
{
  "success": false,
  "message": "Une communauté avec ce nom existe déjà",
  "error": {
    "statusCode": 409,
    "message": "Une communauté avec ce nom existe déjà",
    "error": "Conflict"
  }
}
```
**Solution:** Choose a different community name.

---

## 🎨 Categories Available

Choose from:
- `Technology`
- `Marketing`
- `Design`
- `Fitness`
- `Education`
- `Business`
- `Creative Arts`
- `Personal Development`
- `Cooking & Food`
- `Travel & Adventure`
- `Music & Entertainment`

---

## 💰 Pricing Options

### Free Community
```
joinFee: "free"
feeAmount: "0"
```

### Paid Community
```
joinFee: "paid"
feeAmount: "29.99"
currency: "TND"
```

---

## 📸 Logo Upload

To upload a logo file:

1. Select **form-data** in Body tab
2. Add key: `logo`
3. Change type from **Text** to **File**
4. Click **Select Files** and choose your image
5. Supported formats: JPG, PNG, GIF, WebP
6. Max size: Usually 5MB

---

## 📦 Complete Postman Collection JSON

```json
{
  "info": {
    "name": "Create Community",
    "description": "Create a new community as a creator",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Free Community (Simple)",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{access_token}}"
          }
        ],
        "body": {
          "mode": "formdata",
          "formdata": [
            {
              "key": "name",
              "value": "JavaScript Developers Tunisia",
              "type": "text"
            },
            {
              "key": "country",
              "value": "Tunisia",
              "type": "text"
            },
            {
              "key": "status",
              "value": "public",
              "type": "text"
            },
            {
              "key": "joinFee",
              "value": "free",
              "type": "text"
            },
            {
              "key": "feeAmount",
              "value": "0",
              "type": "text"
            },
            {
              "key": "currency",
              "value": "TND",
              "type": "text"
            },
            {
              "key": "socialLinks[website]",
              "value": "https://jsdevs-tunisia.com",
              "type": "text"
            }
          ]
        },
        "url": {
          "raw": "http://192.168.1.112:3000/api/community-aff-crea-join/create",
          "protocol": "http",
          "host": ["192", "168", "1", "112"],
          "port": "3000",
          "path": ["api", "community-aff-crea-join", "create"]
        }
      }
    },
    {
      "name": "Create Complete Community",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{access_token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"JavaScript Developers Tunisia\",\n  \"bio\": \"A community for JavaScript developers in Tunisia\",\n  \"country\": \"Tunisia\",\n  \"category\": \"Technology\",\n  \"tags\": [\"JavaScript\", \"React\", \"Node.js\"],\n  \"status\": \"public\",\n  \"joinFee\": \"free\",\n  \"feeAmount\": \"0\",\n  \"currency\": \"TND\",\n  \"socialLinks\": {\n    \"website\": \"https://jsdevs-tunisia.com\",\n    \"facebook\": \"https://facebook.com/jsdevs\"\n  }\n}"
        },
        "url": {
          "raw": "http://192.168.1.112:3000/api/community-aff-crea-join/create",
          "protocol": "http",
          "host": ["192", "168", "1", "112"],
          "port": "3000",
          "path": ["api", "community-aff-crea-join", "create"]
        }
      }
    }
  ]
}
```

---

## 🚀 Quick Start Steps

### 1. Get Your Access Token
```bash
# Login first to get token
POST http://192.168.1.112:3000/api/auth/login
```

### 2. Create Community in Postman

1. **Open Postman**
2. **New Request** → `POST`
3. **URL:** `http://192.168.1.112:3000/api/community-aff-crea-join/create`
4. **Headers:**
   - Key: `Authorization`
   - Value: `Bearer YOUR_ACCESS_TOKEN`
5. **Body** → **form-data**
6. **Add fields** (see table above)
7. **Click Send** 🚀

### 3. Check Response
You should get a 201 Created response with your new community data!

---

## 🎉 Success!

Your community is now created and:
- ✅ You are the creator
- ✅ You are automatically a member
- ✅ You are automatically an admin
- ✅ Community has rank "bronze"
- ✅ Member count is 1 (you)
- ✅ Community is active

You can now:
- Create courses in this community
- Create events
- Create products
- Invite members
- Manage the community

---

## 📚 Next Steps

After creating community:
1. **Get community ID** from response (`_id`)
2. **Generate invite link** for members
3. **Create content** (courses, events, etc.)
4. **Customize** settings and appearance

Happy creating! 🎨🚀
