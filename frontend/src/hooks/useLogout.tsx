import { useNavigate } from "react-router-dom";

import { toast } from "sonner";

import authService from "@/services/authService";

import { useAppDispatch } from "@/store/hooks";

import { logout } from "@/features/auth/authSlice";

import axios from "axios";

const useLogout = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();

      dispatch(logout());

      toast.success("Logged out successfully");

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      let message = "Logout failed";

      if (axios.isAxiosError(error)) {
        message =
          error.response?.data?.message ??
          message;
      }

      toast.error(message);
    }
  };

  return handleLogout;
};

export default useLogout

