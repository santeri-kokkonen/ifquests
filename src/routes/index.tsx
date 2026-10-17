import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RadialBar, RadialBarChart, PolarAngleAxis } from "recharts";
import { ArrowRight, Footprints } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useMove } from "@/components/MoveProvider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import moving from "@/assets/moving.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MoveReady by If — A better move" },
      {
        name: "description",
        content:
          "A moving companion for young renters: practical safety quests, a helping crew and separate everyday rewards.",
      },
      { property: "og:title", content: "MoveReady by If — A better move" },
      {
        property: "og:description",
        content:
          "A moving companion for young renters: practical safety quests, a helping crew and separate everyday rewards.",
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
  return (
    <AppShell>
      <div className="grid gap-8 md:grid-cols-[1fr_340px]">
        <section>
          <p className="eyebrow">A LITTLE HELP FOR YOUR NEXT CHAPTER</p>
          <h1 className="mt-2 text-4xl font-light leading-tight">
            MoveReady.
            <br />
            Life happens. We help.
          </h1>
          <img
            src={moving}
            alt="Friends helping move boxes into a new apartment"
            width={1280}
            height={768}
            className="mt-6 aspect-[5/3] w-full rounded-xl object-cover"
          />
          <div className="mt-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-light">Your new home starts here.</h2>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Protect your deposit. Bring your friends.
                <br />
                Make the move a little less moving.
              </p>
            </div>
          </div>
          <Button asChild className="mt-5 h-11">
            <Link to="/quests/moving">
              Explore move quests
              <ArrowRight />
            </Link>
          </Button>
          <div className="mt-7 grid grid-cols-3 gap-3 border-y py-5">
            {[
              ["10", "useful checks"],
              ["4", "room quests"],
              ["3", "move rewards"],
            ].map(([n, label]) => (
              <div key={label}>
                <p className="text-2xl font-light text-primary">{n}</p>
                <p className="mt-1 text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            Hackathon prototype · Sample policy, activity and partner services. Progress lasts for
            this session.
          </p>
        </section>
        <section>
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-light">Everyday wellbeing</h2>
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
            10,500 sample steps · Daily goal reached. Earn up to 50 ActiveCredits per day. Moving
            rewards never require exercise.
          </p>
          <Button
            className="mt-4 w-full h-11"
            disabled={!state.optIn || !state.customer || state.daily >= 50}
            onClick={() => state.earn("steps")}
          >
            {state.habits.includes("steps")
              ? "Daily goal claimed"
              : state.daily >= 50
                ? "Daily cap reached"
                : "Claim today’s +50 ActiveCredits"}
            <Footprints />
          </Button>
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
