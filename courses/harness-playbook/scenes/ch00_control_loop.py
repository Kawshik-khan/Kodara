"""Chapter 00: one run of the harness control loop (ManimGL).

Render: manimgl scenes/ch00_control_loop.py ControlLoop -w
"""
from manimlib import *

from kodara_palette import BG, ORANGE, INK, LINE, GREEN, AMBER

STAGES = ["Context  c_t", "Model  z_t", "Gate  a_t", "Execute  o_t", "Update  s_t+1"]

# (stage index, token label, gate outcome) for the payment run
STEPS = [
    (0, "task", None), (1, "read_ledger", None), (2, "read_ledger", "pass"),
    (3, "[42, 42]", None), (4, "state", None),
    (0, "task + facts", None), (1, "refund €42", None), (2, "refund €42", "escalate"),
]


class ControlLoop(Scene):
    camera_config = dict(background_color=BG)

    def construct(self):
        boxes = VGroup()
        for name in STAGES:
            box = RoundedRectangle(width=3.4, height=0.8, corner_radius=0.1)
            box.set_stroke(LINE, 2).set_fill(WHITE, 1)
            boxes.add(VGroup(box, Text(name, font_size=22).set_color(INK).move_to(box)))
        boxes.arrange(DOWN, buff=0.25).shift(1.5 * LEFT)
        loop = CurvedArrow(boxes[-1].get_left(), boxes[0].get_left(), angle=-PI / 2)
        loop.set_color(LINE)

        token = VGroup(
            RoundedRectangle(width=2.2, height=0.6, corner_radius=0.1).set_fill(ORANGE, 1).set_stroke(width=0),
            Text("task", font_size=20).set_color(WHITE),
        ).next_to(boxes[0], RIGHT, buff=0.5)

        self.play(LaggedStartMap(FadeIn, boxes, lag_ratio=0.15), ShowCreation(loop))
        self.play(GrowFromCenter(token))

        for stage, label, outcome in STEPS:
            self.play(token.animate.next_to(boxes[stage], RIGHT, buff=0.5), run_time=0.5)
            new_text = Text(label, font_size=20).set_color(WHITE).move_to(token[0])
            self.play(Transform(token[1], new_text), run_time=0.3)
            if outcome == "pass":
                self.play(boxes[stage][0].animate.set_stroke(GREEN, 4), run_time=0.3)
            elif outcome == "escalate":
                self.play(boxes[stage][0].animate.set_stroke(AMBER, 4), token[0].animate.set_fill(AMBER))
                stop = Text("ESCALATE: to a person", font_size=24).set_color(AMBER)
                self.play(Write(stop.next_to(boxes, DOWN, buff=0.4)))
        self.wait()
