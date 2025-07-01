## Troubleshooting Token Refresh Issues

Based on the error you're seeing, here are the steps to diagnose and fix the token refresh problem:

### Step 1: Check Current Status

Open your browser console and run:
```javascript
// Diagnose the current authentication state
window.tokenTestUtils.diagnoseProblem();
```

### Step 2: Check Backend Configuration

I've updated the access token expiration to 15 minutes and fixed a bug in the refresh token creation. Restart your backend:

```bash
cd backend/src/SP.API
dotnet run
```

### Step 3: Fresh Login

1. Clear all tokens: Open console and run `window.tokenTestUtils.clearTokens()`
2. Refresh the page
3. Log in again
4. Check the auth debugger (blue button in bottom-right corner)

### Step 4: Monitor Token Refresh

After logging in, watch the console for:
- Token refresh scheduling logs
- Proactive refresh attempts
- Any error messages

### Common Issues and Solutions

#### Issue 1: "Invalid or expired refresh token"
**Cause**: Refresh token expired or was revoked
**Solution**: 
- Clear all tokens and login again
- Check if backend is properly setting refresh token cookies

#### Issue 2: No refresh token cookie
**Cause**: CORS or cookie settings issue
**Solution**:
- Ensure `withCredentials: true` in frontend
- Check cookie settings in backend
- Verify same origin for cookies

#### Issue 3: Token expires too quickly
**Cause**: Very short token expiration (was 2 minutes)
**Solution**: 
- Updated to 15 minutes
- Restart backend to apply changes

### Debug Commands

```javascript
// Check current token status
window.tokenTestUtils.logRefreshStatus();

// Diagnose authentication problems
window.tokenTestUtils.diagnoseProblem();

// Test manual token refresh
authService.refreshToken().then(console.log).catch(console.error);

// Check cookies
document.cookie;

// Check localStorage
localStorage.getItem('user');
localStorage.getItem('accessToken');
```

### Expected Behavior

With the fixes:
1. **Login**: Get 15-minute access token + 7-day refresh token
2. **Proactive Refresh**: Scheduled 1 minute before expiration (14 minutes after login)
3. **Success Logs**: Should see "Token refreshed successfully" in console
4. **Continuous Loop**: New refresh scheduled after each successful refresh

### If Still Having Issues

1. **Clear everything and restart**:
   ```javascript
   localStorage.clear();
   // Refresh page
   // Login again
   ```

2. **Check backend logs** for any errors during token refresh

3. **Use the Auth Debugger** (blue button) to monitor real-time status

4. **Network tab**: Check if refresh requests are being made and what responses they get

The main fixes I implemented:
- ✅ Fixed refresh token expiration bug (was 0 days, now 7 days)
- ✅ Increased access token expiration (2 min → 15 min)
- ✅ Better error handling and logging
- ✅ Auth debugger for real-time monitoring
- ✅ Improved retry logic for temporary failures
