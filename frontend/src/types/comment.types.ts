export interface CommentOwner{
    _id: "$userDetails._id",
    username: "$userDetails.username",
    fullName: "$userDetails.fullName",
    avatar: "$userDetails.avatar"
}

export interface Comment{
    _id:string,
    content:string,
    owner:CommentOwner,
    createdAt:string,
    updatedAt:string
}

export interface CommentResponse {
    statusCode: number;
    message: string;
    data: Comment[];
}