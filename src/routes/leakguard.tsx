import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Droplets, Check, ArrowLeft, Camera, Download, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useMove } from "@/components/MoveProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/leakguard")({
  head: () =>
    pageHead(
      "LeakGuard",
      "Act quickly on a suspected leak: shut off water safely, report the fault and save evidence.",
    ),
  component: LeakGuard,
});
function LeakGuard() {
  const state = useMove();
  const alert = state.leakAlert;
  const fault = state.faultDescription;
  const location = state.faultLocation;
  const photo = state.photos["leak"] ?? "";
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState("");
  const [downloadStarted, setDownloadStarted] = useState(false);
  function draft() {
    const text = `FAULT REPORT — DEMO DRAFT\nLocation: ${location}\nIssue: ${fault}\nWater shut off: ${state.leakSteps.includes("water") ? "Marked complete in demo" : "Not recorded"}\nPlease contact the resident and arrange an urgent inspection.\n\nDemo draft — not sent to maintenance or the housing company.`;
    state.setReport(text);
    state.finishLeak("report");
    toast.success("Step 2 recorded", { description: "Fault report draft prepared." });
  }
  function download() {
    let url: string | undefined;
    try {
      setDownloadError("");
      url = URL.createObjectURL(new Blob([state.report], { type: "text/plain" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "IFQuests-fault-report.txt";
      document.body.appendChild(a);
      try {
        a.click();
        setDownloadStarted(true);
      } finally {
        a.remove();
      }
    } catch {
      setDownloadError("The download could not start. You can copy the report above instead.");
    } finally {
      if (url) {
        const downloadUrl = url;
        window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      }
    }
  }
  return (
    <AppShell>
      <div className="max-w-2xl">
        <Button asChild variant="link" className="mb-4 px-0">
          <Link to="/quests/moving">
            <ArrowLeft />
            Moving sidequest
          </Link>
        </Button>
        <Droplets className="h-10 w-10 text-primary" strokeWidth={1.2} />
        <h1 className="mt-4 text-4xl font-light">A leak? You have a plan.</h1>
        <p className="mt-3 text-muted-foreground">
          A faster response starts with knowing your home.
        </p>
        {!alert ? (
          <section className="mt-7 border-y py-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {state.sensorArrived
                ? "Sensor setup recorded in this demo. No live sensor is connected."
                : "No live sensor is connected. Try a simulated alert to walk through your response."}
            </p>
            <Button className="mt-5" onClick={() => state.setLeakAlert(true)}>
              <Droplets />
              Simulate a leak alert
            </Button>
          </section>
        ) : (
          <>
            <div
              role="alert"
              className="mt-6 flex gap-3 rounded-lg border border-destructive/30 bg-card p-4"
            >
              <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
              <div>
                <p className="font-medium">Demo alert · Water detected</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Simulated water detection near the bathroom sink. No live sensor is connected.
                </p>
              </div>
            </div>
            <Progress className="mt-6" value={(state.leakSteps.length / 3) * 100} />
            <p className="mt-2 text-xs text-muted-foreground">
              {state.leakSteps.length}/3 response steps recorded
            </p>
            <section className="mt-7 border-b pb-6">
              <h2 className="text-xl font-medium">1. Stop the water safely</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                If anyone is in immediate danger, move to safety and call 112. Contact your building’s
                emergency maintenance promptly. Use your saved photo to locate the water shut-off
                only if it is safe and you know how. Stay away from wet electrical equipment.
              </p>
              {state.photos["valve"] ? (
                <img
                  src={state.photos["valve"]}
                  alt="Your saved water shut-off valve from the bathroom quest"
                  width={1024}
                  height={768}
                  className="mt-4 aspect-[4/3] w-full rounded-lg object-cover"
                />
              ) : (
                <div className="mt-4 rounded-lg bg-secondary p-4 text-sm">
                  No valve photo saved yet. Ask maintenance where the shut-off is before you need it.
                  <Button variant="link" asChild className="block px-0">
                    <Link to="/quests/moving">Add a valve photo in the moving sidequest</Link>
                  </Button>
                </div>
              )}
              <Button
                className="mt-4"
                disabled={state.leakSteps.includes("water")}
                onClick={() => {
                  state.finishLeak("water");
                  toast.success("Step 1 recorded", { description: "Water shut-off marked complete." });
                }}
              >
                {state.leakSteps.includes("water") ? (
                  <>
                    <Check />
                    Water shut-off recorded
                  </>
                ) : (
                  "I safely shut off the water"
                )}
              </Button>
            </section>
            <section className="mt-6 border-b pb-6">
              <h2 className="text-xl font-medium">2. Report the fault</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Notify your housing company or emergency maintenance promptly. This prepares a
                draft, not a sent report.
              </p>
              <form onSubmit={(event) => { event.preventDefault(); if (location.trim() && fault.trim()) draft(); }}>
              <label htmlFor="fault-address" className="mt-4 block text-sm">
                Address and apartment
              </label>
              <Input
                className="mt-2"
                id="fault-address"
                value={location}
                onChange={(e) => state.setFaultLocation(e.target.value)}
                required
                placeholder="Your address and apartment number"
              />
              <label htmlFor="fault-description" className="mt-4 block text-sm">
                What happened?
              </label>
              <p className="mt-1 text-xs text-muted-foreground">An example description is provided. Edit it to match what you observed.</p>
              <Textarea
                className="mt-2"
                id="fault-description"
                value={fault}
                onChange={(e) => state.setFaultDescription(e.target.value)}
                required
              />
              <Button type="submit" className="mt-4" disabled={!location.trim() || !fault.trim()}>
                Prepare fault report
              </Button>
              </form>
              {!state.report && <p className="mt-3 text-sm text-muted-foreground">Add the affected address and describe the leak to prepare a draft for maintenance. Nothing is sent automatically.</p>}
              {state.report && (
                <div className="mt-4">
                  <pre className="whitespace-pre-wrap rounded-lg bg-secondary p-4 font-sans text-xs leading-relaxed">
                    {state.report}
                  </pre>
                  <Button variant="outline" className="mt-3" onClick={download}>
                    <Download />
                    Download report draft
                  </Button>
                  {downloadError ? <p role="alert" className="mt-2 text-sm text-destructive">{downloadError}</p>
                    : downloadStarted && <p role="status" className="mt-2 text-sm text-success">Report download started.</p>}
                </div>
              )}
            </section>
            <section className="mt-6">
              <h2 className="text-xl font-medium">3. Document what happened</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Take evidence photos from a safe place. Do not delay stopping the leak or reporting
                it.
              </p>
              <label htmlFor="leak-evidence" className="mt-4 block text-sm font-medium">
                Evidence photo
              </label>
              <Input
                className="mt-2"
                id="leak-evidence"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setPhotoError(state.savePhotoFile("leak", file));
                }}
              />
              {photoError && (
                <p role="alert" className="mt-2 text-sm text-destructive">
                  {photoError}
                </p>
              )}
              {!photo && <p className="mt-3 text-sm text-muted-foreground">No evidence photo saved yet. Add one from a safe place after stopping and reporting the leak.</p>}
              {photo && (
                <img
                  src={photo}
                  alt="Saved leak evidence photo"
                  width={400}
                  height={300}
                  className="mt-3 aspect-[4/3] w-full rounded-lg object-cover"
                />
              )}
              <Button
                className="mt-4"
                disabled={!photo || state.leakSteps.includes("evidence")}
                onClick={() => {
                  state.savePhoto("leak", photo);
                  state.finishLeak("evidence");
                  toast.success("Step 3 recorded", { description: "Evidence photo saved." });
                }}
              >
                <Camera />
                {state.leakSteps.includes("evidence") ? "Evidence saved" : "Save evidence"}
              </Button>
            </section>
            {state.leakSteps.length === 3 && (
              <p role="status" className="mt-6 rounded-lg bg-success-soft p-4 text-success">
                Response recorded. Send the draft to maintenance yourself and follow their
                instructions. This demo did not contact anyone.
              </p>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
