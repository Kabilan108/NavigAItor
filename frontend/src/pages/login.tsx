import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/hooks";

import { Button } from "@/components/ui/button";
import * as Icons from "@/components/icons";

import { AuthProviders } from "@/client/types";

export default function LoginPage() {
  const { user, login } = useAuth();

  if (user !== undefined) {
    return <Navigate to="/app" />;
  }

  const handleGoogleSignIn = async () => {
    try {
      await login(AuthProviders.GOOGLE);
    } catch (error) {
      console.error(`Login failed: ${error}`);
    }
  };

  return (
    <div className="w-full min-h-[600px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <Icons.Logo className="w-20 h-20 mx-auto mb-8 text-accent-foreground" />

          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Sign in to your account
            </p>
          </div>
          <div className="grid gap-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
            >
              Sign in with <Icons.Google className="ml-2 mr-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
