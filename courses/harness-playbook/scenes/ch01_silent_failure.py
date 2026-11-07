"""Chapter 01: turning silent failures into visible ones (ManimGL).

Render: E=10 manimgl scenes/ch01_silent_failure.py SilentFailure -w
Same formulas as src/features/charts/charts/aiEngineering/silentFailure.ts.
"""
from manimlib import *
import os

from kodara_palette import BG, INK, MUTED, RED, BLUE

E = int(os.environ.get("E", 10)) / 100


def completed(d_pct, e=E):
    """Share of runs recorded as COMPLETED, in percent."""
    return 100 * (1 - e * d_pct / 100)


def silent_rate(d_pct, e=E):
    """Wrong outcomes recorded as completed / all completed, in percent."""
    d = d_pct / 100
    return 100 * e * (1 - d) / (1 - e * d)


class SilentFailure(Scene):
    camera_config = dict(background_color=BG)

    def construct(self):
        axes = Axes(x_range=(0, 100, 20), y_range=(0, 100, 20), width=10, height=5.5)
        axes.set_stroke(INK, 2)
        axes.add_coordinate_labels(font_size=20)
        axes.coordinate_labels.set_color(MUTED)
        x_label = Text("verifier detection coverage (%)", font_size=22).set_color(MUTED)
        x_label.next_to(axes.x_axis, DOWN, buff=0.6)

        done = axes.get_graph(completed, color=BLUE, stroke_width=3)
        silent = axes.get_graph(silent_rate, color=RED, stroke_width=5)

        self.play(ShowCreation(axes), FadeIn(x_label))
        self.play(ShowCreation(done), ShowCreation(silent), run_time=2)

        d = ValueTracker(0)
        dot = Dot(color=RED).add_updater(lambda m: m.move_to(axes.c2p(d.get_value(), silent_rate(d.get_value()))))
        readout = DecimalNumber(0, num_decimal_places=1, font_size=32).set_color(INK)

        def follow(mob):
            mob.set_value(silent_rate(d.get_value()))
            mob.next_to(dot, UR, buff=0.15)

        readout.add_updater(follow)
        self.add(dot, readout)
        self.play(d.animate.set_value(95), run_time=6)
        self.wait()
