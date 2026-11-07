"""ManimGL scene for Chapter 05: pass@k vs pass^k and missing-output denominator distortion."""
from manimlib import *


class PassPowerKScene(Scene):
    def construct(self):
        axes = Axes(
            x_range=(0.5, 1.0, 0.1),
            y_range=(0, 100, 20),
            width=9,
            height=4.8,
            axis_config={"include_tip": False},
        )
        title = Text("Repeated-Trial Reliability: pass@k vs pass^k (k = 5, attrition m = 15%)", font_size=26)
        title.to_edge(UP)

        k = 5
        m = 0.15
        pass_at_k = axes.get_graph(lambda p: 100 * (1 - (1 - p) ** k), x_range=(0.5, 0.99), color=GREY_B)
        pass_pow_k = axes.get_graph(lambda p: 100 * (p ** k), x_range=(0.5, 0.99), color=BLUE_C)
        honest_pow_k = axes.get_graph(lambda p: 100 * (((1 - m) * p) ** k), x_range=(0.5, 0.99), color=ORANGE)

        self.play(FadeIn(title), ShowCreation(axes))
        self.play(ShowCreation(pass_at_k), ShowCreation(pass_pow_k), ShowCreation(honest_pow_k))
        self.wait(2)

