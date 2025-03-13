import Providers from "./Providers";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/app-routes";

function App() {

  return (
    <Providers>
        <Toaster />
        <AppRoutes />
    </Providers>
  );
}

export default App;
