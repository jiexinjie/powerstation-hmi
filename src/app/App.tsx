import { RouterProvider } from "react-router";
import { router } from "./routes";

export default function App() {
  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center overflow-hidden select-none"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {/* 1024×600 HMI screen frame */}
      <div
        className="w-full h-full sm:w-[1024px] sm:h-[600px] sm:rounded-lg overflow-hidden relative flex flex-col bg-background"
        style={{ border: "1px solid rgba(0,212,255,0.18)", boxShadow: "0 0 80px rgba(0,212,255,0.06), 0 32px 64px rgba(0,0,0,0.6)" }}
      >
        <RouterProvider router={router} />
      </div>
    </div>
  );
}