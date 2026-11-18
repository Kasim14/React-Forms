import { Routes, Route } from "react-router-dom";
import AdminLayout from "./components/layout/AdminLayout.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NewForm from "./pages/NewForm.jsx";
import FormBuilder from "./pages/FormBuilder.jsx";
import FormPreview from "./pages/FormPreview.jsx";
import FormResponses from "./pages/FormResponses.jsx";
import PublicSurvey from "./pages/PublicSurvey.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      {/* ---------- Public routes (no login) ---------- */}
      <Route path="/login" element={<Login />} />
      <Route path="/f/:slug" element={<PublicSurvey />} />

      {/* ---------- Admin pages WITH the sidebar layout ---------- */}
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/forms/:id/responses" element={<FormResponses />} />
      </Route>

      {/* ---------- Admin pages that are full-screen ---------- */}
      <Route path="/forms/new" element={<NewForm />} />
      <Route path="/forms/:id/edit" element={<FormBuilder />} />
      <Route path="/forms/:id/preview" element={<FormPreview />} />

      {/* ---------- Anything else ---------- */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}