"""Chapter 03: compiling the Case 9182 briefing (ManimGL).

Render: manimgl scenes/ch03_context_compiler.py ContextCompilerScene -w
Shows candidates classified into admitted evidence, preserved conflicts,
untrusted data-only, and rejected/stale items.
"""
from manimlib import *

from kodara_palette import BG, ORANGE, INK, MUTED, LINE, GREEN, RED, BLUE, AMBER

CANDIDATES = [
    ("id-binding-7", "ADMITTED", GREEN),
    ("charges-991 + sub-events-4", "CONFLICT SET", AMBER),
    ("attachment-1", "DATA ONLY", BLUE),
    ("case-8100 (archive)", "NOT AUTHORITATIVE", RED),
    ("policy-v31 (2820s)", "STALE -> BLOCKED", ORANGE),
]


class ContextCompilerScene(Scene):
    camera_config = dict(background_color=BG)

    def construct(self):
        header = Text("Case 9182 · resolution_proposal build", font_size=26).set_color(INK)
        header.to_edge(UP, buff=0.5)
        self.play(FadeIn(header))

        rows = VGroup()
        for unit, verdict, color in CANDIDATES:
            left = RoundedRectangle(width=4.4, height=0.75, corner_radius=0.08)
            left.set_stroke(LINE, 2).set_fill(WHITE, 1)
            l_txt = Text(unit, font_size=18).set_color(INK).move_to(left)

            right = RoundedRectangle(width=3.8, height=0.75, corner_radius=0.08)
            right.set_stroke(color, 3).set_fill(WHITE, 1)
            r_txt = Text(verdict, font_size=18).set_color(color).move_to(right)

            pair = VGroup(VGroup(left, l_txt), VGroup(right, r_txt)).arrange(RIGHT, buff=1.1)
            arrow = Arrow(left.get_right(), right.get_left(), buff=0.08).set_color(color)
            rows.add(VGroup(pair[0], arrow, pair[1]))

        rows.arrange(DOWN, buff=0.25).next_to(header, DOWN, buff=0.45)

        for row in rows:
            self.play(FadeIn(row[0], shift=0.2 * RIGHT), GrowArrow(row[1]), FadeIn(row[2]), run_time=0.45)

        status = Text("policy refreshed (v32) -> READY · case edited v41->v42 -> STALE", font_size=20).set_color(MUTED)
        status.next_to(rows, DOWN, buff=0.4)
        self.play(Write(status))
        self.wait()

