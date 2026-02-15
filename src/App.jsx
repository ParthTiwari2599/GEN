// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { SignedIn, UserButton, useAuth } from "@clerk/clerk-react";
import NoPage from "./pages/NoPage";
import Landing from "./pages/Landing";
import Gen from "./pages/Gen";
import Showcase from "./pages/Showcase";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import "./App.css";
import GooeyNav from "./components/GooeyNav";

const navItems = [
  { label: "Home", href: "/" },
  { label: "GEN", href: "/gen" },
  { label: "Showcase", href: "/showcase" },
];

function getActiveIndex(pathname) {
  if (pathname === "/showcase") return 2;
  if (pathname === "/gen" || pathname === "/app") return 1;
  return 0;
}

const ProtectedRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Navigate to="/sign-up" replace />;

  return children;
};

function AppContent() {
  const location = useLocation();
  const activeIndex = getActiveIndex(location.pathname);
  const isLanding = location.pathname === "/";
  const isAuthPage =
    location.pathname.startsWith("/sign-in") || location.pathname.startsWith("/sign-up");

  return (
    <div className="relative w-full min-h-screen bg-black text-white overflow-hidden">
      {!isAuthPage && (
        <>
          <div
            className={`fixed top-6 right-8 z-50 pointer-events-auto ${
              isLanding
                ? "rounded-full bg-[#2b2117]/80 px-2 py-1 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur"
                : ""
            }`}
          >
            <GooeyNav
              items={navItems}
              particleCount={15}
              particleDistances={[90, 10]}
              particleR={100}
              initialActiveIndex={activeIndex === -1 ? 0 : activeIndex}
              animationTime={600}
              timeVariance={300}
              colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            />
          </div>

          <SignedIn>
            <div className="fixed left-6 top-6 z-50">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </>
      )}

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/gen"
          element={
            <ProtectedRoute>
              <Gen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/showcase"
          element={
            <ProtectedRoute>
              <Showcase />
            </ProtectedRoute>
          }
        />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </div>
  );
}

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
