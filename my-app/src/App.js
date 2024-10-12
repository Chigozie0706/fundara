import React from "react";
import {  Routes, Route } from "react-router-dom";
import "./App.css";
import NavigationBar from "./components/NavigationBar";
import "bootstrap/dist/css/bootstrap.min.css";
import DisasterReportCard from "./components/DisasterCard";
import Hero from "./components/Hero";
import DisasterReportForm from "./components/DisasterReportForm";
import DisasterReportDetails from "./components/DisasterReportDetails";

function App() {
  return (
    <>
      <NavigationBar />
      {/* Define Routes */}
      <Routes>
        {/* Home Route - shows the Hero component */}
        <Route path="/" element={<Hero />} />

        {/* Route for Disaster Report Card */}
        <Route
          path="/disaster-report"
          element={<DisasterReportCard  />}
        />

        {/* Route for Disaster Report Card */}
        <Route
          path="/disaster-report/:id"
          element={<DisasterReportDetails />}
        />

        {/* Route for Disaster Report Form */}
        <Route path="/submit-report" element={<DisasterReportForm />} />
      </Routes>
    </>
  );
}

export default App;
