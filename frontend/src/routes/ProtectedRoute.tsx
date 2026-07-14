import { Navigate } from "react-router-dom";

import { useAppSelector } from "@/store/hooks";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({
  children,
}: ProtectedRouteProps) => {
  const { isAuthenticated, accessToken } =
    useAppSelector((state) => state.auth);

  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;