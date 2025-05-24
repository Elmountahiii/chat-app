import { useNavigate } from "react-router-dom";
import "../styles/notFoundPage.css";

export default function NotFoundPage() {
  const router = useNavigate();
  return (
    <div className="not-found-container">
      <div className="content-wrapper">
        <h1 className="title">404</h1>
        <span className="subtitle">Oops! Page Not Found!</span>
        <p className="description">
          It seems like the page you&apos;re looking for <br />
          does not exist or might have been removed.
        </p>
        <div className="button-group">
          <button onClick={() => router(-1)}>Go Back</button>
          <button onClick={() => router("/")}>Back to Home</button>
        </div>
      </div>
    </div>
  );
}
