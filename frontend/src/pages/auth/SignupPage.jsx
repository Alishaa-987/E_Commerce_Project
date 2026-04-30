import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { useSelector } from "react-redux";

const SignupPage = () => {
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  // reset any stale state when the page mounts (after hot reloads or navigation)
  useEffect(() => {
    setError("");
    setSuccessMessage("");
    setIsSubmitting(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    if (isSubmitting) return;

    if (password !== confirmPassword) {
      setError("Password aur confirm password match nahi karte.");
      return;
    }

    const newForm = new FormData();

    if (avatar) {
      newForm.append("file", avatar);
    }
    newForm.append("name", name);
    newForm.append("email", email);
    newForm.append("password", password);

    setIsSubmitting(true);
    axios
      .post(`${server}/user/create-user`, newForm)
      .then((res) => {
        console.log("signup success:", res.data);
        setSuccessMessage(res.data.message || "Account is created.");
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setAvatar(null);
      })
      .catch((err) => {
        console.log("signup failed:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Signup failed.");
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white font-Poppins">
      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-white/5 blur-[120px] animate-glow" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 translate-x-1/3 rounded-full bg-emerald-300/10 blur-[140px] animate-glow" />

        <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 py-12">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111114] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.6)] animate-fade-up">
            <div className="space-y-2 text-center">
              <p className="text-[11px] uppercase tracking-[0.4em] text-white/60">
                Lumen Market
              </p>
              <h1 className="text-3xl font-Playfair font-semibold">
                Create your account
              </h1>
              <p className="text-sm text-white/60">
                Join for exclusive deals and faster checkout.
              </p>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="space-y-1 text-sm text-white/70">
                Full name
                <input
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/10"
                  placeholder="Enter your name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

              <label className="space-y-1 text-sm text-white/70">
                Email
                <input
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/10"
                  placeholder="xyz@gmail.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <label className="space-y-1 text-sm text-white/70">
                Password
                <input
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/10"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>

              <label className="space-y-1 text-sm text-white/70">
                Confirm password
                <input
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/10"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </label>

              <label className="space-y-1 text-sm text-white/70">
                Upload profile picture
                <input
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:font-medium file:text-white hover:file:bg-white/20"
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                />
              </label>

              {error ? <p className="text-sm text-red-300">{error}</p> : null}
              {successMessage ? <p className="text-sm text-emerald-300">{successMessage}</p> : null}

            
              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#0b0b0d] transition hover:-translate-y-0.5"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create account"}
                <span className="inline-flex h-2 w-2 rounded-full bg-[#0b0b0d] group-hover:animate-pulse" />
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-white/60">
              Already have an account?{" "}
              <Link to="/login" className="text-emerald-200 hover:text-white">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
