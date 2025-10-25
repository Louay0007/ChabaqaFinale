# 🧪 Authentication Testing Guide

## 🎯 **Current Setup**

✅ **App always starts with Sign In screen** (for testing)  
✅ **Complete auth flow ready to test**  
✅ **Detailed console logging enabled**  
✅ **Test helper component available**

---

## 🚀 **How to Test the Complete Auth Flow**

### **Step 1: Start the App**
```bash
cd mobile
npx expo start --clear
```

**Expected:** App opens directly to Sign In screen (no matter what)

### **Step 2: Test Registration (if needed)**
1. Click "Sign Up" or "Create Account"
2. Fill in: Name, Email, Password
3. Click "Register"
4. **Watch console for:** `✅ [AUTH-API] Inscription réussie`

### **Step 3: Test Login Flow**
1. Enter email & password
2. Click "Sign In"
3. **Watch console for:**
   ```
   🚀 [AUTH-API] Tentative de connexion
   📡 [AUTH-API] URL API: http://YOUR_IP:3001/api/auth/login
   📱 [AUTH-API] 2FA requis
   ```
4. **Check your email** for 6-digit code

### **Step 4: Test 2FA Verification**
1. Enter the 6-digit code from email
2. Click "Verify"
3. **Watch console for:**
   ```
   🔐 [AUTH-API] Vérification du code 2FA
   ✅ [AUTH] 2FA vérifié avec succès
   ✅ [AUTH] Utilisateur authentifié: your-email@example.com
   ```
4. **Expected:** App navigates to main screen

### **Step 5: Test Session Persistence**
1. Close the app completely
2. Reopen the app
3. **Expected:** Still shows Sign In screen (because we're in testing mode)
4. **Check console:** Should show token verification logs

---

## 🔍 **Console Logs to Watch**

### **Successful Login:**
```
🚀 [AUTH-API] Tentative de connexion: { email: "test@example.com" }
📡 [AUTH-API] URL API: http://192.168.1.180:3001/api/auth/login
🔐 [AUTH] Tentative de connexion pour: test@example.com
📨 [AUTH] Réponse du serveur: { requires2FA: true }
📱 [AUTH] 2FA requis
📱 [AUTH-API] 2FA requis
```

### **Successful 2FA:**
```
🔐 [AUTH-API] Vérification du code 2FA pour: test@example.com
📡 [AUTH-API] URL API: http://192.168.1.180:3001/api/auth/verify-2fa
🔐 [AUTH] Vérification du code 2FA pour: test@example.com
📨 [AUTH] Réponse du serveur: { access_token: "...", user: {...} }
✅ [AUTH] 2FA vérifié avec succès
✅ [AUTH-API] 2FA vérifié avec succès
```

### **Token Storage:**
```
🔍 [AUTH] Vérification de l'authentification...
🔑 [AUTH] Access token trouvé, vérification du profil...
🔍 [AUTH] Récupération du profil utilisateur...
✅ [AUTH] Profil récupéré: { user: {...} }
✅ [AUTH] Utilisateur authentifié: test@example.com
```

### **Errors to Watch For:**
```
❌ [AUTH] Échec de connexion: Email ou mot de passe incorrect
💥 [AUTH] Exception lors de la connexion: Network request failed
❌ [AUTH] Code invalide ou expiré
⚠️ [AUTH] Erreur 401 lors de la récupération du profil
```

---

## 🛠️ **Using the Test Helper Component**

Add this to any screen for advanced testing:

```typescript
import AuthTestHelper from '@/components/AuthTestHelper';

export default function YourScreen() {
  return (
    <View>
      {/* Your normal content */}
      
      {/* Add this for testing */}
      <AuthTestHelper />
    </View>
  );
}
```

**The helper provides buttons to:**
- 🔍 Show current token status
- 🗑️ Clear all tokens manually
- 👋 Force logout for testing

---

## 🔄 **Testing Different Scenarios**

### **Scenario 1: Fresh Install (No Tokens)**
1. Clear all tokens using test helper
2. Restart app
3. Should show Sign In screen
4. Complete login flow

### **Scenario 2: Expired Token**
1. Login successfully
2. Wait for token to expire (or manually clear access token)
3. Try to access protected content
4. Should auto-refresh token

### **Scenario 3: Invalid 2FA Code**
1. Start login flow
2. Enter wrong 6-digit code
3. Should show error message
4. Try again with correct code

### **Scenario 4: Network Error**
1. Turn off backend server
2. Try to login
3. Should show connection error
4. Turn server back on and retry

---

## 📊 **Success Checklist**

Mark ✅ when each works:

- [ ] App always starts with Sign In screen
- [ ] Registration creates new user
- [ ] Login sends 2FA email
- [ ] Email arrives with 6-digit code
- [ ] 2FA verification works
- [ ] Tokens stored in SecureStore
- [ ] User navigates to main screen
- [ ] Console shows all success logs
- [ ] Profile data loads correctly
- [ ] Logout clears session
- [ ] Test helper shows correct info

---

## 🔧 **Switch Back to Normal Mode**

When you're done testing, edit `app/index.tsx`:

**Comment out the testing section:**
```typescript
// 🧪 TESTING MODE: Always start with auth for testing
// Comment out the lines below when you want normal behavior
// console.log('🧪 [INDEX] TESTING MODE: Always redirecting to auth for testing');
// return <Redirect href="/(auth)/signin" />;
```

**Uncomment the normal section:**
```typescript
// 📝 NORMAL MODE: Uncomment this section for production behavior
// Remove the /* and */ to enable normal behavior
```

---

## 🚨 **Common Issues During Testing**

### **"Cannot connect to backend"**
- Check backend is running: `cd backend && npm run start:dev`
- Check IP in `mobile/.env` matches your computer's IP
- Try: `curl http://YOUR_IP:3001/api/docs`

### **"2FA email not received"**
- Check spam folder
- Check backend email configuration
- Look for email logs in backend console

### **"Reanimated errors"**
- Run: `npx expo start --clear`
- If persists: Delete `node_modules` and reinstall

### **"Tokens not persisting"**
- Use test helper to check token status
- Check SecureStore permissions
- Look for storage error logs

---

## 📞 **Testing Support**

**Backend Health Check:**
```bash
curl http://192.168.1.180:3001/api/docs
```

**Quick Registration Test:**
```bash
curl -X POST http://192.168.1.180:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test1234"}'
```

**View All Logs:**
- Mobile: Check Expo console
- Backend: Check terminal where `npm run start:dev` is running

---

**🎉 Happy Testing! The complete auth system is ready for thorough testing.**
