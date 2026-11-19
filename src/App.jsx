import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";

/*
 * lazy(): each page becomes its own JavaScript file, downloaded only when visited.
 * Respondents opening /f/… download the survey, never the dashboard or builder.
 */
const AdminLayout = lazy(() => import("./components/layout/AdminLayout.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const NewForm = lazy(() => import("./pages/NewForm.jsx"));
const FormBuilder = lazy(() => import("./pages/FormBuilder.jsx"));
const FormPreview = lazy(() => import("./pages/FormPreview.jsx"));
const FormResponses = lazy(() => import("./pages/FormResponses.jsx"));
const PublicSurvey = lazy(() => import("./pages/PublicSurvey.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

function PageLoader() {
  return (
    <div className="flex min-h-dvh items-center justify-center" role="status">
      <Loader2 className="h-8 w-8 animate-spin text-brand-500" aria-hidden="true" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export default function App() {
  return (
    // Suspense shows PageLoader while a page's file is downloading (first visit only)
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
  );
}