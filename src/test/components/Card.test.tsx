import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BentoCard, Card } from "@/components/ui/Card";

describe("BentoCard and Card components", () => {
  it("renders children, header and subtitle", () => {
    render(
      <BentoCard
        title="Card Title"
        subtitle="Card Subtitle"
        action={<button>Action</button>}
      >
        <p>Bento Body Content</p>
      </BentoCard>
    );

    expect(screen.getByText("Card Title")).toBeInTheDocument();
    expect(screen.getByText("Card Subtitle")).toBeInTheDocument();
    expect(screen.getByText("Bento Body Content")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /action/i })).toBeInTheDocument();
  });

  it("renders with custom header node using Card alias", () => {
    render(
      <Card header={<div>Custom Header Node</div>}>
        <p>Card Content</p>
      </Card>
    );

    expect(screen.getByText("Custom Header Node")).toBeInTheDocument();
  });
});
