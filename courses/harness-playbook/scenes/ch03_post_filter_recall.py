"""Chapter 03: post-filter recall gap vs scope-first compilation (ManimGL).

Render: K=5 M=2 manimgl scenes/ch03_post_filter_recall.py PostFilterRecall -w
Same formulas as src/features/charts/charts/aiEngineering/postFilterRecall.ts.
"""
from manimlib import *
import math
import os

from kodara_palette import BG, INK, MUTED, GREEN, RED, BLUE

K = int(os.environ.get("K", 5))
M = int(os.environ.get("M", 2))


def post_filter_recall(s_pct, k=K, m=M):
    """Probability that at least m valid units survive in top-k when fraction s are restricted/stale."""
    p_valid = 1 - s_pct / 100
    total = 0.0
    for j in range(m, k + 1):
        total += math.comb(k, j) * (p_valid ** j) * ((1 - p_valid) ** (k - j))
    return 100 * min(1.0, total)


def scope_first_recall(s_pct, k=K, m=M):
    """Scope-first queries filter before ranking, so all k slots draw from admissible units."""
    return 100.0 if k >= m else 0.0


class PostFilterRecall(Scene):
    camera_config = dict(background_color=BG)

    def construct(self):
        axes = Axes(x_range=(0, 90, 15), y_range=(0, 100, 20), width=10, height=5.5)
        axes.set_stroke(INK, 2)
        axes.add_coordinate_labels(font_size=20)
        axes.coordinate_labels.set_color(MUTED)
        x_label = Text("restricted or stale lookalikes in top-k (%)", font_size=22).set_color(MUTED)
        x_label.next_to(axes.x_axis, DOWN, buff=0.6)

        scoped = axes.get_graph(scope_first_recall, color=GREEN, stroke_width=3)
        post = axes.get_graph(post_filter_recall, color=RED, stroke_width=5)
        wasted = axes.get_graph(lambda x: x, color=BLUE, stroke_width=3)

        self.play(ShowCreation(axes), FadeIn(x_label))
        self.play(ShowCreation(scoped), ShowCreation(wasted), ShowCreation(post), run_time=2)

        s = ValueTracker(10)
        dot = Dot(color=RED).add_updater(
            lambda m: m.move_to(axes.c2p(s.get_value(), post_filter_recall(s.get_value())))
        )
        readout = DecimalNumber(0, num_decimal_places=1, font_size=32).set_color(INK)

        def follow(mob):
            mob.set_value(post_filter_recall(s.get_value()))
            mob.next_to(dot, UR, buff=0.15)

        readout.add_updater(follow)
        self.add(dot, readout)
        self.play(s.animate.set_value(80), run_time=6)
        self.wait()

