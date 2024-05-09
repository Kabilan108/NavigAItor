import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/ui/mode-toggle";

interface ChromeIconProps {
  className?: string;
}

export default function Component() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500">
      <div className="mx-auto flex max-w-sm flex-col space-y-6 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <ChromeIcon className="mx-auto h-12 w-12 text-indigo-600" />
          <h1 className="mt-4 text-2xl font-bold text-indigo-600">
            Sign in with Google
          </h1>
          <p className="mt-2 text-gray-500">
            Unlock the power of seamless productivity
          </p>
        </div>
        <Button
          className="relative mx-auto flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
          variant="outline"
        >
          <ChromeIcon className="h-5 w-5 text-white" />
          Continue with Google
        </Button>
        <p className="text-center text-sm text-gray-500">
          By continuing, you agree to our
          <Link className="underline" to="#">
            Terms of Service
          </Link>
          {" \n                  "}and
          <Link className="underline" to="#">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
      <ModeToggle />
    </div>
  );
}

function ChromeIcon(props: ChromeIconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  );
}
