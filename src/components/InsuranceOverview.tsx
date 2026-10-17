import { Check, FileText, MapPin, Receipt, Shield, Users } from "lucide-react";

const PLAN = {
  name: "Home Insurance",
  tier: "Plus",
  policy: "1234 567 890",
  period: "1 Jan – 31 Dec 2026",
  premium: "€12.90 / month",
};

const COVERAGE = [
  "Contents cover up to €20,000",
  "Legal protection",
  "Liability insurance",
  "Personal property on the go",
];

const DETAILS = [
  { icon: FileText, label: "Insured", value: "A. Virtanen" },
  { icon: MapPin, label: "Address", value: "Mäkeläntie 12 A 34, Helsinki" },
  { icon: Users, label: "Household", value: "2 adults, 1 child" },
  { icon: Receipt, label: "Home type", value: "Apartment, 62 m²" },
];

export function InsuranceOverview() {
  return (
    <div>
      <h1 className="text-3xl font-light">Insurance</h1>
      <p className="mt-3 leading-relaxed text-muted-foreground">Your policy at a glance.</p>

      <section className="mt-8 rounded-xl bg-secondary p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Shield className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-medium">
                {PLAN.name} <span className="text-primary">{PLAN.tier}</span>
              </p>
              <p className="text-sm text-muted-foreground">Policy {PLAN.policy}</p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
            Active
          </span>
        </div>

        <div className="mt-6 space-y-4 border-t border-border pt-5">
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-sm text-muted-foreground">Coverage</span>
            <span className="text-right font-medium">{PLAN.period}</span>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-sm text-muted-foreground">Premium</span>
            <span className="text-right font-medium">{PLAN.premium}</span>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-xl border bg-card p-6">
        <h2 className="text-lg font-light">What's included</h2>
        <ul className="mt-4 space-y-3">
          {COVERAGE.map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent">
                <Check className="h-3 w-3 text-primary" strokeWidth={2.5} />
              </span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-xl border bg-card p-6">
        <h2 className="text-lg font-light">Your information</h2>
        <ul className="mt-4 space-y-4">
          {DETAILS.map(({ icon: Icon, label, value }) => (
            <li key={label} className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary">
                <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
              </span>
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="ml-auto text-right text-sm font-medium">{value}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
