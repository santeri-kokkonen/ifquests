import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RadialBar, RadialBarChart, PolarAngleAxis } from "recharts";
import { ArrowRight, Droplets, Footprints, ShieldCheck, Truck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useMove } from "@/components/MoveProvider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/activity")({
  head: () => ({
    meta: [
      { title: "IF Quests — Home" },
      {
        name: "description",
        content:
          "Track your daily steps and earn ActiveCredits with IF Quests.",
      },
      { property: "og:title", content: "IF Quests — Home" },
      {
        property: "og:description",
        content:
          "Track your daily steps and earn ActiveCredits with IF Quests.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const TARGET = 10000;
const STEPS = 10500;

function useCountUp(to: number, ms = 1500) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setV(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, ms]);
  return v;
}

function StepRing({ earned }: { earned: boolean }) {
  const [mounted, setMounted] = useState(false);
  const count = useCountUp(STEPS);
  useEffect(() => {
    setMounted(true);
  }, []);
  const pct = Math.round((STEPS / TARGET) * 100);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[190px] [&_svg]:mx-auto">
      {mounted && (
        <RadialBarChart
          width={190}
          height={190}
          innerRadius="80%"
          outerRadius="100%"
          data={[{ value: Math.min(count, TARGET) }]}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, TARGET]} tick={false} />
          <RadialBar
            dataKey="value"
            cornerRadius={20}
            fill={earned ? "var(--success)" : "var(--primary)"}
            background={{ fill: "var(--card)" }}
            isAnimationActive={false}
          />
        </RadialBarChart>
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <Footprints
          className={`mb-1 h-5 w-5 ${earned ? "text-success" : "text-primary"}`}
          strokeWidth={1.5}
        />
        <span className="text-4xl font-light  tabular-nums">{count.toLocaleString("en-US")}</span>
        <span className="mt-1 text-xs text-muted-foreground">
          of {TARGET.toLocaleString("en-US")} steps
        </span>
        {earned ? (
          <span className="mt-2 rounded-full bg-success-soft px-3 py-1 text-[11px] font-semibold text-success">
            +50 ActiveCredits earned
          </span>
        ) : (
          <span className="mt-2 rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-primary">
            {pct}%
          </span>
        )}
      </div>
    </div>
  );
}

function Index() {
  const state = useMove();
  const goalMet = 10500 >= 10000;
  const { optIn, customer, daily, habits, earn, ready } = state;
  useEffect(() => {
    if (ready && goalMet && optIn && customer && daily < 50 && !habits.includes("steps")) earn("steps");
  }, [ready, goalMet, optIn, customer, daily, habits, earn]);
  return (
    <AppShell>
      <div className="mx-auto max-w-md">
        <section>
          <p className="eyebrow">Main quest · Today</p>
          <h1 className="mt-1 text-3xl font-light">Home</h1>
          <div className="mt-4 rounded-xl bg-secondary py-4">
            <StepRing earned={state.habits.includes("steps")} />
          </div>
          <Link
            to="/quests/moving"
            className="mt-4 flex items-center gap-4 rounded-xl bg-primary p-4 text-primary-foreground"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
              <Truck className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <span className="flex-1">
              <span className="block text-xs opacity-80">Active sidequest</span>
              <span className="block font-medium">Moving to a new rental</span>
              <span className="block text-xs opacity-80">
                {state.completed.length}/9 tasks · {state.total} MoveCredits
              </span>
            </span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <label className="mt-5 flex items-start gap-3">
            <Switch checked={state.optIn} onCheckedChange={state.setOptIn} />
            <span className="text-sm font-medium">
              Activity rewards
              <span className="mt-1 block text-xs font-normal text-muted-foreground">
                Credits are added automatically when you hit your step goal.
              </span>
            </span>
          </label>
          {!state.optIn && (
            <p className="mt-3 text-xs text-muted-foreground">
              Turn on activity rewards to start collecting credits automatically.
            </p>
          )}
        </section>
        <section className="mt-9 border-t pt-6">
          <h2 className="font-medium">More than a step count</h2>
          <div className="mt-4 space-y-3">
            {[
              { id: "annual-alarm", name: "Yearly smoke alarm test", icon: ShieldCheck, Truck },
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
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Daily cap: {state.daily}/50 · Yearly cap: {state.yearly}/10,000. Annual safety checks
            earn once per year. All activity is simulated; only a credit total would leave the
            device in production.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
