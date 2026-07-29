import { ImagePlus } from "lucide-react";
import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import type { User } from "@/types/user.types";

import settingService from "@/services/settingService";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface CoverImageCardProps {
    user: User;
    refetch: () => Promise<void>;
}

const CoverImageCard = ({
    user,
    refetch,
}: CoverImageCardProps) => {
    const [selectedFile, setSelectedFile] =
        useState<File | null>(null);

    const [isUploading, setIsUploading] =
        useState(false);

    const fileInputRef =
        useRef<HTMLInputElement>(null);

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error("Please select an image first.");
            return;
        }

        try {
            setIsUploading(true);

            const formData = new FormData();

            formData.append(
                "coverImage",
                selectedFile
            );

            const response =
                await settingService.updateCoverImage(
                    formData
                );

            toast.success(response.message);

            await refetch();

            setSelectedFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message ??
                        "Failed to upload cover image."
                );
            } else {
                toast.error("Something went wrong.");
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>
                        Cover Image
                    </CardTitle>

                    <CardDescription>
                        Update your channel cover image.
                    </CardDescription>
                </div>

                {user.coverImage && (
                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                    >
                        <label htmlFor="cover-upload">
                            <ImagePlus className="mr-2 h-4 w-4" />
                            Change
                        </label>
                    </Button>
                )}
            </CardHeader>

            <CardContent className="space-y-6">
                {user.coverImage ? (
                    <img
                        src={user.coverImage}
                        alt="Cover"
                        className="h-48 w-full rounded-lg border object-cover"
                    />
                ) : (
                    <div className="flex h-48 w-full items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                        No cover image uploaded
                    </div>
                )}

                <div>
                    <p className="font-medium">
                        Current Cover Image
                    </p>

                    <p className="text-sm text-muted-foreground">
                        Recommended: 2048 × 1152 px (16:9)
                    </p>
                </div>

                <input
                    ref={fileInputRef}
                    id="cover-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />

                {!user.coverImage &&
                    !selectedFile && (
                        <Button asChild>
                            <label htmlFor="cover-upload">
                                Choose Cover Image
                            </label>
                        </Button>
                    )}

                {selectedFile && (
                    <div className="flex flex-wrap items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                            Selected:{" "}
                            {selectedFile.name}
                        </p>

                        <Button
                            onClick={handleUpload}
                            disabled={isUploading}
                        >
                            {isUploading
                                ? "Uploading..."
                                : "Upload Cover Image"}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isUploading}
                        >
                            Cancel
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default CoverImageCard;