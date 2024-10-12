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
          Fundara is a disaster refund platform on the Arbitrum network,
          providing fast, transparent, and secure fund distribution through
          blockchain technology, ensuring efficient relief for affected
          communities.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex space-x-4">
          <button className="bg-blue-700 text-white py-3 px-6 rounded-full hover:bg-blue-800 transition-all">
            <Link
              to="/submit-report"
              className="hover:text-gray-900  no-underline text-white"
            >
              Submit Report
            </Link>
          </button>
          {/* <button className="border border-white text-white py-3 px-6 rounded-full hover:bg-white hover:text-gray-800 transition-all">
            <Link
              to="/submit-report"
              className="hover:text-gray-900  no-underline text-white"
            >
              Submit Report
            </Link>
          </button> */}
        </div>
      </section>
    </div>
  );
}
