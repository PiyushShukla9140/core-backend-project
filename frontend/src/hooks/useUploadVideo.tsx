import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import videoService from "@/services/videoService";

import type { PublishVideoPayload } from "@/types/video.types";

const useUploadVideo = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadVideo = async (data: PublishVideoPayload) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const response = await videoService.createVideo(data, (progress) => {
        setUploadProgress(progress);
      });
      setUploadProgress(100);

      toast.success(
        response.message || "Video uploaded successfully!"
      );

      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ??
            "Failed to upload video."
        );
      } else {
        toast.error("Something went wrong.");
      }

      throw error;
    } finally {
      setIsUploading(false);
      setTimeout(() => {
        setUploadProgress(0);
      }, 500);
    }
  };

  return {
    uploadVideo,
    isUploading,
    uploadProgress
  };
};

export default useUploadVideo;