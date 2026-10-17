import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { InsuranceOverview } from "@/components/InsuranceOverview";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/insurance")({
  head: () =>
    pageHead("Your insurance", "Your current home insurance plan and personal policy information."),
  component: () => (
    <AppShell>
      <div className="max-w-2xl">
        <InsuranceOverview />
        <p className="mt-5 text-xs text-muted-foreground">
          Sample policy and personal details · Not a live insurance record.
        </p>
      </div>
    </AppShell>
  ),
});
