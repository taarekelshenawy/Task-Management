import Routes from "./routes/routes";
import { useEffect } from "react";

function App() {
  useEffect(() => {
  console.log("SUPABASE URL:", import.meta.env.VITE_SUPABASE_URL);
}, []);

  return (
    <>
      <Routes/>
    </>
  )
}

export default App
