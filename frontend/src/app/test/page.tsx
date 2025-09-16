"use client";

import { useEffect, useRef, useState } from "react";

function Page() {
  const [number, setNumber] = useState(0);
  const refRenderCount = useRef<number>(0);

  useEffect(() => {
    refRenderCount.current += 1;
  }, [number]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 relative overflow-hidden">
      <div className="bg-white bg-opacity-70 backdrop-blur-md rounded-xl shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Test Page
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          This is a simple test page to demonstrate state management and
          rendering in a Next.js application.
        </p>
        <div className="mb-6">
          <button
            onClick={() => setNumber(number + 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Increment Number
          </button>
        </div>
        <div className="text-xl text-gray-800 mb-2">
          Current Number: <span className="font-mono">{number}</span>
        </div>
        <div className="text-sm text-gray-500">
          Render Count:{" "}
          <span className="font-mono">{refRenderCount.current}</span>
        </div>
      </div>
    </div>
  );
}

export default Page;
