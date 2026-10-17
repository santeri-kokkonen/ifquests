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
- Update demo state atomically with functional setters and stable actions so batched events cannot duplicate awards or overspend.
- Manage uploaded evidence object URLs in the shared provider so photos survive navigation and are released on replacement or session teardown.
- Persist the deliberately local demo through versioned, validated browser storage after hydration; persist uploaded evidence as image data, not transient object URLs, so refreshes preserve progress without live services.
- Use separate TanStack content routes for activity, sidequests, rewards, crew and LeakGuard; the root If start menu previews insurance destinations without a separate policy route, so the prototype stays focused on Quests.

- Keep only reachable application controls and test-supported utilities; remove unused template modules so maintenance and dependency audits reflect the actual prototype.
