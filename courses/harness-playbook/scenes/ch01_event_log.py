"""Chapter 01: an append-only, hash-chained event log (ManimGL).

Render: manimgl scenes/ch01_event_log.py EventChain -w
Three events link by prev_hash; editing the first one breaks the chain.
"""
from manimlib import *

from kodara_palette import BG, ORANGE, INK, LINE, GREEN, RED

EVENTS = [("1", "effect_dispatched"), ("2", "effect_reconciled"), ("3", "completed")]


class EventChain(Scene):
    camera_config = dict(background_color=BG)

    def construct(self):
        blocks = VGroup()
        for seq, kind in EVENTS:
            box = RoundedRectangle(width=3.4, height=1.3, corner_radius=0.1)
            box.set_stroke(LINE, 2).set_fill(WHITE, 1)
            title = Text(f"#{seq}  {kind}", font_size=20).set_color(INK)
            blocks.add(VGroup(box, title.move_to(box)))
        blocks.arrange(RIGHT, buff=0.8)

        links = VGroup(*(
            Arrow(blocks[i][0].get_right(), blocks[i + 1][0].get_left(), buff=0.05).set_color(GREEN)
            for i in range(len(blocks) - 1)
        ))
        caption = Text("each event stores the hash of the one before", font_size=22).set_color(INK)
        caption.next_to(blocks, DOWN, buff=0.8)

        for block in blocks:
            self.play(FadeIn(block, shift=0.3 * RIGHT), run_time=0.5)
        self.play(LaggedStartMap(GrowArrow, links, lag_ratio=0.3), Write(caption))
        self.wait()

        edited = Text("amount 42 → 4.2", font_size=20).set_color(RED).next_to(blocks[0], UP)
        self.play(Write(edited), blocks[0][0].animate.set_stroke(ORANGE, 4))
        self.play(links[0].animate.set_color(RED), Flash(links[0].get_center(), color=RED))
        broken = Text("prev_hash no longer matches: refuse to resume", font_size=22).set_color(RED)
        self.play(Transform(caption, broken.move_to(caption)))
        self.wait()
