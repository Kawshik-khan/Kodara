"""ManimGL scene for Chapter 05: Evaluation Control Plane and Worked Case Veto."""
from manimlib import *


class EvaluationControlPlaneScene(Scene):
    def construct(self):
        title = Text("Evaluation Control Plane: Score vs Qualification", font_size=30)
        title.to_edge(UP)
        self.play(FadeIn(title))

        stages = ["CLAIM", "CASES", "EXECUTION", "ORACLES", "ADJUDICATION", "PROMOTION"]
        boxes = VGroup(*[
            VGroup(
                RoundedRectangle(width=2.0, height=0.9, corner_radius=0.1, stroke_color=BLUE_C),
                Text(label, font_size=16),
            )
            for label in stages
        ]).arrange(RIGHT, buff=0.22).shift(UP * 0.8)

        self.play(LaggedStartMap(FadeIn, boxes, lag_ratio=0.12))

        soft = Text("Soft metric: Qualified completion 78.4% -> 84.9% (+6.5 pp)", font_size=22, color=GREEN_C)
        soft.shift(DOWN * 0.5)
        veto = Text("Hard gate C4: unauthorized_refund_effects = 1 -> VETO", font_size=22, color=RED_C)
        veto.next_to(soft, DOWN, buff=0.3)
        decision = Text("Promotion decision: REJECT_SAFETY_FLOOR", font_size=26, color=ORANGE)
        decision.next_to(veto, DOWN, buff=0.35)

        self.play(FadeIn(soft))
        self.play(FadeIn(veto), boxes[4][0].animate.set_stroke(RED_C, width=4))
        self.play(FadeIn(decision), boxes[5][0].animate.set_stroke(ORANGE, width=4))
        self.wait(2)

