import { BrowserRouter, Routes, Route } from "react-router-dom";

import Courtroom from "./pages/Courtroom";
import Scorecard from "./pages/Scorecard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Courtroom />}
        />

        <Route
          path="/scorecard"
          element={<Scorecard />}
        />

      </Routes>
    </BrowserRouter>
  );
}