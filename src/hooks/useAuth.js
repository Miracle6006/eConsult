import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Hook to expose auth actions & state
export default function useAuth() {
  const {
    user,
    login,
    logout,
    isAuthenticated,
    hasRole,
    hasPermission,
  } = useContext(AuthContext);

  return {
    user,
    login,
    logout,
    isAuthenticated,
    hasRole,
    hasPermission,
  };
}
