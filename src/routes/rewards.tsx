import { createFileRoute } from "@tanstack/react-router";
import {
  Truck,
  Pizza,
  Droplets,
  Check,
  Sparkles,
  Footprints,
  Heart,
  ShieldCheck,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useMove } from "@/components/MoveProvider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { moveRewards, canClaimMove, CLEANING_COST } from "@/lib/move-rules";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/rewards")({
  head: () =>
    pageHead("Your rewards", "Practical move rewards and independent everyday activity credits."),
  component: Rewards,
});
function Rewards() {
  const state = useMove();
  const icons = { trailer: Truck, pizza: Pizza, "leak-sensor": Droplets };
  return (
    <AppShell>
      <p className="eyebrow">A LITTLE THANK-YOU GOES A LONG WAY</p>
      <h1 className="mt-2 text-4xl font-light">Good moves. Real rewards.</h1>
      <p className="mt-3 text-muted-foreground">Two balances. Different purposes. Never mixed.</p>
      <section className="mt-8 border-t pt-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-light">Move rewards</h2>
          <span className="font-medium text-primary">{state.total} MoveCredits</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Earn milestone rewards through safety quests. Each unlock is yours once; credits track
          progress, not spending.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {moveRewards.map((r) => {
            const Icon = icons[r.id];
            const claimed = state.claimed.includes(r.id);
            return (
              <article key={r.id} className="flex flex-col rounded-xl border bg-card p-5">
                <div className="flex items-center justify-between">
                  <Icon className="h-8 w-8 text-primary" strokeWidth={1.2} />
                  <span className="text-xs text-muted-foreground">{r.cost} MoveCredits</span>
                </div>
                <h3 className="mt-5 text-lg font-medium">{r.name}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{r.detail}</p>
                <Progress className="mt-5" value={Math.min((state.total / r.cost) * 100, 100)} />
                <Button
                  className="mt-4 w-full"
                  disabled={claimed || !canClaimMove(r.id, state.completed, state.claimed)}
                  onClick={() => state.claim(r.id)}
                >
                  {claimed ? (
                    <>
                      <Check />
                      Claimed in demo
                    </>
                  ) : state.total >= r.cost ? (
                    "Claim reward"
                  ) : (
                    `${r.cost - state.total} credits to unlock`
                  )}
                </Button>
                {claimed && (
                  <p role="status" className="mt-3 text-xs text-success">
                    {r.id === "leak-sensor"
                      ? "Demo delivery reserved. No sensor is being shipped."
                      : `Demo voucher: MOVE-${r.id.toUpperCase()} · No real booking or order.`}
                  </p>
                )}
                {r.id === "leak-sensor" && claimed && (
                  <Button
                    variant="outline"
                    className="mt-3 whitespace-normal h-auto"
                    disabled={state.sensorArrived}
                    onClick={() => state.setSensorArrived(true)}
                  >
                    {state.sensorArrived ? "Demo sensor delivered" : "Simulate sensor delivery"}
                  </Button>
                )}
              </article>
            );
          })}
        </div>
      </section>
      <section className="mt-9 border-t pt-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-light">Everyday rewards</h2>
          <span className="font-medium text-primary">{state.active} ActiveCredits</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Build a balance before the move. Put it towards the old flat’s final clean.
        </p>
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          <article className="rounded-xl border bg-card p-5">
            <Sparkles className="h-8 w-8 text-primary" strokeWidth={1.2} />
            <h3 className="mt-4 text-lg font-medium">Old-flat final cleaning</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              400 ActiveCredits · Illustrative demo price, partner and service scope to be agreed.
            </p>
            <Button
              className="mt-5"
              disabled={state.cleaning || state.active < CLEANING_COST}
              onClick={state.redeemCleaning}
            >
              {state.cleaning ? "Cleaning reserved in demo" : "Reserve final cleaning"}
            </Button>
            {state.cleaning && (
              <p role="status" className="mt-3 text-sm text-success">
                400 ActiveCredits used. No real cleaning is booked.
              </p>
            )}
          </article>
          <div>
            <h3 className="font-medium">More than a step count</h3>
            <div className="mt-4 space-y-3">
              {[
                { id: "activity", name: "Log any activity", icon: Heart },
                { id: "annual-alarm", name: "Yearly smoke alarm test", icon: ShieldCheck },
                { id: "battery", name: "Sensor battery check", icon: Droplets },
              ].map((h) => (
                <div className="flex items-center gap-3 border-b pb-3" key={h.id}>
                  <h.icon className="h-5 w-5 text-primary" />
                  <span className="flex-1 text-sm">{h.name}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      !state.optIn ||
                      !state.customer ||
                      state.daily >= 50 ||
                      state.habits.includes(h.id)
                    }
                    onClick={() => state.earn(h.id)}
                  >
                    {state.habits.includes(h.id) ? "Claimed" : "+50"}
                  </Button>
                </div>
              ))}
            </div>
            <label className="mt-4 flex items-center gap-3 text-sm">
              <Switch checked={state.optIn} onCheckedChange={state.setOptIn} />
              Opt in to ActiveCredits
            </label>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Daily cap: {state.daily}/50 · Yearly cap: {state.yearly}/10,000. Annual safety checks
              earn once per year. All activity is simulated; only a credit total would leave the
              device in production.
            </p>
            <label className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
              <Switch checked={state.customer} onCheckedChange={state.setCustomer} />
              Active If customer (demo eligibility)
            </label>
            <p className="mt-2 text-xs text-muted-foreground">
              Credits only accrue while you are a customer. No currency conversion.
            </p>
          </div>
        </div>
      </section>
      <Button asChild variant="link" className="mt-5 px-0">
        <Link to="/quests/moving">
          <Footprints />
          Back to move quests
        </Link>
      </Button>
    </AppShell>
  );
}
