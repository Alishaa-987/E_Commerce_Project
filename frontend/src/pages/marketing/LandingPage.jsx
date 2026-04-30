import React from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Hero from "../../components/home/Hero";
import Categories from "../../components/home/Categories";
import BestSelling from "../../components/home/BestSelling";
import Events from "../../components/home/Events";
import FeaturedShops from "../../components/home/FeaturedShops";
import Sponsored from "../../components/home/Sponsored";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white font-Poppins">
      <Navbar />
      <Hero />
      <Sponsored />
      <Categories />
      <BestSelling />
      <Events />
      <FeaturedShops />
      <Footer />
    </div>
  );
};

export default LandingPage;
