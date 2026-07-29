import { Button } from "@/components/ui/button";
import { X,UploadCloud } from "lucide-react";

import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UploadActionsProps {
    isUploading: boolean;
    uploadProgress: number;
}

const UploadActions = ({isUploading,uploadProgress}:UploadActionsProps) => {
  const navigate = useNavigate()

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


      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            type="button"
            disabled={isUploading}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Discard upload?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Your upload hasn't been published yet. If you leave this page,
              all entered information and selected files will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>
              Continue Editing
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() => navigate("/")}
            >
              Discard Upload
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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