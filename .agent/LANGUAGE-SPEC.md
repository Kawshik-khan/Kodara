# KODARA LANGUAGE SPECIFICATION (NATIVE BANGLA ARCHITECTURE)

## 1. Core Language Principle

Kodara is a bilingual programming education platform where **Bangla is a first-class native language**, not a translated fallback.

The system treats:
- **Bangla (`bn`)** as a complete, native product language.
- **English (`en`)** as a complete, co-equal technical partner language.
- **Programming syntax and keywords** as English by default (`let`, `const`, `function`, `def`, `class`, `import`).
- **Technical terminology** as English-first with natural, conversational Bangla explanations.

Never treat Bangla as a simple machine-translation layer. The Bangla learning experience must feel naturally authored by a Bangladeshi technical educator.

---

## 2. Default Language Behavior

**Default Language**: `bn` (Bangla).

When Bangla (`bn`) is active:
- UI, navigation labels, and buttons render in Bangla.
- Lesson explanations and theory render in natural Bangla.
- Educational instructions, hints, and feedback render in natural Bangla.
- Error explanations and failure diagnoses render in natural Bangla.
- Progress, mastery, and system status messages render in natural Bangla.

However:
- **Code remains unchanged** in syntax and keywords.
- **API names, libraries, and frameworks** remain in English (`fetch`, `React.useState`, `FastAPI`, `PostgreSQL`).
- **Function, variable, and class names** remain in English (`getUserById`, `totalCount`).
- **File names and directory paths** remain in English (`src/features/auth/`).
- **CLI commands** remain in English (`pnpm test`, `git status`).
- **Code comments** may use Bangla only when the lesson specifically requests it for beginner clarity.

---

## 3. Native Bangla — Not Literal Translation

Never translate English sentences word-for-word.

- **Literal/Machine Bangla (Forbidden)**:
  > "ভেরিয়েবল একটি কন্টেইনার যা একটি মান সংরক্ষণ করে।"
- **Natural Kodara Bangla (Preferred)**:
  > "Variable হলো এমন একটি নামযুক্ত জায়গা, যেখানে আমরা কোনো value সংরক্ষণ করতে পারি।"

### Stylistic Guidelines
- Use **সহজ Bangla** (accessible, modern, conversational).
- Avoid Google-Translate-like phrasing, overly archaic formal Bangla, or unnatural Sanskritized vocabulary.
- Prefer concrete code examples before abstract theory.
- Keep sentences short, engaging, and focused on building mental models.

---

## 4. Technical Terminology Policy

Programming terminology remains in English. Do not force artificial translations.

### Canonical Industry Terms (Kept in English)
`Variable`, `Function`, `Array`, `Object`, `Class`, `Interface`, `Type`, `Component`, `State`, `Props`, `Event`, `Promise`, `Async/Await`, `API`, `HTTP`, `Database`, `Query`, `Algorithm`, `Runtime`, `Compiler`, `Interpreter`, `Framework`, `Library`, `Repository`, `Git`, `Branch`, `Commit`, `Deployment`, `Authentication`, `Authorization`, `Encryption`, `Recursion`, `Loop`, `Condition`, `Parameter`, `Argument`, `Return value`.

- **Correct**:
  > "Function হলো এমন একটি reusable block of code..."
- **Incorrect (Forbidden)**:
  > "Function হলো এমন একটি পুনঃব্যবহারযোগ্য কোডের খণ্ড..."

The educational goal is dual mastery:
1. Understanding the underlying concept in natural Bangla.
2. Acquiring the industry-standard English vocabulary required for real-world software engineering.

---

## 5. Bilingual Term Pattern

When introducing an important technical concept for the first time:
```text
English Term + Natural Bangla Explanation
```

Example:
> "Variable হলো এমন একটি নামযুক্ত জায়গা যেখানে আমরা data রাখতে পারি।"
> "এখন থেকে আমরা Variable শব্দটাই ব্যবহার করব।"

Do not repeatedly append phonetic parentheses like `Variable (ভ্যারিয়েবল)` on every sentence. Introduce it clearly once, then use the standard English term naturally in Bangla grammar.

---

## 6. Separation of Code and Bangla Explanation

Every lesson maintains a strict separation:

### 1. Concept
Natural Bangla explanation establishing the mental model.

### 2. Code
Pure programming syntax in standard English.
```python
name = "Kodara"
```

### 3. Explanation
Bangla explanation incorporating the English technical terms:
> "এখানে `name` একটি variable। আমরা `"Kodara"` value-টি এই variable-এর মধ্যে রাখছি।"

Never translate code tokens into Bangla syntax (`নাম = "কোদারা"` is prohibited).

---

## 7. UI Internationalization (i18n) Architecture

User-facing strings must never be hardcoded inside components.

```text
src/
└── i18n/
    ├── index.ts               # i18n initialization & react hook
    ├── config.ts              # Supported languages: ["bn", "en"], default: "bn"
    └── locales/
        ├── bn/                # Bangla locale dictionary
        │   ├── common.ts      # Global actions (এগিয়ে যান, বাতিল, সংরক্ষণ)
        │   ├── navigation.ts  # Menu items (ড্যাশবোর্ড, শিখুন, প্লে-গ্রাউন্ড)
        │   ├── dashboard.ts   # Stats, progress, resume learning
        │   ├── lessons.ts     # Lesson runner controls & sections
        │   ├── exercises.ts   # Challenge UI, code editor actions
        │   ├── errors.ts      # User-friendly error explanations
        │   └── auth.ts        # Login, register, session labels
        └── en/                # English locale dictionary
            ├── common.ts
            ├── navigation.ts
            ├── dashboard.ts
            ├── lessons.ts
            ├── exercises.ts
            ├── errors.ts
            └── auth.ts
```

### Usage in Components
```tsx
import { useTranslation } from "@/i18n";

export function ContinueButton() {
  const { t } = useTranslation();
  return <Button variant="outline">{t("common.continue")}</Button>;
}
```

---

## 8. Semantic Key Design

Translation keys describe **meaning**, never visual styling or position.

- **Good Semantic Keys**:
  `common.continue`, `common.submit`, `lesson.start`, `lesson.nextStep`, `lesson.hint`, `dashboard.progress`, `dashboard.completedTracks`, `errors.syntaxErrorNotice`.
- **Bad Positional Keys**:
  `button1`, `bottomRightText`, `orangeLabel`, `textRow2`.

---

## 9. Language Switching & Persistence

The platform supports seamless switching between `বাংলা` (`bn`) and `English` (`en`).

### Persistence Resolution Order
```text
1. Authenticated user profile preference (database)
       ↓ (if unauthenticated)
2. localStorage ("kodara_lang")
       ↓ (if empty)
3. Browser navigator language (if starts with "bn")
       ↓
4. Kodara platform default: "bn"
```

### Non-Destructive Switching Rule
Switching languages must **never** reset or disturb:
- Current lesson step or scroll position.
- Code buffer contents in Monaco Editor.
- Execution trace timeline or visualization step.
- Active challenge attempts or submitted code.
- UI layout, drawer toggles, or theme settings.

---

## 10. User Preference Data Model

Language is stored strictly as a standardized 2-letter ISO identifier:
```ts
export type Language = "bn" | "en";

export interface UserPreferences {
  language: Language;
  theme: "light";
  playbackSpeed: number;
}
```
Never store localized strings inside database state or user records.

---

## 11. Paired Lesson Content Architecture

Lessons maintain complete structural equivalence across languages:

```text
content/
└── typescript/
    └── modules/
        └── 01-runtime-foundations/
            └── lessons/
                └── 01-variables/
                    ├── lesson.json           # Canonical metadata & challenge IDs
                    ├── theory.bn.md          # Natural Bangla theory
                    ├── theory.en.md          # English theory
                    ├── playground.ts         # Shared, identical code exercise
                    ├── break-it.bn.json      # Bangla break scenario & hints
                    ├── break-it.en.json      # English break scenario & hints
                    └── visualization.json    # Language-neutral state machine
```

### Invariants:
- Learning objectives, concept IDs, challenge test suites, and visualization steps are **identical** between `bn` and `en`.
- Only presentation, explanations, hints, and instructional microcopy change.

---

## 12. Bangla Tone & Writing Style

Kodara Bangla must be:
- **Modern & Conversational**: "চলো দেখি কীভাবে এটা কাজ করে।"
- **Pedagogically Clear**: "এখানে আসলে কী হচ্ছে?"
- **Action-Oriented**: "এখন variable-এর value পরিবর্তন করে দেখো।"

Avoid archaic, literary sadhu-bhasha (e.g., avoid "উক্ত প্রক্রিয়াটির কার্যপ্রণালী পর্যবেক্ষণ করিব").

---

## 13. Controlled Terminology Mixing

Code education naturally involves controlled English/Bangla mixing:
- **Good**: "এই function-এ আমরা একটি parameter পাঠাচ্ছি।"
- **Good**: "Array-এর প্রতিটি item loop-এর মাধ্যমে access করা হচ্ছে।"
- **Good**: "React component-এর state পরিবর্তন হলে UI আবার render হয়।"
- **Excessive/Bad**: "এই function-টার ভিতরের জিনিসটা basically execute হয়ে তারপর output-এর জিনিসটা return করে দেয়..."

Keep English technical words purposeful and grammatically integrated.

---

## 14. Error Messages & Diagnostics

Error messages presented to Bangla learners must be pedagogically actionable without translating technical identifiers.

- **Syntax Error**:
  > "Code-এ syntax-এর সমস্যা আছে। উপরের line-টি আবার check করো।"
- **Null / Undefined Dereference (`TypeError: Cannot read properties of undefined`)**:
  > "এই জায়গায় একটি value পাওয়া যাওয়ার কথা ছিল, কিন্তু সেখানে `undefined` পাওয়া গেছে।"

The raw technical error stack trace must always remain accessible via a **"Details" / "বিস্তারিত"** toggle.

---

## 15. Progressive Hint System (Bangla)

Hints escalate progressively without immediately handing over the answer:
- **Hint 1 (Conceptual Nudge)**:
  > "প্রথমে দেখো variable-টির মধ্যে কোন value রাখা আছে।"
- **Hint 2 (Diagnostic Question)**:
  > "এখন সেই value পরিবর্তন করার জন্য assignment operator ব্যবহার করো।"
- **Hint 3 (Targeted Explanation & Syntax)**:
  > "`=` operator ব্যবহার করে নতুন value assign করা যায়।"

---

## 16. Socratic AI Tutor Language Behavior

The AI Tutor dynamically adopts the learner's active language:
- When `language = "bn"`:
  - Explains concepts in natural, conversational Bangla.
  - Keeps all technical terms and code tokens in English.
  - Explains code line-by-line in Bangla when requested.
  - Avoids unsolicited English paragraphs.
- When `language = "en"`:
  - Responds entirely in technical English.

---

## 17. Typography & Font Stack

Bangla glyphs require clean, highly legible typography with proper conjunct rendering.

```css
:root {
  --font-sans: "Noto Sans Bengali", "Noto Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", monospace;
}
```

### Typographic Invariants
- Body text line-height must be at least `1.6` to accommodate Bangla ascenders and descenders.
- Never use decorative display fonts for educational body text or code explanations.
- Do not artificially increase letter-spacing on Bangla text (it breaks conjunct ligature connections).

---

## 18. Responsive Layout & Horizontal Text Expansion

Bangla text typically requires **20% to 35% more horizontal width** than equivalent English words:
- English: `Continue` (8 chars) → Bangla: `এগিয়ে যান` (10 chars, wider glyphs).
- English: `Run Code` → Bangla: `কোড রান করুন`.

### Layout Invariants
- **Never use fixed-width containers** for buttons, badges, navigation links, or card headers.
- Use `min-width`, `flex-wrap`, and `auto` margins.
- Ensure buttons and bento cards wrap gracefully on 360px mobile viewports in Bangla mode without clipping or overflow.

---

## 19. Canonical Data Model & API Rules

- **Database Rule**: All database rows, enum values, and status columns store canonical English identifiers (`status = "completed"`, `difficulty = "beginner"`).
- **API Rule**: REST and WebSocket responses return canonical English keys and enum values. Translation occurs entirely on the frontend presentation layer.
- **Search Rule**: Global search supports queries in English (`variable`), phonetic Bangla (`ভেরিয়েবল`), and mixed natural phrases (`variable কী`, `React স্টেট`).
