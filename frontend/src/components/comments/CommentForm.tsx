import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";

import commentService from "@/services/commentService";
import { useAppSelector } from "@/store/hooks";

import { toast } from "sonner";
import { useState } from "react";

const formSchema = z.object({
    content: z
        .string()
        .trim()
        .min(1, "Comment cannot be empty")
        .max(500, "Comment is too long"),
});

type FormValues = z.infer<typeof formSchema>;

interface CommentFormProps {
    videoId: string;
    onCommentAdded: () => Promise<void>;
}

const CommentForm = ({  onCommentAdded,videoId }: CommentFormProps) => {
    const user = useAppSelector(
        (state) => state.auth.user
    );

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "",
        },
    });
    const [isFocused, setIsFocused] = useState(false);
    //this state only controls the UI, not the form data.

    const onSubmit = async (values: FormValues) => {
        try {
            await commentService.createComment(
                videoId,
                values.content
            );
             toast.success("Comment added successfully.");
            await onCommentAdded();

            form.reset();
        } catch (error) {
           toast.error("Failed to add comment.");
        }
    };

    return (
        <div className="flex gap-4">
            <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>
                    {user?.fullName?.charAt(0)}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                             placeholder="Add a public comment..."
                                            className="resize-none border-0 border-b rounded-none px-0 shadow-none focus-visible:ring-0"
                                            rows={isFocused ? 3 : 1}
                                            onFocus={() => setIsFocused(true)}
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {isFocused && (
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        form.reset();
                                        setIsFocused(false);
                                    }}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={form.formState.isSubmitting}
                                >
                                    {form.formState.isSubmitting
                                        ? "Posting..."
                                        : "Comment"}
                                </Button>
                            </div>
                        )}
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default CommentForm;