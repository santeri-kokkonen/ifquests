import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Users, Link as LinkIcon, Check, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useMove } from "@/components/MoveProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { tasks } from "@/lib/move-rules";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/crew")({
  head: () =>
    pageHead(
      "Your moving crew",
      "Join the moving crew through a web link and witness useful safety checks.",
    ),
  component: Crew,
});
function Crew() {
  const state = useMove();
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const [joinMessage, setJoinMessage] = useState("");
  const [url, setUrl] = useState("");
  useEffect(() => setUrl(`${window.location.origin}/crew`), []);
  return (
    <AppShell>
      <Button variant="link" asChild className="mb-4 px-0">
        <Link to="/quests/moving">
          <ArrowLeft />
          Moving sidequest
        </Link>
      </Button>
      <div className="max-w-2xl">
        <Users className="h-10 w-10 text-primary" strokeWidth={1.2} />
        <h1 className="mt-4 text-4xl font-light">Moving is a team sport.</h1>
        <p className="mt-3 text-muted-foreground">
          Plan your move with friends and record the safety checks they witness.
        </p>
        <div className="mt-7 border-y py-5">
          <label htmlFor="invite" className="text-sm font-medium">
            Your crew link
          </label>
          <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-2">
            <Input id="invite" readOnly value={url} onFocus={(e) => e.currentTarget.select()} />
            <Button
              aria-label="Copy crew link"
              title="Copy crew link"
              size="icon"
              disabled={!url}
              onClick={async () => {
                try {
                  setCopyError("");
                  await navigator.clipboard.writeText(url);
                  setCopied(true);
                } catch {
                  setCopied(false);
                  setCopyError("Could not copy the link. Select the link and copy it manually.");
                }
              }}
            >
              {copied ? <Check /> : <LinkIcon />}
            </Button>
          </div>
          {copyError && (
            <p role="alert" className="mt-2 text-sm text-destructive">
              {copyError}
            </p>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            This link opens the crew page. Names and confirmations stay in this browser; friends cannot join a shared session in this demo.
          </p>
        </div>
        <form
          className="mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) {
              const already = state.crew.includes(name.trim());
              setJoinMessage(already ? `${name.trim()} is already in your crew.` : `${name.trim()} joined your crew.`);
              if (!already) toast.success(`${name.trim()} joined your crew`);
              state.join(name.trim());
              setName("");
            }
          }}
        >
          <label className="text-sm font-medium" htmlFor="crew-name">
            Join as a helper
          </label>
          <div className="mt-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
            <Input
              id="crew-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your first name"
              maxLength={40}
              required
            />
            <Button type="submit" disabled={!name.trim()}>Join crew</Button>
          </div>
        </form>
        {joinMessage && <p role="status" className="mt-3 text-sm text-success">{joinMessage}</p>}
        {state.crew.length === 0 && <p className="mt-5 text-sm text-muted-foreground">Every move is easier with a helper. Add your first crew member to start recording witnessed checks.</p>}
        {state.crew.length > 0 && (
          <>
            <p role="status" className="mt-5 text-sm text-success">
              Your crew: {state.crew.join(", ")}
            </p>
            <h2 className="mt-7 text-xl font-light">Witnessed safety checks</h2>
            <p className="mt-2 text-xs text-muted-foreground">
              Local demo witness confirmations, not independently verified.
            </p>
            <div className="mt-4 divide-y">
              {tasks
                .filter((t) => t.id !== "coverage")
                .map((t) => (
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-4" key={t.id}>
                    <span className="min-w-0 text-sm">{t.name}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={state.confirmed.includes(t.id)}
                      onClick={() => {
                        state.confirm(t.id);
                        toast.success("Check witnessed", { description: t.name });
                      }}
                    >
                      {state.confirmed.includes(t.id) ? (
                        <>
                          <Check />
                          Witnessed
                        </>
                      ) : (
                        "Confirm check"
                      )}
                    </Button>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
