# 🎨 Creator Account Creation Guide

**Date:** October 22, 2025  
**Backend:** NestJS API  
**Mobile:** React Native (Expo)

---

## 🎯 Overview

In your platform, there are **3 user roles**:
1. **`user`** - Regular user (can join communities, consume content)
2. **`creator`** - Content creator (can create communities, courses, products, etc.)
3. **`admin`** - Platform administrator

---

## 📊 Backend Analysis

### User Registration Endpoints

#### Option 1: `/auth/register` (Recommended)
- **Method:** `POST`
- **Endpoint:** `http://192.168.1.112:3000/api/auth/register`
- **Authentication:** None required
- **Default Role:** `user`

#### Option 2: `/user/signup`
- **Method:** `POST`
- **Endpoint:** `http://192.168.1.112:3000/api/user/signup`
- **Authentication:** None required
- **Supports:** Role selection including `creator`

---

## ✅ How to Create a Creator Account

### Method 1: Via Backend API Directly

**Endpoint:** `POST /api/user/signup`

**Request Body:**
```json
{
  "name": "Jane Creator",
  "email": "jane.creator@example.com",
  "password": "SecurePassword123!",
  "role": "creator",
  "numtel": "+1234567890",
  "date_naissance": "1990-01-15",
  "sexe": "female",
  "pays": "Tunisia",
  "ville": "Tunis",
  "code_postal": "1000",
  "adresse": "123 Creator Street",
  "bio": "Content creator passionate about education and technology"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Compte créé avec succès",
  "user": {
    "_id": "64a1b2c3d4e5f6789abcdef0",
    "name": "Jane Creator",
    "email": "jane.creator@example.com",
    "role": "creator",
    "createdAt": "2023-07-01T10:00:00.000Z"
  }
}
```

---

## 🔧 Required Fields

### Minimum Required:
```json
{
  "name": "string (min 3 chars)",
  "email": "valid@email.com",
  "password": "string (min 8 chars)",
  "role": "creator"  // ⭐ Important!
}
```

### Optional Fields:
- `numtel` - Phone number
- `date_naissance` - Birth date (ISO 8601 format)
- `sexe` - Gender (`male`, `female`, `other`)
- `pays` - Country
- `ville` - City
- `code_postal` - Postal code
- `adresse` - Address
- `photo_profil` - Profile picture URL
- `bio` - Biography (max 500 chars)
- `lien_instagram` - Instagram profile link

---

## 📱 Mobile App Integration

### Current Status
❌ **Not Implemented** - The mobile signup currently doesn't have a role selector.

### What Needs to be Done

#### 1. Update Signup DTO in Mobile

**File:** `mobile/lib/auth-api.ts`

Add role field to signup:
```typescript
export interface SignupData {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'creator';  // ⭐ Add this
  numtel?: string;
  date_naissance?: string;
}
```

#### 2. Update Signup Screen UI

**File:** `mobile/app/(auth)/signup/index.tsx`

Add role selector:
```typescript
const [accountType, setAccountType] = useState<'user' | 'creator'>('user');

// Add before submit:
<View style={styles.roleSelector}>
  <Text style={styles.label}>Account Type:</Text>
  <View style={styles.roleButtons}>
    <TouchableOpacity 
      style={[styles.roleButton, accountType === 'user' && styles.roleButtonActive]}
      onPress={() => setAccountType('user')}
    >
      <Text>👤 User</Text>
      <Text style={styles.roleDescription}>Join & learn</Text>
    </TouchableOpacity>
    
    <TouchableOpacity 
      style={[styles.roleButton, accountType === 'creator' && styles.roleButtonActive]}
      onPress={() => setAccountType('creator')}
    >
      <Text>🎨 Creator</Text>
      <Text style={styles.roleDescription}>Create & teach</Text>
    </TouchableOpacity>
  </View>
</View>

// Then pass to signup:
const signupData = {
  name,
  email,
  password,
  role: accountType,  // ⭐ Include role
  // ... other fields
};
```

#### 3. Update Signup Function

**File:** `mobile/lib/auth-api.ts`

```typescript
export const signupAction = async (data: SignupData): Promise<SignupResult> => {
  try {
    const resp = await tryEndpoints('/api/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role || 'user',  // ⭐ Include role, default to user
        numtel: data.numtel,
        date_naissance: data.date_naissance,
      },
      timeout: 30000,
    });

    return {
      success: true,
      user: resp.data.user,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Signup failed',
    };
  }
};
```

---

## 🎬 Creator Account Features

### What Creators Can Do:

1. **Create Communities**
   - `POST /api/community-aff-crea-join/create`
   - Set pricing, description, social links
   - Upload logo and cover images

2. **Create Courses**
   - `POST /api/cours/create`
   - Add lessons, videos, resources
   - Set pricing and access levels

3. **Create Products**
   - `POST /api/product/create`
   - Digital products, downloads
   - Licensing and pricing

4. **Create Events**
   - `POST /api/event/create`
   - Live or virtual events
   - Ticketing and registration

5. **Create Challenges**
   - `POST /api/challenge/create`
   - Competitions and contests
   - Prizes and rewards

6. **Create 1-on-1 Sessions**
   - `POST /api/session/create`
   - Coaching, mentoring
   - Calendar integration

7. **Manage Subscriptions**
   - Start free trial (7 days)
   - Choose plan (Starter, Pro, Premium)
   - Upgrade/downgrade anytime

---

## 💳 Creator Subscription Plans

### When Creator Account is Created:

1. **No Active Subscription**
   - Creator can start 7-day free trial
   - `POST /api/subscription/start-trial`

2. **Trial Period (7 days)**
   - Full access to Starter plan features
   - Can create content
   - Limited by plan quotas

3. **After Trial**
   - Must subscribe to continue
   - `POST /api/subscription/upgrade`
   - Choose plan tier: `STARTER`, `PRO`, `PREMIUM`

### Plan Tiers (Assumptions based on code):
- **STARTER** - Basic features, limited communities
- **PRO** - More communities, advanced analytics
- **PREMIUM** - Unlimited, white-label, API access

---

## 🧪 Testing Creator Account

### Step 1: Create Creator via API

```bash
curl -X POST http://192.168.1.112:3000/api/user/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Creator",
    "email": "test.creator@example.com",
    "password": "TestPass123!",
    "role": "creator"
  }'
```

### Step 2: Login

```bash
curl -X POST http://192.168.1.112:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.creator@example.com",
    "password": "TestPass123!"
  }'
```

### Step 3: Start Trial Subscription

```bash
curl -X POST http://192.168.1.112:3000/api/subscription/start-trial \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Step 4: Create First Community

```bash
curl -X POST http://192.168.1.112:3000/api/community-aff-crea-join/create \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My First Community",
    "country": "Tunisia",
    "status": "public",
    "joinFee": "free",
    "feeAmount": "0",
    "currency": "TND",
    "socialLinks": {
      "website": "https://mycommunity.com"
    }
  }'
```

---

## 🚀 Quick Implementation for Mobile

### Option A: Quick Test (Without UI Changes)

For testing, you can manually create a creator account via API (using Postman or curl), then login in the mobile app.

### Option B: Full Implementation (Recommended)

1. **Add role selector to signup screen**
2. **Update SignupData interface**
3. **Update signup API call to include role**
4. **Test both user and creator registration flows**

---

## 📋 Implementation Checklist

### Backend (Already Done ✅)
- [x] User schema supports 'creator' role
- [x] Signup endpoint accepts role parameter
- [x] Subscription system for creators
- [x] Creator-specific endpoints (create community, etc.)

### Mobile (To Do ❌)
- [ ] Add role selector UI to signup screen
- [ ] Update signup form to include role field
- [ ] Update API call to send role
- [ ] Add creator onboarding flow
- [ ] Add "Start Trial" button for new creators
- [ ] Show subscription status in creator dashboard

---

## 💡 Recommendations

### For User Experience:

1. **Separate Signup Flows**
   - `/signup` → Regular user signup
   - `/signup/creator` → Creator-specific signup with benefits

2. **Creator Onboarding**
   - Explain benefits
   - Show example communities
   - Walkthrough trial period
   - Guide through first community creation

3. **Trial Reminder**
   - Show "X days left in trial"
   - Prompt to upgrade before expiry
   - Smooth transition to paid plan

4. **Dashboard**
   - Creator sees analytics
   - Subscription status
   - Quick actions (create content)

---

## 🎉 Summary

**To create a creator account:**

1. **Via API:** Send `role: "creator"` in signup request to `/api/user/signup`
2. **Via Mobile:** Currently creates `user` by default - needs implementation
3. **After Creation:** Start 7-day trial with `POST /api/subscription/start-trial`
4. **Then:** Create communities, courses, products, etc.

**Your next step:** Choose whether to test via API first, or implement the mobile UI changes for full creator registration flow.

---

## 📞 Need Help?

All the backend is ready! You just need to:
1. Add role selector to mobile signup screen
2. Pass `role` field in signup request
3. Test the flow

Would you like me to implement the mobile signup changes now? 🚀
