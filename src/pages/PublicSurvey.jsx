import { useParams } from "react-router-dom";

export default function PublicSurvey() {
  const { slug } = useParams();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-2xl">
          <p className="text-sm font-medium text-brand-600">Public form</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Survey coming soon
          </h1>
          <p className="mt-3 text-lg text-slate-500">
            The form{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-base text-slate-700">{slug}</code>{" "}
            will load here.
          </p>
        </div>
      </main>
      <footer className="py-6 text-center text-xs text-slate-400">Powered by Reelo Forms</footer>
    </div>
  );
}