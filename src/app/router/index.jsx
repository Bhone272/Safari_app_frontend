import { Routes, Route } from "react-router-dom";
import RootLayout from "../layout/RootLayout.jsx";
import AuthLayout from "../layout/AuthLayout.jsx";
import MinimalLayout from "../layout/MinimalLayout.jsx";
import { PrivateRoute } from "./PrivateRoute.jsx";
import { PublicRoute } from "./PublicRoute.jsx";

import HomePage from "../../pages/home/HomePage.jsx";
import ImportPage from "../../pages/import/ImportPage.jsx";
import ExportPage from "../../pages/export/ExportPage.jsx";

import LoginPage from "../../pages/auth/LoginPage.jsx";
import SignupPage from "../../pages/auth/SignupPage.jsx";
import ForgotPasswordPage from "../../pages/auth/ForgotPasswordPage.jsx";

import NotFoundPage from "../../pages/system/NotFoundPage.jsx";
import UnauthorizedPage from "../../pages/system/UnauthorizedPage.jsx";
import ProfilePage from "../../pages/account/ProfilePage.jsx";

export function AppRouter() {
  return (
    <Routes>
      {/* Public Auth pages */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />
      </Route>

      {/* Main app (currently no auth required, but wired) */}
      <Route
        element={
          <RootLayout />
          // To protect later:
          // <PrivateRoute><RootLayout /></PrivateRoute>
        }
      >
        <Route path="/" element={<HomePage />} />
        <Route path="/import" element={<ImportPage />} />
        <Route path="/export" element={<ExportPage />} />
        <Route path="/account/profile" element={<ProfilePage />} />
      </Route>

      {/* System */}
      <Route element={<MinimalLayout />}>
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
