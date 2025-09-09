"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ fallbackHref = "/dashboard", className = "" }) {
  const router = useRouter();

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label="Volver"
      className={
        "inline-flex items-center text-blue-600 cursor-pointer rounded-full border border-gray-200 bg-white p-2 shadow-sm " +
        "hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 " +
        "focus-visible:outline-offset-2 focus-visible:outline-blue-600 " +
        className
      }
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
  );
}
