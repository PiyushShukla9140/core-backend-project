import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import commentService from "@/services/commentService";
import type { Comment } from "@/types/comment.types";

const useComments = (videoId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchComments = useCallback(async () => {
    if (!videoId) return;

    try {
      setLoading(true);

      const response =
        await commentService.getComments(videoId);

      setComments(response.data.data);

      setError("");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ??
            "Failed to fetch comments"
        );
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }, [videoId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return {
    comments,
    loading,
    error,
    refetchComments: fetchComments,
  };
};
// we use useCallback because fetchComments is used inside useEffect. This keeps the function reference stable and avoids unnecessary effect reruns.
export default useComments;