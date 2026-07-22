import Dashboard from "./pages/dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Repositories from "./pages/Repositories";
import CreateRepository from "./pages/CreateRepository";
import RepositoryDetail from "./pages/RepositoryDetail";
import PullRequests from "./pages/PullRequests";
import Branches from "./pages/Branches";
import Commits from "./pages/Commits";
import Settings from "./pages/Settings";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import FollowList from "./pages/FollowList";
import Issues from "./pages/Issues";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
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

        <Route
          path="/repository/:id"
          element={
            <ProtectedRoute>
              <RepositoryDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/repository/:id/pullrequests"
          element={
            <ProtectedRoute>
              <RepositoryDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/branches"
          element={
            <ProtectedRoute>
              <Branches />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pullrequests"
          element={
            <ProtectedRoute>
              <PullRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/commits"
          element={
            <ProtectedRoute>
              <Commits />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/followers"
          element={
            <ProtectedRoute>
              <FollowList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/following"
          element={
            <ProtectedRoute>
              <FollowList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:id/followers"
          element={
            <ProtectedRoute>
              <FollowList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:id/following"
          element={
            <ProtectedRoute>
              <FollowList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/issues"
          element={
            <ProtectedRoute>
              <Issues />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
