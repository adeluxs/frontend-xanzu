"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    console.error("ROUTE_RENDER_ERROR", {
      digest: error?.digest,
      name: error?.name,
    });
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-5 py-10">
      <div className="w-full max-w-lg rounded-2xl border border-grayish/10 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-grayish">
          We could not load this page
        </h1>
        <p className="mt-3 text-sm leading-6 text-grayish/65">
          Please try again. If the problem continues, contact support with error
          reference {error?.digest || "unavailable"}.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-grayish"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
