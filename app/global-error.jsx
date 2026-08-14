"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("GLOBAL_RENDER_ERROR", {
      digest: error?.digest,
      name: error?.name,
    });
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "24px",
          }}
        >
          <div style={{ maxWidth: "520px", textAlign: "center" }}>
            <h1>We could not load the application</h1>
            <p>Please try again or contact support if the problem continues.</p>
            <button type="button" onClick={reset}>
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
