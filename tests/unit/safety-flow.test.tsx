import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SafetyFlowSection } from "@/components/public/safety-flow-section";
import { publicContent } from "@/config/content";

describe("SafetyFlowSection", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    );
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 0;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
  });

  it("renders the shared safety journey with step one active initially", () => {
    render(<SafetyFlowSection />);

    expect(screen.getAllByRole("article", { hidden: true })).toHaveLength(4);
    expect(screen.getByRole("button", { name: /Show step 01/ })).toHaveAttribute(
      "aria-current",
      "step",
    );
    expect(
      screen.getByText(publicContent.safetyFlow.preview.vehicleRegistration),
    ).toBeInTheDocument();
  });

  it("changes the active step with click and arrow-key controls", () => {
    render(<SafetyFlowSection />);

    const stepOne = screen.getByRole("button", { name: /Show step 01/ });
    fireEvent.keyDown(stepOne, { key: "ArrowDown" });

    const stepTwo = screen.getByRole("button", { name: /Show step 02/ });
    expect(stepTwo).toHaveAttribute("aria-current", "step");

    fireEvent.click(screen.getByRole("button", { name: /Show step 04/ }));
    expect(screen.getByRole("button", { name: /Show step 04/ })).toHaveAttribute(
      "aria-current",
      "step",
    );
    expect(screen.getByText("Trip completed")).toBeInTheDocument();
  });

  it("keeps every step visible when reduced motion is enabled", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    );

    const { container } = render(<SafetyFlowSection />);

    expect(container.querySelector('[data-story-ready="false"]')).toBeInTheDocument();
    expect(screen.getAllByRole("article", { hidden: true })).toHaveLength(4);
  });
});
