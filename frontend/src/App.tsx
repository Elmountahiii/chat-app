import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import HomePage from "./routes/homePage";
import SignUpPage from "./routes/signUpPage";
import SignInPage from "./routes/signInPage";

type Props = {};

function App({}: Props) {
  return (
    <Router>
      <Toaster richColors={true} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
      </Routes>
    </Router>
  );
}

export default App;
