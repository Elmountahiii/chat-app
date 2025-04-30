import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./routes/homePage";
import AuthPage from "./routes/authPage";

type Props = {};

function App({}: Props) {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}

export default App;
