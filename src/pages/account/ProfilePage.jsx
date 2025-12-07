// src/pages/account/ProfilePage.jsx
import PageHeader from "../../shared/components/layout/PageHeader";

/**
 * Tries a few common places to get the signed-in user.
 * - If you already have an auth store (e.g., useAuthStore), just swap the getter.
 */
function useCurrentUser() {
  // If you have a Zustand auth store, uncomment and adjust:
  // const user = useAuthStore((s) => s.user);

  let user = null;

  // 1) Try localStorage keys your project might use
  try {
    user =
      JSON.parse(localStorage.getItem("auth_user")) ||
      JSON.parse(localStorage.getItem("current_user")) ||
      JSON.parse(localStorage.getItem("user")) ||
      null;
  } catch (_) {
    user = null;
  }

  // 2) Fallback demo so the page still renders nicely
  if (!user) {
    return {
      name: "User",
      email: "user@example.com",
    };
  }
  return {
    name: user.name || user.fullName || user.username || "User",
    email: user.email || "user@example.com",
  };
}

function initialsFrom(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");
}

export default function ProfilePage() {
  const { name, email } = useCurrentUser();
  const initials = initialsFrom(name);

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Profile" />

      {/* Card */}
      <section className="bg-white border rounded-2xl shadow-sm p-6 md:p-8">
        {/* Header row */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="h-16 w-16 md:h-20 md:w-20 rounded-full border flex items-center justify-center text-xl md:text-2xl font-semibold bg-gray-50">
            {initials || "U"}
          </div>
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-semibold leading-tight">{name}</h2>
            <p className="text-gray-500">{email}</p>
          </div>
          {/* If you later add edit profile, wire this button */}
          {/* <Button onClick={openEdit}>Edit</Button> */}
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-gray-200" />

        {/* Details grid */}
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-xl p-4">
            <dt className="text-xs uppercase tracking-wide text-gray-500">Name</dt>
            <dd className="mt-1 text-sm md:text-base">{name}</dd>
          </div>

          <div className="border rounded-xl p-4">
            <dt className="text-xs uppercase tracking-wide text-gray-500">Email</dt>
            <dd className="mt-1 text-sm md:text-base">{email}</dd>
          </div>

          {/* Keep password out intentionally (design space reserved if you add change-password route) */}
          {/* <div className="border rounded-xl p-4">
              <dt className="text-xs uppercase tracking-wide text-gray-500">Password</dt>
              <dd className="mt-1 text-sm text-gray-400">Hidden</dd>
            </div> */}
        </dl>

        {/* Helper note */}
        <p className="mt-6 text-sm text-gray-500">
          Want to update your info? Add an “Edit Profile” action and I’ll hook it to your backend later.
        </p>
      </section>
    </div>
  );
}
