import { useState } from "react";
import { ArrowRight, Home as HomeIcon, Pizza } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

const TASKS = [
  "Photograph under the kitchen sink",
  "Test the smoke alarms",
  "Document existing floor scratches",
];

export function LifeEventQuest() {
  const [done, setDone] = useState<boolean[]>(TASKS.map(() => false));
  const count = done.filter(Boolean).length;
  const pct = Math.round((count / TASKS.length) * 100);

  return (
    <section className="mt-10">
      <h2 className="text-xl font-light">Sidequests</h2>
      <div className="mt-4 rounded-xl border bg-card p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary">
            <HomeIcon className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-medium">New home checkup</p>
            <p className="text-sm text-muted-foreground">3 safety checks · Example pizza reward</p>
          </div>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <button className="mt-5 inline-flex w-full items-center justify-between gap-3 rounded-lg bg-primary px-5 py-3.5 text-left font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              <span>Open your move-in safety checklist</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full bg-card sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="text-2xl font-light">New apartment checkup</SheetTitle>
              <SheetDescription>Explore three move-in safety checks. No real reward is ordered in this demo.</SheetDescription>
            </SheetHeader>
            <div className="px-4">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold text-primary">
                  {count}/{TASKS.length}
                </span>
              </div>
              <Progress value={pct} className="h-2 bg-secondary" />
              <ul className="mt-6 space-y-3">
                {TASKS.map((t, i) => (
                  <li key={t}>
                    <label className="flex cursor-pointer items-center gap-4 rounded-xl border p-4">
                      <Checkbox
                        checked={done[i] ?? false}
                        onCheckedChange={(v) =>
                          setDone((d) => d.map((x, j) => (j === i ? v === true : x)))
                        }
                        className="h-5 w-5"
                      />
                      <span className={done[i] ? "text-muted-foreground line-through" : ""}>
                        {i + 1}. {t}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
              {count === TASKS.length && (
                <div className="mt-6 flex items-center gap-3 rounded-xl bg-accent p-4">
                  <Pizza className="h-5 w-5 text-primary" strokeWidth={1.5} />
                  <p className="font-semibold">Checklist complete. Example pizza milestone reached.</p>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </section>
  );
}
