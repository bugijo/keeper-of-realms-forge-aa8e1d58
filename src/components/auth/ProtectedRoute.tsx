
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireVerification?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requireVerification = false 
}: ProtectedRouteProps) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Handle loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-fantasy-dark">
        <div className="w-16 h-16 relative">
          <div className="absolute top-0 left-0 w-full h-full animate-spin">
            <svg className="w-full h-full" viewBox="0 0 24 24">
              <path
                fill="none"
                stroke="#6E59A5"
                strokeWidth="2"
                strokeLinecap="round"
                d="M12 2v4m0 12v4m-10-10h4m12 0h4m-2.93-7.07l-2.83 2.83M5.76 18.24l-2.83 2.83m0-16.97l2.83 2.83m12.41 12.41l2.83 2.83"
              />
            </svg>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 bg-fantasy-gold rounded-full opacity-30 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If email verification is required and user's email is not verified
  if (requireVerification && !currentUser.emailVerified) {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  // If all checks pass, render the protected component
  return <>{children}</>;
}
