"""Chapter 02: one refund through the six ACI layers (ManimGL).

Render: SCENARIO=ack_lost manimgl scenes/ch02_aci_refund.py AciRefund -w
"""
from manimlib import *
import os

from kodara_palette import BG, ORANGE, INK, LINE, GREEN, AMBER, RED

SCENARIO = os.environ.get("SCENARIO", "ack_lost")
LAYERS = ["Affordance", "Proposal\ncontract", "Authority\ngate",
          "Effect\nadapter", "Observation\ncontract", "Evidence\nhook"]

# Each step: (target, outcome). target is a layer index or "provider".
SCENARIOS = {
    "clean":      [(0, "pass"), (1, "pass"), (2, "pass"), (3, "pass"),
                   ("provider", "commit"), (4, "pass"), (5, "pass")],
    "ack_lost":   [(0, "pass"), (1, "pass"), (2, "pass"), (3, "pass"),
                   ("provider", "commit"), (3, "unknown"),
                   ("provider", "lookup"), (4, "pass"), (5, "pass")],
    "naive":      [(0, "pass"), (1, "pass"), (2, "pass"), (3, "pass"),
                   ("provider", "commit"), (3, "unknown"),
                   ("provider", "commit"), (3, "deny")],
    "over_limit": [(0, "pass"), (1, "pass"), (2, "hold")],
}
TINT = {"pass": GREEN, "unknown": AMBER, "hold": AMBER, "deny": RED}


class AciRefund(Scene):
    camera_config = dict(background_color=BG)

    def construct(self):
        gates = VGroup()
        for name in LAYERS:
            box = RoundedRectangle(width=1.7, height=3.0, corner_radius=0.12)
            box.set_stroke(LINE, 2).set_fill(WHITE, 1)
            label = Text(name, font_size=18).set_color(INK)
            label.move_to(box.get_top() + 0.45 * DOWN)
            gates.add(VGroup(box, label))
        gates.arrange(RIGHT, buff=0.25).shift(0.6 * LEFT)

        provider = VGroup(
            RoundedRectangle(width=1.8, height=3.0, corner_radius=0.12).set_stroke(INK, 2),
            Text("Payment\nprovider", font_size=18).set_color(INK),
        ).next_to(gates, RIGHT, buff=0.35)
        ledger = VGroup()

        token = VGroup(
            RoundedRectangle(width=1.4, height=0.45, corner_radius=0.22)
                .set_fill(ORANGE, 1).set_stroke(width=0),
            Text("refund €42", font_size=16).set_color(WHITE),
        ).next_to(gates, LEFT, buff=0.3)

        self.play(LaggedStartMap(FadeIn, gates, lag_ratio=0.12), FadeIn(provider))
        self.play(GrowFromCenter(token))

        for target, outcome in SCENARIOS[SCENARIO]:
            dest = provider if target == "provider" else gates[target]
            self.play(token.animate.move_to(dest[0].get_center()), run_time=0.7)
            if target == "provider":
                if outcome == "commit":
                    row = Text(f"refund #{len(ledger) + 1}  €42", font_size=16).set_color(INK)
                    ledger.add(row)
                    ledger.arrange(DOWN, aligned_edge=LEFT).next_to(provider, DOWN, buff=0.2)
                    self.play(Write(row))
                else:
                    self.play(Indicate(ledger, color=ORANGE))
                continue
            self.play(dest[0].animate.set_stroke(TINT[outcome], 4), run_time=0.3)
            if outcome in ("deny", "hold"):
                self.play(token[0].animate.set_fill(TINT[outcome]), FlashAround(dest))
                break
        self.wait()
