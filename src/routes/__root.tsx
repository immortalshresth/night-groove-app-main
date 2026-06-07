import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { PlayerProvider } from "@/components/player/PlayerProvider";
import { Sidebar } from "@/components/Sidebar";
import { Player } from "@/components/Player";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient-neon">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-gradient-neon px-4 py-2 text-sm font-medium text-background transition-transform hover:scale-105"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Neonwave — Synthwave Music Streaming" },
      { name: "description", content: "Stream synthwave & retro electronic music in a glowing neon interface." },
      { name: "author", content: "Neonwave" },
      { property: "og:title", content: "Neonwave — Synthwave Music Streaming" },
      { property: "og:description", content: "Stream synthwave & retro electronic music in a glowing neon interface." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <PlayerProvider>
      <div className="flex min-h-screen w-full flex-col">
        <div className="flex flex-1" style={{ paddingBottom: "5.5rem" }}>
          <Sidebar />
          <main className="flex-1 overflow-x-hidden">
            <Outlet />
          </main>
        </div>
        <Player />
      </div>
    </PlayerProvider>
  );
}
