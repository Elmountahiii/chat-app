import React from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import "../styles/signInPage.css";

type SignInForm = {
  email: string;
  password: string;
};

function SignInPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState<SignInForm>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handlerLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message);
        setError(data.message || "An error occurred.");
        return;
      }
      if (response.ok) {
        toast.success("Login successful!");
        navigate("/chat");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      setError("Network error. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Minimal validation example
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }
    setError(null);
    // Handle form submission
    setIsSubmitting(true);
    handlerLogin();
    console.log(formData);
  };

  const handleSocialSignIn = (provider: string) => {
    alert(`Sign in with ${provider} coming soon!`);
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <div className="form-header">
          <h1>Welcome Back</h1>
          <p className="subtitle">Sign in to your account</p>
        </div>

        <button
          className="social-btn"
          type="button"
          onClick={() => handleSocialSignIn("Google")}>
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
            alt="Google"
          />
          Sign in with Google
        </button>
        <button
          className="social-btn"
          type="button"
          onClick={() => handleSocialSignIn("GitHub")}
          style={{ marginTop: "10px" }}>
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
            alt="GitHub"
          />
          Sign in with GitHub
        </button>

        <div className="divider">
          <span>or</span>
        </div>

        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group" style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              autoComplete="current-password"
            />
            <span
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#888",
                fontSize: 14,
                userSelect: "none",
              }}
              onClick={() => setShowPassword((v) => !v)}
              title={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {error && (
            <div
              style={{
                color: "#d32f2f",
                marginBottom: 10,
                textAlign: "center",
                fontSize: 14,
              }}>
              {error}
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            Sign In
          </button>
        </form>

        <p
          className="signup-link"
          style={{ textAlign: "center", marginTop: 20 }}>
          Don't have an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default SignInPage;
