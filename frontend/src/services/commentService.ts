import api from "@/api/axios"

import type { Comment } from "@/types/comment.types"

const CommentService= {
    getComments:async(videoId:string)=>{
        return api.get<Comment[]>(`/comments/${videoId}`)
    },
    createComment: async(
        videoId:string,
        content:string,
    )=>{
        return api.post<Comment>(`/comments/${videoId}`,{
            content
        })
    },
    updateComment:async(
        commentId:string,
        content:string
    )=>{
        return api.patch<Comment>(`/comments/c/${commentId}`,{content})
    },
    deleteComment:async (
        commentId:string
    ) => {
        return api.delete<Comment>(`/comments/c/$commentId`)
    }

}

export default CommentService