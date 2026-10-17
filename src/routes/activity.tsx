import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RadialBar, RadialBarChart, PolarAngleAxis } from "recharts";
import { ArrowRight, Footprints } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useMove } from "@/components/MoveProvider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/activity")({
  head: () => ({
    meta: [
      { title: "IF Quests — Your daily activity" },
      {
        name: "description",
        content:
          "Track your daily steps and earn ActiveCredits with IF Quests.",
      },
      { property: "og:title", content: "IF Quests — Your daily activity" },
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

function StepRing() {
  const [mounted, setMounted] = useState(false);
  const count = useCountUp(STEPS);
  useEffect(() => {
    setMounted(true);
  }, []);
  const pct = Math.round((STEPS / TARGET) * 100);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[300px] [&_svg]:mx-auto">
      {mounted && (
        <RadialBarChart
          width={300}
          height={300}
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
            fill="var(--primary)"
            background={{ fill: "var(--card)" }}
            isAnimationActive={false}
          />
        </RadialBarChart>
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <Footprints className="mb-2 h-6 w-6 text-primary" strokeWidth={1.5} />
        <span className="text-5xl font-light  tabular-nums">{count.toLocaleString("en-US")}</span>
        <span className="mt-1 text-sm text-muted-foreground">
          of {TARGET.toLocaleString("en-US")} steps
        </span>
        <span className="mt-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
          {pct}%
        </span>
      </div>
    </div>
  );
}

function Index() {
  const state = useMove();
  const goalMet = 10500 >= 10000;
  const { optIn, customer, daily, habits, earn } = state;
  useEffect(() => {
    if (goalMet && optIn && customer && daily < 50 && !habits.includes("steps")) earn("steps");
  }, [goalMet, optIn, customer, daily, habits, earn]);
  return (
    <AppShell>
      <div className="mx-auto max-w-md">
        <section>
          <div className="flex items-baseline justify-between">
            <h1 className="text-3xl font-light">Your daily activity</h1>
            <span className="text-xs text-primary">ActiveCredits</span>
          </div>
          <div className="mt-4 rounded-xl bg-secondary py-5">
            <StepRing />
          </div>
          <div className="mt-4 flex items-center justify-between border-b pb-4">
            <span className="text-sm">Your balance</span>
            <span className="font-medium text-primary">{state.active} ActiveCredits</span>
          </div>
          <label className="mt-5 flex items-start gap-3">
            <Switch checked={state.optIn} onCheckedChange={state.setOptIn} />
            <span className="text-sm font-medium">
              Activity rewards
              <span className="mt-1 block text-xs font-normal text-muted-foreground">
                Opt-in. No raw activity data shared in production.
              </span>
            </span>
          </label>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            10,500 sample steps · Daily goal reached. Credits are added automatically when you hit
            your step goal — up to 50 ActiveCredits per day.
          </p>
          {!state.optIn && (
            <p className="mt-3 text-xs text-muted-foreground">
              Turn on activity rewards to start collecting credits automatically.
            </p>
          )}
          <Button asChild variant="link" className="mt-2 w-full">
            <Link to="/rewards">
              Prefer a different way to earn?
              <ArrowRight />
            </Link>
          </Button>
          {state.habits.includes("steps") && (
            <p role="status" className="mt-2 rounded-lg bg-success-soft p-3 text-sm text-success">
              Daily goal crushed! +50 ActiveCredits earned.
            </p>
          )}
        </section>
      </div>
    </AppShell>
  );
}
