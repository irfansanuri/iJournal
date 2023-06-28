import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; //Link

import Header from "./components/includes/Header";
import Footer from "./components/includes/Footer";

import HomePage from "./components/HomePage";
import Login from "./components/Login";
import Register from "./components/Register";
import NotFound from "./components/NotFound";

import RequireAuth from "./components/RequireAuth";

import FieldList from "./components/roles/panels/FieldList";
import UserList from "./components/roles/Admin/UserList";
import ArticleList from "./components/roles/Admin/ArticleList";
import UploadArticle from "./components/roles/Author/UploadArticle";
import UploadArticleAdmin from "./components/roles/Admin/UploadArticleAdmin";
import ArticlesUnderReview from "./components/roles/panels/ArticlesUnderReview";
import AssignArticle from "./components/roles/General Editor/AssignArticle";
import ManageEditors from "./components/roles/General Editor/ManageEditors";
import ManageArticlesEditor from "./components/roles/Editor/ManageArticlesEditor";
import ManageArticlesReviewer from "./components/roles/Reviewer/ManageArticlesReviewer";
import Browse from "./components/Browse";

export const UserContext = createContext([]);

function App() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const logOutCallback = async () => {
    await fetch("http://localhost:6969/logout", {
      method: "POST",
      credentials: "include" // Needed to include the cookie
    });
    // Clear user from context
    setUser({});
    // Navigate back to startpage
    window.location.href = "/";
  };

  // First thing, check if a refreshtoken exist
  useEffect(() => {
    async function checkRefreshToken() {
      const result = await (
        await fetch("http://localhost:6969/refresh_token", {
          method: "POST",
          credentials: "include", // Needed to include the cookie
          headers: {
            "Content-Type": "application/json"
          }
        })
      ).json();
      setUser({
        accesstoken: result.accesstoken
      });

      setLoading(false);
    }
    checkRefreshToken();
  }, []);

  if (loading) return <div>Loading ...</div>;

  return (
    <UserContext.Provider value={[user, setUser]}>
      <div className="whole shadow-6">
        <BrowserRouter>
          <Header logOut={logOutCallback} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/browse" element={<Browse />} />

            <Route element={<RequireAuth roleCode={["6901", "6902"]} />}>
              <Route path="/managefields" element={<FieldList />} />
            </Route>

            <Route
              element={<RequireAuth roleCode={["6903", "6904", "6905"]} />}
            >
              <Route path="/underreview" element={<ArticlesUnderReview />} />
            </Route>

            <Route element={<RequireAuth roleCode={["6901"]} />}>
              <Route path="/manageusers" element={<UserList />} />
              <Route path="/managearticles" element={<ArticleList />} />
              <Route
                path="/adminpublisharticle"
                element={<UploadArticleAdmin />}
              />
            </Route>

            <Route element={<RequireAuth roleCode={["6902"]} />}>
              <Route path="/assignarticles" element={<AssignArticle />} />
              <Route path="/managefields" element={<FieldList />} />
              <Route path="/manageeditors" element={<ManageEditors />} />
            </Route>

            <Route element={<RequireAuth roleCode={["6903"]} />}>
              <Route
                path="/managearticleseditor"
                element={<ManageArticlesEditor />}
              />
            </Route>

            <Route element={<RequireAuth roleCode={["6904"]} />}>
              <Route
                path="/managearticlesreview"
                element={<ManageArticlesReviewer />}
              />
            </Route>
            <Route path="/underreview" element={<ArticlesUnderReview />} />
            <Route element={<RequireAuth roleCode={["6905"]} />}>
              <Route path="/publisharticle" element={<UploadArticle />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </div>
    </UserContext.Provider>
  );
}

export default App;
