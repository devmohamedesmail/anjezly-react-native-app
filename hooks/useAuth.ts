import { useAuth } from '@/contexts/auth_context';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Alert } from 'react-native';

/**
 * Hook that requires authentication and redirects to login if not authenticated
 */
export const useRequireAuth = (redirectTo: string = '/login') => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'Please sign in to access this feature.',
        [
          {
            text: 'Sign In',
            onPress: () => router.push(redirectTo as any),
          },
        ]
      );
    }
  }, [isAuthenticated, isLoading, redirectTo]);

  return { isAuthenticated, isLoading };
};

/**
 * Hook that redirects authenticated users (useful for login/register screens)
 */
export const useRedirectIfAuth = (redirectTo: string = '/') => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(redirectTo as any);
    }
  }, [isAuthenticated, isLoading, redirectTo]);

  return { isAuthenticated, isLoading };
};

/**
 * Hook that checks if user has specific role
 */
export const useRequireRole = (requiredRole: 'freelancer' | 'client') => {
  const { user, isAuthenticated, isLoading } = useAuth();

  const hasRole = isAuthenticated && user?.role === requiredRole;

  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasRole) {
      Alert.alert(
        'Access Denied',
        `This feature is only available for ${requiredRole}s.`
      );
    }
  }, [isAuthenticated, isLoading, hasRole, requiredRole]);

  return { hasRole, isAuthenticated, isLoading, user };
};
