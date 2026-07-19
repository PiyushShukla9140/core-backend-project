import {useState,useEffect} from "react"

import {AxiosError} from "axios"

import CommentService from "../services/commentService.ts"


const useUpdateComment = ()=>{
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState<string | null>(null)

    const updateComment = async(
        commentId:string,
        content:string
    )=>{
        try{
            setLoading(true);
            setError(null);

            const response = await CommentService.updateComment(
                commentId,
                content
            );
            

            return response;
        }catch(err){
            const error = err as AxiosError<{ message: string }>;

            const message =
                error.response?.data?.message ||
                "Failed to update comment";

            setError(message);
        }finally{
            setLoading(false)
        }
    }
    return {
        updateComment,
        loading,
        error
    }
       
    
}

export default useUpdateComment