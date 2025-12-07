import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

export default function LoginPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: hook up real auth
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-green-50 to-emerald-100">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-lg">
        {/* Left Section */}
        <div className="hidden w-1/2 flex-col items-center justify-center bg-gradient-to-t  bg-[url('https://www.transparenttextures.com/patterns/symphony.png')] bg-teal-200 p-12 md:flex">
          <h1 className="mb-4 text-5xl font-bold text-gray-800">Welcome</h1>
          <p className=" mt-4 mb-8 text-lg text-gray-600">
            Simplify your Data Management!
          </p>
          <p className="text-sm mt-8 text-gray-700">
            Create your Account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-gray-900 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>

        {/* Right Section */}
        <div className="flex w-full flex-col justify-center p-10 md:w-1/2">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-800">
            Log in
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
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="mt-1 w-full border-b-2 border-emerald-300 bg-transparent px-1 py-2 text-gray-800 outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="mt-1 w-full border-b-2 border-emerald-300 bg-transparent px-1 py-2 text-gray-800 outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="mt-4 w-full rounded-full border border-gray-700 py-2 font-semibold text-gray-800 hover:bg-gray-100"
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
