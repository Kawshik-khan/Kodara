import {
  CodeTraceDefinition,
  RecordedTrace,
  TraceNote,
} from "@/features/code-trace/types/trace.types";
import traceJson from "./eventLog.trace.json";

// Recorded by courses/harness-playbook/tools/record_trace.py; JSON widens the event unions.
const trace = traceJson as unknown as RecordedTrace;

/**
 * Notes for every traced line of harness/ch01/event_log.py.
 * Keys: line number, "!" for exception events, "^" for return events.
 * Re-check line numbers whenever the trace is re-recorded.
 */
const NOTES: Record<string, TraceNote> = {
  // worker: the crash
  "71": {
    what: { bn: "Worker শুরু: refund-এর key `refund-case-882`।", en: "The worker starts: the refund key is `refund-case-882`." },
    why: { bn: "Key দায়িত্বকে চিহ্নিত করে (অধ্যায় ০২)। পরে recovery এই key দিয়েই খুঁজবে।", en: "The key names the obligation (Chapter 02). Recovery will later look things up by this key." },
    ref: "The failure that reveals the architecture · p. 30",
  },
  "72": {
    what: { bn: "`log.append(\"effect_dispatched\", ...)`: টাকা পাঠানোর আগেই intent event log-এ লেখা হচ্ছে।", en: "`log.append(\"effect_dispatched\", ...)`: the intent is written to the event log before any money moves." },
    why: { bn: "Crash যেকোনো মুহূর্তে হতে পারে। Intent আগে লেখা থাকলে পরে জানা যায় একটা effect হয়তো ঘটেছে, এমনকি উত্তর না এলেও।", en: "A crash can happen at any moment. With the intent written first, recovery knows an effect may exist even if no answer ever arrived." },
    without: { bn: "Intent না লিখে পাঠালে crash-এর পর কোনো record থাকত না যে টাকা পাঠানো শুরু হয়েছিল।", en: "Sending without writing the intent leaves no record that a payment was ever started." },
    ref: "Persist intent before dispatch · pp. 28, 64",
  },
  "26": {
    what: { bn: "`append()`: নতুন event-এর `prev_hash` বের করা হচ্ছে: আগের event-এর digest, আর log খালি হলে \"genesis\"।", en: "`append()`: computes the new event's `prev_hash`: the previous event's digest, or \"genesis\" for an empty log." },
    why: { bn: "প্রতিটা event আগেরটার hash বহন করে, তাই event-গুলো একটা শিকলে বাঁধা। পুরোনো কোনো event বদলালে শিকল ভেঙে যায়।", en: "Each event carries the hash of the one before, so the events form a chain. Editing any old event breaks the chain." },
    ref: "Event integrity_hash · pp. 34–35",
  },
  "27": {
    what: { bn: "নতুন `Event` log-এর শেষে যোগ হচ্ছে, নতুন sequence নম্বরসহ।", en: "A new `Event` is added to the end of the log with the next sequence number." },
    why: { bn: "Log শুধু append হয়। ভুল সংশোধন মানে নতুন event যোগ করা, পুরোনোটা বদলানো না। Objects panel-এ log বড় হতে দেখো।", en: "The log is append-only. A correction is a new event, never an edit. Watch the log grow in the Objects panel." },
    without: { bn: "ইতিহাস বদলানো গেলে audit, replay বা ঘটনার পরে পুনর্গঠন, কোনোটাতেই ভরসা করা যেত না।", en: "If history could be edited, neither audit, replay nor post-incident reconstruction could be trusted." },
    ref: "Events are append-only · p. 35",
  },
  "73": {
    what: { bn: "`provider.refund(key, 42.0)`: payment system-কে টাকা ফেরত দিতে বলা হচ্ছে।", en: "`provider.refund(key, 42.0)`: the payment system is asked to refund." },
    why: { bn: "এটাই বাইরের দুনিয়ায় effect। এর পরে যা-ই ঘটুক, provider-এর ledger-এ refund থাকতে পারে।", en: "This is the external effect. Whatever happens next, the provider's ledger may now hold a refund." },
  },
  "60": {
    what: { bn: "Provider-এর ledger-এ key `{local.key}` দিয়ে refund লেখা হচ্ছে।", en: "The provider writes a refund under key `{local.key}` in its ledger." },
    why: { bn: "Provider হলো authoritative system: টাকা গেছে কি না, তার সত্য এখানে থাকে, agent-এর কথোপকথনে না।", en: "The provider is the authoritative system: whether money moved is recorded here, not in the agent's conversation." },
    ref: "Reconcile against the external system · p. 30",
  },
  "74": {
    what: { bn: "`if crash`: এই scenario-তে worker এখানে মরে যাবে।", en: "`if crash`: in this scenario the worker dies here." },
    why: { bn: "এটা failure injection: ঠিক সেই মুহূর্তে crash, যখন provider refund নিয়েছে কিন্তু উত্তর এখনো লেখা হয়নি। বই এটাকেই আর্কিটেকচার প্রকাশ করা failure বলে।", en: "This is failure injection: a crash exactly when the provider has accepted the refund but the response is not yet written. The book calls this the failure that reveals the architecture." },
    ref: "p. 30",
  },
  "75": {
    what: { bn: "`raise Crash(...)`: worker মারা গেল।", en: "`raise Crash(...)`: the worker dies." },
    why: { bn: "Line 76 আর 77 কখনো চলবে না: \"effect_observed\" event আর transcript-এর \"refund confirmed\" দুটোই বাদ পড়ল।", en: "Lines 76 and 77 never run: both the \"effect_observed\" event and the transcript's \"refund confirmed\" are missing." },
  },
  "75!": {
    what: { bn: "Exception: {detail}", en: "Exception: {detail}" },
    why: { bn: "Objects panel দেখো: ledger-এ refund আছে, log-এ শুধু dispatched আছে, transcript খালি। পরের দুই scenario এই অবস্থা থেকে আবার শুরু করে।", en: "Look at the Objects panel: the ledger holds the refund, the log holds only the dispatch, the transcript is empty. The next two scenarios resume from exactly this state." },
    ref: "p. 30",
  },
  // resume from the transcript
  "82": {
    what: { bn: "Transcript-এ \"refund confirmed\" আছে কি? নেই।", en: "Is \"refund confirmed\" in the transcript? It is not." },
    why: { bn: "Transcript-কে state ধরলে যুক্তিটা স্বাভাবিক মনে হয়: নিশ্চিতকরণ নেই, মানে refund হয়নি। কিন্তু transcript বলে কী বলা হয়েছিল, দুনিয়ায় কী ঘটেছে তা না।", en: "Treating the transcript as state makes this sound reasonable: no confirmation, so no refund. But the transcript records what was said, not what happened in the world." },
    without: { bn: "এখানে authoritative system না দেখে কথোপকথন দেখা হচ্ছে। এটাই মূল ভুল।", en: "This checks the conversation instead of the authoritative system. That is the root mistake." },
    ref: "If the transcript is the system's state · p. 30",
  },
  "83": {
    what: { bn: "আবার refund, নতুন id দিয়ে: `retry-{...}`।", en: "Refund again, under a new id: `retry-{...}`." },
    why: { bn: "Resume-এর পর worker জানে না আগের key কী ছিল, কারণ সেটা মরা worker-এর memory-তে ছিল। নতুন id মানে provider-এর কাছে নতুন refund।", en: "After resuming, the worker does not know the old key; it lived in the dead worker's memory. A new id is a new refund to the provider." },
    without: { bn: "Event log থাকলে key সেখানে লেখা থাকত, আর একই key দিয়ে খোঁজা যেত।", en: "With an event log, the key would be on record and could be looked up." },
    ref: "p. 30",
  },
  "84": {
    what: { bn: "Transcript-এ \"refund confirmed\" লেখা হচ্ছে।", en: "The transcript records \"refund confirmed\"." },
    why: { bn: "Transcript এখন বলছে সব ঠিক আছে। Ledger দেখো: দুটো refund। Customer দুবার টাকা পেল, আর কথোপকথনে তার কোনো চিহ্ন নেই।", en: "The transcript now says all is well. Look at the ledger: two refunds. The customer was paid twice, and the conversation shows no trace of it." },
    ref: "p. 30",
  },
  // resume from the log
  "89": {
    what: { bn: "`log.intact()`: resume করার আগে log-এর শিকল অক্ষত কি না দেখা হচ্ছে।", en: "`log.intact()`: before resuming, check that the log's hash chain is unbroken." },
    why: { bn: "Recovery-র সিদ্ধান্ত log-এর ওপর দাঁড়ায়। Log বদলানো থাকলে সেই সিদ্ধান্তও ভুল হবে, তাই আগে অখণ্ডতা যাচাই।", en: "Recovery decisions rest on the log. If the log was edited, those decisions would be wrong too, so integrity comes first." },
    ref: "Integrity of the event and evidence records · p. 46",
  },
  "30": {
    what: { bn: "`intact()`: শিকল যাচাই শুরু, প্রথম event-এর আশা করা `prev_hash` হলো \"genesis\"।", en: "`intact()`: the chain check starts; the first event should point to \"genesis\"." },
    why: { bn: "প্রতিটা event-এর digest আবার হিসাব করে পরেরটার `prev_hash`-এর সাথে মেলানো হবে।", en: "Each event's digest is recomputed and compared with the next event's `prev_hash`." },
  },
  "31": {
    what: { bn: "পরের event-এ যাওয়া (বা শেষ হলে loop থেকে বের হওয়া)।", en: "On to the next event (or out of the loop when done)." },
    why: { bn: "পুরো log পরীক্ষা হয়; একটাও ভাঙা সংযোগ থাকলে resume হবে না।", en: "The whole log is checked; a single broken link stops the resume." },
  },
  "32": {
    what: { bn: "`event.prev_hash` কি `{local.prev}`-এর সমান?", en: "Does `event.prev_hash` equal `{local.prev}`?" },
    why: { bn: "`prev` হলো আগের event থেকে এখন হিসাব করা digest। Event যা দাবি করে আর এখনকার হিসাব না মিললে, মাঝখানে কিছু বদলানো হয়েছে।", en: "`prev` is the digest recomputed from the previous event now. If what the event claims and the fresh computation differ, something in between was edited." },
    ref: "pp. 34–35",
  },
  "33": {
    what: { bn: "মেলেনি: `return False`। ইতিহাস বদলানো হয়েছে।", en: "No match: `return False`. History was edited." },
    why: { bn: "Event 1-এর amount 42 থেকে 4.2 করা হয়েছিল। তার digest বদলে গেছে, তাই event 2-এর `prev_hash` আর মেলে না।", en: "Event 1's amount was changed from 42 to 4.2. Its digest changed, so event 2's `prev_hash` no longer matches." },
    ref: "Events are append-only · p. 35",
  },
  "33^": {
    what: { bn: "`intact()` ফেরত দিল {detail}।", en: "`intact()` returns {detail}." },
    why: { bn: "পরের line resume থামিয়ে দেবে।", en: "The next line will stop the resume." },
  },
  "34": {
    what: { bn: "মিলেছে। এই event-এর digest পরেরটার জন্য রাখা হচ্ছে।", en: "It matches. This event's digest is kept for checking the next one." },
    why: { bn: "Digest সব field থেকে হিসাব হয়: seq, kind, data আর prev_hash। যেকোনো একটা বদলালে digest বদলায়।", en: "The digest covers every field: seq, kind, data and prev_hash. Changing any of them changes the digest." },
  },
  "15": {
    what: { bn: "`digest()`: event-টাকে নির্দিষ্ট ক্রমে JSON করা হচ্ছে।", en: "`digest()`: the event is serialized to JSON in a fixed order." },
    why: { bn: "`sort_keys=True` থাকায় একই event সবসময় একই লেখা হয়, তাই একই hash। নইলে key-এর ক্রম বদলালেই hash বদলে যেত।", en: "With `sort_keys=True` the same event always serializes the same way, so it gets the same hash. Otherwise key order alone could change the hash." },
  },
  "16": {
    what: { bn: "SHA-256 hash, প্রথম ১২ অক্ষর।", en: "A SHA-256 hash, first 12 characters." },
    why: { bn: "এখানে ছোট রাখা হয়েছে পড়ার সুবিধার জন্য। আসল সিস্টেমে পুরো hash রাখা হয়।", en: "It is shortened here for readability. A real system keeps the full hash." },
  },
  "16^": {
    what: { bn: "Digest: {detail}", en: "Digest: {detail}" },
    why: { bn: "এই মান পরের event-এর `prev_hash` হয়, বা যাচাইয়ের সময় তার সাথে মেলানো হয়।", en: "This value becomes the next event's `prev_hash`, or is compared with it during the check." },
  },
  "35": {
    what: { bn: "পুরো শিকল অক্ষত: `return True`।", en: "The whole chain is intact: `return True`." },
    why: { bn: "এখন log-কে কাজের সত্য হিসেবে ব্যবহার করা নিরাপদ।", en: "It is now safe to use the log as operational truth." },
  },
  "35^": {
    what: { bn: "`intact()` ফেরত দিল {detail}।", en: "`intact()` returns {detail}." },
    why: { bn: "Resume এগোতে পারে।", en: "The resume can proceed." },
  },
  "90": {
    what: { bn: "`raise RuntimeError(...)`: বদলানো log থেকে resume করতে অস্বীকার।", en: "`raise RuntimeError(...)`: refuse to resume from an edited log." },
    why: { bn: "ভুল log থেকে recovery মানে ভুল সিদ্ধান্ত: হয়তো ভুল অঙ্ক, হয়তো ভুল key। থামাটাই নিরাপদ, আর এটা একজন মানুষের নজরে আনতে হবে।", en: "Recovering from a wrong log means wrong decisions: a wrong amount, perhaps a wrong key. Stopping is the safe choice, and a person has to look at it." },
    without: { bn: "যাচাই না করলে কেউ চুপচাপ ইতিহাস বদলে recovery-কে ভুল দিকে চালাতে পারত।", en: "Without the check, someone could quietly edit history and steer recovery the wrong way." },
    ref: "Fail-safe defaults · p. 46",
  },
  "90!": {
    what: { bn: "Exception: {detail}", en: "Exception: {detail}" },
    why: { bn: "Run নিঃশব্দে ভুল করার বদলে জোরে ব্যর্থ হলো। এটাই চাওয়া আচরণ।", en: "The run fails loudly instead of silently doing the wrong thing. That is the intended behaviour." },
  },
  "91": {
    what: { bn: "`state = materialize(log.events)`: event থেকে task-এর বর্তমান অবস্থা তৈরি।", en: "`state = materialize(log.events)`: the task's current state is built from the events." },
    why: { bn: "Resume কথোপকথনের সারাংশ পড়ে না; durable event থেকে state আবার তৈরি করে। যেকোনো worker একই event থেকে একই state পাবে।", en: "Resuming does not read a summary of the chat; it rebuilds state from durable events. Any worker gets the same state from the same events." },
    without: { bn: "Transcript scenario-তে ঠিক এটাই নেই, আর সেখানে refund দ্বিগুণ হয়।", en: "This is exactly what the transcript scenario lacks, and there the refund doubles." },
    ref: "Resume from durable state, not narrative reconstruction · p. 38",
  },
  "40": {
    what: { bn: "`materialize()`: শুরুর state: phase RECEIVED, কোনো অমীমাংসিত effect নেই।", en: "`materialize()`: the starting state: phase RECEIVED, no unresolved effects." },
    why: { bn: "Projection প্রতিবার একই শুরু থেকে event-গুলো একে একে প্রয়োগ করে। তাই ফল সবসময় একই।", en: "The projection applies the events one by one from the same start every time, so the result is always the same." },
    ref: "Materialized task state · p. 35",
  },
  "41": {
    what: { bn: "পরের event নেওয়া (বা সব শেষ হলে বের হওয়া)।", en: "Take the next event (or finish when none are left)." },
    why: { bn: "State মানে event-গুলোর যোগফল। কোনো event বাদ পড়লে state ভুল হবে।", en: "State is the sum of the events. Skipping one would make the state wrong." },
  },
  "42": {
    what: { bn: "Event কি `effect_dispatched`?", en: "Is the event `effect_dispatched`?" },
    why: { bn: "Dispatch মানে বাইরের effect হয়তো ঘটেছে, তাই এটা অমীমাংসিত তালিকায় যাবে যতক্ষণ না প্রমাণ আসে।", en: "A dispatch means an external effect may exist, so it goes on the unresolved list until evidence arrives." },
  },
  "43": {
    what: { bn: "Phase এখন EXECUTING।", en: "The phase becomes EXECUTING." },
    why: { bn: "State-এর phase typed; \"কাজ চলছে\" লেখা কোনো বাক্য না।", en: "The phase is typed, not a sentence like \"working on it\"." },
  },
  "44": {
    what: { bn: "Key অমীমাংসিত effect-এর তালিকায় যোগ হলো।", en: "The key joins the list of unresolved effects." },
    why: { bn: "অমীমাংসিত effect থাকলে run COMPLETED হতে পারে না। Unknown মানে failed না; মীমাংসা না হওয়া পর্যন্ত অজানা।", en: "While an effect is unresolved, the run cannot be COMPLETED. Unknown is not failed; it stays unknown until reconciled." },
    ref: "I5 Unknown is not failed · p. 48",
  },
  "45": {
    what: { bn: "Event কি `effect_observed` বা `effect_reconciled`?", en: "Is the event `effect_observed` or `effect_reconciled`?" },
    why: { bn: "এই দুটোই প্রমাণ যে effect সত্যিই ঘটেছে: একটা সরাসরি উত্তর থেকে, অন্যটা পরে খুঁজে দেখে।", en: "Both are evidence the effect really happened: one from the direct response, one from looking it up afterwards." },
  },
  "46": {
    what: { bn: "Key অমীমাংসিত তালিকা থেকে সরানো হলো।", en: "The key leaves the unresolved list." },
    why: { bn: "এখন আর অনিশ্চয়তা নেই: effect ঘটেছে বলে প্রমাণিত।", en: "The uncertainty is gone: the effect is proven to have happened." },
  },
  "47": {
    what: { bn: "Key evidence-এর তালিকায় যোগ হলো।", en: "The key joins the evidence list." },
    why: { bn: "Completion-এর জন্য evidence লাগে। এই তালিকাই পরে \"completed\" event-এ যাবে।", en: "Completion needs evidence. This list goes into the \"completed\" event later." },
    ref: "I4 Evidence-bound completion · p. 48",
  },
  "48": {
    what: { bn: "Event কি `completed`?", en: "Is the event `completed`?" },
    why: { bn: "Completion নিজেও একটা event, তাই সেটাও log-এ থাকে আর পরে যাচাই করা যায়।", en: "Completion is itself an event, so it is on record and can be checked later." },
  },
  "49": {
    what: { bn: "Phase এখন COMPLETED।", en: "The phase becomes COMPLETED." },
    why: { bn: "Phase বদলায় শুধু event থেকে। কেউ সরাসরি state-এ \"done\" লিখতে পারে না।", en: "The phase changes only through events. Nobody can write \"done\" into state directly." },
  },
  "50": {
    what: { bn: "`return state`: তৈরি হওয়া projection ফেরত।", en: "`return state`: returns the built projection." },
    why: { bn: "State হলো runtime-এর উৎস, event log হলো audit-এর উৎস। দুটো আলাদা, কিন্তু একটা থেকে অন্যটা সবসময় আবার তৈরি করা যায়।", en: "State is the runtime source; the event log is the audit source. They differ, but state can always be rebuilt from the log." },
    ref: "p. 35",
  },
  "50^": {
    what: { bn: "Materialized state: {detail}", en: "Materialized state: {detail}" },
    why: { bn: "এখানে দেখো unresolved তালিকায় কী আছে। সেটাই ঠিক করবে recovery-কে কী করতে হবে।", en: "Look at what is on the unresolved list. That decides what recovery has to do." },
  },
  "92": {
    what: { bn: "প্রতিটা অমীমাংসিত effect একে একে দেখা হচ্ছে।", en: "Each unresolved effect is examined in turn." },
    why: { bn: "Recovery সব effect-এর জন্য একই নিয়ম মানে: আগে মীমাংসা, তারপর অন্য কিছু।", en: "Recovery applies one rule to every effect: reconcile first, then anything else." },
    ref: "Reconcile before retry · p. 41",
  },
  "93": {
    what: { bn: "`provider.lookup(key)`: provider-এর ledger-এ `{local.key}` আছে কি?", en: "`provider.lookup(key)`: is `{local.key}` in the provider's ledger?" },
    why: { bn: "আবার পাঠানোর আগে authoritative system-কে জিজ্ঞেস করা। এখানে key জানা আছে, কারণ সেটা event log-এ লেখা ছিল।", en: "Ask the authoritative system before sending anything again. The key is known here because it was written to the event log." },
    ref: "p. 41",
  },
  "63": {
    what: { bn: "`lookup()`: ledger-এ key খুঁজছে।", en: "`lookup()`: searches the ledger for the key." },
    why: { bn: "এই read কিছু বদলায় না, তাই যতবার খুশি নিরাপদে করা যায়।", en: "This read changes nothing, so it is safe to repeat." },
  },
  "63^": {
    what: { bn: "`lookup()` ফেরত দিল {detail}।", en: "`lookup()` returns {detail}." },
    why: { bn: "Refund আগেই হয়ে গিয়েছিল। Crash টাকাকে থামায়নি, শুধু উত্তরটা হারিয়েছিল।", en: "The refund had already happened. The crash did not stop the money; it only lost the answer." },
  },
  "94": {
    what: { bn: "`effect_reconciled` event যোগ হচ্ছে।", en: "An `effect_reconciled` event is appended." },
    why: { bn: "মীমাংসার ফলও একটা নতুন event। পুরোনো event বদলানো হয় না; ইতিহাসে দেখা যায় কখন আর কীভাবে অনিশ্চয়তা দূর হলো।", en: "The reconciliation is a new event too. Nothing old is edited; the history shows when and how the uncertainty was resolved." },
    ref: "p. 35",
  },
  "97": {
    what: { bn: "নতুন event-সহ state আবার তৈরি হচ্ছে।", en: "The state is rebuilt with the new events." },
    why: { bn: "State সরাসরি বদলানো হয় না; event যোগ করে আবার projection তৈরি হয়। তাই state আর log কখনো আলাদা কথা বলে না।", en: "State is never edited directly; events are appended and the projection is rebuilt. So state and log never disagree." },
  },
  "98": {
    what: { bn: "আর কোনো অমীমাংসিত effect আছে কি?", en: "Are any effects still unresolved?" },
    why: { bn: "একটাও অমীমাংসিত থাকলে run COMPLETED হবে না; সেটা escalated হিসেবে কারো কাছে যাবে।", en: "If any remain unresolved, the run is not COMPLETED; it goes to someone as escalated." },
    ref: "I4 Evidence-bound completion · p. 48",
  },
  "99": {
    what: { bn: "`completed` event, evidence-এর তালিকাসহ।", en: "A `completed` event, with the evidence list." },
    why: { bn: "Completion নিজেই প্রমাণসহ লেখা থাকে: কোন effect-এর ভিত্তিতে কাজ শেষ বলা হলো।", en: "Completion is recorded with its proof: which effects the claim of completion rests on." },
  },
  "100": {
    what: { bn: "শেষ state তৈরি করে ফেরত দেওয়া।", en: "Build and return the final state." },
    why: { bn: "Objects panel-এ log দেখো: dispatched → reconciled → completed। Ledger-এ ঠিক একটা refund।", en: "Look at the log in the Objects panel: dispatched → reconciled → completed. The ledger holds exactly one refund." },
  },
  "100^": {
    what: { bn: "Resume শেষ: {detail}", en: "The resume ends: {detail}" },
    why: { bn: "Transcript scenario-র সাথে তুলনা করো: একই crash, কিন্তু এখানে একটা refund আর প্রমাণসহ COMPLETED।", en: "Compare with the transcript scenario: the same crash, but here one refund and a COMPLETED backed by evidence." },
    ref: "p. 30",
  },
};

export const EVENT_LOG_TRACE: CodeTraceDefinition = {
  id: "ai-engineering.harness.ch01.event-log",
  titleEn: "Line-by-line trace",
  titleBn: "Code লাইন ধরে ধরে",
  descriptionEn: "A worker crashes after the refund went through. Step through the crash, then two ways to resume: from the transcript and from the event log. A fourth run shows an edited history being caught.",
  descriptionBn: "Refund হয়ে যাওয়ার পর worker crash করে। ধাপে ধাপে crash দেখো, তারপর resume-এর দুটো উপায়: transcript থেকে আর event log থেকে। চতুর্থ run দেখায় বদলানো ইতিহাস কীভাবে ধরা পড়ে।",
  displayPath: "harness/ch01/event_log.py",
  trace,
  scenarios: [
    { id: "crash", title: { en: "1 · The crash", bn: "১ · Crash" } },
    { id: "transcript", title: { en: "2 · Resume from transcript", bn: "২ · Transcript থেকে resume" } },
    { id: "log", title: { en: "3 · Resume from event log", bn: "৩ · Event log থেকে resume" } },
    { id: "edited", title: { en: "4 · Edited history", bn: "৪ · বদলানো ইতিহাস" } },
  ],
  notes: NOTES,
  objectTypes: { log: "EventLog", provider: "Provider", transcript: "list" },
};
