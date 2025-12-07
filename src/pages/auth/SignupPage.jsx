import { Link } from "react-router-dom";
import Input from "../../shared/components/ui/Input.jsx";
import Button from "../../shared/components/ui/Button.jsx";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import SignupForm from "../../features/auth/SignupForm.jsx";

export default function SignupPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call signup API / auth store later
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-green-50 to-emerald-100">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-lg">
        {/* Left Section */}
        <div className="flex w-1/2 flex-col items-center justify-center bg-teal-200 p-12">
          <h1 className="mb-4 text-5xl font-bold text-gray-800">Welcome</h1>
          <p className="mb-8 text-lg text-gray-600">
            Simplify your Data Management!
          </p>
          <p className="text-sm text-gray-700">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-gray-900 hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>

        {/* Right Section */}
        <div className="flex w-full flex-col justify-center p-10 md:w-1/2">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-800">
            Sign Up
          </h2>

          {/* Social Buttons */}
          <div className="flex justify-center gap-4">
            <button className="flex items-center justify-center gap-2 rounded-full border border-gray-300 px-6 py-2 font-medium hover:bg-gray-50">
              <FcGoogle className="text-xl" />
              Join with Google
            </button>
            <button className="flex items-center justify-center gap-2 rounded-full border border-gray-300 px-4 py-2 font-medium hover:bg-gray-50">
              <FaFacebookF className="text-blue-600 text-lg" />
            </button>
          </div>

          <div className="my-6 flex items-center justify-center">
            <div className="h-px w-1/4 bg-gray-300"></div>
            <span className="mx-2 text-gray-500">or</span>
            <div className="h-px w-1/4 bg-gray-300"></div>
          </div>

          {/* Form */}
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
