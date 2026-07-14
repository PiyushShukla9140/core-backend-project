import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAppSelector } from "@/store/hooks";

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, accessToken } = useAppSelector(
    (state) => state.auth
  );

  if (isAuthenticated && accessToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;