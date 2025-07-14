# 🔐 Authentication System

This project includes a comprehensive authentication system with login, register, and logout functionality using React Context and AsyncStorage for persistence.

## 📁 File Structure

```
contexts/
  auth_context.tsx       # Main authentication context
hooks/
  useAuth.ts            # Authentication utility hooks
app/
  login.tsx             # Login screen
  register.tsx          # Register screen
  (tabs)/
    profile.tsx         # Profile screen with auth integration
```

## 🚀 Features

- ✅ **User Registration** with role selection (Freelancer/Client)
- ✅ **User Login** with email/password
- ✅ **Secure Logout** with token invalidation
- ✅ **Persistent Sessions** using AsyncStorage
- ✅ **Token Management** with automatic refresh
- ✅ **Profile Updates** 
- ✅ **Role-based Access** control
- ✅ **Error Handling** with field-specific validation
- ✅ **TypeScript Support** with comprehensive types
- ✅ **Auth Guards** for protected routes

## 🔧 Setup Instructions

### 1. API Configuration

Update the API URL in `contexts/auth_context.tsx`:

```typescript
const API_BASE_URL = 'https://your-api-url.com/api'; // Replace with your actual API URL
```

### 2. Expected API Endpoints

Your backend should provide these endpoints:

```
POST /auth/login          # User login
POST /auth/register       # User registration  
POST /auth/logout         # User logout
POST /auth/refresh        # Token refresh
GET  /auth/verify         # Token verification
PUT  /auth/profile        # Profile update
```

### 3. API Response Format

Expected response format for all endpoints:

```typescript
{
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  message?: string;
  errors?: Record<string, string[]>;
}
```

## 📝 Usage Examples

### Basic Authentication Check

```typescript
import { useAuth } from '@/contexts/auth_context';

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return <WelcomeMessage user={user} />;
}
```

### Login Form

```typescript
import { useAuth } from '@/contexts/auth_context';

function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleLogin = async () => {
    const result = await login(credentials);
    if (result.success) {
      router.push('/dashboard');
    }
  };

  return (
    <View>
      <TextInput 
        value={credentials.email}
        onChangeText={(email) => setCredentials(prev => ({...prev, email}))}
        placeholder="Email"
      />
      <TextInput 
        value={credentials.password}
        onChangeText={(password) => setCredentials(prev => ({...prev, password}))}
        placeholder="Password"
        secureTextEntry
      />
      <Button onPress={handleLogin} disabled={isLoading}>
        {isLoading ? 'Signing In...' : 'Sign In'}
      </Button>
      {error && <Text style={{color: 'red'}}>{error}</Text>}
    </View>
  );
}
```

### Registration Form

```typescript
import { useAuth } from '@/contexts/auth_context';

function RegisterForm() {
  const { register, isLoading } = useAuth();
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client' as 'freelancer' | 'client'
  });

  const handleRegister = async () => {
    const result = await register(credentials);
    if (result.success) {
      Alert.alert('Success', 'Account created successfully!');
    }
  };

  return (
    <View>
      <TextInput 
        placeholder="Full Name"
        value={credentials.name}
        onChangeText={(name) => setCredentials(prev => ({...prev, name}))}
      />
      <TextInput 
        placeholder="Email"
        value={credentials.email}
        onChangeText={(email) => setCredentials(prev => ({...prev, email}))}
      />
      <TextInput 
        placeholder="Password"
        value={credentials.password}
        onChangeText={(password) => setCredentials(prev => ({...prev, password}))}
        secureTextEntry
      />
      <Button onPress={handleRegister} disabled={isLoading}>
        Create Account
      </Button>
    </View>
  );
}
```

### Protected Routes

```typescript
import { useRequireAuth } from '@/hooks/useAuth';

function ProtectedScreen() {
  const { isAuthenticated, isLoading } = useRequireAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return null; // Will redirect to login

  return <YourProtectedContent />;
}
```

### Role-based Access

```typescript
import { useRequireRole } from '@/hooks/useAuth';

function FreelancerDashboard() {
  const { hasRole, isLoading } = useRequireRole('freelancer');

  if (isLoading) return <LoadingSpinner />;
  if (!hasRole) return <AccessDenied />; // Will show alert

  return <FreelancerContent />;
}
```

### Auth Guard Component

```typescript
import { AuthGuard } from '@/contexts/auth_context';

function App() {
  return (
    <AuthGuard requireAuth={true} fallback={<LoginScreen />}>
      <ProtectedApp />
    </AuthGuard>
  );
}
```

### Logout Function

```typescript
import { useAuth } from '@/contexts/auth_context';

function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          onPress: async () => {
            await logout();
            router.replace('/login');
          }
        }
      ]
    );
  };

  return (
    <TouchableOpacity onPress={handleLogout}>
      <Text>Sign Out</Text>
    </TouchableOpacity>
  );
}
```

## 🛡️ Security Features

- **Token Persistence**: Tokens are securely stored in AsyncStorage
- **Automatic Refresh**: Expired tokens are automatically refreshed
- **Session Validation**: Tokens are validated on app startup
- **Secure Logout**: Tokens are invalidated on server and client
- **Error Handling**: Comprehensive error handling with user feedback
- **Type Safety**: Full TypeScript support prevents runtime errors

## 🔄 State Management

The auth context maintains the following state:

```typescript
{
  user: User | null;           // Current user data
  isLoading: boolean;          // Loading state for operations
  isAuthenticated: boolean;    // Authentication status
  token: string | null;        // JWT token
  error: string | null;        // Current error message
}
```

## 📱 Integration with Navigation

The authentication system is integrated with Expo Router:

- Login/Register screens are available at `/login` and `/register`
- Protected routes automatically redirect to login
- Successful authentication redirects to home screen
- Logout redirects to login screen

## 🎯 Best Practices

1. **Always check `isLoading`** before rendering auth-dependent content
2. **Use error state** to provide user feedback
3. **Handle network errors** gracefully
4. **Clear sensitive data** on logout
5. **Validate forms** before submission
6. **Use TypeScript** for better development experience

This authentication system provides a solid foundation for secure user management in your React Native app! 🚀
