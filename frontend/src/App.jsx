import AppRoutes from "./routes/AppRoutes";
import Dashboard from "./pages/dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Repositories from "./pages/Repositories";
import CreateRepository from "./pages/CreateRepository";
import RepositoryDetail from "./pages/RepositoryDetail";
import PullRequests from "./pages/PullRequests";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/repositories" element={<Repositories />} />

        <Route path="/repositories/create" element={<CreateRepository />} />

        <Route path="/repository/:id" element={<RepositoryDetail />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/repository/:id/pullrequests" element={<PullRequests />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
