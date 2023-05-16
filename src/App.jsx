import { Navbar } from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { Settings } from "./pages/Settings";
import { About } from "./pages/About";
import "./styles/navbar.css";

export const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
};
