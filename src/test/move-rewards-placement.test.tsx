import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MoveProvider } from "@/components/MoveProvider";
import { MoveRewards } from "@/components/MoveRewards";
import { QuestBoard } from "@/components/QuestBoard";

describe("Move rewards live only in the moving sidequest", () => {
  it("shows all three milestone rewards inside the moving section", () => {
    render(
      <MoveProvider>
        <MoveRewards />
      </MoveProvider>,
    );
    expect(screen.getByText("One trailer hour")).toBeTruthy();
    expect(screen.getByText("Pizza for your crew")).toBeTruthy();
    expect(screen.getByText("A leak sensor")).toBeTruthy();
  });

  it("renders the move rewards as part of the moving sidequest board", () => {
    render(
      <MoveProvider>
        <QuestBoard />
      </MoveProvider>,
    );
    expect(screen.getByRole("heading", { name: "Move rewards" })).toBeTruthy();
  });
});
