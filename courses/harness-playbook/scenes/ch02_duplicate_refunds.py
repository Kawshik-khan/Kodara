"""Chapter 02: duplicate refunds vs acknowledgement loss (ManimGL).

Render: RETRIES=3 manimgl scenes/ch02_duplicate_refunds.py DuplicateRefunds -w
Same formulas as src/features/charts/charts/aiEngineering/duplicateRefunds.ts.
"""
from manimlib import *
import os

from kodara_palette import BG, ORANGE, INK, MUTED, GREEN, BLUE

RETRIES = int(os.environ.get("RETRIES", 3))


def naive_duplicates(p_pct, retries=RETRIES):
    """Expected extra refunds per 1000 when every lost ack triggers a fresh-id retry."""
    p = p_pct / 100
    return 1000 * sum(p ** k for k in range(1, retries))


def reconcile_reads(p_pct):
    """The keyed harness pays with ledger reads instead of money."""
    return 1000 * p_pct / 100


class DuplicateRefunds(Scene):
    camera_config = dict(background_color=BG)

    def construct(self):
        axes = Axes(x_range=(0, 30, 5), y_range=(0, 500, 100), width=10, height=5.5)
        axes.set_stroke(INK, 2)
        axes.add_coordinate_labels(font_size=20)
        axes.coordinate_labels.set_color(MUTED)
        x_label = Text("ack loss rate (%)", font_size=22).set_color(MUTED)
        x_label.next_to(axes.x_axis, DOWN, buff=0.6)
        y_label = Text("per 1000 refunds", font_size=22).set_color(MUTED)
        y_label.next_to(axes.y_axis, UP).shift(RIGHT)

        naive = axes.get_graph(naive_duplicates, color=ORANGE, stroke_width=5)
        reads = axes.get_graph(reconcile_reads, color=BLUE, stroke_width=3)
        keyed = axes.get_graph(lambda x: 0, color=GREEN, stroke_width=5)

        self.play(ShowCreation(axes), FadeIn(x_label), FadeIn(y_label))
        self.play(ShowCreation(keyed), ShowCreation(reads), ShowCreation(naive), run_time=2)

        p = ValueTracker(2)
        dot = Dot(color=ORANGE).add_updater(
            lambda d: d.move_to(axes.input_to_graph_point(p.get_value(), naive)))
        guide = always_redraw(lambda: DashedLine(
            axes.c2p(p.get_value(), 0), dot.get_center()).set_stroke(MUTED, 2))
        readout = DecimalNumber(0, num_decimal_places=0, font_size=32).set_color(INK)

        def follow(mob):
            mob.set_value(naive_duplicates(p.get_value()))
            mob.next_to(dot, UL, buff=0.15)

        readout.add_updater(follow)
        self.add(guide, dot, readout)
        self.play(p.animate.set_value(25), run_time=5)
        self.wait()
