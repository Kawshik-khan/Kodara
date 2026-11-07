import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/Button";

describe("Button component", () => {
  it("renders with default outline variant and children text", () => {
    render(<Button>Click Me</Button>);
    const btn = screen.getByRole("button", { name: /click me/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass("kodara-button--outline");
  });

  it("renders solid variant correctly", () => {
    render(<Button variant="solid">Continue Lesson</Button>);
    const btn = screen.getByRole("button", { name: /continue lesson/i });
    expect(btn).toHaveClass("kodara-button--solid");
  });

  it("handles disabled state", () => {
    render(<Button disabled>Disabled Action</Button>);
    const btn = screen.getByRole("button", { name: /disabled action/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveClass("kodara-button--disabled");
  });
});
