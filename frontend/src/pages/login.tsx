import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/hooks";

import LoginForm from "@/components/login/form";
import * as Icons from "@/components/icons";

export default function LoginPage() {
  const { checkAuth, login } = useAuth();

  if (checkAuth()) {
    return <Navigate to="/app" />;
  }

  return (
    <div className="w-full min-h-[600px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[400px] gap-6">
          <Icons.Logo className="w-20 h-20 mx-auto mb-8 text-accent-foreground" />
          <LoginForm login={login} />
        </div>
      </div>
    </div>
  );
}
