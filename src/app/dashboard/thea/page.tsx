import { Suspense } from "react";
import TheaClient from "./TheaClient";

export default function TheaPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-black/5 bg-white/60 p-8 text-sm text-zinc-600 shadow-sm backdrop-blur-xl">
          Loading Thea...
        </div>
      }
    >
      <TheaClient />
    </Suspense>
  );
}
