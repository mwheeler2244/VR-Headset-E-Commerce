# 🎯 Login Page Quick Reference

## 📝 Test Credentials

```
Username: admin    Password: admin123
Username: user     Password: password
Username: john     Password: welcome2024
Username: test     Password: test123
```

## 🔍 Quick Exploits to Try

### 1️⃣ View Stored Credentials

**Console Command:**

```javascript
localStorage.getItem("storedUsers");
```

**DevTools:**

- Press `F12` → Application/Storage → Local Storage
- View all stored credentials

---

### 2️⃣ Bypass Login

**URL:**

```
login.html?bypass=true
```

**Effect:** Automatically logs in without credentials

---

### 3️⃣ Console Logging

**What to do:**

1. Open Console (`F12` → Console)
2. Try to login with any credentials
3. View logged username/password in console

---

### 4️⃣ Steal Session

**After logging in:**

1. Open DevTools → Application → Local Storage
2. Copy values:
   - `currentUser`
   - `isLoggedIn`
3. On another tab, paste these values
4. Refresh page → You're logged in!

---

### 5️⃣ View Network Traffic

**What to do:**

1. Open DevTools → Network tab
2. Attempt to login
3. Watch request/response (credentials may be visible)

---

## ⚠️ Vulnerabilities Summary

| #   | Vulnerability               | Severity    | Quick Access           |
| --- | --------------------------- | ----------- | ---------------------- |
| 1   | Credentials in localStorage | 🔴 CRITICAL | DevTools → Application |
| 2   | Console logging             | 🟠 HIGH     | DevTools → Console     |
| 3   | URL bypass                  | 🔴 CRITICAL | `?bypass=true`         |
| 4   | No rate limiting            | 🟡 MEDIUM   | Try many logins        |
| 5   | Session in localStorage     | 🟠 HIGH     | DevTools → Application |

---

## 📖 Full Guide

For detailed explanations and secure practices, see:
**SECURITY_PRACTICE_GUIDE.md**

---

## ⚖️ Legal Reminder

**Only test on systems you own or have permission to test!**
