import { useState } from "react";
import Input from "../../shared/components/ui/Input.jsx";
import Button from "../../shared/components/ui/Button.jsx";
import { useAuthStore } from "../../entities/auth/store.js";
import { signup } from "../../entities/auth/api.js";
import React from "react";

export default function SignupForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const setAuth = useAuthStore((s) => s.setAuth);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim();
    const password = form.password.trim();
    const confirmPassword = form.confirmPassword.trim();

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      alert("Please fill in First Name, Last Name, Email, Password, and Confirm Password.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await signup({
        firstName,
        lastName,
        email,
        password,
      });

      setAuth(result);
      // TODO: navigate to dashboard after signup if needed
    } catch (err) {
      console.error(err);
      alert("Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          required
          className="mt-1 border-b-2 border-emerald-300 bg-transparent px-1 py-2 text-gray-800 outline-none focus:border-emerald-500"
        />
        <Input
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          required
          className="mt-1 border-b-2 border-emerald-300 bg-transparent px-1 py-2 text-gray-800 outline-none focus:border-emerald-500"
        />
      </div>

      <Input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        className="mt-1 border-b-2 border-emerald-300 bg-transparent px-1 py-2 text-gray-800 outline-none focus:border-emerald-500"
      />

      <Input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
        className="mt-1 border-b-2 border-emerald-300 bg-transparent px-1 py-2 text-gray-800 outline-none focus:border-emerald-500"
      />

      <Input
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        value={form.confirmPassword}
        onChange={handleChange}
        required
        className="mt-1 border-b-2 border-emerald-300 bg-transparent px-1 py-2 text-gray-800 outline-none focus:border-emerald-500"
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 w-full rounded-full border border-gray-700 py-2 font-semibold text-gray-800 hover:bg-gray-100 disabled:opacity-60"
      >
        {isSubmitting ? "Creating Account..." : "Sign Up"}
      </Button>
    </form>
  );
}
