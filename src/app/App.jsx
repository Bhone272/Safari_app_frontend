// src/app/App.jsx
import { AppRouter } from "./router/index.jsx";
import { QueryProvider } from "./providers/QueryProvider.jsx";
import { AuthInit } from "./providers/AuthInit.jsx";
import { UIProvider } from "./providers/UIProvider.jsx";

export default function App() {
  return (
    <QueryProvider>
      <AuthInit>
        <UIProvider>
          <AppRouter />
        </UIProvider>
      </AuthInit>
    </QueryProvider>
  );
}
