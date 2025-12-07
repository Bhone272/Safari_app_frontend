// Placeholder; replace with real API calls later.

export async function login(credentials) {
  console.log("login() called with", credentials);
  // simulate success
  return {
    user: { id: 1, name: "Demo User", email: credentials.email },
    token: "demo-token",
  };
}


export async function signup(payload) {
  console.log("signup() called with", payload);
  // simulate success – in real app, call your backend here
  return {
    user: {
      id: 2,
      name: `${payload.firstName} ${payload.lastName}`.trim() || payload.email,
      email: payload.email,
    },
    token: "demo-signup-token",
  };
}
