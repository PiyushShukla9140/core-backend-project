import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Input } from "../ui/input";

type ShareVideoDialogProps = {
    url: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const ShareVideoDialog = ({
    url,
    open,
    onOpenChange,
}: ShareVideoDialogProps) => {
    
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);

            toast.success("Link copied to clipboard!");

            onOpenChange(false);
        } catch {
            toast.error("Failed to copy link.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share Video</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <Input
                        value={url}
                        readOnly
                        onFocus={(e) => e.target.select()}
                    />

                    <Button
                        className="w-full"
                        onClick={handleCopy}
                    >
                        Copy Link
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShareVideoDialog;