import React from "react";
import { Link } from "react-router-dom";
import hero from "../assests/images/hero.jpg";
export default function Hero() {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${hero})` }}
    >
      {/* NavigationBar */}
      {/* <NavigationBar /> */}

      {/* Main Section */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-5 text-white">
        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl font-bold leading-snug mb-4">
          Manage Disaster. Scale On Blockchain. <br /> Build the Society.
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl max-w-2xl mb-8">
          Fundara improves disaster response with a secure, transparent platform
          for managing disaster information. Using blockchain technology, it
          ensures data integrity and accessibility, enabling authorities and
          relief organizations to make informed decisions and coordinate
          effectively while promoting transparency and accountability in
          disaster management.
        </p>

        {/* Call to Action Buttons */}
        <Link
          to="/submit-report"
          className="hover:text-gray-900  no-underline text-white"
        >
          <div className="flex space-x-4">
            <button className="bg-blue-700 text-white py-3 px-6 rounded-full hover:bg-blue-800 transition-all">
              Submit Report
            </button>
          </div>
        </Link>
      </section>
    </div>
  );
}
