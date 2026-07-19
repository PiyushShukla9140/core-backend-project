import { useState } from "react";
import { AxiosError } from "axios";

import  CommentService  from "@/services/commentService";
import { toast } from "sonner"


export const useDeleteComment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteComment = async (commentId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await CommentService.deleteComment(commentId);

      return response;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;

      const message =
        error.response?.data?.message ||
        "Failed to delete comment";

      setError(message);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteComment,
    loading,
    error,
  };
};