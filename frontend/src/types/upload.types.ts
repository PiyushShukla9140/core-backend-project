export interface UploadVideoFormData {
    title: string;
    description: string;
    thumbnail: File | null;
    videoFile: File | null;
}