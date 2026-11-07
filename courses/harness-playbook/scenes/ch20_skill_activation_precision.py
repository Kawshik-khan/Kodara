"""ManimGL scene for Chapter 20: Skill Activation Precision across N adjacent lookalike slices."""
import os
from manimlib import *


def false_activation(f: float, n: float) -> float:
    return 1.0 - ((1.0 - f) ** n)


def nomination_precision(q: float, r: float, f: float, n: float) -> float:
    tp = q * r
    fp = (1.0 - q) * false_activation(f, n)
    return 100.0 * tp / (tp + fp)


class SkillActivationPrecisionScene(Scene):
    def construct(self):
        q = float(os.environ.get("Q", "0.30"))
        f_broad = float(os.environ.get("F", "0.08"))
        r = 0.92
        f_scoped = 0.005

        axes = Axes(
            x_range=(1, 10, 1),
            y_range=(0, 100, 25),
            width=9,
            height=4.8,
            axis_config={"include_tip": False},
        )
        title = Text("Skill Nomination Precision vs Adjacent Lookalike Slices (N)", font_size=26)
        title.to_edge(UP)

        scoped_curve = axes.get_graph(
            lambda n: nomination_precision(q, r, f_scoped, n),
            x_range=(1, 10),
            color=GREEN_C,
        )
        broad_curve = axes.get_graph(
            lambda n: nomination_precision(q, r, f_broad, n),
            x_range=(1, 10),
            color=RED_C,
        )

        self.play(FadeIn(title), ShowCreation(axes))
        self.play(ShowCreation(scoped_curve), ShowCreation(broad_curve))
        self.wait(2)

