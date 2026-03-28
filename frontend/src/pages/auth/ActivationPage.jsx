import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { server } from "../../server";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { loadUser } from "../../redux/actions/user";

function ActivationPage() {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (activation_token) {
      const activationEmail = async () => {
        try {
          await axios.post(`${server}/user/activation`, {
            activation_token,
          }, {
            withCredentials: true,
          });
          localStorage.setItem("userAuth", "true");
          await dispatch(loadUser());
        } catch (error) {
          setError(true);
        }
      };
      activationEmail();
    }
  }, [activation_token, dispatch]);
  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white font-Poppins flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-6 pt-24 pb-16">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111114] p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
          {error ? (
            <>
              <p className="text-xl font-Playfair font-semibold text-white mb-2">Activation failed</p>
              <p className="text-sm text-white/50 mb-4">Your activation link is invalid or expired. Please sign up again.</p>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#0b0b0d]"
              >
                Try again
              </Link>
            </>
          ) : (
            <>
              <p className="text-xl font-Playfair font-semibold text-white mb-2">Account activated</p>
              <p className="text-sm text-white/50 mb-4">Your account is ready. You can now sign in.</p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-300 px-4 py-2 text-sm font-semibold text-[#0b0b0d]"
              >
                Go to login
              </Link>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ActivationPage;
