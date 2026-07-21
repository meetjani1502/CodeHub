import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/dashboard";

import CreateRepository from "../pages/CreateRepository";
import Repositories from "../pages/Repositories";
import RepositoryPage from "../pages/RepositoryPage";
import FilePage from "../pages/FilePage";
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/repositories"
          element={
            <ProtectedRoute>
              <Repositories />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-repository"
          element={
            <ProtectedRoute>
              <CreateRepository />
            </ProtectedRoute>
          }
        />

        <Route path="/repository/:id" element={<RepositoryPage />} />

        <Route path="/repository/:repoId/file/:fileId" element={<FilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
