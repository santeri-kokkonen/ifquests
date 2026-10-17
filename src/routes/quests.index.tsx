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
    pageHead("Life quests", "Quests for life's big changes: moving now, with more on the way."),
  component: QuestsHub,
});

function QuestsHub() {
  const state = useMove();
  return (
    <AppShell>
      <p className="eyebrow">LIFE QUESTS</p>
      <h1 className="mt-2 text-4xl font-light">Big life changes, made safer.</h1>
      <p className="mt-3 text-muted-foreground">Pick the chapter you're in. Each one has its own quests and rewards.</p>

      <h2 className="mt-8 text-xl font-light">Active</h2>
      <Link
        to="/quests/moving"
        className="mt-4 block rounded-xl border bg-card p-5 transition-colors hover:border-primary"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-primary">
            <Package className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <p className="font-medium">Moving to a new rental</p>
            <p className="text-sm text-muted-foreground">
              {state.completed.length}/10 tasks · trailer hour, crew pizza, leak sensor
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-primary" />
        </div>
        <Progress className="mt-4" value={(state.total / 1100) * 100} />
      </Link>

      <h2 className="mt-8 text-xl font-light">Coming soon</h2>
      <div className="mt-4 space-y-3">
        {upcoming.map(({ name, text, icon: Icon }) => (
          <div key={name} className="flex items-center gap-3 rounded-xl border border-dashed bg-secondary/50 p-5 opacity-80">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-card text-muted-foreground">
              <Icon className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <p className="font-medium">{name}</p>
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
            <Lock className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          </div>
        ))}
      </div>
    </AppShell>
  );
}
