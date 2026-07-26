import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    playlistSchema,
    type PlaylistFormValues,
} from "@/schemas/playlist.schema";

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

interface PlaylistFormProps {
    defaultValues?: PlaylistFormValues;
    submitLabel: string;
    loading?: boolean;
    onSubmit: (values: PlaylistFormValues) => Promise<void>;
}

const PlaylistForm = ({
    defaultValues,
    submitLabel,
    loading = false,
    onSubmit,
}: PlaylistFormProps) => {
    const form = useForm<PlaylistFormValues>({
        resolver: zodResolver(playlistSchema),
        defaultValues: defaultValues ?? {
            name: "",
            description: "",
        },
    });

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>

                            <FormControl>
                                <Input
                                    placeholder="My Playlist"
                                    {...field}
                                />
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
                                    rows={4}
                                    placeholder="Describe your playlist..."
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    className="w-full"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Please wait..." : submitLabel}
                </Button>
            </form>
        </Form>
    );
};

export default PlaylistForm;