import type { Comment } from "@/types/comment.types";
// this file will only be used to display the comment 
import { Card } from "../ui/card";
import { Avatar,AvatarFallback,AvatarImage } from "../ui/avatar";

import { formatTimeAgo } from "@/lib/video";

import { useState } from "react";

import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

import  useUpdateComment  from "@/hooks/useUpdateComment";
import { useDeleteComment } from "@/hooks/useDeleteComment";

import { useAppSelector } from "@/store/hooks";
import { Pencil, Trash2 } from "lucide-react";
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
} from "../ui/alert-dialog";

import { toast } from "sonner";

interface CommentCardProps{
    comment:Comment;
    onCommentsUpdated: ()=>Promise<void>
}
const CommentCard = ({comment,onCommentsUpdated}:CommentCardProps)=>{
    // {comment} this is used to destructure comment and use its properties
    // without destructuring if you want to access comment propertoies you need to use props everywhere
    // for eg props.comment.owner

    const currentUser = useAppSelector(
        (state) => state.auth.user
    );
    console.log(currentUser);
    console.log(comment.owner);

    const isOwner =
        currentUser?._id === comment.owner._id;
    
    console.log("Current User:", currentUser?._id);
    console.log("Comment Owner:", comment.owner._id);
    console.log("isOwner:", isOwner);

    const [isEditing, setIsEditing] = useState(false);

    const [editedContent, setEditedContent] = useState(comment.content);

    const { updateComment, loading } = useUpdateComment();
    const {
        deleteComment,
        loading: deleteLoading,
        } = useDeleteComment();

    const handleSave = async () => {
        const content = editedContent.trim();

        if (!content) return;

        try {
            await updateComment(comment._id, content);

            await onCommentsUpdated();
            toast.success("comment updated")

            setIsEditing(false);
        } catch (error) {
            toast.error("Failed to update comment.");
        }
    };

    const handleCancel = () => {
    setEditedContent(comment.content);
    setIsEditing(false);
    };

    const handleDelete = async () => {
        

        try {
            await deleteComment(comment._id);

            await onCommentsUpdated();
            toast.success("comment deleted successfully")
        } catch (error) {
            toast.error("Failed to delete comment.");
        }
    };
    return(
        <Card className="border-0 shadow-none rounded-lg p-2 transition-colors hover:bg-muted/40">
            <div className="flex items-start gap-3 p-2">
                <Avatar>
                    <AvatarImage className="h-10 w-11"
                        src={comment.owner.avatar}
                        alt={comment.owner.fullName}
                    />
                    <AvatarFallback>
                        {comment.owner.fullName.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-sm">
                            {comment.owner.fullName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            @{comment.owner.username}
                        </span>

                        <span className="text-xs text-muted-foreground">
                            •
                        </span>

                        <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(comment.createdAt)}
                        </span>
                    </div>
                    {isEditing ? (
                    <div className="space-y-3">
                        <Textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        rows={3}
                        autoFocus
                        />

                        <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handleSave}
                            disabled={loading || !editedContent.trim()||
                                editedContent.trim() === comment.content.trim()
                            }
                        >
                            {loading ? "Saving..." : "Save"}
                        </Button>
                        </div>
                    </div>
                    ) : (
                    <p className="text-sm leading-6 mt-2 whitespace-pre-wrap">
                        {comment.content}
                    </p>
                    )}

                    {isOwner && !isEditing && (
                        <div className="mt-2 flex gap-2">
                            <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            >
                                 <Pencil className="h-4 w-4 mr-1" />
                                Edit
                            </Button>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={deleteLoading}
                                    >
                                         <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                    </Button>
                                </AlertDialogTrigger>

                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Delete Comment
                                    </AlertDialogTitle>

                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently
                                        delete your comment.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>

                                    <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>

                                    <AlertDialogAction
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}

                </div>
            </div>
        </Card>
    )
}

export default CommentCard


