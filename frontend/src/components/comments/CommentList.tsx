import CommentCard from "./CommentCard"
import type { Comment } from "@/types/comment.types"
//Its only responsibility is to receive an array of comments and render a CommentCard for each one.


interface CommentListProps{
    comments:Comment[];
    onCommentsUpdated: () => Promise<void>;

}
const CommentList = ({comments,onCommentsUpdated}:CommentListProps)=>{

     return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentCard
          key={comment._id}
          comment={comment}
           onCommentsUpdated={onCommentsUpdated}
        />
      ))}
    </div>
  );
}

export default CommentList