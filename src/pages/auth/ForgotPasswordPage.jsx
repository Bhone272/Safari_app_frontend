// src/pages/auth/ForgotPasswordPage.jsx
import { Link } from "react-router-dom";
import Input from "../../shared/components/ui/Input.jsx";
import Button from "../../shared/components/ui/Button.jsx";

export default function ForgotPasswordPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: integrate with backend:
    // 1) read email
    // 2) call "send reset link" API
  };

  return (
    <div className="min-h-screen bg-[#f5faf9]">
      {/* Top brand bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center">
          <div className="font-semibold text-xl tracking-[0.25em]">
            SAFARI
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-6xl mx-auto mt-4">
        <div className="relative bg-gradient-to-r from-emerald-100 to-emerald-300 min-h-[420px] flex items-stretch">
          {/* Left welcome / info panel */}
          <div className="w-full md:w-1/2 bg-white/70 backdrop-blur-sm flex items-center">
            <div className="px-10 py-16">
              <h1 className="text-5xl font-semibold mb-6">Welcome</h1>
              <p className="text-xl mb-6">
                Simplify your Data Managment!
              </p>
              <p className="text-sm text-gray-700 mb-6">
                Forgot your password? Enter your email on the right side and
                we&apos;ll help you get back into your account.
              </p>
              <p className="text-sm">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="font-semibold underline hover:text-emerald-700"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>

          {/* Right reset form card */}
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <div className="bg-white w-full max-w-md mx-6 my-10 px-10 py-10 shadow-xl">
              <h2 className="text-2xl font-semibold text-center mb-2">
                Forgot Password
              </h2>
              <p className="text-xs text-gray-500 text-center mb-6">
                Enter the email associated with your account and we&apos;ll
                send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                <div>
                  <label className="block mb-1">Email</label>
                  <Input
                    type="email"
                    name="email"
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <div className="mt-6 flex justify-center">
                  <Button
                    type="submit"
                    className="rounded-full px-8 py-2 border border-gray-800 hover:bg-gray-900 hover:text-white"
                  >
                    Send reset link
                  </Button>
                </div>
              </form>

              <div className="mt-6 text-center text-xs text-gray-600">
                Back to{" "}
                <Link
                  to="/login"
                  className="font-semibold underline hover:text-emerald-700"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
