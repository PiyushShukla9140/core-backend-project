import { Button } from "@/components/ui/button";
import { X,UploadCloud } from "lucide-react";


interface UploadActionsProps {
    isUploading: boolean;
    uploadProgress: number;
}

const UploadActions = ({isUploading,uploadProgress}:UploadActionsProps) => {

  return (
    <div className="mt-8 flex justify-end gap-4">
      {isUploading && (
        <div className="mb-6">
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}


      <Button
        variant="outline"
        type="button"
      > 
        <X className="mr-2 h-4 w-4"/>
        Cancel
      </Button>

      <Button
        type="submit"
        disabled={isUploading}
      >
        <UploadCloud className="mr-2 h-4 w-4" />
        {isUploading
            ? `Uploading ${uploadProgress}%`
            : "Upload Video"}
      </Button>
    </div>
  );
};

export default UploadActions;