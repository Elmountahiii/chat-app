import React from "react";
import { SignUpTypes } from "../types/authTypes";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import "../styles/signUpPage.css";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState<SignUpTypes>({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const registerUser = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Account created successfully!");
        navigate("/signin");
      } else {
        toast.error("Error creating account.");
        setError(data.message || "An error occurred.");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      setError("Network error. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);

    console.log(formData);
    setIsSubmitting(true);
    registerUser();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSocialSignup = (provider: string) => {
    // Placeholder for social signup logic
    alert(`Sign up with ${provider} coming soon!`);
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="form-header">
          <h1>Welcome</h1>
          <p className="subtitle">Create your account to get started</p>
        </div>

        <button
          className="social-btn"
          type="button"
          onClick={() => handleSocialSignup("Google")}>
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
            alt="Google"
          />
          Sign up with Google
        </button>
        <button
          className="social-btn"
          type="button"
          onClick={() => handleSocialSignup("GitHub")}
          style={{ marginTop: "10px" }}>
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
            alt="GitHub"
          />
          Sign up with GitHub
        </button>

        <div className="divider">
          <span>or</span>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Username"
              required
              autoComplete="username"
            />
          </div>

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
              autoComplete="new-password"
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

          <div className="form-group" style={{ position: "relative" }}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              required
              autoComplete="new-password"
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
              onClick={() => setShowConfirmPassword((v) => !v)}
              title={showConfirmPassword ? "Hide password" : "Show password"}>
              {showConfirmPassword ? "🙈" : "👁️"}
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
            Create Account
          </button>
        </form>

        <p
          className="login-link"
          style={{ textAlign: "center", marginTop: 20 }}>
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
