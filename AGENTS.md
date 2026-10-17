<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep demo state in a shared browser-safe React provider across content routes; the hackathon prototype deliberately mocks partners, activity, policies and crew verification without live services.
- Centralize tasks, milestone rewards and earning rules in a pure domain module so credit eligibility is independently tested.
- Use separate TanStack content routes for activity, quests, rewards, crew and LeakGuard; keep personal policy information in its own insurance route.
