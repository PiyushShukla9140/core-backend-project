import { Camera } from "lucide-react";

import type { User } from "@/types/user.types";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { useRef, useState } from "react";
import { toast } from "sonner";
import settingService from "@/services/settingService";
import axios from "axios";

interface AvatarCardProps {
    user: User;
    refetch: () => Promise<void>;
}


const AvatarCard = ({ user,refetch }: AvatarCardProps) => {
    
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setSelectedFile(file);
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error("Please select an image first.");
            return;
        }

        try {
            setIsUploading(true);

            const formData = new FormData();
            formData.append("avatar", selectedFile);

             await settingService.updateAvatar(formData);


            await refetch();
            

            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            
            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message ??
                        "Failed to upload avatar."
                );
            } else {
                toast.error("Something went wrong.");
            }
        } finally {
            setIsUploading(false);
        }
    };
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Avatar</CardTitle>

                    <CardDescription>
                        Update your profile picture.
                    </CardDescription>
                </div>

                <Button variant="outline" size="sm">
                    <Camera className="mr-2 h-4 w-4" />
                    Change
                </Button>
            </CardHeader>

            <CardContent className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                   {user.avatar && (
                        <AvatarImage
                            src={user.avatar}
                            alt={user.fullName}
                        />
                    )}

                    <AvatarFallback>
                        {user.fullName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div>
                    <p className="font-medium">
                        Current Avatar
                    </p>

                    <p className="text-sm text-muted-foreground">
                        Recommended: Square image, at least 400×400 px.
                    </p>


                </div>


                <input
                    ref={fileInputRef}
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />

                <Button asChild>
                    <label htmlFor="avatar-upload">
                        Choose Avatar
                    </label>
                </Button>
                {selectedFile && (
                    <p className="text-sm text-muted-foreground">
                        Selected:{selectedFile.name}
                    </p>
                )}

                <Button
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading}
                >
                    {isUploading ? "Uploading..." : "Upload Avatar"}
                </Button>
            </CardContent>
        </Card>
    );
};

export default AvatarCard;