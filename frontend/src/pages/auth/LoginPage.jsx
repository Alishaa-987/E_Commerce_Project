import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../server";
import { loadUser } from "../../redux/actions/user";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  const redirectTo = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    await axios
      .post(
        `${server}/user/login-user`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        },
      )
      .then(async () => {
        setMessage("Login successful!");
        setMessageType("success");
        localStorage.setItem("userAuth", "true");
        await dispatch(loadUser());
        // navigate(redirectTo, { replace: true });
      })

      .catch((err) => {
        console.log(err);
        setMessageType("error");
        setMessage(err.response?.data?.message || "Login failed");
      });
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
                Welcome back
              </h1>
              <p className="text-sm text-white/60">
                Sign in to keep your cart and orders synced.
              </p>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="space-y-1 text-sm text-white/70">
                Email
                <input
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/10"
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

              <div className="flex items-center justify-between text-xs text-white/60">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/20 bg-transparent text-emerald-300 focus:ring-white/10"
                  />
                  Keep me signed in
                </label>
                <button
                  type="button"
                  className="text-white/70 hover:text-white"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"

                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#0b0b0d] transition hover:-translate-y-0.5"
              >
                Sign in
                <span className="inline-flex h-2 w-2 rounded-full bg-[#0b0b0d] group-hover:animate-pulse" />
              </button>
            </form>
            {message && (
              <p
                className={`mt-4 text-center text-sm ${
                  messageType === "success" ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {message}
              </p>
            )}

            <p className="mt-6 text-center text-xs text-white/60">
              New here?{" "}
              <Link to="/signup" className="text-emerald-200 hover:text-white">
                Create your account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
