import { useState } from "react";
import reactLogo from "@/assets/react.svg";
import viteLogo from "/vite.svg";
import { useAuth } from "@/lib/context";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Navigate } from "react-router-dom";
import "@/pages/App.css";

export default function MainApp() {
  const [count, setCount] = useState(0);
  const { user, loading } = useAuth();

  // redirect only after loading
  if (!loading && user === undefined) {
    console.log("not logged in");
    return <Navigate to="/login" />;
  }

  // render the rest of the component only after loading
  if (loading || user === undefined) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR Hello
        </p>
        <p>Hello {user.name}</p>
        <p>Email: {user.email}</p>
        <p>ID: {user.id}</p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}
