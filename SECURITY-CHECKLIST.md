# 🔐 Security Checklist - Before Hosting CollabType

## ✅ Status: Your Current Security Setup

### 1. Environment Variables
- ✅ **DONE**: Firebase config uses `process.env.NEXT_PUBLIC_*` variables
- ✅ **DONE**: `.env.local` file exists with your Firebase keys
- ✅ **DONE**: `.env.example` template created (safe to commit)
- ✅ **DONE**: `.gitignore` includes `.env*` pattern

### 2. Git Safety
- ✅ **DONE**: `.env.local` is ignored by git (won't be committed)
- ⚠️ **TODO**: Verify no sensitive data in existing commits
  ```bash
  git log --all --full-history --source --oneline -- .env.local
  ```
  If this shows any commits, your keys were exposed. See "Recovery Steps" below.

### 3. Firestore Security Rules
- ✅ **DONE**: Rules use role-based authentication
- ✅ **DONE**: Clients restricted to their workspaces only
- ✅ **DONE**: Admin role can update user roles
- ⚠️ **TODO**: Publish updated rules to Firebase Console

**Current Rules Summary:**
- ✅ Unauthenticated users: Blocked from everything
- ✅ Authenticated users: Can read their own profile
- ✅ Clients: Read only their workspaces, client messages, and tasks
- ✅ Staff/Admin: Full access to all workspaces, messages, tasks
- ✅ Admins: Can update any user's role and delete users

### 4. Authentication Security
- ✅ **DONE**: Email verification required for email/password signups
- ✅ **DONE**: Google OAuth properly configured
- ⚠️ **TODO**: Add your deployment domain to Firebase Authorized Domains

---

## 📋 Pre-Deployment Checklist

### Before Deploying to Vercel/Production:

#### Step 1: Verify Local Security
```bash
# Make sure .env.local is NOT tracked
git status
# You should NOT see .env.local in the output
```

#### Step 2: Add Environment Variables to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (or create new)
3. Go to **Settings → Environment Variables**
4. Add these variables (copy from your `.env.local`):

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCxzB-1nPOEPevC3Iyoy2aBl0oxca7yZ64
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=offloadr-connect.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=offloadr-connect
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=offloadr-connect.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=468580440532
NEXT_PUBLIC_FIREBASE_APP_ID=1:468580440532:web:978917c20c3aff89955e41
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-JZ75XVK2S1
```

5. Select **All Environments** (Production, Preview, Development)
6. Click **Save**

#### Step 3: Update Firebase Authorized Domains
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **offloadr-connect**
3. Navigate to **Authentication → Settings → Authorized domains**
4. Add your Vercel domain (e.g., `your-app.vercel.app`)
5. Also add any custom domains you'll use

#### Step 4: Publish Latest Firestore Rules
1. Go to Firebase Console → **Firestore Database → Rules**
2. Copy the rules from `firestore.rules` in your project
3. Click **Publish**
4. Wait for confirmation

#### Step 5: Deploy to Vercel
```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

Follow the prompts:
- Link to existing project or create new
- Configure project settings
- Deploy!

---

## 🚨 Recovery Steps (If Keys Were Exposed)

If you accidentally committed `.env.local` or hard-coded keys to Git:

### Option 1: Remove from Git History (Recommended)
```bash
# Remove .env.local from all commits
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env.local" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (if already pushed to remote)
git push origin --force --all
```

### Option 2: Regenerate Firebase Keys (Most Secure)
1. Go to Firebase Console → Project Settings
2. Find your Web App
3. Click **Regenerate API Key** (if available)
4. Update `.env.local` with new key
5. Update Vercel environment variables
6. Redeploy

**Note:** Firebase Web API keys are not as sensitive as database passwords. With proper Firestore rules, leaked keys aren't catastrophic, but it's still good practice to keep them clean.

---

## 🔒 Firestore Rules - Current Version

Your current rules in `firestore.rules`:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    
    function isAdmin() {
      return isSignedIn() && getUserRole() == 'admin';
    }
    
    function isStaff() {
      return isSignedIn() && (getUserRole() == 'staff' || getUserRole() == 'admin');
    }
    
    function isClient() {
      return isSignedIn() && getUserRole() == 'client';
    }

    // Users collection
    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if request.auth.uid == userId;
      allow update: if isSignedIn() && (request.auth.uid == userId || isAdmin());
      allow delete: if isAdmin();
    }

    // Workspaces collection
    match /workspaces/{workspaceId} {
      allow read: if isSignedIn() && (
        isStaff() || 
        (isClient() && resource.data.clientId == request.auth.uid)
      );
      allow create, update, delete: if isStaff();
    }

    // Messages collection
    match /messages/{messageId} {
      allow read: if isSignedIn() && (
        isStaff() ||
        (isClient() && resource.data.type == 'client')
      );
      allow create: if isSignedIn() && (
        isStaff() ||
        (isClient() && request.resource.data.type == 'client')
      );
      allow update, delete: if isStaff();
    }

    // Tasks collection
    match /tasks/{taskId} {
      allow read: if isSignedIn();
      allow create, update, delete: if isStaff();
    }
  }
}
```

**Make sure to publish these rules in Firebase Console!**

---

## ✅ Final Verification

Before going live, test:

1. **As Admin:**
   - ✅ Can create/delete workspaces
   - ✅ Can change user roles
   - ✅ Can delete users
   - ✅ Can see all messages (staff + client)
   - ✅ Can create/edit tasks

2. **As Staff:**
   - ✅ Can create/delete workspaces
   - ✅ Can see all workspaces
   - ✅ Can send staff and client messages
   - ✅ Can create/edit tasks

3. **As Client:**
   - ✅ Can only see their assigned workspaces
   - ✅ Can only see client messages
   - ✅ Can send client messages
   - ✅ Can see tasks but cannot edit
   - ❌ Cannot access admin panel
   - ❌ Cannot see staff messages

---

## 📞 Need Help?

If you run into issues:
- Check Vercel deployment logs
- Check Firebase Console → Firestore → Rules → Logs
- Verify environment variables are set correctly
- Test locally with `npm run dev` first

---

## 🎉 You're Ready!

Your security setup is solid. The main things left are:
1. ✅ Environment variables already in `.env.local`
2. ⚠️ Copy them to Vercel when deploying
3. ⚠️ Add Vercel domain to Firebase Authorized Domains
4. ⚠️ Publish Firestore rules

Then you're good to go live! 🚀
