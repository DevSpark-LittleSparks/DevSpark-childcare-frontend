import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="flex h-screen items-center justify-center bg-primary-50">
        <h1 className="text-3xl font-bold text-primary-700">
          DevSpark Childcare System - Base Setup Complete!
        </h1>
      </div>
    ),
  },
]);
