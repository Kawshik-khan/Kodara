import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { FluidFlowGrid } from "@/components/visual/FluidFlowGrid";

describe("FluidFlowGrid component", () => {
  beforeEach(() => {
    // Mock HTMLCanvasElement getContext
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      setTransform: vi.fn(),
      scale: vi.fn(),
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
    });
  });

  it("renders background canvas with aria-hidden and test id", () => {
    render(<FluidFlowGrid />);

    const grid = screen.getByTestId("fluid-flow-grid");
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveAttribute("aria-hidden", "true");
    expect(grid.querySelector("canvas")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<FluidFlowGrid className="custom-test-class" />);

    const grid = screen.getByTestId("fluid-flow-grid");
    expect(grid).toHaveClass("custom-test-class");
    expect(grid).toHaveClass("fluid-flow-grid");
  });
});
