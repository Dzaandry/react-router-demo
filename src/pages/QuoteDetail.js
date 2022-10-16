import { useParams, Route, Link, useRouteMatch } from "react-router-dom";
import Comments from "../components/comments/Comments";
import HighlightedQuote from "../components/quotes/HighlightedQuote";
import useHttp from "../hooks/use-http";
import { getSingleQuote } from "../lib/api";
import { useEffect } from "react";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const QuoteDetail = () => {
  const params = useParams();
  const match = useRouteMatch();
  const { quoteId } = params;

  const {
    sendRequest,
    status,
    data: loadedQuote,
    error,
  } = useHttp(getSingleQuote, true);

  useEffect(() => {
    sendRequest(quoteId);
  }, [sendRequest, quoteId]);

  if (status === "pending") {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="centered focused">
        <p>{error}</p>
      </div>
    );
  }

  if (!loadedQuote.text) {
    return (
      <div className="centered">
        <p>Quote not found!</p>
      </div>
    );
  }

  const commentsURL = `${match.url}/comments`;

  return (
    <section>
      <HighlightedQuote author={loadedQuote.author} text={loadedQuote.text} />
      <Route path={match.path} exact>
        <div className="centered">
          <Link className="btn--flat" to={commentsURL}>
            Comments
          </Link>
        </div>
      </Route>
      <Route path={commentsURL}>
        <Comments quoteId={quoteId} />
      </Route>
    </section>
  );
};

export default QuoteDetail;
