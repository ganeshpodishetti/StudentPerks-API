# Enhanced Token Management System

This document describes the enhanced authentication and token management system implemented in the StudentPerks application.

## Overview

The system implements proactive token refresh to ensure users remain authenticated without interruption, even when access tokens have short lifetimes.

## Architecture

### Key Components

1. **TokenManager** (`/src/services/tokenManager.ts`)
   - Manages proactive token refresh scheduling
   - Calculates optimal refresh timing
   - Handles refresh failures gracefully

2. **Enhanced AuthService** (`/src/services/authService.ts`)
   - Integrates with TokenManager
   - Provides token lifecycle management
   - Handles authentication state

3. **Enhanced useAuth Hook** (`/src/hooks/useAuth.ts`)
   - Provides React integration
   - Monitors refresh status
   - Handles authentication events

4. **API Client Interceptors** (`/src/services/apiClient.ts`)
   - Automatic token attachment
   - 401 response handling
   - Request queuing during refresh

## Token Refresh Strategy

### Proactive Refresh
- Tokens are refreshed **1 minute before expiration** by default
- Minimum refresh interval: 10 seconds
- Maximum refresh interval: 5 minutes
- Automatic rescheduling after successful refresh

### Reactive Refresh
- API interceptors handle 401 responses
- Failed requests are queued during refresh
- Automatic retry with new token

### Fallback Handling
- Multiple refresh attempt prevention
- User logout on refresh failure
- Clear error messaging

## Configuration

### Backend JWT Settings
```json
{
  "Jwt": {
    "Issuer": "StudentPerks.API",
    "Audience": "StudentPerks.Client",
    "Key": "YourSuperSecretJwtKeyThatShouldBeAtLeast256BitsLong!",
    "AccessTokenExpirationInMinutes": 15,
    "RefreshTokenExpirationInDays": 7
  }
}
```

### Frontend Configuration
The token manager can be configured by modifying constants in `tokenManager.ts`:

```typescript
private readonly REFRESH_BUFFER_MS = 60000; // 1 minute before expiration
private readonly MIN_REFRESH_INTERVAL_MS = 10000; // Minimum 10 seconds  
private readonly MAX_REFRESH_INTERVAL_MS = 300000; // Maximum 5 minutes
```

## Usage

### Basic Authentication
```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { isAuthenticated, login, logout, refreshStatus } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome! Token refresh: {refreshStatus.isScheduled ? 'Active' : 'Inactive'}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => login('email', 'password')}>Login</button>
      )}
    </div>
  );
}
```

### Token Status Monitoring
```typescript
import { TokenStatus } from '@/components/TokenStatus';

function AdminPanel() {
  return (
    <div>
      <h1>Admin Panel</h1>
      <TokenStatus className="mb-4" />
      {/* Other content */}
    </div>
  );
}
```

### Making Authenticated API Calls
```typescript
import { apiClient } from '@/services/apiClient';

// Automatic token attachment and refresh handling
const response = await apiClient.get('/api/protected-endpoint');
```

## Development Testing

### Token Test Utilities
In development mode, testing utilities are available via the browser console:

```javascript
// Set a token that expires in 30 seconds
window.tokenTestUtils.setShortLivedToken(30);

// Check current token status
window.tokenTestUtils.logRefreshStatus();

// Get detailed token information
const info = window.tokenTestUtils.getTokenInfo();
console.log(info);
```

### Testing Scenarios

1. **Short Token Expiration**
   ```javascript
   // Test proactive refresh with 1-minute token
   window.tokenTestUtils.setShortLivedToken(60);
   ```

2. **Monitor Refresh Status**
   ```javascript
   // Check refresh scheduling
   setInterval(() => {
     window.tokenTestUtils.logRefreshStatus();
   }, 10000);
   ```

## Security Considerations

### Access Tokens
- Stored in localStorage and memory
- Short-lived (15 minutes default)
- Automatically refreshed proactively

### Refresh Tokens
- HTTP-only cookies
- Long-lived (7 days default)
- Revoked on logout
- Database cleanup of expired tokens

### Best Practices
- Never store refresh tokens in localStorage
- Use HTTPS in production
- Implement proper CORS configuration
- Regular token cleanup

## Error Handling

### Refresh Failures
1. Clear invalid tokens
2. Emit `tokenRefreshFailed` event
3. Redirect to login page
4. Show appropriate error message

### Network Issues
1. Queue failed requests
2. Retry after successful refresh
3. Fallback to login on persistent failures

## Monitoring and Debugging

### Console Logging
The system provides detailed console logging:
- Token refresh scheduling
- Refresh execution
- Failure handling
- Queue management

### Event System
Listen for authentication events:
```typescript
window.addEventListener('tokenRefreshFailed', (event) => {
  console.error('Token refresh failed:', event.detail.error);
  // Handle refresh failure
});
```

## Performance Considerations

### Request Queuing
- Failed requests are queued during refresh
- Automatic retry with new token
- Prevents duplicate refresh attempts

### Memory Management
- Cleanup timers on component unmount
- Event listener cleanup
- Proper token manager disposal

## Deployment Notes

### Environment Configuration
- Set JWT secrets via user secrets or environment variables
- Configure appropriate token expiration times
- Enable HTTPS in production

### Health Checks
- Monitor token refresh success rates
- Track authentication failures
- Alert on excessive refresh attempts

## Troubleshooting

### Common Issues

1. **Tokens Not Refreshing**
   - Check JWT configuration
   - Verify refresh endpoint availability
   - Check console for errors

2. **Infinite Refresh Loops**
   - Verify token expiration calculation
   - Check system clock synchronization
   - Review refresh buffer settings

3. **Login Required Frequently**
   - Check refresh token expiration
   - Verify cookie settings
   - Review logout triggers

### Debug Commands
```javascript
// Check current authentication state
window.tokenTestUtils.logRefreshStatus();

// Verify token parsing
const token = localStorage.getItem('accessToken');
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('Token payload:', payload);
}
```

## Future Enhancements

1. **Token Metrics**
   - Refresh success/failure rates
   - Token lifetime analytics
   - Performance monitoring

2. **Advanced Security**
   - Token binding
   - Device fingerprinting
   - Suspicious activity detection

3. **User Experience**
   - Progressive token refresh
   - Offline token management
   - Multi-tab synchronization
