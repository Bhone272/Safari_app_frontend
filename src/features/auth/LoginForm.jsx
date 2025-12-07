import { useState } from "react";
import Input from "../../shared/components/ui/Input.jsx";
import Button from "../../shared/components/ui/Button.jsx";
import { login } from "../../entities/auth/api.js";
import { useAuthStore } from "../../entities/auth/store.js";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setAuth = useAuthStore((s) => s.setAuth);

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await login({ email, password });
    setAuth(result);
  };

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 p-6">
      <h2 className="text-2xl font-semibold mb-2">Log in</h2>
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit" className="mt-2">
        Log in
      </Button>
    </form>
  );
}
