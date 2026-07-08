import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Seo from "../components/Seo";

// Landing page sections — each is a separate file for easy editing
import {
  HeroSection,
  FeaturesSection,
  StatsSection,
  AboutSection,
  ServicesSection,
  HowItWorksSection,
  TestimonialsSection,
  FAQSection,
  CTASection,
} from "./landing";

const LandingPage = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Seo
        title="Taskora - Connect, Collaborate, Grow"
        description="The ultimate platform for freelancers, employers and professionals to work, connect and grow together."
      />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <AboutSection />
      <ServicesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
