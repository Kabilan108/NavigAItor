import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useAuth } from "@/lib/context";

export default function LoginPage() {
  const { user, login } = useAuth();

  if (user !== undefined) {
    return <Navigate to="/app" />;
  }

  const handleGoogleSignIn = async () => {
    try {
      login();
    } catch (error) {
      console.error(`Login failed: ${error}`);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <Card className="mx-auto flex flex-col rounded-lg p-4 shadow-lg w-96 mb-16">
        <CardHeader className="space-y-1">
          <Icons.logo className="w-20 h-20 mx-auto mb-8 text-accent-foreground" />
          <CardTitle className="text-3xl">Sign In</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-6">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
            >
              <Icons.google className="mr-2 h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
