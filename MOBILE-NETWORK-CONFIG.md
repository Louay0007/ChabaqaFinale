# 📱 Mobile Network Configuration

**Updated:** October 22, 2025  
**Your Network:** home (192.168.1.x)

---

## ✅ Your Configuration (UPDATED)

### Current Setup
- **Computer IP:** `192.168.1.112`
- **WiFi Network:** `home`
- **Backend Port:** `3000`
- **API URL:** `http://192.168.1.112:3000`

### Environment File
**Location:** `mobile/.env`

```env
EXPO_PUBLIC_API_URL=http://192.168.1.112:3000
```

---

## 🎯 Platform-Specific Behavior

Your app automatically adjusts based on where it's running:

### 1. **Physical Device (iPhone/Android)**
- ✅ **Uses:** `http://192.168.1.112:3000`
- ✅ **Works with:** Your configured .env URL
- ⚠️ **Requirement:** Device must be on the **same WiFi network** (`home`)

### 2. **Android Emulator**
- ✅ **Uses:** `http://10.0.2.2:3000` (emulator's special IP)
- ✅ **Fallback:** Your .env URL if emulator IP fails
- ℹ️ **Note:** 10.0.2.2 points to host machine's localhost

### 3. **iOS Simulator**
- ✅ **Uses:** `http://localhost:3000`
- ✅ **Fallback:** Your .env URL if localhost fails
- ℹ️ **Note:** iOS simulator can access localhost directly

### 4. **Web Browser**
- ✅ **Uses:** `http://localhost:3000`
- ✅ **Fallback:** Your .env URL
- ℹ️ **Note:** Running in browser on same machine

---

## 🔍 How It Works

Your `http.ts` file has smart endpoint fallback:

```typescript
const BASE_URLS = [
  'http://192.168.1.112:3000',  // Your .env (primary)
  'http://10.0.2.2:3000',        // Android emulator
  'http://localhost:3000',       // iOS simulator / web
  'http://127.0.0.1:3000'        // Alternative localhost
];
```

The app tries each URL in order until one succeeds!

---

## 🚀 Next Steps

### 1. Restart Your App
After changing .env, you MUST restart:

```bash
# Stop the current app (Ctrl+C)
# Then restart:
npx expo start --clear
```

### 2. Verify Backend is Running
Make sure your backend is running on port 3000:

```bash
# In backend directory:
npm run start:dev
# or
yarn start:dev
```

### 3. Test Connectivity

**From your phone's browser:**
Navigate to: `http://192.168.1.112:3000/api/health` or `http://192.168.1.112:3000`

- ✅ **If you see JSON/response:** Network is configured correctly!
- ❌ **If timeout/error:** Check firewall or WiFi connection

---

## ✅ Your Full API Endpoints

With your current configuration, your mobile app will access:

```
Authentication:
  Login:      http://192.168.1.112:3000/api/auth/login
  Register:   http://192.168.1.112:3000/api/auth/register
  Verify 2FA: http://192.168.1.112:3000/api/auth/verify-2fa
  Logout:     http://192.168.1.112:3000/api/auth/logout
  Refresh:    http://192.168.1.112:3000/api/auth/refresh
  Profile:    http://192.168.1.112:3000/api/auth/me

Communities:
  List:       http://192.168.1.112:3000/api/communities
  Details:    http://192.168.1.112:3000/api/communities/:slug
  Join:       http://192.168.1.112:3000/api/community-aff-crea-join/join
  Leave:      http://192.168.1.112:3000/api/community-aff-crea-join/leave/:id
  My Joined:  http://192.168.1.112:3000/api/community-aff-crea-join/my-joined

User Profile:
  Get:        http://192.168.1.112:3000/api/user/me
  Update:     http://192.168.1.112:3000/api/user/update-profile
  Password:   http://192.168.1.112:3000/api/user/change-password
```

---

## 🔧 Troubleshooting

### ❌ Connection Failed / Timeout

**Problem:** Mobile app can't reach backend

**Solutions:**
1. ✅ Verify both devices on same WiFi (`home`)
2. ✅ Check backend is running: `http://192.168.1.112:3000`
3. ✅ Restart Expo: `npx expo start --clear`
4. ✅ Check Windows Firewall (allow port 3000)
5. ✅ Try accessing from phone browser first

### ❌ "Network request failed"

**Problem:** Firewall blocking connection

**Solutions:**
1. **Windows Firewall:** Allow Node.js on port 3000
2. **Antivirus:** Temporarily disable to test
3. **Router:** Check if device isolation is enabled

### ❌ Works on emulator but not phone

**Problem:** Physical device not on same network

**Solutions:**
1. ✅ Check phone WiFi = `home` network
2. ✅ Try from phone browser: `http://192.168.1.112:3000`
3. ✅ Ensure mobile data is OFF (use WiFi only)

### ❌ IP Changed

**Problem:** Your computer got a different IP address

**Solutions:**
1. Run `ipconfig` again
2. Update `.env` with new IP
3. Restart app: `npx expo start --clear`

---

## 📱 Testing Checklist

Before deploying, test on all platforms:

- [ ] **Physical iPhone** - WiFi connection working
- [ ] **Physical Android** - WiFi connection working
- [ ] **Android Emulator** - Using 10.0.2.2
- [ ] **iOS Simulator** - Using localhost
- [ ] **Web Browser** - Using localhost
- [ ] **Login flow** - Can authenticate
- [ ] **Communities** - Can fetch and display
- [ ] **Join/Leave** - Can join communities
- [ ] **Profile** - Can view/edit

---

## 🎉 You're All Set!

Your mobile app is now configured to connect to:
- ✅ **Backend:** Running on your computer (192.168.1.112:3000)
- ✅ **Network:** home WiFi
- ✅ **Devices:** Any device on the same network

**Happy coding!** 🚀
