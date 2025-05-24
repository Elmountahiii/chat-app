import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import HomePage from "./routes/homePage";
import SignUpPage from "./routes/signUpPage";
import SignInPage from "./routes/signInPage";
import ChatPage from "./routes/chatPage";
import NotFoundPage from "./routes/notFoundPage";
import TestPage from "./routes/testPage";

type Props = {};

function App({}: Props) {
  return (
    <Router>
      <Toaster richColors={true} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </Router>
  );
}

export default App;
