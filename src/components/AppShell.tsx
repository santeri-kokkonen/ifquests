import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, Compass, Shield, Gift, Coins } from "lucide-react";
import { useMove } from "./MoveProvider";
import { Button } from "./ui/button";
import type { ReactNode } from "react";
export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const state = useMove();
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-xl font-semibold italic text-primary-foreground">
              if…
            </span>
            <span className="text-xl font-medium">
              MoveReady
              <span className="ml-2 hidden text-xs font-normal text-muted-foreground sm:inline">
                by If
              </span>
            </span>
          </Link>
          {path !== "/insurance" && <Button variant="ghost" asChild className="gap-2">
            <Link to="/rewards">
              <Coins className="text-primary" />
              <span className="text-sm tabular-nums">
                {state.active} <span className="hidden sm:inline">ActiveCredits</span>
                <span className="sm:hidden">AC</span>
              </span>
            </Link>
          </Button>}
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 pb-28 pt-7 sm:px-8 sm:pt-10">{children}</main>
      <nav
        aria-label="Main navigation"
        className="fixed inset-x-0 bottom-0 z-30 border-t bg-card pb-[env(safe-area-inset-bottom)]"
      >
        <div className="mx-auto grid max-w-xl grid-cols-4 py-2">
          {(
            [
              { to: "/", label: "Home", icon: Activity },
              { to: "/quests", label: "Quests", icon: Compass },
              { to: "/rewards", label: "Rewards", icon: Gift },
              { to: "/insurance", label: "Insurance", icon: Shield },
            ] as const
          ).map(({ to, label, icon: Icon }) => (
            <Button
              key={to}
              asChild
              variant="ghost"
              className={`h-14 flex-col gap-1 text-xs ${path === to ? "text-primary" : "text-muted-foreground"}`}
            >
              <Link to={to} aria-current={path === to ? "page" : undefined}>
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
