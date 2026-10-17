import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Baby, Car, Home, Package, Lock } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useMove } from "@/components/MoveProvider";
import { Progress } from "@/components/ui/progress";
import { pageHead } from "@/lib/page-head";

const upcoming = [
  { name: "Buying a car", text: "Safe-driving checks, winter tyres and roadside readiness.", icon: Car },
  { name: "Having a baby", text: "Childproofing, family cover check and a calmer first year.", icon: Baby },
  { name: "Buying your own home", text: "Inspection photos, moisture checks and moving-in essentials.", icon: Home },
];

export const Route = createFileRoute("/quests/")({
  head: () =>
    pageHead("Sidequests", "Your main quest is your daily steps. Sidequests are life's big changes."),
  component: QuestsHub,
});

function QuestsHub() {
  const state = useMove();
  return (
    <AppShell>
      <p className="eyebrow">SIDEQUESTS</p>
      <h1 className="mt-2 text-4xl font-light">Your main quest? Daily steps.</h1>
      <p className="mt-3 text-muted-foreground">
        Build an active everyday routine with your daily step goal. Explore practical safety
        checks for life’s big changes, each with its own sidequest and rewards.
      </p>

      <h2 className="mt-8 text-xl font-light">Active</h2>
      <Link
        to="/quests/moving"
        className="mt-4 block rounded-xl border bg-card p-5 transition-colors hover:border-primary"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-primary">
            <Package className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium">Moving to a new rental</p>
            <p className="text-sm text-muted-foreground">
              {state.completed.length}/9 tasks · crew pizza, leak sensor
            </p>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-primary" />
        </div>
        <Progress className="mt-4" value={(state.total / 1000) * 100} />
      </Link>

      <h2 className="mt-8 text-xl font-light">Future sidequests</h2>
      <p className="mt-2 text-sm text-muted-foreground">Ideas for future life changes. These sidequests are not available in this demo.</p>
      <div className="mt-4 space-y-3">
        {upcoming.map(({ name, text, icon: Icon }) => (
          <div key={name} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-dashed bg-secondary/50 p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-card text-muted-foreground">
              <Icon className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <p className="font-medium">{name}</p>
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
            <Lock className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
          </div>
        ))}
      </div>
    </AppShell>
  );
}
