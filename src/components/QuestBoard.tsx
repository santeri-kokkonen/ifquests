import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Confetti } from "./Confetti";
import {
  Bath,
  CookingPot,
  DoorOpen,
  Package,
  ArrowRight,
  Check,
  Camera,
  Users,
  ShieldCheck,
  Droplets,
} from "lucide-react";
import { rooms, tasks, coverageResult, type Room } from "@/lib/move-rules";
import { useMove } from "./MoveProvider";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Progress } from "./ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Input } from "./ui/input";
import { MoveRewards } from "./MoveRewards";
import valve from "@/assets/valve.jpg";
const icons = { before: Package, kitchen: CookingPot, bathroom: Bath, entry: DoorOpen };
export function QuestBoard() {
  const state = useMove();
  const [room, setRoom] = useState<Room | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [policy, setPolicy] = useState("");
  const [liability, setLiability] = useState("");
  const [address, setAddress] = useState("");
  const [result, setResult] = useState("");
  const [photoError, setPhotoError] = useState<string | null>(null);
  const task = tasks.find((t) => t.id === selected);
  const next = state.total < 300 ? 300 : state.total < 600 ? 600 : 1000;
  const [attested, setAttested] = useState(false);
  const celebrated = useRef(state.total >= 1000);
  const [burst, setBurst] = useState(0);
  useEffect(() => {
    if (state.total >= 1000 && !celebrated.current) {
      celebrated.current = true;
      setBurst((n) => n + 1);
      toast.success("Moving checklist complete", {
        description: "1,000 MoveCredits. Welcome home.",
      });
    }
  }, [state.total]);
  return (
    <>
      {burst > 0 && <Confetti key={burst} />}
      <Link to="/quests" className="text-sm text-primary">
        ← All sidequests
      </Link>
      <div className="mt-3 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div className="min-w-0">
          <p className="eyebrow">YOUR NEW HOME · TURKU DEMO</p>
          <h1 className="mt-2 text-4xl font-light">Make yourself at home.</h1>
          <p className="mt-3 text-muted-foreground">
            A little care now. A better move for everyone.
          </p>
        </div>
        <Button variant="outline" asChild className="justify-self-start sm:justify-self-end">
          <Link to="/crew">
            <Users />
            Your crew {state.crew.length > 0 && `· ${state.crew.length}`}
          </Link>
        </Button>
      </div>
      <section className="mt-8 border-y py-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
          <span className="min-w-0 text-sm font-medium">
            <span className="text-2xl text-primary tabular-nums">{state.total}</span> / 1,000
            MoveCredits
          </span>
          <span className="text-sm text-muted-foreground">{state.completed.length}/9 tasks</span>
        </div>
        <Progress className="mt-3" value={(state.total / 1000) * 100} />
        <p className="mt-3 text-sm text-muted-foreground">
          {state.total < 600
            ? `${next - state.total} MoveCredits to ${next === 300 ? "crew pizza" : "your leak sensor"}`
            : state.total === 1000
              ? "Moving checklist complete. Welcome home."
              : "Demo milestones unlocked. Finish the remaining checks for your new home."}
        </p>
      </section>
      {state.completed.length === 0 && <p className="mt-4 text-sm text-muted-foreground">Start with Before you move, then explore each room. Your first check brings you closer to a safer new home.</p>}
      <div className="mt-7 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <h2 className="text-xl font-light">Your home map</h2>
        <span className="text-xs text-muted-foreground">4 areas · 9 checks</span>
      </div>
      <div className="home-map mt-4 grid grid-cols-2 gap-3">
        {rooms.map((r, i) => {
          const list = tasks.filter((t) => t.room === r.id);
          const done = list.filter((t) => state.completed.includes(t.id)).length;
          const ready = done === list.length;
          const Icon = icons[r.id];
          return (
            <Button
              key={r.id}
              variant="ghost"
              onClick={() => setRoom(r.id)}
              style={{ animationDelay: `${i * 80}ms` }}
              className={`room-tile animate-rise h-auto min-w-0 min-h-44 flex-col items-start justify-between whitespace-normal rounded-xl border p-4 sm:p-5 text-left ${ready ? "border-success bg-success-soft text-success" : "bg-card"}`}
            >
              <div className="flex w-full items-center justify-between">
                <Icon className="!h-8 !w-8" strokeWidth={1.2} />
                {ready ? <Check /> : <ArrowRight className="text-muted-foreground" />}
              </div>
              <div>
                <h3 className="mt-6 text-lg font-medium">{r.name}</h3>
                <p className="mt-1 text-xs font-normal text-muted-foreground">{r.subtitle}</p>
                <p className={`mt-3 text-xs ${ready ? "text-success" : "text-primary"}`}>
                  {ready ? "Checks complete" : `${done} of ${list.length} done`}
                </p>
              </div>
            </Button>
          );
        })}
      </div>
      <MoveRewards />
      <section className="mt-6 flex items-center gap-4">
        <Droplets className="h-7 w-7 shrink-0 text-primary" strokeWidth={1.2} />
        <div className="flex-1">
          <h2 className="font-medium">LeakGuard</h2>
          <p className="text-sm text-muted-foreground">
            Know what to do before a leak becomes a flood.
          </p>
        </div>
        <Button asChild variant="outline" size="icon" title="Open LeakGuard">
          <Link to="/leakguard" aria-label="Open LeakGuard">
            <ArrowRight />
          </Link>
        </Button>
      </section>
      <Sheet
        open={room !== null}
        onOpenChange={(open) => {
          if (!open) {
            setRoom(null);
            setSelected(null);
          }
        }}
      >
        <SheetContent className="w-full overflow-y-auto bg-card sm:max-w-lg">
          <SheetHeader className="text-left">
            <SheetTitle className="text-3xl font-light">
              {rooms.find((r) => r.id === room)?.name}
            </SheetTitle>
            <SheetDescription>Small checks that make your move safer.</SheetDescription>
          </SheetHeader>
          <Progress
            className="my-6"
            value={
              (tasks.filter((t) => t.room === room && state.completed.includes(t.id)).length /
                Math.max(1, tasks.filter((t) => t.room === room).length)) *
              100
            }
          />
          <div className="divide-y">
            {tasks
              .filter((t) => t.room === room)
              .map((t) => (
                <Button
                  variant="ghost"
                  className="h-auto w-full justify-start whitespace-normal rounded-none px-0 py-5 text-left"
                  key={t.id}
                  onClick={() => {
                    setSelected(t.id);
                    setAttested(false);
                    setResult("");
                    setPhotoError(null);
                  }}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${state.completed.includes(t.id) ? "bg-success-soft text-success" : "bg-secondary text-primary"}`}
                  >
                    {state.completed.includes(t.id) ? (
                      <Check />
                    ) : t.photo ? (
                      <Camera />
                    ) : (
                      <ShieldCheck />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    {t.name}
                    <span className="mt-1 block text-xs text-muted-foreground">
                      +{t.credits} MoveCredits {state.completed.includes(t.id) && "· Complete"}
                    </span>
                  </span>
                  <ArrowRight />
                </Button>
              ))}
          </div>
          {task && (
            <div className="mt-5 border-t pt-6">
              <h3 className="text-xl font-medium">{task.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{task.hint}</p>
              {task.id === "coverage" ? (
                <div className="mt-5 space-y-5">
                  {[
                    {
                      label: "1. Do you have a home insurance policy?",
                      value: policy,
                      set: setPolicy,
                      options: [
                        ["if", "With If"],
                        ["none", "No policy"],
                      ],
                    },
                    {
                      label: "2. Does it include liability cover?",
                      value: liability,
                      set: setLiability,
                      options: [
                        ["yes", "Yes"],
                        ["no", "No"],
                        ["unsure", "Not sure"],
                      ],
                    },
                    {
                      label: "3. Is your new address covered from move-in?",
                      value: address,
                      set: setAddress,
                      options: [
                        ["yes", "Yes"],
                        ["no", "No"],
                        ["unsure", "Not sure"],
                      ],
                    },
                  ].map((q) => (
                    <fieldset key={q.label}>
                      <legend className="mb-2 text-sm font-medium">{q.label}</legend>
                      <div className="flex flex-wrap gap-2">
                        {q.options.map(([value, label]) => (
                          <Button
                            key={value}
                            variant={q.value === value ? "default" : "outline"}
                            size="sm"
                            onClick={() => { q.set(value ?? ""); setResult(""); }}
                            aria-pressed={q.value === value}
                          >
                            {label}
                          </Button>
                        ))}
                      </div>
                    </fieldset>
                  ))}
                  <Button
                    disabled={!policy || !liability || !address}
                    onClick={() => {
                      setResult(coverageResult(policy, liability, address));
                      state.complete("coverage");
                      toast.success("+100 MoveCredits", {
                        description: "Home coverage check complete.",
                      });
                    }}
                  >
                    Get my coverage guidance
                    <ArrowRight />
                  </Button>
                  {result && (
                    <div role="status" className="rounded-lg bg-accent p-4 text-sm leading-relaxed">
                      {result}
                      <p className="mt-3 text-xs">
                        General guidance only. Your policy terms determine coverage.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {task.photo && (
                    <div className="mt-5">
                      {state.photos[task.id] && (
                        <img
                          src={state.photos[task.id]}
                          alt="Saved quest evidence"
                          width={400}
                          height={300}
                          className="mb-3 aspect-[4/3] w-full rounded-lg object-cover"
                        />
                      )}
                      <label
                        className="mb-2 block text-sm font-medium"
                        htmlFor={`photo-${task.id}`}
                      >
                        Your evidence photo
                      </label>
                      <Input
                        id={`photo-${task.id}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setPhotoError(state.savePhotoFile(task.id, file));
                        }}
                      />
                      {photoError && (
                        <p role="alert" className="mt-2 text-sm text-destructive">
                          {photoError}
                        </p>
                      )}
                      {task.id === "valve" && (
                        <Button
                          variant="link"
                          className="mt-2 px-0"
                          onClick={() => state.savePhoto("valve", valve)}
                        >
                          Use demo valve photo
                        </Button>
                      )}
                    </div>
                  )}
                  {task.id === "sensor" && !state.sensorArrived && (
                    <p className="mt-4 text-sm text-muted-foreground">
                      Claim your sensor at 600 MoveCredits, then mark its demo delivery under Moving
                      rewards.
                    </p>
                  )}
                  <label className="mt-5 flex items-start gap-3 text-sm">
                    <Checkbox checked={attested} onCheckedChange={(v) => setAttested(v === true)} />
                    <span>I have completed this safety check.</span>
                  </label>
                  <div className="mt-5 border-y py-4">
                    <p className="text-sm font-medium">Helper confirmation (optional)</p>
                    {state.crew.length === 0 ? (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Moving solo? Your own confirmation above is enough. You can also{" "}
                        <Link to="/crew" onClick={() => setRoom(null)} className="text-primary underline">
                          invite a helper
                        </Link>{" "}
                        to witness checks together.
                      </p>
                    ) : (
                      <label className="mt-3 flex items-start gap-3 text-sm">
                        <Checkbox
                          checked={state.confirmed.includes(task.id)}
                          disabled={state.confirmed.includes(task.id)}
                          onCheckedChange={(v) => {
                            if (v === true) state.confirm(task.id);
                          }}
                        />
                        <span>
                          {state.crew[0]} saw this check{" "}
                          <span className="block text-xs text-muted-foreground">
                            Simulated crew confirmation
                          </span>
                        </span>
                      </label>
                    )}
                  </div>
                  <Button
                    className="mt-5 w-full"
                    disabled={
                      state.completed.includes(task.id) ||
                      !attested ||
                      (task.photo && !state.photos[task.id]) ||
                      (task.id === "sensor" && !state.sensorArrived)
                    }
                    onClick={() => {
                      state.complete(task.id);
                      setSelected(null);
                      toast.success(`+${task.credits} MoveCredits`, {
                        description: `${task.name} complete.`,
                      });
                    }}
                  >
                    {" "}
                    {state.completed.includes(task.id)
                      ? "Completed"
                      : `Finish check · +${task.credits} MoveCredits`}
                    <Check />
                  </Button>
                  {!state.completed.includes(task.id) && <p className="mt-3 text-xs text-muted-foreground">
                    {[
                      !attested && "Confirm the safety check above.",
                      task.photo && !state.photos[task.id] && "Add an evidence photo.",
                      task.id === "sensor" && !state.sensorArrived && "Simulate sensor delivery in Moving rewards.",
                    ].filter(Boolean).join(" ")}
                  </p>}
                </>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
