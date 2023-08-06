import { Routes, Route, Navigate, useMatch } from "react-router-dom";
import { BlogPage } from "./pages/BlogPage/BlogPage.jsx";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage.jsx";
import { PostPage } from "./pages/PostPage/PostPage.jsx";
import { LoginPage } from "./pages/LoginPage/LoginPage.jsx";
import { RegistrationPage } from "./pages/RegistrationPage/RegistrationPage.jsx";
import { NotFound } from "./pages/NotFound/NotFound.jsx";
import { UsersPage } from "./pages/UsersPage/UsersPage.jsx";
import { MusicPage } from "./pages/MusicPage/MusicPage.jsx";
import { ArtistPage } from "./pages/ArtistPage/ArtistPage.jsx";
import { SettingsPage } from "./pages/SettingsPage/SettingsPage.jsx";
import { Chat } from "./pages/Chat/Chat.jsx";

export const useRoutes = (isAuthentificated) => {
  if (isAuthentificated) {
    return (
      <Routes>
        <Route path="/" element={<BlogPage />} />
        <Route path="/users" element={<UsersPage />} />
        {/* <Route path="/users/:filterType" element={<UsersPage />} /> */}
        <Route path="/music" element={<MusicPage />} />
        <Route path="/music/artist/:artistName" element={<ArtistPage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/post/:postId" element={<PostPage />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/settings/:userId" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};
