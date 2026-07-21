import { useRef } from "react";
import { ImagePlus } from "lucide-react";
import { useFormContext } from "react-hook-form";

import  type { UploadSchema } from "@/schemas/upload.schema";

const ThumbnailUpload = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<UploadSchema>();

  const selectedThumbnail = watch("thumbnail");

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setValue("thumbnail", file, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleThumbnailChange}
      />

      <div
        onClick={handleClick}
        className="
          group
          cursor-pointer
          rounded-2xl
          border-2
          border-dashed
          p-8
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-primary
          hover:bg-muted/40
          hover:shadow-lg
        "
      >
        <div className="flex flex-col items-center text-center">
          {selectedThumbnail ? (
            <>
              <div className="rounded-full bg-green-100 p-5">
                <ImagePlus className="h-10 w-10 text-green-600" />
              </div>

              <h3 className="mt-6 text-lg font-semibold">
                {selectedThumbnail.name}
              </h3>

              <p className="text-sm text-muted-foreground">
                {(selectedThumbnail.size / 1024 / 1024).toFixed(2)} MB
              </p>

              <p className="mt-4 text-sm font-medium text-green-600">
                ✓ Thumbnail Selected
              </p>
            </>
          ) : (
            <>
              <div className="rounded-full bg-primary/10 p-5 transition-colors group-hover:bg-primary/20">
                <ImagePlus className="h-10 w-10 text-primary" />
              </div>

              <h3 className="mt-6 text-lg font-semibold tracking-tight">
                Upload Thumbnail
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Drag & drop your thumbnail here
              </p>

              <p className="text-sm font-medium text-primary">
                or browse files
              </p>

              <div className="mt-5 rounded-full bg-muted px-3 py-1 text-xs">
                PNG • JPG • WEBP
              </div>
            </>
          )}
        </div>
      </div>

      {errors.thumbnail && (
        <p className="mt-2 text-sm text-destructive">
          {errors.thumbnail.message}
        </p>
      )}
    </>
  );
};

export default ThumbnailUpload;