import { useState,useEffect } from "react"

import axios from "axios"

import CommentService from "@/services/commentService"
import type { Comment } from "@/types/comment.types"


const UseComments = (videoId:string) => {
    const [comments,setComments] = useState<Comment[]>([])

    const [loading,setLoading] = useState(true)

    const [error,setError] = useState("")

    useEffect(()=>{
        if(!videoId) return;

        const fetchComments = async ()=>{
            try{
                 const response = await CommentService.getComments(videoId)
                 setComments(response.data.data)
            }catch(error){
                if(axios.isAxiosError(error)){
                    setError(error.response?.data?.message ??
                        "Failed to fetch comments"
                    )
                }else{
                    setError("Something went wrong")
                }
            }finally{
                setLoading(false)
            }
        };

        fetchComments()


    },[videoId])
}

export default UseComments