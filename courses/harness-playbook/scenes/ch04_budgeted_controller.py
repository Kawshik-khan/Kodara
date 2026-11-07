"""Chapter 04: governed controller lifecycle across a payment timeout (ManimGL).

Render: manimgl scenes/ch04_budgeted_controller.py BudgetedControllerScene -w
Shows RUNNING -> RECOVERING -> WAITING_EXTERNAL -> VERIFYING -> COMPLETED.
"""
from manimlib import *

from kodara_palette import BG, ORANGE, INK, MUTED, LINE, GREEN, BLUE, AMBER

STATES = [
    ("RUNNING", "dispatch_refund -> timeout", ORANGE),
    ("RECOVERING", "effect = UNKNOWN_EFFECT", AMBER),
    ("WAITING_EXTERNAL", "0 model calls burned", BLUE),
    ("VERIFYING", "reconciled: 1 refund found", BLUE),
    ("COMPLETED", "all obligations closed", GREEN),
]


class BudgetedControllerScene(Scene):
    camera_config = dict(background_color=BG)

    def construct(self):
        title = Text("Budgeted Controller · Refund Timeout Recovery", font_size=26).set_color(INK)
        title.to_edge(UP, buff=0.45)
        self.play(FadeIn(title))

        cards = VGroup()
        for state, note, color in STATES:
            box = RoundedRectangle(width=7.8, height=0.82, corner_radius=0.08)
            box.set_stroke(color, 3).set_fill(WHITE, 1)
            left = Text(state, font_size=20).set_color(color)
            right = Text(note, font_size=18).set_color(INK)
            row = VGroup(left, right).arrange(RIGHT, buff=0.6).move_to(box)
            cards.add(VGroup(box, row))

        cards.arrange(DOWN, buff=0.22).next_to(title, DOWN, buff=0.4)

        for i, card in enumerate(cards):
            self.play(FadeIn(card, shift=0.2 * DOWN), run_time=0.45)
            if i < len(cards) - 1:
                arrow = Arrow(card.get_bottom(), cards[i + 1].get_top(), buff=0.04).set_color(LINE)
                self.play(GrowArrow(arrow), run_time=0.2)

        footer = Text("if reconciliation stays down at deadline -> UNRESOLVED_EFFECT", font_size=19).set_color(MUTED)
        footer.next_to(cards, DOWN, buff=0.35)
        self.play(Write(footer))
        self.wait()

