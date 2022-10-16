import { useState, useCallback, useEffect } from "react";
import classes from "./Comments.module.css";
import NewCommentForm from "./NewCommentForm";
import useHttp from "../../hooks/use-http";
import { getAllComments } from "../../lib/api";
import CommentsList from "./CommentsList";
import LoadingSpinner from "../UI/LoadingSpinner";

const Comments = (props) => {
  const [isAddingComment, setIsAddingComment] = useState(false);
  const { sendRequest, status, data: loadedComments } = useHttp(getAllComments);

  useEffect(() => {
    sendRequest(props.quoteId);
  }, [sendRequest, props.quoteId]);

  const startAddCommentHandler = () => {
    setIsAddingComment(true);
  };

  const finishAddCommentHandler = useCallback(() => {
    setIsAddingComment(false);
    sendRequest(props.quoteId);
  }, [props.quoteId, sendRequest]);

  let comments;

  if (status === "pending") {
    comments = (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "completed" && loadedComments && loadedComments.length > 0) {
    comments = <CommentsList comments={loadedComments} />;
  }

  if (
    status === "completed" &&
    (!loadedComments || loadedComments.length === 0)
  ) {
    comments = <p className="centered">No comments were added yet.</p>;
  }

  return (
    <section className={classes.comments}>
      <h2>User Comments</h2>
      {!isAddingComment && (
        <button className="btn" onClick={startAddCommentHandler}>
          Add a Comment
        </button>
      )}
      {isAddingComment && (
        <NewCommentForm
          onAddComment={finishAddCommentHandler}
          quoteId={props.quoteId}
        />
      )}
      {comments}
    </section>
  );
};

export default Comments;
