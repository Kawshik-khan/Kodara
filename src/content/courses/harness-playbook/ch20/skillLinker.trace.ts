import { CodeTraceDefinition, RecordedTrace, TraceNote } from "@/features/code-trace/types/trace.types";
import rawTrace from "./skillLinker.trace.json";

const trace = rawTrace as unknown as RecordedTrace;

const NOTES: Record<string, TraceNote> = {
  "26": {
    what: {
      bn: "Admission gate ধাপ ১: `{local.skill}` কি এখনো `'ACTIVE'` assurance অবস্থায় আছে, নাকি সেটি revoke বা quarantine করা হয়েছে?",
      en: "Admission gate step 1: check whether `{local.skill}` is still in the `'ACTIVE'` assurance state rather than revoked or quarantined.",
    },
    why: {
      bn: "ক্যাটালগ ডিসকভারি বা মডেলের নমিনেশন কখনোই নিজে থেকে লোডিংয়ের অনুমতি দেয় না—প্রতিটি অ্যাক্টিভেশনের আগে লাইভ assurance state যাচাই করা বাধ্যতামূলক (পৃষ্ঠা 137–138)।",
      en: "Catalog discovery or model nomination never authorizes loading by itself; every activation must first verify the skill's live assurance state (pp. 137–138).",
    },
    without: {
      bn: "এই গেট না থাকলে আগেই ফ্ল্যাগ বা প্রত্যাহার (revoked) হওয়া একটি ত্রুটিপূর্ণ স্কিলও নতুন রানে লোড হয়ে যাবে।",
      en: "Without this gate, a skill that has already been flagged or revoked for safety regressions would still be loaded into new runs.",
    },
    ref: "Separate nomination from admission · pp. 137–138 & Appendix H.7 · pp. 507–508",
  },

  "30": {
    what: {
      bn: "Admission gate ধাপ ২: বর্তমান মডেল, টুল স্কিমা এবং পলিসি স্ন্যাপশটের সাথে `{local.skill}`-এর সামঞ্জস্য কি `'QUALIFIED'`?",
      en: "Admission gate step 2: check whether `{local.skill}` has a `'QUALIFIED'` compatibility status for the active model, tool schema, and policy snapshot.",
    },
    why: {
      bn: "স্কিল কোনো নিঃসঙ্গ টেক্সট ফাইল নয়; এটি একটি নির্দিষ্ট `(skill@version, model_family, tool_schema, policy_snapshot)` টিউপলের বিপরীতে পরীক্ষিত হয় (পৃষ্ঠা 140)।",
      en: "A skill is never qualified in isolation; it is qualified against a specific `(skill@version, model_family, tool_schema, policy_snapshot)` tuple (p. 140).",
    },
    without: {
      bn: "অপরীক্ষিত (`UNTESTED`) বা অসামঞ্জস্যপূর্ণ স্ট্যাকে পুরনো স্কিল লোড করলে অদৃশ্য আচরণগত বিচ্যুতি ঘটে।",
      en: "Loading a skill onto an `UNTESTED` or incompatible stack introduces silent behavioral drift.",
    },
    ref: "Pin the compatibility matrix · p. 140 & Appendix H.3 · pp. 503–504",
  },

  "31": {
    what: {
      bn: "Compatibility টিউপল `'QUALIFIED'` নয়; তাই অ্যাক্টিভেশন স্ট্যাটাস `'DENIED'` সেট করা হচ্ছে।",
      en: "The compatibility tuple is not `'QUALIFIED'`; set activation status to `'DENIED'`.",
    },
    why: {
      bn: "যখন রানটাইম এনভায়রনমেন্ট কোনো স্কিলের পরীক্ষিত সীমার বাইরে চলে যায়, তখন অনুমানের ওপর নির্ভর না করে লোডিং প্রত্যাখ্যান করতে হয়।",
      en: "When the runtime environment falls outside a skill's tested compatibility envelope, the harness must fail closed and refuse to load it.",
    },
    ref: "Appendix H.3 Compatibility matrix · pp. 503–504",
  },

  "32": {
    what: {
      bn: "প্রত্যাখ্যানের কারণ হিসেবে `'COMPAT_UNTESTED'` রেকর্ড করা হচ্ছে।",
      en: "Record `'COMPAT_UNTESTED'` as the deterministic denial reason.",
    },
    why: {
      bn: "স্পষ্ট কারণ কোড থাকলে অপারেটররা বুঝতে পারেন কেন স্কিলটি ব্লক হয়েছে এবং কোন টিউপলটি পুনরায় কোয়ালিফাই করতে হবে।",
      en: "An explicit reason code tells operators why the skill was blocked and which stack tuple requires qualification.",
    },
    ref: "Appendix H.6 Activation telemetry · p. 507",
  },

  "33": {
    what: {
      bn: "অপরীক্ষিত স্ট্যাকের জন্য `'DENIED'` সিদ্ধান্ত ফেরত দেওয়ার প্রস্তুতি।",
      en: "Prepare to return `'DENIED'` for the untested compatibility tuple.",
    },
    why: {
      bn: "স্কিলের বডি (`SKILL.md`) কনটেক্সটে লোড হওয়ার আগেই এই হার্ড গেটটি কার্যকর হয়।",
      en: "This hard gate executes before the skill body (`SKILL.md`) ever enters the model's context window.",
    },
    ref: "Progressive disclosure · pp. 137–138",
  },

  "33^": {
    what: {
      bn: "`admit_skill()` অপরীক্ষিত টিউপলের কারণে `{detail}` ফেরত দিল (কারণ: `{object.rec.reason}`)।",
      en: "`admit_skill()` returns `{detail}` due to the untested compatibility tuple (reason: `{object.rec.reason}`).",
    },
    why: {
      bn: "প্রমাণিত সামঞ্জস্য ছাড়া কোনো স্কিল প্রোডাকশন রানে প্রবেশ করতে পারে না।",
      en: "No skill may enter a production run without verified stack compatibility.",
    },
    ref: "Appendix H.8 Invariant 4 · p. 509",
  },

  "34": {
    what: {
      bn: "Admission gate ধাপ ৩: রানের সিগন্যাল তালিকা `{local.signals}` একে একে পরীক্ষা করা হচ্ছে যে কোনো বর্জন শর্ত (`excluded`) উপস্থিত কি না।",
      en: "Admission gate step 3: iterate through the run signals `{local.signals}` to check whether any deterministic exclusion condition (`excluded`) is present.",
    },
    why: {
      bn: "প্রোবাবিলিস্টিক রাউটার ('দুবার চার্জ হয়েছে') এবং কাঠামোগতভাবে ভিন্ন প্রসিডিউরের ('সক্রিয় চার্জব্যাক') মাঝখানে ডিটারমিনিস্টিক বর্জন গেট থাকা জরুরি (পৃষ্ঠা 144–146)।",
      en: "A deterministic exclusion gate must stand between a probabilistic router ('charged twice') and structurally different procedures ('active chargeback') (pp. 144–146).",
    },
    variants: [
      {
        when: { localPresent: "sig" },
        what: {
          bn: "সিগন্যাল `{local.sig}` নিরাপদ প্রমাণিত হয়েছে; `{local.signals}`-এর পরবর্তী সিগন্যালে অগ্রসর হচ্ছে।",
          en: "Signal `{local.sig}` passed the exclusion check; advance to the next signal in `{local.signals}`.",
        },
      },
    ],
    ref: "Separate nomination from admission · pp. 138, 144–146",
  },

  "35": {
    what: {
      bn: "বর্তমান সিগন্যাল `{local.sig}` কি স্কিলের নিষিদ্ধ তালিকা `('active_chargeback', 'fraud_claim')`-এর ভেতর আছে?",
      en: "Check whether the current signal `{local.sig}` is in the skill's exclusion list `('active_chargeback', 'fraud_claim')`.",
    },
    why: {
      bn: "চার্জব্যাক বা জালিয়াতির কেস সাধারণ ডুপ্লিকেট চার্জ তদন্তের সাথে ভাষাগতভাবে মেলে, কিন্তু ভুল প্রসিডিউরে ঢুকলে আইনি ও আর্থিক ক্ষতি ঘটে (পৃষ্ঠা 144)।",
      en: "Chargeback and fraud tickets share surface vocabulary with duplicate-charge inquiries, but routing them into standard duplicate-charge handling violates dispute rules (p. 144).",
    },
    without: {
      bn: "v4.2.1-এর ঢালাও বর্ণনার মতো শুধু শব্দার্থিক মিলের ওপর নির্ভর করলে চার্জব্যাক কেসে ৯.৪% ভুল অ্যাক্টিভেশন ঘটে (পৃষ্ঠা 144)।",
      en: "Relying on semantic similarity alone caused a 9.4% false-activation rate on chargeback tickets in the v4.2.1 failure case (p. 144).",
    },
    ref: "Worked failure case: v4.2.1 · pp. 143–147",
  },

  "36": {
    what: {
      bn: "নিষিদ্ধ সিগন্যাল `{local.sig}` ধরা পড়েছে! অ্যাক্টিভেশন স্ট্যাটাস `'REJECTED'` সেট করা হচ্ছে।",
      en: "Excluded signal `{local.sig}` detected! Set activation status to `'REJECTED'`.",
    },
    why: {
      bn: "যখন প্রাক-শর্ত বা বর্জন শর্ত সরাসরি স্টেট থেকে যাচাই করা যায়, তখন সেটিকে প্রম্পটের উপদেশ হিসেবে না রেখে কোডে বাধ্যতামূলক করতে হয় (পৃষ্ঠা 138)।",
      en: "Whenever preconditions or exclusions can be checked directly from state, they must be enforced in code rather than left as prose advice in the prompt (p. 138).",
    },
    ref: "Separate nomination from admission · p. 138",
  },

  "37": {
    what: {
      bn: "বর্জনের সুনির্দিষ্ট কারণ `'EXCLUDED:{local.sig}'` রেকর্ড করা হচ্ছে।",
      en: "Record the exact exclusion reason `'EXCLUDED:{local.sig}'`.",
    },
    why: {
      bn: "অডিট লগে কোন সিগন্যালটি নমিনেশন বাতিল করেছে তা সংরক্ষণ করলে রাউটিং এবং ক্যাটালগ ওভারল্যাপ বিশ্লেষণ করা সহজ হয়।",
      en: "Recording which signal rejected the nomination enables precise routing telemetry and catalog overlap diagnosis.",
    },
    ref: "Appendix H.6 Activation telemetry · p. 507",
  },

  "38": {
    what: {
      bn: "বর্জিত নমিনেশনের জন্য `'REJECTED'` ফেরত দেওয়ার প্রস্তুতি।",
      en: "Prepare to return `'REJECTED'` for the excluded nomination.",
    },
    why: {
      bn: "ভুল প্রসিডিউরের নির্দেশনা মডেলের কনটেক্সটে ঢোকার আগেই হারনেস সেটিকে থামিয়ে দিল।",
      en: "The harness stops the wrong procedure before its instructions ever enter the model's context.",
    },
    ref: "Worked case repair · pp. 145–146",
  },

  "38^": {
    what: {
      bn: "`admit_skill()` বর্জন গেট থেকে `{detail}` ফেরত দিল (কারণ: `{object.rec.reason}`)।",
      en: "`admit_skill()` returns `{detail}` from the exclusion gate (reason: `{object.rec.reason}`).",
    },
    why: {
      bn: "চার্জব্যাক কেসটি এখন নিরাপদে তার নিজস্ব ডিসপিউট ওয়ার্কফ্লোতে রাউট হতে পারবে।",
      en: "The chargeback case can now be safely routed to the dedicated dispute workflow instead of the duplicate-charge skill.",
    },
    ref: "Worked case repair · pp. 145–146",
  },

  "39": {
    what: {
      bn: "Admission gate ধাপ ৪: স্কিলের নির্ভরযোগ্য লাইভ পলিসি সার্ভিস (`policy_healthy = {local.policy_healthy}`) কি সচল আছে?",
      en: "Admission gate step 4: check whether the authoritative live policy dependency (`policy_healthy = {local.policy_healthy}`) is available.",
    },
    why: {
      bn: "স্কিল প্যাকেজের ভেতর থাকা উদাহরণ (`examples/`) কেবল ফরম্যাট বোঝানোর জন্য—লাইভ পলিসি সার্ভিস বন্ধ থাকলে উদাহরণকে কখনোই সত্যের উৎস হিসেবে ব্যবহার করা যাবে না (পৃষ্ঠা 139, 146)।",
      en: "Bundled examples inside a skill package illustrate structure only; if the live policy service is down, the agent must never fall back to bundled examples as operational truth (pp. 139, 146).",
    },
    without: {
      bn: "পলিসি আউটেজের সময় বান্ডেল করা উদাহরণ দেখে সিদ্ধান্ত নিলে পুরনো বা ভুল নিয়মে রিফান্ড অনুমোদিত হতে পারে।",
      en: "Falling back to bundled example snippets during a policy outage causes the agent to apply stale or fabricated rules.",
    },
    ref: "Bundled resources are not operational truth · p. 139 & Appendix H.4 · p. 505",
  },

  "40": {
    what: {
      bn: "লাইভ পলিসি সার্ভিস অপ্রাপ্য (`policy_healthy = False`); তাই রানটিকে `'SUSPENDED'` অবস্থায় নেওয়া হচ্ছে।",
      en: "The live policy dependency is unavailable (`policy_healthy = False`); set status to `'SUSPENDED'`.",
    },
    why: {
      bn: "প্রয়োজনীয় বাহ্যিক সত্য অনুপস্থিত থাকলে অনুমান করে কাজ চালানোর চেয়ে নিরাপদে স্থগিত (suspend) হওয়াই সঠিক হারনেস সিদ্ধান্ত।",
      en: "When required authoritative truth is unavailable, suspending safely is the only sound harness decision.",
    },
    ref: "Worked failure case · p. 146",
  },

  "41": {
    what: {
      bn: "স্থগিতকরণের কারণ হিসেবে `'POLICY_DEPENDENCY_UNAVAILABLE'` রেকর্ড করা হচ্ছে।",
      en: "Record `'POLICY_DEPENDENCY_UNAVAILABLE'` as the suspension reason.",
    },
    why: {
      bn: "রিজিউম কন্ট্রোলার এই কারণ দেখেই বুঝবে যে পলিসি সার্ভিস সুস্থ হলে এবং স্কিলটি তখনো বৈধ থাকলে রানটি পুনরায় শুরু করা যাবে।",
      en: "The resume controller uses this reason to know what dependency must recover before the run can be resumed.",
    },
    ref: "Appendix H.7 Revocation & quarantine · pp. 507–508",
  },

  "42": {
    what: {
      bn: "`'SUSPENDED'` স্ট্যাটাস ফেরত দেওয়ার প্রস্তুতি।",
      en: "Prepare to return `'SUSPENDED'`.",
    },
    why: {
      bn: "কোনো অননুমোদিত টুল কল বা ভুল পলিসি প্রয়োগ ছাড়াই রানটি নিরাপদ চেকপয়েন্টে থেমে যাচ্ছে।",
      en: "The run pauses at a safe checkpoint without executing any tool calls or applying unverified policy examples.",
    },
    ref: "Appendix H.8 Invariant 3 · p. 509",
  },

  "42^": {
    what: {
      bn: "`admit_skill()` পলিসি আউটেজের কারণে `{detail}` ফেরত দিল (কারণ: `{object.rec.reason}`)।",
      en: "`admit_skill()` returns `{detail}` due to the policy outage (reason: `{object.rec.reason}`).",
    },
    why: {
      bn: "লাইভ পলিসি ছাড়া কোনো সিদ্ধান্ত নেওয়া হয়নি এবং বান্ডেল করা উদাহরণকে নীতি হিসেবে ব্যবহার করা হয়নি।",
      en: "No decision was taken without live policy, and bundled examples were never treated as authoritative rules.",
    },
    ref: "Bundled resources are not operational truth · p. 139",
  },

  "44": {
    what: {
      bn: "Authority intersection: স্কিল যেসব টুল চায় (`skill.tools`) এবং বর্তমান রানের যেটুকু অনুমতি আছে (`{local.run_grant}`), তাদের ছেদ (intersection) নির্ণয় করা হচ্ছে।",
      en: "Authority intersection: compute the intersection of the tools requested by the skill (`skill.tools`) and the current run's capability grant (`{local.run_grant}`).",
    },
    why: {
      bn: "একটি স্কিল কখনোই রানের নিজস্ব অনুমতি বাড়াতে (widen) পারে না: `effective_tools = skill.tools ∩ run_grant` (পৃষ্ঠা 139–140)।",
      en: "A skill can narrow attention, but it can never widen the run's capability envelope: `effective_tools = skill.tools ∩ run_grant` (pp. 139–140).",
    },
    without: {
      bn: "স্কিল ম্যানিফেস্টে `'refund_create'` লেখা থাকলেই যদি সেটির অনুমতি মিলে যেত, তবে যেকোনো প্রম্পট বা স্কিল ইনজেকশন নিজেই নিজের ক্ষমতা বাড়িয়ে নিতে পারত।",
      en: "If listing `'refund_create'` in a skill manifest granted permission to call it, any skill could escalate its own privileges beyond the run's lease.",
    },
    variants: [
      {
        when: { localPresent: "t" },
        what: {
          bn: "টুল `{local.t}` পরীক্ষা করা হচ্ছে: এটি কি বর্তমান রানের অনুমোদিত তালিকা `{local.run_grant}`-এর ভেতর আছে?",
          en: "Check tool `{local.t}`: is it present in the current run's capability grant `{local.run_grant}`?",
        },
      },
    ],
    ref: "Skills never widen authority · pp. 139–140 & Appendix H.8 Invariant 2 · p. 509",
  },

  "45": {
    what: {
      bn: "`effective_tools`-এ শুধুমাত্র `['billing_read', 'policy_read', 'case_proposal_write']` রাখা হলো (`'refund_create'` বাদ পড়েছে); এবং অডিট লগের জন্য Skill Bill of Materials (`bom`) রেকর্ড করা হচ্ছে।",
      en: "`effective_tools` is restricted to `['billing_read', 'policy_read', 'case_proposal_write']` (`'refund_create'` is stripped), and the Skill Bill of Materials (`bom`) is recorded.",
    },
    why: {
      bn: "প্রতিটি রানে কোন স্কিলের কোন সংস্করণ, কোন কন্টেন্ট ডাইজেস্ট (`sha256:420a`) এবং কোন উদাহরণ (`non-authoritative` হিসেবে চিহ্নিত) ব্যবহৃত হয়েছে, তা ট্রেসযোগ্য হতে হয় (পৃষ্ঠা 141)।",
      en: "Every run must record the exact skill version, content digest (`sha256:420a`), and bundled resources (tagged `non-authoritative`) in its audit trail (p. 141).",
    },
    ref: "Skill Bill of Materials (BOM) · p. 141 & Appendix H.6 · p. 507",
  },

  "46": {
    what: {
      bn: "সবকটি গেট উত্তীর্ণ হয়েছে; অ্যাক্টিভেশন স্ট্যাটাস `'ADMITTED'` সেট করা হচ্ছে।",
      en: "All admission gates passed; set activation status to `'ADMITTED'`.",
    },
    why: {
      bn: "শুধুমাত্র এই ধাপের পরেই স্কিলের নির্দেশনা (`SKILL.md`) কনটেক্সট কম্পাইলারে প্রবেশের অনুমতি পায়।",
      en: "Only after passing every deterministic gate is the skill body (`SKILL.md`) admitted into the context compiler.",
    },
    ref: "Figure 20.1 · p. 136",
  },

  "47": {
    what: {
      bn: "অ্যাক্টিভেশনের কারণ হিসেবে `'PROPOSAL_ONLY_GRANT'` রেকর্ড করা হচ্ছে, কারণ রানটি সরাসরি অর্থ ছাড়ের বদলে কেবল প্রস্তাব তৈরি করতে পারবে।",
      en: "Record `'PROPOSAL_ONLY_GRANT'` as the admission reason, reflecting that the run may write a case proposal but cannot directly execute a refund.",
    },
    why: {
      bn: "তদন্তের গুণমান এবং অর্থ ছাড়ের চূড়ান্ত কর্তৃত্ব আলাদা রাখলে ভুল অ্যাক্টিভেশনের ক্ষতি সীমাবদ্ধ থাকে।",
      en: "Separating investigative procedure from direct financial execution bounds the blast radius of any skill.",
    },
    ref: "Skills never widen authority · pp. 139–140",
  },

  "48": {
    what: {
      bn: "চূড়ান্ত `'ADMITTED'` সিদ্ধান্ত ফেরত দেওয়ার প্রস্তুতি।",
      en: "Prepare to return the `'ADMITTED'` decision.",
    },
    why: {
      bn: "অ্যাডমিশন গেটটি একটি যাচাইকৃত `ActivationRecord` তৈরি করেছে যেখানে কার্যকর টুল এবং BOM উভয়ই বাঁধা আছে।",
      en: "The admission gate has produced a verified `ActivationRecord` binding both the effective tool grant and the BOM.",
    },
    ref: "Appendix H.6 · p. 507",
  },

  "48^": {
    what: {
      bn: "`admit_skill()` সফলভাবে `{detail}` ফেরত দিল (কার্যকর টুল: `{object.rec.effective_tools}`, BOM: `{object.rec.bom}`)।",
      en: "`admit_skill()` returns `{detail}` (effective tools: `{object.rec.effective_tools}`, BOM: `{object.rec.bom}`).",
    },
    why: {
      bn: "স্কিলটি এখন প্রমাণিত সামঞ্জস্য, সীমিত টুল কর্তৃত্ব এবং পূর্ণ অডিট ট্রেইলসহ রান করার জন্য প্রস্তুত।",
      en: "The skill is now admitted with verified compatibility, intersected tool authority, and a complete audit BOM.",
    },
    ref: "Turning Procedures into Reliable Agent Skills · pp. 135–142",
  },

  "53": {
    what: {
      bn: "`resume_skill_run()`: স্থগিত রানটি পুনরায় চালু করার আগে দেখা হচ্ছে `{local.skill}`-এর assurance state কি এখনো `'ACTIVE'`?",
      en: "`resume_skill_run()`: before resuming the suspended run, re-verify whether `{local.skill}` is still in the `'ACTIVE'` assurance state.",
    },
    why: {
      bn: "রান স্থগিত থাকার মাঝখানে যদি কোনো ইনসিডেন্টের কারণে স্কিলটি `REVOKED` বা `QUARANTINED` হয়, তবে পুরনো চেকপয়েন্ট থেকে সেই স্কিল আর চালানো যাবে না (পৃষ্ঠা 142, 508)।",
      en: "If an incident revokes or quarantines a skill while a run is suspended, the harness must not resume execution under the revoked skill (pp. 142, 508).",
    },
    without: {
      bn: "রিজিউমের সময় assurance state পুনরায় পরীক্ষা না করলে প্রত্যাহার করা ত্রুটিপূর্ণ স্কিল দিয়েই ইন-ফ্লাইট রানগুলো শেষ হবে।",
      en: "Without re-checking assurance state on resume, in-flight runs would continue executing a skill that operators have already revoked.",
    },
    ref: "Revocation & kill-switch · p. 142 & Appendix H.7 · pp. 507–508",
  },

  "54": {
    what: {
      bn: "স্কিলটি ইতিমধ্যে `'REVOKED'` হয়েছে; তাই স্ট্যাটাস `'REVOKED_STOPPED'` সেট করা হচ্ছে।",
      en: "The skill has been `'REVOKED'`; set status to `'REVOKED_STOPPED'`.",
    },
    why: {
      bn: "কিল-সুইচ বা রেভোকেশন তাৎক্ষণিকভাবে সব নতুন এবং স্থগিত রানের এক্সিকিউশন থামিয়ে দেয়।",
      en: "A revocation kill-switch immediately halts both new admissions and suspended in-flight runs.",
    },
    ref: "Appendix H.7 · pp. 507–508",
  },

  "55": {
    what: {
      bn: "কারণ হিসেবে `'STOP_AND_RECONCILE'` সেট করা হচ্ছে যাতে রানটি নিরাপদে রিকনসাইল বা ফ্যালব্যাক পথে যায়।",
      en: "Set reason to `'STOP_AND_RECONCILE'` so the run transitions cleanly to reconciliation or safe fallback.",
    },
    why: {
      bn: "মাঝপথে থামা রানকে চুপচাপ ফেলে না রেখে স্পষ্ট `'STOP_AND_RECONCILE'` অবস্থায় নিলে অপারেটর বা বেসলাইন ওয়ার্কফ্লো দায়িত্ব নিতে পারে।",
      en: "Transitioning to `'STOP_AND_RECONCILE'` ensures an interrupted run is cleanly handed off rather than left dangling.",
    },
    ref: "Appendix H.7 · p. 508",
  },

  "56": {
    what: {
      bn: "`'REVOKED_STOPPED'` সিদ্ধান্ত ফেরত দেওয়ার প্রস্তুতি।",
      en: "Prepare to return `'REVOKED_STOPPED'`.",
    },
    why: {
      bn: "প্রত্যাহার করা স্কিলের অধীনে কোনো পরবর্তী ধাপ বা টুল কল কার্যকর হতে দেওয়া হয়নি।",
      en: "No further steps or tool calls are permitted under the revoked skill.",
    },
    ref: "Appendix H.8 Invariant 6 · p. 509",
  },

  "56^": {
    what: {
      bn: "`resume_skill_run()` চূড়ান্ত স্ট্যাটাস `{detail}` ফেরত দিল (কারণ: `{object.rec.reason}`)।",
      en: "`resume_skill_run()` returns `{detail}` (reason: `{object.rec.reason}`).",
    },
    why: {
      bn: "স্কিল লাইফসাইকেল গভর্নেন্স নিশ্চিত করল যে রেভোকেশন কেবল নতুন রানের জন্যই নয়, স্থগিত রানের ক্ষেত্রেও সমানভাবে কার্যকর।",
      en: "Skill lifecycle governance ensures revocation is enforced across suspended runs just as strictly as on new admissions.",
    },
    ref: "Appendix H.7 & H.8 · pp. 507–509",
  },
};

export const SKILL_LINKER_TRACE: CodeTraceDefinition = {
  id: "ai-engineering.harness.ch20.skill-linker",
  titleEn: "Line-by-line trace",
  titleBn: "Code লাইন ধরে ধরে",
  descriptionEn:
    "Step through four skill admission and lifecycle scenarios (pp. 135–147): a scoped duplicate-charge admission that strips refund_create and records a BOM, a chargeback exclusion gate, a policy outage followed by mid-run revocation, and an untested compatibility tuple denial.",
  descriptionBn:
    "চারটি skill admission ও lifecycle দৃশ্যপট ধাপে ধাপে দেখো (pp. 135–147): যেখানে ডুপ্লিকেট চার্জ স্কিল লোড হওয়ার সময় `refund_create` ছাঁটাই হয় ও BOM লেখা হয়, যেখানে চার্জব্যাক সিগন্যাল বর্জিত হয়, যেখানে পলিসি আউটেজে স্থগিত রান রেভোকেশনে থামে, এবং যেখানে অপরীক্ষিত স্ট্যাক প্রত্যাখ্যাত হয়।",
  displayPath: "harness/ch20/skill_linker.py",
  trace,
  scenarios: [
    { id: "admitted", title: { en: "1 · Admitted with tool intersection & BOM", bn: "১ · টুল ছেদ ও BOM-সহ অনুমোদিত" } },
    { id: "excluded", title: { en: "2 · Chargeback signal rejected by exclusion gate", bn: "২ · বর্জন গেটে চার্জব্যাক সিগন্যাল প্রত্যাখ্যাত" } },
    { id: "revoked", title: { en: "3 · Policy outage suspend → mid-run revocation", bn: "৩ · পলিসি আউটেজে স্থগিত → মাঝপথে প্রত্যাহার" } },
    { id: "untested", title: { en: "4 · Untested stack compatibility denied", bn: "৪ · অপরীক্ষিত স্ট্যাক সামঞ্জস্য প্রত্যাখ্যাত" } },
  ],
  notes: NOTES,
  objectTypes: { rec: "ActivationRecord" },
};

