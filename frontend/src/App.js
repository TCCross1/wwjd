import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import cloudsBg from "@/assets/clouds-bg.png";

import Landing from "@/pages/Landing";
import Gift from "@/pages/Gift";
import GiftSuccess from "@/pages/GiftSuccess";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Activate from "@/pages/Activate";
import Dashboard from "@/pages/Dashboard";
import Counsel from "@/pages/Counsel";
import Diary from "@/pages/Diary";
import Stories from "@/pages/Stories";
import PayForward from "@/pages/PayForward";
import Donate from "@/pages/Donate";
import DonateSuccess from "@/pages/DonateSuccess";
import TeachingHome from "@/pages/teaching/TeachingHome";
import BookVisit from "@/pages/teaching/BookVisit";
import Beside from "@/pages/teaching/Beside";

function App() {
  return (
    <div className="App min-h-screen relative">
      {/* Heavenly clouds background */}
      <div className="fixed inset-0 -z-10" aria-hidden="true">
        <img src={cloudsBg} alt="" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/72 via-white/60 to-[#F5F3EB]/80" />
      </div>

      <BrowserRouter>
        <AuthProvider>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/gift" element={<Gift />} />
              <Route path="/gift/success" element={<GiftSuccess />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/donate/success" element={<DonateSuccess />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/activate" element={<Activate />} />
              <Route path="/stories" element={<Stories />} />
              <Route path="/app" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/counsel" element={<ProtectedRoute><Counsel /></ProtectedRoute>} />
              <Route path="/diary" element={<ProtectedRoute><Diary /></ProtectedRoute>} />
              <Route path="/pay-it-forward" element={<ProtectedRoute><PayForward /></ProtectedRoute>} />
              <Route path="/word" element={<TeachingHome />} />
              <Route path="/word/beside" element={<Beside />} />
              <Route path="/word/:id" element={<BookVisit />} />
            </Routes>
          </main>
          <Toaster
            position="top-center"
            toastOptions={{ style: { background: "#FFFFFF", border: "1px solid #E6E1D6", color: "#2D2824" } }}
          />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
