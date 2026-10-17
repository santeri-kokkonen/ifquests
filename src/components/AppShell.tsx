import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, Compass, Gift, Coins } from "lucide-react";
import { useMove } from "./MoveProvider";
import { Button } from "./ui/button";
import type { ReactNode } from "react";
import ifLogoAsset from "@/assets/if-logo.png.asset.json";
export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const state = useMove();
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <Link to="/" aria-label="Back to the If app" className="flex items-center gap-3">
            <img
              src={ifLogoAsset.url}
              alt="If"
              width={44}
              height={44}
              className="h-11 w-11"
            />
            <span className="text-xl font-medium">Quests</span>
          </Link>
          {path.startsWith("/quests/moving") || path === "/crew" || path === "/leakguard" ? (
            <Button variant="ghost" asChild className="gap-2">
              <Link to="/quests/moving" aria-label={`${state.total} MoveCredits`}>
                <Coins className="text-primary" />
                <span className="text-sm tabular-nums">
                  {state.total} <span className="hidden sm:inline">MoveCredits</span>
                  <span className="sm:hidden">MC</span>
                </span>
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" asChild className="gap-2">
              <Link to="/rewards" aria-label={`${state.active} ActiveCredits`}>
                <Coins className="text-primary" />
                <span className="text-sm tabular-nums">
                  {state.active} <span className="hidden sm:inline">ActiveCredits</span>
                  <span className="sm:hidden">AC</span>
                </span>
              </Link>
            </Button>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 pb-28 pt-7 sm:px-8 sm:pt-10">{children}</main>
      <nav
        aria-label="Main navigation"
        className="fixed inset-x-0 bottom-0 z-30 border-t bg-card pb-[env(safe-area-inset-bottom)]"
      >
        <div className="mx-auto grid max-w-xl grid-cols-3 py-2">
          {(
            [
              { to: "/activity", label: "Home", icon: Activity },
              { to: "/quests", label: "Sidequests", icon: Compass },
              { to: "/rewards", label: "Rewards", icon: Gift },
            ] as const
          ).map(({ to, label, icon: Icon }) => (
            <Button
              key={to}
              asChild
              variant="ghost"
              className={`h-14 flex-col gap-1 text-xs ${path === to || (to === "/quests" && path.startsWith("/quests/")) ? "text-primary" : "text-muted-foreground"}`}
            >
              <Link to={to} aria-current={path === to || (to === "/quests" && path.startsWith("/quests/")) ? "page" : undefined}>
                <Icon className="!h-5 !w-5" strokeWidth={1.5} />
                {label}
              </Link>
            </Button>
          ))}
        </div>
      </nav>
    </div>
  );
}
