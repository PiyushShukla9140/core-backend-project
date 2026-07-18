import api from "@/api/axios"

import type { Comment, CommentResponse } from "@/types/comment.types"

const CommentService = {

    getComments(videoId: string) {
        return api.get<CommentResponse>(
            `/comments/${videoId}`
        );
    },

    createComment(
        videoId: string,
        content: string
    ) {
        return api.post<CommentResponse>(
            `/comments/${videoId}`,
            { content }
        );
    },

    updateComment(
        commentId: string,
        content: string
    ) {
        return api.patch<CommentResponse>(
            `/comments/c/${commentId}`,
            { content }
        );
    },

    deleteComment(commentId: string) {
        return api.delete(
            `/comments/c/${commentId}`
        );
    },
};

export default CommentService