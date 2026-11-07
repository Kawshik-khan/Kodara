"""Chapter 00: reserve budget for verification (ManimGL).

Render: Q=70 V=2 manimgl scenes/ch00_verification_budget.py VerificationBudget -w
Same formulas as src/features/charts/charts/aiEngineering/verificationBudget.ts.
"""
from manimlib import *
from math import comb, floor
import os

from kodara_palette import BG, ORANGE, INK, MUTED, BLUE

Q = int(os.environ.get("Q", 70)) / 100
V = int(os.environ.get("V", 2))
WORK_STEPS = 6


def finish_within(n, q=Q, k=WORK_STEPS):
    """P(at least k successes in n independent steps), in percent."""
    n = floor(n)
    if n < k:
        return 0.0
    return 100 * sum(comb(n, j) * q ** j * (1 - q) ** (n - j) for j in range(k, n + 1))


class VerificationBudget(Scene):
    camera_config = dict(background_color=BG)

    def construct(self):
        axes = Axes(x_range=(0, 30, 5), y_range=(0, 100, 20), width=10, height=5.5)
        axes.set_stroke(INK, 2)
        axes.add_coordinate_labels(font_size=20)
        axes.coordinate_labels.set_color(MUTED)
        x_label = Text("step budget (B)", font_size=22).set_color(MUTED)
        x_label.next_to(axes.x_axis, DOWN, buff=0.6)
        y_label = Text("% of runs", font_size=22).set_color(MUTED)
        y_label.next_to(axes.y_axis, UP).shift(RIGHT)

        work = axes.get_graph(finish_within, color=BLUE, stroke_width=3)
        verified = axes.get_graph(lambda b: finish_within(b - V), color=ORANGE, stroke_width=5)

        self.play(ShowCreation(axes), FadeIn(x_label), FadeIn(y_label))
        self.play(ShowCreation(work), ShowCreation(verified), run_time=2)

        budget = ValueTracker(6)
        dot = Dot(color=ORANGE).add_updater(
            lambda d: d.move_to(axes.c2p(budget.get_value(), finish_within(budget.get_value() - V))))
        gap = always_redraw(lambda: Line(
            axes.c2p(budget.get_value(), finish_within(budget.get_value() - V)),
            axes.c2p(budget.get_value(), finish_within(budget.get_value())),
        ).set_stroke(MUTED, 3))
        readout = DecimalNumber(0, num_decimal_places=0, font_size=32).set_color(INK)

        def follow(mob):
            mob.set_value(finish_within(budget.get_value() - V))
            mob.next_to(dot, UL, buff=0.15)

        readout.add_updater(follow)
        self.add(gap, dot, readout)
        self.play(budget.animate.set_value(24), run_time=6)
        self.wait()
