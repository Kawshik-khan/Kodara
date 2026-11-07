"""ManimGL scene for Chapter 20: Skill Runtime Loading & Governance Lifecycle."""
from manimlib import *


class SkillLifecycleScene(Scene):
    def construct(self):
        title = Text("Skill Linker: Nomination != Admission", font_size=30)
        title.to_edge(UP)
        self.play(FadeIn(title))

        stages = ["CATALOG", "NOMINATION", "ADMISSION GATE", "AUTHORITY CAP", "BOM & TELEMETRY", "REVOCATION"]
        boxes = VGroup(*[
            VGroup(
                RoundedRectangle(width=2.0, height=0.9, corner_radius=0.1, stroke_color=BLUE_C),
                Text(label, font_size=14),
            )
            for label in stages
        ]).arrange(RIGHT, buff=0.2).shift(UP * 0.8)

        self.play(LaggedStartMap(FadeIn, boxes, lag_ratio=0.12))

        excl = Text("Exclusion gate: active_chargeback -> REJECTED before SKILL.md loads", font_size=20, color=RED_C)
        excl.shift(DOWN * 0.4)
        cap = Text("Authority cap: skill.tools n run_grant -> refund_create stripped", font_size=20, color=GREEN_C)
        cap.next_to(excl, DOWN, buff=0.28)
        bom = Text("Skill BOM: duplicate-charge-investigation@4.2.0 (sha256:420a)", font_size=20, color=ORANGE)
        bom.next_to(cap, DOWN, buff=0.28)

        self.play(FadeIn(excl), boxes[2][0].animate.set_stroke(RED_C, width=4))
        self.play(FadeIn(cap), boxes[3][0].animate.set_stroke(GREEN_C, width=4))
        self.play(FadeIn(bom), boxes[4][0].animate.set_stroke(ORANGE, width=4))
        self.wait(2)

