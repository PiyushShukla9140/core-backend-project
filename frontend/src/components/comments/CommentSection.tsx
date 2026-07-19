import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import CommentSkeleton from "./CommentSkeleton";
import useComments from "@/hooks/useComment";

interface CommentSectionProps {
  videoId: string;
}

const CommentSection = ({
  videoId,
}: CommentSectionProps) => {
  const {
    comments,
    loading,
    error,
    refetchComments
  } = useComments(videoId);

  if (loading) {
    return (
      <section className="mt-8">
        <CommentSkeleton />
      </section>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <p className="text-destructive">
          {error}
        </p>
      </div>
    );
  }

  return (
    <section className="mt-8 space-y-6">
      <h2 className="text-xl font-semibold">
        {comments.length}{" "}
        {comments.length === 1
          ? "Comment"
          : "Comments"}
      </h2>

      <CommentForm 
      videoId={videoId}
      onCommentAdded={refetchComments} />

      {comments.length === 0 ? (
        <p className="text-muted-foreground">
          No comments yet. Be the first to
          comment!
        </p>
      ) : (
        <CommentList
         comments={comments}
         onCommentsUpdated={refetchComments} />
      )}
    </section>
  );
};

export default CommentSection;