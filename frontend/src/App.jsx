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
import Branches from "./pages/Branches";
import Commits from "./pages/Commits";
import Settings from "./pages/Settings";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import FollowList from "./pages/FollowList";
import Issues from "./pages/Issues";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/repositories" element={<Repositories />} />

        <Route path="/create-repository" element={<CreateRepository />} />

        <Route path="/repository/:id" element={<RepositoryDetail />} />

        <Route path="/branches" element={<Branches />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/pullrequests" element={<PullRequests />} />

        <Route
          path="/repository/:id/pullrequests"
          element={<RepositoryDetail />}
        />
        <Route path="/commits" element={<Commits />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/profile/followers" element={<FollowList />} />
        <Route path="/profile/following" element={<FollowList />} />
        <Route path="/profile/:id/followers" element={<FollowList />} />
        <Route path="/profile/:id/following" element={<FollowList />} />
        <Route path="/issues" element={<Issues />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
