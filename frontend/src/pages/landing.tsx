import DarkModeToggle from "@/components/ui/dark-mode-toggle";

import { getBackendURL } from "@/client";

function LandingPage() {
  return (
    <div className="bg-gray-100 p-4 font-sans">
      <h1 className="text-4xl font-bold">Landing Page</h1>
      <p className="text-gray-800">This is the landing page.</p>
      <p className="text-gray-800">{getBackendURL()}</p>
      <DarkModeToggle />
    </div>
  );
}

export default LandingPage;
