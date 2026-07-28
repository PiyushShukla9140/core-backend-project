export interface ShareOptions {
    title: string;
    url: string;
    text?: string;
}

export type ShareResult =
    | "shared"
    | "unsupported"
    | "cancelled";

export const share = async ({
    title,
    url,
    text,
}: ShareOptions): Promise<ShareResult> => {
    if (!navigator.share) {
        return "unsupported";
    }

    try {
        await navigator.share({
            title,
            text,
            url,
        });

        return "shared";
    } catch (error) {
        // User dismissed the native share sheet or an error occurred.
        console.error("Share failed:", error);
        return "cancelled";
    }
};