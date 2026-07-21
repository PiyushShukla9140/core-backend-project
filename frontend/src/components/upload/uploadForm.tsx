import UploadActions from "./ulpoadActions.tsx";
import UploadHeader from "./uploadHeader.tsx";
import UploadMetadata from "./uploadMetaData.tsx";
import ThumbnailUpload from "./uploadThumbnail.tsx";
import VideoUpload from "./videoUpload.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";

import {
  uploadSchema,
} from "@/schemas/upload.schema";

import useUploadVideo from "@/hooks/useUploadVideo";
import type{UploadSchema} from "@/schemas/upload.schema"
import { useNavigate } from "react-router-dom";


const UploadForm = () => {

  const navigate = useNavigate()
  const { uploadVideo, isUploading, uploadProgress } = useUploadVideo();
  const form = useForm<UploadSchema>({
    resolver: zodResolver(uploadSchema),

    defaultValues: {
      title: "",
      description: "",
      thumbnail: undefined,
      videoFile: undefined,
    },
  });

  const onSubmit = async (data: UploadSchema) => {
    const response = await uploadVideo(data);

    form.reset();
    navigate(`/watch/${response.data._id}`)
  
  };

  return (
    <Form {...form}>
      <form
      
       onSubmit={form.handleSubmit(onSubmit)}>

        <UploadHeader />

        <div className="grid gap-8 lg:grid-cols-3">

          <div className=" border-4 border-e-red-500 space-y-6">
            <ThumbnailUpload />
            <VideoUpload />
          </div>

          <div className="lg:col-span-2">
            <UploadMetadata />
          </div>

        </div>

        <UploadActions isUploading={isUploading} uploadProgress={uploadProgress} />

      </form>
    </Form>
  );
};

export default UploadForm