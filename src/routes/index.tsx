import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RadialBar, RadialBarChart, PolarAngleAxis } from "recharts";
import { Home, Compass, Shield, Coins, PartyPopper, ArrowRight, Footprints } from "lucide-react";
import { LifeEventQuest } from "@/components/LifeEventQuest";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "If Rewards — Your daily steps" },
      { name: "description", content: "See today's steps, your IfCredits balance and daily goal progress." },
      { property: "og:title", content: "If Rewards — Your daily steps" },
      { property: "og:description", content: "See today's steps, your IfCredits balance and daily goal progress." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const TARGET = 10000;
const STEPS = 10500;

type Tab = "home" | "quests" | "insurance";

function useCountUp(to: number, ms = 1500) {
  const [v, setV] = useState(0);
  useEffect(() => {
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
        <span className="text-5xl font-light tracking-tight tabular-nums">
          {count.toLocaleString("en-US")}
        </span>
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
  const [tab, setTab] = useState<Tab>("home");

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        <header className="flex items-center justify-between bg-card px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="font-serif text-lg italic font-semibold">if…</span>
            </div>
            <span className="text-lg font-medium">Rewards</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-secondary px-3 py-2">
            <Coins className="h-4 w-4 text-primary" strokeWidth={1.5} />
            <span className="text-sm font-semibold">IfCredits: 450</span>
          </div>
        </header>

        <main className="flex-1 px-6 pb-28 pt-8">
          {tab === "home" ? (
            <>
              <p className="text-sm text-muted-foreground">Saturday, 17 October</p>
              <h1 className="mt-1 text-3xl font-light leading-tight">Today's steps</h1>

              <section className="mt-8 rounded-xl bg-secondary p-6">
                <StepRing />
              </section>

              <div className="mt-6 flex items-start gap-3 rounded-xl bg-accent p-4">
                <PartyPopper className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={1.5} />
                <p className="leading-relaxed">
                  <span className="font-semibold">Daily Goal Crushed!</span> +50 IfCredits earned.
                </p>
              </div>

              <button
                onClick={() => setTab("quests")}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Explore quests <ArrowRight className="h-4 w-4" />
              </button>
            </>
          ) : tab === "quests" ? (
            <div>
              <h1 className="text-3xl font-light">Quests</h1>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Complete quests to earn IfCredits.
              </p>
              <LifeEventQuest />
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-light">Insurance</h1>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Use your IfCredits towards your If insurance — coming soon.
              </p>
            </div>
          )}
        </main>

        <nav className="fixed inset-x-0 bottom-0 border-t bg-card">
          <div className="mx-auto grid max-w-md grid-cols-3 py-2">
            {([
              ["home", "Home", Home],
              ["quests", "Quests", Compass],
              ["insurance", "Insurance", Shield],
            ] as const).map(([id, label, Icon]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex flex-col items-center gap-1 py-2 text-xs ${
                  tab === id ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-6 w-6" strokeWidth={1.25} />
                {label}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
