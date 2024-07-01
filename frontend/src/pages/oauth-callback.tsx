import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

import { getOAuthToken } from "@/client";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const isProcessing = useRef(false);

  useEffect(() => {
    const handleOAuth = async () => {
      if (isProcessing.current) return;
      isProcessing.current = true;

      try {
        const query = window.location.search;
        if (query) {
          await getOAuthToken(query);
          navigate("/app");
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error handling OAuth success:", error);
        navigate("/login");
      } finally {
        isProcessing.current = false;
      }
    };

    handleOAuth();
  }, [navigate]);

  return <div>Processing login...</div>;
}
