"""Chapter 04: multiplicative retry amplification vs obligation-scoped budget (ManimGL).

Render: R=4 L=3 manimgl scenes/ch04_retry_amplification.py RetryAmplification -w
Same formulas as src/features/charts/charts/aiEngineering/retryAmplification.ts.
"""
from manimlib import *
import os

from kodara_palette import BG, INK, MUTED, GREEN, RED, BLUE

R = int(os.environ.get("R", 4))
L = int(os.environ.get("L", 3))


def single_layer_attempts(p_pct, r=R):
    """Expected attempts for one layer with cap r when each try fails with probability p."""
    p = p_pct / 100
    return sum(p ** k for k in range(r))


def layered_attempts(p_pct, r=R, layers=L):
    """Expected provider hits per 100 tasks when each of L layers retries up to r times."""
    return 100 * (single_layer_attempts(p_pct, r) ** layers)


def obligation_attempts(p_pct, r=R):
    """Expected provider hits per 100 tasks when one retry locus owns the obligation budget r."""
    return 100 * single_layer_attempts(p_pct, r)


class RetryAmplification(Scene):
    camera_config = dict(background_color=BG)

    def construct(self):
        axes = Axes(x_range=(0, 90, 15), y_range=(0, 4000, 1000), width=10, height=5.5)
        axes.set_stroke(INK, 2)
        axes.add_coordinate_labels(font_size=20)
        axes.coordinate_labels.set_color(MUTED)
        x_label = Text("per-attempt failure rate p (%)", font_size=22).set_color(MUTED)
        x_label.next_to(axes.x_axis, DOWN, buff=0.6)

        governed = axes.get_graph(obligation_attempts, color=GREEN, stroke_width=4)
        layered = axes.get_graph(layered_attempts, color=RED, stroke_width=5)

        self.play(ShowCreation(axes), FadeIn(x_label))
        self.play(ShowCreation(governed), ShowCreation(layered), run_time=2)

        p = ValueTracker(10)
        dot = Dot(color=RED).add_updater(
            lambda m: m.move_to(axes.c2p(p.get_value(), layered_attempts(p.get_value())))
        )
        readout = DecimalNumber(0, num_decimal_places=0, font_size=32).set_color(INK)

        def follow(mob):
            mob.set_value(layered_attempts(p.get_value()))
            mob.next_to(dot, UR, buff=0.15)

        readout.add_updater(follow)
        self.add(dot, readout)
        self.play(p.animate.set_value(80), run_time=6)
        self.wait()

