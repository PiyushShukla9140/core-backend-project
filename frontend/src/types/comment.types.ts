export interface CommentOwner{
    _id:string,
    username:string,
    fullName:string,
    avatar:string,
}

export interface Comment{
    _id:string,
    content:string,
    owner:CommentOwner,
    createdAt:string,
    updatedAt:string
}