import { useParams } from "react-router-dom";
import { useEffect, useState} from "react";

import useVideo from "@/hooks/useVideo";
import dashboardService from "@/services/dashboardService";
import { Badge } from "@/components/ui/badge";
import { EditVideoSchema } from "@/schemas/editVideo.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { EditVideoFormData } from "@/schemas/editVideo.schema";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {useForm} from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import axios from "axios";

import { useNavigate } from "react-router-dom";
const EditVideo = ()=>{

    const navigate = useNavigate()
    const [isUpdating, setIsUpdating] = useState(false);
    const {videoId} = useParams()
    const {video,loading,error,refetch} = useVideo(videoId ?? "");
    const form = useForm<EditVideoFormData>({
        resolver: zodResolver(EditVideoSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    });

    const [thumbnail, setThumbnail] = useState<File | null>(null);

    useEffect(() => {
        if (!video) return;

        form.reset({
            title: video.title,
            description: video.description,
        });
    }, [video, form]);

    const onSubmit = async (data: EditVideoFormData) => {
        if (!video) return;

        try {
            setIsUpdating(true);

            const formData = new FormData();

            formData.append("title", data.title);
            formData.append("description", data.description);

            if (thumbnail) {
                formData.append("thumbnail", thumbnail);
            }

            await dashboardService.updateVideo(
            video._id,
            formData
            );

            setThumbnail(null);

            toast.success("Video Updated Successfully")

            

            navigate("/dashboard");
        } 
        catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message ??
                    "Failed to update video."
                );
            } else {
                toast.error("Something went wrong.");
            }
        }
         finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="container py-8">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-8 text-destructive">
                {error}
            </div>
        );
    }

    if (!video) {
        return (
            <div className="container py-8">
                Video not found.
            </div>
        );
    }

    console.log(thumbnail);

    return (
        <div className="container mx-auto max-w-4xl py-8">

            <Card>

                <CardHeader>
                    <CardTitle>
                        Edit Video
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-8">

                    <img
                        src={
                            thumbnail
                                ? URL.createObjectURL(thumbnail)
                                : video.thumbnail
                        }
                        alt={video.title}
                        className="aspect-video w-full rounded-lg object-cover"
                    />

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <FormItem>
                                <FormLabel>Thumbnail</FormLabel>

                                <FormControl>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];

                                            if (file) {
                                                setThumbnail(file);
                                            }
                                        }}
                                    />
                                </FormControl>
                            </FormItem>
                            <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Title</FormLabel>

                                <FormControl>
                                    <Input {...field} />
                                </FormControl>

                                <FormMessage />
                                </FormItem>
                            )}
                            />

                            <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Description</FormLabel>

                                <FormControl>
                                    <Textarea
                                    {...field}
                                    rows={8}
                                    />
                                </FormControl>

                                <FormMessage />
                                </FormItem>
                            )}
                            />

                            <div className="flex items-center justify-between">
                                <Badge
                                    variant={
                                    video.isPublished
                                        ? "default"
                                        : "secondary"
                                    }
                                >
                                    {video.isPublished
                                    ? "Published"
                                    : "Draft"}
                                </Badge>

                                <Button
                                    type="submit"
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </Form>

                </CardContent>

            </Card>

        </div>
    );
}

export default EditVideo