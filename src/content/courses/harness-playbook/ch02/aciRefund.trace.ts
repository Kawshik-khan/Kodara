import {
  CodeTraceDefinition,
  RecordedTrace,
  TraceNote,
} from "@/features/code-trace/types/trace.types";
import traceJson from "./aciRefund.trace.json";

// Recorded by courses/harness-playbook/tools/record_trace.py; JSON widens the event unions.
const trace = traceJson as unknown as RecordedTrace;

/**
 * Notes for every traced line of harness/ch02/aci_refund.py.
 * Keys: line number, "!" for exception events, "^" for return events.
 * Re-check line numbers whenever the trace is re-recorded.
 */
const NOTES: Record<string, TraceNote> = {
  "75": {
    what: { bn: "Harness তৈরি হচ্ছে। `self.provider = provider` দিয়ে payment provider-এর reference harness-এর ভেতরে রাখা হচ্ছে।", en: "The harness is being built. `self.provider = provider` stores a reference to the payment provider inside it." },
    why: { bn: "Harness নিজে টাকা ফেরত দেয় না। সে শুধু ঠিক করে কখন আর কীভাবে বাইরের সিস্টেমকে ডাকা হবে। Provider বাইরে থেকে দেওয়া হয় (dependency injection), তাই test-এ নকল provider বসানো যায়, যেমন এখানে `lose_first_ack=True` দিয়ে।", en: "The harness never moves money itself. It decides when and how the external system is called. The provider is passed in (dependency injection), so a test can plug in a fake one, like this one with `lose_first_ack=True`." },
    without: { bn: "Harness নিজেই provider বানালে \"উত্তর হারানো\" অবস্থাটা test করা কঠিন হতো। যে failure test করা যায় না, সেটা প্রথম দেখা যায় production-এ।", en: "If the harness built its own provider, the lost-response case would be hard to test. A failure you cannot test is one you first meet in production." },
    ref: "Effect adapter · p. 56",
  },
  "78": {
    what: { bn: "`run()` শুরু। প্রথম কাজ: operation-কে PROPOSED থেকে VALIDATED-এ নেওয়ার অনুরোধ, সাথে কারণ লেখা।", en: "`run()` starts. First it asks to move the operation from PROPOSED to VALIDATED, with a reason attached." },
    why: { bn: "মডেলের proposal শুধু একটা দাবি। Validate মানে deterministic check: schema ঠিক, account ID harness নিজে bind করেছে (মডেল copy করেনি), আর €42 ledger-এর duplicate charge-এর সাথে মেলে। এই ছোট উদাহরণে check-গুলো একটা note দিয়ে দেখানো; বড় system-এ এগুলো আলাদা function।", en: "The model's proposal is only a claim. Validation means deterministic checks: the schema is right, the harness bound the account ID itself (the model did not copy it), and €42 matches the duplicate charge. This small example summarizes the checks in a note; a larger system gives each its own function." },
    without: { bn: "Validation না থাকলে মডেল সঠিক format-এ ভুল customer-এর ID দিলেও সেটা সামনে এগিয়ে যেত।", en: "Without validation, a well-formed proposal for the wrong customer would move forward." },
    ref: "Proposal contract · pp. 61–62",
  },
  "65": {
    what: { bn: "`move()`-এর guard: {object.op.state} → {local.to} কি `LEGAL` table-এ আছে?", en: "The guard in `move()`: is {object.op.state} → {local.to} in the `LEGAL` table?" },
    why: { bn: "Run একটা state machine, conversation না। প্রতিটা transition-এর একটা guard থাকে, যাতে মডেল, কোনো bug বা অন্য worker ধাপ লাফিয়ে যেতে না পারে। যেমন PREPARED থেকে সরাসরি COMMITTED যাওয়া যায় না।", en: "A run is a state machine, not a conversation. Every transition has a guard, so neither the model, a bug, nor another worker can skip a step. PREPARED cannot jump straight to COMMITTED, for example." },
    without: { bn: "Guard না থাকলে \"মডেল বলেছে done\" দিয়েই COMMITTED লেখা যেত, কোনো evidence ছাড়াই। এখানে অবৈধ হলে `RuntimeError` হয় আর state যেমন ছিল তেমনই থাকে।", en: "Without the guard, \"the model said done\" could write COMMITTED with no evidence. Here an illegal move raises `RuntimeError` and the state stays as it was." },
    ref: "Every transition has a guard · p. 37",
  },
  "67": {
    what: { bn: "Transition-টা `op.log`-এ এক লাইনে লেখা হচ্ছে: আগের state, নতুন state আর কারণ।", en: "The transition is written to `op.log` as one line: old state, new state and the reason." },
    why: { bn: "এটাই durable operation record। Crash, retry বা অন্য worker কাজ হাতে নিলে conversation না, এই record পড়েই বোঝা যায় কাজ কোথায় আছে। খেয়াল করো, log লেখা হয় state বদলানোর আগে।", en: "This is the durable operation record. After a crash, a retry or a handoff, this record, not the conversation, tells you where the work stands. Notice the log is written before the state changes." },
    without: { bn: "Record না থাকলে timeout-এর পর কেউ বলতে পারত না refund পাঠানো হয়েছিল কি না। তখন অনুমান করে retry হতো।", en: "Without the record, nobody could say after a timeout whether the refund was sent. The system would retry on a guess." },
    ref: "Resume from durable state · p. 38",
  },
  "68": {
    what: { bn: "`self.state = to`: op.state এখন {local.to} হবে। পরের ধাপে Object panel-এ বদলটা দেখবে।", en: "`self.state = to`: op.state becomes {local.to}. You will see it change in the Objects panel on the next step." },
    why: { bn: "Guard পাস করেছে, log লেখা হয়েছে, তাই এখন state বদলানো নিরাপদ। ক্রমটা গুরুত্বপূর্ণ: আগে যাচাই, তারপর রেকর্ড, তারপর বদল।", en: "The guard passed and the log is written, so changing the state is now safe. The order matters: check, then record, then change." },
    without: { bn: "State আগে বদলে log লিখতে গিয়ে crash হলে record আর আসল অবস্থা আলাদা হয়ে যেত।", en: "If the state changed first and the process crashed before logging, the record and reality would disagree." },
    ref: "Run as a state machine · p. 37",
  },
  "79": {
    what: { bn: "`op.amount >= self.CEILING`: €{object.op.amount} কি €100 সীমার সমান বা বেশি?", en: "`op.amount >= self.CEILING`: is €{object.op.amount} at or above the €100 ceiling?" },
    why: { bn: "এটা authority gate। Policy বলে এই run একা শুধু €100-এর নিচে refund দিতে পারে। সীমাটা code-এ class constant হিসেবে আছে, মডেলের prompt-এ না, তাই মডেল যুক্তি দিয়ে এটা বদলাতে পারে না।", en: "This is the authority gate. Policy lets this run refund only below €100 on its own. The limit lives in code as a class constant, not in the model's prompt, so the model cannot argue its way past it." },
    without: { bn: "সীমাটা শুধু prompt-এ লেখা থাকলে (\"€100-এর বেশি দিও না\"), একটা চতুর customer message মডেলকে রাজি করিয়ে ফেলতে পারত।", en: "If the limit lived only in the prompt (\"never refund over €100\"), a clever customer message could talk the model out of it." },
    ref: "Authority gate · pp. 56, 61",
  },
  "80": {
    what: { bn: "€{object.op.amount} সীমা ছাড়িয়েছে। Run WAITING_APPROVAL-এ যায় আর এখানেই `return` করে। কোনো refund পাঠানো হয় না।", en: "€{object.op.amount} is over the ceiling. The run moves to WAITING_APPROVAL and `return`s here. No refund is sent." },
    why: { bn: "বড় অঙ্কের জন্য একজন মানুষ approve করবেন। তিনি tool syntax না, ঠিক পরিণতিটা approve করেন: কোন card, কত টাকা, কোন policy। Approval সেই frozen proposal-এর সাথে বাঁধা থাকে।", en: "A person approves larger amounts. They approve the exact consequence, not tool syntax: which card, how much, under which policy. The approval is bound to that frozen proposal." },
    without: { bn: "Agent নিজে \"approve\" লিখতে পারলে prompt injection দিয়ে নিজের অনুমতি নিজেই বানিয়ে নিত। তাই approval channel agent-এর নাগালের বাইরে।", en: "If the agent could write its own approval, a prompt injection could manufacture the permission it needs. So the approval channel sits outside its reach." },
    ref: "Approval is a commit protocol · p. 65",
  },
  "81": {
    what: { bn: "€{object.op.amount} সীমার নিচে, তাই AUTHORIZED-এর অনুরোধ।", en: "€{object.op.amount} is below the ceiling, so it requests AUTHORIZED." },
    why: { bn: "Authorized মানে এই identity, এই case, এই অঙ্ক আর এই policy version মিলিয়ে action-টা অনুমোদিত। Tool দেখতে পাওয়া আর অনুমতি থাকা এক জিনিস না।", en: "Authorized means this identity, this case, this amount and this policy version together permit the action. Seeing a tool is not the same as being allowed to use it." },
    without: { bn: "Tool দেখা গেলেই চালানো গেলে, যে run-এর শুধু preview করার কথা সেও টাকা পাঠিয়ে দিতে পারত।", en: "If seeing a tool meant permission, a run meant only to preview could send money." },
    ref: "Discoverability ≠ authorization · p. 57",
  },
  "83": {
    what: { bn: "`op.key = f\"refund-case-{op.case}-v{case_version}\"`: dispatch-এর আগে idempotency key তৈরি হচ্ছে।", en: "`op.key = f\"refund-case-{op.case}-v{case_version}\"`: the idempotency key is created before dispatch." },
    why: { bn: "Key বানানো হয়েছে case আর version থেকে, চেষ্টার নম্বর থেকে না। তাই এই refund যতবারই চেষ্টা হোক, key একই থাকে, আর provider একই key-তে দ্বিতীয়বার টাকা দেয় না। চেষ্টাকে না, দায়িত্বকে key করো।", en: "The key comes from the case and version, not from an attempt number. However many times this refund is tried, the key stays the same, and the provider never pays twice for one key. Key the obligation, not the attempt." },
    without: { bn: "Naive retry scenario দেখো: সেখানে key-তে attempt নম্বর আছে, তাই প্রতিটা চেষ্টা নতুন refund।", en: "See the Naive retry scenario: its key contains the attempt number, so every try becomes a new refund." },
    ref: "Idempotency · pp. 63–64",
  },
  "84": {
    what: { bn: "Key-সহ PREPARED। Log-এ এখন `key=refund-case-882-v17` লেখা থাকবে।", en: "PREPARED, with the key. The log will now hold `key=refund-case-882-v17`." },
    why: { bn: "Intent আর key টাকা পাঠানোর আগেই record-এ চলে গেল। এরপর crash বা timeout যা-ই হোক, পরের worker জানবে কোন key দিয়ে খুঁজতে হবে।", en: "The intent and key reach the record before any money moves. Whatever happens next, crash or timeout, the next worker knows which key to look up." },
    without: { bn: "Key dispatch-এর পরে লেখা হলে timeout-এর মুহূর্তে কারো কাছে key থাকত না, reconcile করার উপায়ও থাকত না।", en: "If the key were written after dispatch, nobody would hold it at the moment of a timeout, and there would be nothing to reconcile with." },
    ref: "Persist before dispatch · p. 64",
  },
  "85": {
    what: { bn: "State DISPATCHED হচ্ছে, provider-কে ডাকার ঠিক আগে।", en: "The state becomes DISPATCHED, just before the provider is called." },
    why: { bn: "এই লাইনের পর বাইরের দুনিয়ায় effect থাকতে পারে। তাই call-এর আগেই record বলে দেয় \"পাঠানো হচ্ছে\"।", en: "After this line an external effect may exist. So the record says \"sending\" before the call, not after." },
    without: { bn: "PREPARED রেখে call করলে crash-এর পর recovery ভাবত কিছুই পাঠানো হয়নি, আর আবার পাঠাত।", en: "If the call happened while still PREPARED, recovery after a crash would assume nothing was sent and send again." },
    ref: "Action protocol · p. 40",
  },
  "86": {
    what: { bn: "`try` block শুরু।", en: "The `try` block begins." },
    why: { bn: "বাইরের সিস্টেম ব্যর্থ হতে পারে, তাই call-টা `try`-এর ভেতরে। কিন্তু আসল design হলো `except`-এ কী করা হয়: retry, নাকি reconcile?", en: "External systems fail, so the call sits inside `try`. The real design decision is what `except` does: retry, or reconcile?" },
    without: { bn: "Error না ধরলে পুরো run crash করত, আর operation DISPATCHED অবস্থায় আটকে থাকত।", en: "Without catching the error, the run would crash and the operation would be stuck at DISPATCHED." },
    ref: "Error messages are control inputs · p. 62",
  },
  "87": {
    what: { bn: "`self.provider.refund(op.key, op.amount)`: একই key দিয়ে provider-কে টাকা ফেরত দিতে বলা হচ্ছে।", en: "`self.provider.refund(op.key, op.amount)`: the provider is asked to refund, using the same key." },
    why: { bn: "Key আর amount দুটোই আসে operation record থেকে, মডেলের নতুন লেখা value থেকে না। Commit-এর input যত সরু, ভুলের জায়গা তত কম।", en: "Both key and amount come from the operation record, not from fresh values the model wrote. The narrower commit's input, the less room for error." },
    without: { bn: "মডেল এখানে নতুন করে amount লিখলে approve করা অঙ্ক আর পাঠানো অঙ্ক আলাদা হতে পারত।", en: "If the model rewrote the amount here, the approved amount and the sent amount could differ." },
    ref: "Commit takes a frozen proposal · p. 59",
  },
  "87!": {
    what: { bn: "Timeout `run()`-এ এসে পৌঁছাল: {detail}", en: "The Timeout arrives in `run()`: {detail}" },
    why: { bn: "Object panel-এ provider দেখো: ledger-এ refund আগেই আছে। Timeout বলছে \"উত্তর আসেনি\", \"টাকা যায়নি\" না। Harness-এর কাছে এখন অনিশ্চয়তা, failure না।", en: "Look at the provider in the Objects panel: the refund is already in the ledger. The timeout says \"no answer came back\", not \"no money moved\". The harness now faces uncertainty, not failure." },
    without: { bn: "ঠিক এখানে timeout-কে failure ধরলেই naive retry-এর ভুল শুরু হয়।", en: "Treating this timeout as failure is exactly where the naive retry goes wrong." },
    ref: "Unknown is not failed · p. 41",
  },
  "46": {
    what: { bn: "`setdefault`: key {local.key} আগেই আছে, তাই নতুন refund হবে না।", en: "`setdefault`: key {local.key} already exists, so no new refund is made." },
    why: { bn: "Provider idempotent: একই key-তে আবার অনুরোধ এলে সে নতুন refund বানায় না, আগেরটাই রাখে। আসল payment API-ও (যেমন Stripe-এর idempotency key) এভাবেই কাজ করে।", en: "The provider is idempotent: a repeat request with the same key creates no new refund. Real payment APIs, such as Stripe with idempotency keys, behave the same way." },
    without: { bn: "Idempotency শুধু একই key-তে কাজ করে। Key বদলালে (naive retry-এর মতো) provider এটাকে সম্পূর্ণ নতুন refund ভাবে।", en: "Idempotency only works for the same key. Change the key, as the naive retry does, and the provider sees a brand-new refund." },
    ref: "Idempotency · p. 64",
    variants: [
      {
        when: { changesNext: "provider.ledger" },
        what: { bn: "`setdefault`: key {local.key} ledger-এ নেই, তাই একটা €{local.amount} refund যোগ হবে।", en: "`setdefault`: key {local.key} is not in the ledger, so one €{local.amount} refund is added." },
      },
    ],
  },
  "47": {
    what: { bn: "`if self.lose_ack`: এবারের উত্তর কি হারাবে?", en: "`if self.lose_ack`: will this response be lost?" },
    why: { bn: "এটা simulation-এর flag। বাস্তবে network কখন কাটবে আমরা ঠিক করি না; এখানে ইচ্ছা করে প্রথম উত্তরটা হারানো হচ্ছে, যাতে কঠিন case-টা প্রতিবার নিশ্চিতভাবে test করা যায় (failure injection)।", en: "This is a simulation flag. In reality we do not choose when the network drops; here the first response is lost on purpose so the hard case is tested every time (failure injection)." },
    without: { bn: "Failure injection না থাকলে test সবসময় happy path-এ চলে, আর timeout-এর code কখনো চলেই না।", en: "Without failure injection, tests only walk the happy path and the timeout code never runs." },
    ref: "Testing That Earns Trust · ch. 05",
  },
  "48": {
    what: { bn: "`self.lose_ack = False`: উত্তর শুধু একবারই হারাবে।", en: "`self.lose_ack = False`: the response is lost only once." },
    why: { bn: "পরের call স্বাভাবিক উত্তর দেবে। এতে দুই design পাশাপাশি দেখা যায়: harness scenario-তে retry নেই, naive scenario-তে আছে, আর দ্বিতীয় call সফল হয়।", en: "The next call answers normally. That lets you compare both designs: the harness never retries, the naive version does, and its second call succeeds." },
  },
  "49": {
    what: { bn: "Refund commit হয়ে গেছে, এখন `raise Timeout(...)`।", en: "The refund is committed; now `raise Timeout(...)`." },
    why: { bn: "এটাই বইয়ের মূল কঠিন case: provider টাকা দিয়েছে, কিন্তু উত্তর harness পর্যন্ত পৌঁছায়নি। Code-এর ক্রম দেখো: line 46-এ ledger বদলেছে, তারপর line 49-এ exception।", en: "This is the book's central hard case: the provider paid, but the answer never reached the harness. Note the order in the code: the ledger changed on line 46, the exception comes on line 49." },
    ref: "The acknowledgement that never arrived · p. 27",
  },
  "49!": {
    what: { bn: "`refund()`-এর ভেতরে exception তৈরি হলো: {detail}", en: "An exception is raised inside `refund()`: {detail}" },
    why: { bn: "Exception এখন call stack বেয়ে উপরে উঠবে। Call stack panel দেখো: পরের ধাপে `refund()` frame সরে যাবে।", en: "The exception now climbs the call stack. Watch the Call stack panel: on the next step the `refund()` frame disappears." },
  },
  "89": {
    what: { bn: "`except Timeout as err`: harness timeout ধরল।", en: "`except Timeout as err`: the harness catches the timeout." },
    why: { bn: "এখানে কোনো retry নেই, ইচ্ছা করেই। Dispatch হয়ে থাকতে পারে, তাই আগে জানতে হবে আসলে কী ঘটেছে।", en: "There is deliberately no retry here. Dispatch may have happened, so first find out what actually occurred." },
    without: { bn: "এখানে আবার `refund()` ডাকলে, naive scenario-র মতো দ্বিতীয় refund হতে পারত।", en: "Calling `refund()` again here could create a second refund, as in the naive scenario." },
    ref: "Retry decision order · p. 65",
  },
  "90": {
    what: { bn: "UNKNOWN_EFFECT-এর অনুরোধ, কারণসহ: \"reconcile, do not retry\"।", en: "Requests UNKNOWN_EFFECT, with the reason \"reconcile, do not retry\"." },
    why: { bn: "FAILED মানে নিশ্চিত কিছু হয়নি; UNKNOWN_EFFECT মানে হয়তো হয়েছে। দুটোর পরের পদক্ষেপ সম্পূর্ণ আলাদা, তাই state-ও আলাদা।", en: "FAILED means nothing happened, for sure. UNKNOWN_EFFECT means it may have happened. The next steps differ completely, so the states differ too." },
    without: { bn: "একটা `success=False` boolean দিয়ে এই পার্থক্য হারিয়ে যেত।", en: "A single `success=False` boolean would erase this difference." },
    ref: "Terminal states preserve meaning · p. 37",
  },
  "92": {
    what: { bn: "`found = self.provider.lookup(op.key)`: reconcile।", en: "`found = self.provider.lookup(op.key)`: reconcile." },
    why: { bn: "Harness নিজের অনুমান বা মডেলের কথায় ভরসা করে না। সত্য জানে provider-এর ledger, অর্থাৎ authoritative system। একই key দিয়ে খুঁজলেই বোঝা যায় refund হয়েছে কি না।", en: "The harness trusts neither its own guess nor the model. The provider's ledger, the authoritative system, knows the truth. Looking up the same key shows whether the refund happened." },
    without: { bn: "মডেলকে জিজ্ঞেস করলে (\"refund কি হয়েছে?\") সে আত্মবিশ্বাসী উত্তর দিত, কিন্তু সেটা evidence না।", en: "Ask the model \"did the refund go through?\" and it will answer confidently, but that is not evidence." },
    ref: "Reconciled · p. 41",
  },
  "53": {
    what: { bn: "`lookup()`: ledger dictionary-তে key খুঁজছে।", en: "`lookup()`: searches the ledger dictionary for the key." },
    why: { bn: "`.get(key)` key থাকলে amount, না থাকলে `None` ফেরত দেয়। এই read কিছু বদলায় না, তাই যতবার খুশি নিরাপদে করা যায়। এজন্যই inspect আর commit আলাদা verb।", en: "`.get(key)` returns the amount if the key exists, `None` if not. This read changes nothing, so it is safe to repeat. That is why inspect and commit are separate verbs." },
    ref: "Inspect vs commit · p. 59",
  },
  "53^": {
    what: { bn: "`lookup()` ফেরত দিল {detail}।", en: "`lookup()` returns {detail}." },
    why: { bn: "Refund সত্যিই হয়েছে, ঠিক একবার। Harness-এর কাছে এখন অনুমান না, প্রমাণ আছে।", en: "The refund really happened, exactly once. The harness now has proof, not a guess." },
    ref: "Evidence hook · p. 57",
  },
  "93": {
    what: { bn: "`if found is None`: refund কি পাওয়া যায়নি?", en: "`if found is None`: was the refund missing?" },
    why: { bn: "না পাওয়া গেলে run ESCALATED হতো। বই বলে, provider-এর finality window পার হওয়ার পরে policy একই key দিয়ে retry-এর অনুমতি দিতে পারে। এখানে পাওয়া গেছে, তাই run এগোয়।", en: "If missing, the run would go to ESCALATED. The book says policy may allow a same-key retry once the provider's finality window has passed. Here it was found, so the run continues." },
    ref: "B2 recoverable harness · p. 28",
  },
  "95": {
    what: { bn: "RECONCILED-এর অনুরোধ, কারণ: \"ledger holds 1 refund of EUR 42.00\"।", en: "Requests RECONCILED, with the reason \"ledger holds 1 refund of EUR 42.00\"." },
    why: { bn: "Log-এ এখন evidence-সহ লেখা থাকল। পরে audit করলে দেখা যাবে harness কেন বিশ্বাস করেছিল refund হয়েছে।", en: "The log now carries the evidence. A later audit can see why the harness believed the refund happened." },
    ref: "Reconciled · p. 41",
  },
  "96": {
    what: { bn: "VERIFIED-এর অনুরোধ।", en: "Requests VERIFIED." },
    why: { bn: "Verified মানে task contract পূরণ হয়েছে: refund, customer-কে message আর case version একসাথে বাঁধা। এখানে note দিয়ে দেখানো; বড় system-এ এটা আলাদা verifier।", en: "Verified means the task contract is met: refund, customer message and case version are bound together. Here it is a note; a larger system uses a separate verifier." },
    without: { bn: "শুধু API-র \"200 OK\" দেখে verified বললে partial effect চোখ এড়িয়ে যেত।", en: "Calling it verified on an API \"200 OK\" alone would miss partial effects." },
    ref: "Verified and committed · p. 41",
  },
  "97": {
    what: { bn: "COMMITTED-এর অনুরোধ। এটাই শেষ ধাপ।", en: "Requests COMMITTED, the final step." },
    why: { bn: "Completion দাঁড়িয়ে আছে evidence-এর ওপর। পুরো log পড়ে দেখো: timeout হওয়া সত্ত্বেও ledger-এ ঠিক একটা refund।", en: "Completion rests on evidence. Read the whole log: despite the timeout, the ledger holds exactly one refund." },
    ref: "What actually works · p. 28",
  },
  "102": {
    what: { bn: "`for attempt in range(1, 4)`: সর্বোচ্চ তিনবার চেষ্টা।", en: "`for attempt in range(1, 4)`: up to three attempts." },
    why: { bn: "\"তিনবার retry করো\" শুনতে নিরাপদ লাগে। বই বলে এটা কোনো recovery design না। দেখো কেন।", en: "\"Retry three times\" sounds safe. The book says it is not a recovery design. Watch why." },
    ref: "Retries are a budgeted policy · p. 64",
    variants: [
      {
        when: { localPresent: "attempt" },
        what: { bn: "Loop আবার ঘুরছে: attempt {local.attempt}-এর পরের চেষ্টা।", en: "The loop comes round again: the try after attempt {local.attempt}." },
        why: { bn: "কোনো reconcile হয়নি। Code জানেই না আগের refund হয়েছে কি না, তবু আবার পাঠাচ্ছে।", en: "No reconcile happened. The code does not know whether the last refund went through, and sends again anyway." },
      },
    ],
  },
  "103": {
    what: { bn: "`try` block শুরু।", en: "The `try` block begins." },
    why: { bn: "Error ধরা হবে ঠিকই, কিন্তু ধরার পর যা করা হবে সেটাই ভুল।", en: "The error will be caught, but what happens after the catch is the mistake." },
  },
  "104": {
    what: { bn: "`provider.refund(f\"{case}-attempt-{attempt}\", amount)`: key হবে 882-attempt-{local.attempt}।", en: "`provider.refund(f\"{case}-attempt-{attempt}\", amount)`: the key will be 882-attempt-{local.attempt}." },
    why: { bn: "Key-তে attempt নম্বর আছে, তাই provider প্রতিটা চেষ্টাকে নতুন operation ভাবে। এটাই bug: দায়িত্বকে না, চেষ্টাকে key করা হয়েছে।", en: "The key contains the attempt number, so the provider treats every try as a new operation. That is the bug: it keys the attempt, not the obligation." },
    without: { bn: "Harness scenario-র line 83 দেখো: সেখানে key case আর version থেকে বানানো, তাই retry হলেও একই key থাকে।", en: "Compare line 83 in the harness scenario: there the key comes from case and version, so it stays the same on any retry." },
    ref: "Idempotency · p. 63",
  },
  "104!": {
    what: { bn: "Timeout `naive_retry()`-এ পৌঁছাল।", en: "The Timeout reaches `naive_retry()`." },
    why: { bn: "Object panel-এ ledger দেখো: refund #1 আছে। কিন্তু এই code ledger কখনো দেখবে না।", en: "Look at the ledger in the Objects panel: refund #1 is there. This code will never check it." },
    ref: "Unknown is not failed · p. 41",
  },
  "104^": {
    what: { bn: "`naive_retry()` শেষ, ledger-এ দুটো refund।", en: "`naive_retry()` ends with two refunds in the ledger." },
    why: { bn: "মডেল কোনো ভুল করেনি, provider-ও না। Interface অন্ধ retry করতে দিয়েছে, তাই customer €42-এর জায়গায় €84 পেল।", en: "Neither the model nor the provider made a mistake. The interface allowed a blind retry, so the customer got €84 instead of €42." },
    without: { bn: "Visual section-এর line chart-এ দেখো, ack হারানোর হার বাড়লে এটা কত ঘন ঘন ঘটে।", en: "The line chart in the Visual section shows how often this happens as the ack-loss rate rises." },
    ref: "The acknowledgement that never arrived · p. 27",
  },
  "105": {
    what: { bn: "`except Timeout`: timeout ধরা হলো।", en: "`except Timeout`: the timeout is caught." },
    why: { bn: "এখানে timeout-কে failure ধরা হচ্ছে, অথচ dispatch হয়ে গেছে।", en: "Here the timeout is treated as failure, although dispatch already happened." },
    without: { bn: "ঠিক কাজ হতো line 92-এর মতো reconcile করা: একই key দিয়ে ledger পড়া।", en: "The right move is to reconcile, as line 92 does: read the ledger with the same key." },
    ref: "Error taxonomy · p. 62",
  },
  "106": {
    what: { bn: "`continue`: reconcile ছাড়াই আবার চেষ্টা।", en: "`continue`: try again without reconciling." },
    why: { bn: "পরের চেষ্টা নতুন key পাবে, তাই provider-এর idempotency কোনো কাজে আসবে না।", en: "The next try gets a new key, so the provider's idempotency cannot help." },
    without: { bn: "ফল: দ্বিতীয় refund। পরের কয়েক ধাপে ledger দেখো।", en: "Result: a second refund. Watch the ledger over the next few steps." },
    ref: "Retries are a budgeted policy · p. 64",
  },
  "50": {
    what: { bn: "এবার উত্তর হারায়নি: `return \"refunded\"`।", en: "This time the response is not lost: `return \"refunded\"`." },
    why: { bn: "Provider ঠিকঠাক কাজ করছে। সমস্যাটা provider-এ না, harness-এর retry design-এ।", en: "The provider works correctly. The problem is not the provider; it is the retry design." },
  },
  "50^": {
    what: { bn: "`refund()` ফেরত দিল {detail}।", en: "`refund()` returns {detail}." },
    why: { bn: "Naive harness এটাকে সাফল্য ভাবে। কিন্তু ledger দেখো: এখন দুটো entry।", en: "The naive harness reads this as success. Look at the ledger: two entries now." },
  },
};

export const ACI_REFUND_TRACE: CodeTraceDefinition = {
  id: "ai-engineering.harness.ch02.aci-refund",
  titleEn: "Line-by-line trace",
  titleBn: "Code লাইন ধরে ধরে",
  descriptionEn: "The code was actually run and every line recorded. Step through to see which line runs, what is on the call stack, and which values change.",
  descriptionBn: "Code-টা আসলে চালিয়ে প্রতিটা line রেকর্ড করা হয়েছে। ধাপে ধাপে দেখো কোন line চলছে, call stack-এ কে আছে, আর কোন value বদলাচ্ছে।",
  displayPath: "harness/ch02/aci_refund.py",
  trace,
  scenarios: [
    { id: "ack", title: { en: "Harness · ack lost", bn: "Harness · ack হারানো" }, initialStep: "firstCaughtException" },
    { id: "limit", title: { en: "Harness · €140", bn: "Harness · €140" } },
    { id: "naive", title: { en: "Naive retry", bn: "Naive retry" } },
  ],
  notes: NOTES,
  objectTypes: { op: "Operation", provider: "PaymentProvider" },
};
