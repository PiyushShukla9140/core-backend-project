import { ImageIcon } from "lucide-react";

interface ChannelBannerProps {
    coverImage: string;
}

export const ChannelBanner = ({
    coverImage,
}: ChannelBannerProps) => {
    return (
        <div className="relative h-48 overflow-hidden rounded-xl bg-muted md:h-64">
            {coverImage ? (
                <img
                    src={coverImage}
                    alt="Channel Banner"
                    className="h-full w-full object-cover"
                />
            ) : (
                <div className="flex h-full items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
            )}
        </div>
    );
};