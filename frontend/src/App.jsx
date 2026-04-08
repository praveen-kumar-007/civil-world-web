import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/Layout";
import ContentGate from "./components/ContentGate";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import CoursesPage from "./pages/CoursesPage";
import ResourcesPage from "./pages/ResourcesPage";
import GalleryPage from "./pages/GalleryPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminPage from "./pages/AdminPage";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return null;
}

export default function App() {
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      document.body.classList.toggle("theme-night", query.matches);
    };

    applyTheme();
    query.addEventListener("change", applyTheme);

    return () => {
      query.removeEventListener("change", applyTheme);
    };
  }, []);

  return (
    <>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/admin/*" element={<AdminPage />} />
          <Route
            path="/"
            element={
              <ContentGate>
                <HomePage />
              </ContentGate>
            }
          />
          <Route
            path="/about"
            element={
              <ContentGate>
                <AboutPage />
              </ContentGate>
            }
          />
          <Route
            path="/courses"
            element={
              <ContentGate>
                <CoursesPage />
              </ContentGate>
            }
          />
          <Route
            path="/resources"
            element={
              <ContentGate>
                <ResourcesPage />
              </ContentGate>
            }
          />
          <Route
            path="/gallery"
            element={
              <ContentGate>
                <GalleryPage />
              </ContentGate>
            }
          />
          <Route
            path="/contact"
            element={
              <ContentGate>
                <ContactPage />
              </ContentGate>
            }
          />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </>
  );
}
