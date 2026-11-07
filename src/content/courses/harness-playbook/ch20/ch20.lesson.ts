import { Lesson } from "@/features/lessons/types/lesson.types";
import skillSceneSource from "../../../../../courses/harness-playbook/scenes/ch20_skill_lifecycle.py?raw";

/**
 * Chapter 20 of The Harness Engineering Playbook (pp. 135–152, Appendix H pp. 502–510).
 * Positioned as the fourth chapter of Part II · Runtime in the book's reading order.
 */

const RUN_OUTPUT = `$ python -m harness.ch20.skill_linker
# admitted: status=ADMITTED tools=['billing_read', 'policy_read', 'case_proposal_write'] bom=['duplicate-charge-investigation@4.2.0', 'sha256:420a', 'example:policy@31(non-authoritative)']
# chargeback exclusion: status=REJECTED reason=EXCLUDED:active_chargeback`;

export const CH20_RELIABLE_SKILLS_LESSON: Lesson = {
  id: "hp.20.reliable-agent-skills",
  slug: "harness-20-turning-procedures-into-reliable-agent-skills",
  trackId: "ai-engineering",
  moduleId: "hp-part-2",
  moduleTitleEn: "Harness Engineering · Part II · Runtime",
  moduleTitleBn: "Harness Engineering · পার্ট II · রানটাইম",

  titleEn: "Turning Procedures into Reliable Agent Skills",
  titleBn: "Procedure থেকে নির্ভরযোগ্য agent skill",
  subtitleEn:
    "A skill is executable organizational judgment with a probabilistic linker. It becomes a production skill only when the organization can say what activates it, what it may influence, which versions it supports, which evidence qualifies it, and how to make it stop.",
  subtitleBn:
    "Skill হলো প্রোবাবিলিস্টিক লিঙ্কারযুক্ত কার্যকর প্রাতিষ্ঠানিক বিচারবুদ্ধি। এটি কেবল তখনই প্রোডাকশন স্কিল হয়ে ওঠে যখন সুনির্দিষ্টভাবে বলা যায় কী এটিকে সক্রিয় করে, এটি কী প্রভাবিত করতে পারে, কোন সংস্করণে চলে, কোন প্রমাণ এটিকে যোগ্য করে এবং কীভাবে এটিকে থামাতে হয়।",
  descriptionEn:
    "Skills as a release surface: the three-bucket allocation rule; runtime probabilistic linking vs deterministic admission Admissible(s, x); progressive disclosure levels L0–L4 and the Skill Bill of Materials; behavioral SemVer and empirical stack compatibility; six evaluation layers; catalog carrying cost and composition rules; candidate-only self-authored skills; and the duplicate-charge v4.2.0/v4.2.1 worked case. Book pp. 135–152 & Appendix H pp. 502–510.",
  descriptionBn:
    "রিলিজ সারফেস হিসেবে Skill: তিন-বাকেট বরাদ্দ নিয়ম; রানটাইম প্রোবাবিলিস্টিক লিঙ্কিং বনাম ডিটারমিনিস্টিক অ্যাডমিশন Admissible(s, x); প্রগ্রেসিভ ডিসক্লোজার স্তর L0–L4 এবং Skill Bill of Materials; আচরণগত SemVer ও স্ট্যাক কম্প্যাটিবিলিটি; ছয়টি ইভ্যালুয়েশন স্তর; ক্যাটালগের বহন খরচ ও কম্পোজিশন নিয়ম; মডেল-লিখিত প্রার্থী স্কিল এবং ডুপ্লিকেট-চার্জ v4.2.0/v4.2.1 worked case। বইয়ের পৃষ্ঠা 135–152 ও পরিশিষ্ট H পৃষ্ঠা 502–510।",

  difficulty: "intermediate",
  estimatedMinutes: 35,

  prerequisites: [
    {
      id: "hp.03.building-the-right-briefing",
      titleEn: "Building the Right Briefing",
      titleBn: "সঠিক briefing তৈরি",
      slug: "harness-03-building-the-right-briefing",
    },
    {
      id: "hp.05.testing-that-earns-trust",
      titleEn: "Testing That Earns Trust",
      titleBn: "যে testing আস্থা অর্জন করে",
      slug: "harness-05-testing-that-earns-trust",
    },
  ],
  learningObjectivesEn: [
    "Apply the three-bucket test to separate deterministic harness controls, versioned procedural skills, and bounded conditional adaptation.",
    "Enforce the deterministic admission predicate Admissible(s, x) so model nomination never bypasses compatibility, dependency health, exclusion signals, or run-grant intersection.",
    "Distinguish L0–L4 progressive disclosure (token efficiency) from least privilege (security), and emit a complete Skill Bill of Materials.",
    "Explain why v4.2.1's broadened description failed activation qualification and how v4.2.0 handles a live policy outage plus mid-run revocation.",
  ],
  learningObjectivesBn: [
    "তিন-বাকেট পরীক্ষা প্রয়োগ করে ডিটারমিনিস্টিক হার্নেস কন্ট্রোল, সংস্করণযুক্ত স্কিল এবং শর্তসাপেক্ষ অভিযোজন আলাদা করতে পারবে।",
    "ডিটারমিনিস্টিক অ্যাডমিশন সূত্র Admissible(s, x) কার্যকর করতে পারবে যাতে মডেলের মনোনয়ন কখনোই কম্প্যাটিবিলিটি, ডিপেন্ডেন্সি, বর্জন সংকেত বা রান-গ্রান্ট ছেদকে পাশ কাটাতে না পারে।",
    "L0–L4 প্রগ্রেসিভ ডিসক্লোজার (টোকেন সাশ্রয়) এবং লিস্ট প্রিভিলেজ (নিরাপত্তা)-এর পার্থক্য করতে এবং সম্পূর্ণ Skill Bill of Materials তৈরি করতে পারবে।",
    "কেন v4.2.1-এর ঢালাও বর্ণনা অ্যাক্টিভেশন পরীক্ষায় বাতিল হয়েছিল এবং কীভাবে v4.2.0 লাইভ পলিসি বিভ্রাট ও মাঝপথে revocation সামলায় তা ব্যাখ্যা করতে পারবে।",
  ],
  concepts: [
    {
      id: "probabilistic-linker",
      nameEn: "Probabilistic skill linker & deterministic admission",
      nameBn: "প্রোবাবিলিস্টিক স্কিল লিঙ্কার ও ডিটারমিনিস্টিক অ্যাডমিশন",
      descriptionEn: "The model nominates candidate skills from metadata, while the assurance kernel deterministically gates compatibility, exclusions, dependencies, and grant intersection.",
      descriptionBn: "মডেল মেটাডেটা দেখে সম্ভাব্য স্কিল মনোনীত করে, কিন্তু অ্যাসুরেন্স কার্নেল ডিটারমিনিস্টিকভাবে কম্প্যাটিবিলিটি, বর্জন, ডিপেন্ডেন্সি ও গ্রান্ট ছেদ যাচাই করে।",
      trackId: "ai-engineering",
      difficulty: "intermediate",
    },
    {
      id: "context-bom",
      nameEn: "Progressive disclosure (L0–L4) & Skill Bill of Materials",
      nameBn: "প্রগ্রেসিভ ডিসক্লোজার (L0–L4) ও Skill Bill of Materials",
      descriptionEn: "Stages metadata, contract summary, instructions, references, and scripts across L0–L4 while recording every digest and effective tool in the run's BOM.",
      descriptionBn: "L0–L4 স্তরে মেটাডেটা, চুক্তি, নির্দেশনা, রেফারেন্স ও স্ক্রিপ্ট লোড করে এবং প্রতিটি ডাইজেস্ট ও কার্যকর টুল BOM-এ নথিভুক্ত রাখে।",
      trackId: "ai-engineering",
      difficulty: "intermediate",
    },
    {
      id: "skill-revocation",
      nameEn: "Behavioral SemVer, compatibility matrix, and revocation",
      nameBn: "আচরণগত SemVer, কম্প্যাটিবিলিটি ম্যাট্রিক্স এবং revocation",
      descriptionEn: "Binds immutable skill digests to qualified stack tuples and propagates revocation to active and suspended runs via STOP_AND_RECONCILE.",
      descriptionBn: "অপরিবর্তনীয় স্কিল ডাইজেস্টকে পরীক্ষিত স্ট্যাক টাপলের সাথে বাঁধে এবং STOP_AND_RECONCILE-এর মাধ্যমে চলমান ও স্থগিত রানেও revocation কার্যকর করে।",
      trackId: "ai-engineering",
      difficulty: "intermediate",
    },
  ],

  sections: [
    {
      id: "hp20-theory",
      order: 1,
      titleEn: "1. Theory",
      titleBn: "১. তত্ত্ব",
      blocks: [
        {
          id: "hp20-lead",
          type: "explanation",
          titleEn: "A skill is a component in the control path, not just a folder of markdown (pp. 135–137)",
          titleBn: "Skill হলো কন্ট্রোল পাথের একটি অংশ, নিছক কিছু মার্কডাউন ফাইল নয় (pp. 135–137)",
          contentEn:
            "When an engineer converts a twelve-page duplicate-charge procedure into duplicate-charge-investigation@4.2.0, the demo looks great—until three things happen in production: (1) a chargeback case says \"charged twice\" and triggers the wrong legal process, (2) the policy reference inside the skill is one version behind the live policy service, and (3) a helper script requests the general payments credential because that made the example easy to run. Treating a skill as passive documentation is a category error. Its description changes routing, its instructions change reasoning, its references change context, and its scripts execute code. That makes a skill a release surface.\n\nUse the three-bucket allocation test (pp. 137, 149):\n• Must be enforced or independently inspected (identity, grants, effect ceilings, current policy, revocation) → build explicitly in deterministic harness controls.\n• Repeats as a bounded replaceable procedure (domain decomposition, evidence-gathering order, output structure) → package as a versioned skill.\n• May improve from valid reversible feedback (candidate ranking, optional example selection within a qualified range) → let the harness learn conditionally.",
          contentBn:
            "যখন কোনো প্রকৌশলী ১২ পৃষ্ঠার ডুপ্লিকেট-চার্জ নিয়মাবলিকে duplicate-charge-investigation@4.2.0 স্কিলে রূপান্তর করেন, ডেমোতে সেটি চমৎকার দেখায়—যতক্ষণ না প্রোডাকশনে তিনটি ঘটনা ঘটে: (১) একটি চার্জব্যাক কেসে \"দুবার টাকা কাটা হয়েছে\" লেখা থাকায় ভুল আইনি প্রক্রিয়া চালু হয়ে যায়, (২) স্কিলের ভেতরের পলিসি রেফারেন্স লাইভ সার্ভিসের চেয়ে এক সংস্করণ পিছিয়ে থাকে, এবং (৩) একটি হেল্পার স্ক্রিপ্ট পুরো পেমেন্ট ক্রেডেনশিয়াল চেয়ে বসে। স্কিলকে সাধারণ ডকুমেন্টেশন ভাবা একটি বড় ভুল। এর বর্ণনা রাউটিং বদলায়, নির্দেশনা যুক্তি বদলায়, রেফারেন্স কনটেক্সট বদলায় এবং স্ক্রিপ্ট কোড চালায়—অর্থাৎ এটি একটি পূর্ণাঙ্গ release surface।\n\nতাই তিন-বাকেট বরাদ্দ নিয়ম ব্যবহার করো (pp. 137, 149):\n• যা বাধ্যতামূলকভাবে কার্যকর বা স্বাধীনভাবে যাচাই করতে হবে (পরিচয়, অনুমতি, ইফেক্ট সীমা, বর্তমান নীতি, revocation) → ডিটারমিনিস্টিক হার্নেস কন্ট্রোলে তৈরি করো।\n• যা নির্দিষ্ট ও পরিবর্তনযোগ্য কার্যপ্রণালি হিসেবে বারবার ব্যবহৃত হয় (কাজের ধাপ, প্রমাণ সংগ্রহের ক্রম, আউটপুট কাঠামো) → সংস্করণযুক্ত স্কিল হিসেবে প্যাকেজ করো।\n• যা নিরাপদ ও উল্টানো যায় এমন ফিডব্যাক থেকে উন্নত হতে পারে (র‍্যাঙ্কিং, পরীক্ষিত সীমার ভেতরে উদাহরণ নির্বাচন) → শর্তসাপেক্ষে হার্নেসকে শিখতে দাও।",
          keyIdeaEn: "\"A skill is executable organizational judgment with a probabilistic linker.\" (p. 135)",
          keyIdeaBn: "Skill হলো প্রোবাবিলিস্টিক লিঙ্কারযুক্ত কার্যকর প্রাতিষ্ঠানিক বিচারবুদ্ধি। (p. 135)",
        },
        {
          id: "hp20-admission-and-levels",
          type: "under-the-hood",
          titleEn: "Discovery is not admission & progressive disclosure L0–L4 (pp. 137–139)",
          titleBn: "খুঁজে পাওয়া মানেই অনুমোদন নয় এবং প্রগ্রেসিভ ডিসক্লোজার L0–L4 (pp. 137–139)",
          explanationEn:
            "The model or router may nominate a skill from its L0/L1 metadata, but the assurance kernel decides whether that exact version may enter the run via Admissible(s, x).",
          explanationBn:
            "মডেল বা রাউটার L0/L1 মেটাডেটা দেখে একটি স্কিল মনোনীত করতে পারে, কিন্তু অ্যাসুরেন্স কার্নেল Admissible(s, x) দিয়ে নির্ধারণ করে ওই সংস্করণটি রানে প্রবেশ করতে পারবে কি না।",
          pipelineSteps: [
            {
              titleEn: "L0 · Catalog discovery metadata",
              titleBn: "L0 · ক্যাটালগ ডিসকভারি মেটাডেটা",
              descEn: "Exposes name, description, version, and owner for skills installed and visible to the current tenant and task class. Metadata is behavior-bearing control input: changing it requires activation regression tests.",
              descBn: "বর্তমান টেন্যান্ট ও টাস্কের জন্য দৃশ্যমান স্কিলের নাম, বর্ণনা, সংস্করণ ও মালিক দেখায়। মেটাডেটা সরাসরি রাউটিং নিয়ন্ত্রণ করে—তাই এটি বদলালে অ্যাক্টিভেশন রিগ্রেশন টেস্ট চালাতে হয়।",
            },
            {
              titleEn: "L1 · Deterministic admission gate Admissible(s, x)",
              titleBn: "L1 · ডিটারমিনিস্টিক অ্যাডমিশন গেট Admissible(s, x)",
              descEn: "Verifies Installed ∧ Enabled ∧ Match(activation_contract) ∧ Compatible(stack tuple) ∧ DependenciesHealthy ∧ (RequestedAuthority ⊆ RunGrant G) ∧ AssuranceActive ∧ ConflictsResolved.",
              descBn: "যাচাই করে: Installed ∧ Enabled ∧ Match(activation_contract) ∧ Compatible(stack tuple) ∧ DependenciesHealthy ∧ (RequestedAuthority ⊆ RunGrant G) ∧ AssuranceActive ∧ ConflictsResolved।",
            },
            {
              titleEn: "L2 · Full procedural instructions",
              titleBn: "L2 · পূর্ণাঙ্গ কার্যপ্রণালি নির্দেশনা",
              descEn: "Loaded only after admission; logs the exact content digest and context position in the Skill Bill of Materials.",
              descBn: "কেবল অ্যাডমিশন পাশ করার পর লোড হয়; Skill Bill of Materials-এ এর সুনির্দিষ্ট ডাইজেস্ট ও অবস্থান রেকর্ড করা হয়।",
            },
            {
              titleEn: "L3 & L4 · Selected references, examples, and isolated scripts",
              titleBn: "L3 ও L4 · নির্বাচিত রেফারেন্স, উদাহরণ এবং বিচ্ছিন্ন স্ক্রিপ্ট",
              descEn: "Examples are typed as non-authoritative (never current policy); scripts execute in restricted sandboxes with brokered short-lived credentials and full output/effect logging.",
              descBn: "উদাহরণগুলোকে অ-প্রামাণ্য হিসেবে টাইপ করা হয় (কখনোই বর্তমান নীতি নয়); স্ক্রিপ্টগুলো সীমিত স্যান্ডবক্সে চলে এবং সব আউটপুট ও প্রভাব লগ করা হয়।",
            },
          ],
          technicalNoteEn:
            "Progressive disclosure is a context policy (saving tokens), not a security boundary: a compact skill or on-demand script can still request a destructive tool unless RequestedAuthority(s) is intersected with the run grant G (p. 139).",
          technicalNoteBn:
            "প্রগ্রেসিভ ডিসক্লোজার হলো টোকেন বাঁচানোর কনটেক্সট নীতি, কোনো নিরাপত্তা সীমানা নয়: যতক্ষণ না RequestedAuthority(s)-কে রানের অনুমতি G-এর সাথে ছেদ করা হচ্ছে, ততক্ষণ ছোট স্কিল বা স্ক্রিপ্টও বিপজ্জনক টুল কল করতে পারে (p. 139)।",
        },
        {
          id: "hp20-compat-and-authorities",
          type: "comparison",
          titleEn: "Four separated skill authorities and four compatibility states (pp. 140–142)",
          titleBn: "স্কিলের চারটি পৃথক কর্তৃপক্ষ এবং চারটি কম্প্যাটিবিলিটি অবস্থা (pp. 140–142)",
          headers: ["Role / State", "Permitted scope", "Hard prohibition"],
          rows: [
            {
              featureEn: "Author",
              featureBn: "Author (লেখক / মডেল প্রার্থী)",
              values: ["Propose instructions, resources, scripts, tests, and metadata", "Cannot publish, install, or qualify its own unreviewed release"],
            },
            {
              featureEn: "Publisher / Release Authority",
              featureBn: "Publisher (রিলিজ কর্তৃপক্ষ)",
              values: ["Verify provenance, review qualification evidence, sign immutable digest", "Cannot widen production permissions"],
            },
            {
              featureEn: "Installer / Administrator",
              featureBn: "Installer (অ্যাডমিনিস্ট্রেটর)",
              values: ["Admit a signed version into a tenant catalog and configure scope", "Cannot rewrite the signed artifact or bypass qualification"],
            },
            {
              featureEn: "Runtime Activator",
              featureBn: "Runtime Activator (রানটাইম লিঙ্কার)",
              values: ["Nominate and load an eligible QUALIFIED version for a single run", "Cannot mint permissions, move default pointers, or override revocation"],
            },
            {
              featureEn: "QUALIFIED vs UNTESTED",
              featureBn: "QUALIFIED বনাম UNTESTED",
              values: ["QUALIFIED passed all 6 test layers on the exact model×harness×tool×policy tuple", "UNTESTED is syntactically installable only and never inherits production authority"],
            },
          ],
          footnoteEn:
            "SkillsBench (7,308 trajectories, 84 tasks, p. 135) found curated skills improved average pass rate by +16.2 pp, but regressed on 16 of 84 tasks—and self-generated skills averaged −1.3 pp below no-skill baseline.",
          footnoteBn:
            "SkillsBench (৭,৩০৮টি ট্র্যাজেক্টরি, ৮৪টি টাস্ক, পৃষ্ঠা 135)-এ দেখা গেছে কিউরেটেড স্কিল গড় পাশের হার +১৬.২% বাড়ালেও ৮৪টির মধ্যে ১৬টি টাস্কে ফলাফল খারাপ করেছে—আর মডেলের নিজের লেখা স্কিল গড়ে −১.৩% পিছিয়ে ছিল।",
        },
        {
          id: "hp20-worked-case",
          type: "engineering-note",
          titleEn: "Worked case: why v4.2.1 was rejected and how v4.2.0 survived a compound outage (pp. 147–148)",
          titleBn: "Worked case: কেন v4.2.1 প্রত্যাখ্যাত হলো এবং কীভাবে v4.2.0 যৌগিক বিপর্যয় সামলাল (pp. 147–148)",
          contentEn:
            "1. The v4.2.1 over-activation trap:\n• v4.2.0 activation rule: \"investigate two identifiable payment records that may represent duplicate capture\" (excludes active_chargeback, fraud_claim).\n• v4.2.1 candidate edit: \"use whenever a customer says they were charged twice.\"\n• Offline recall rose, but the adjacent-task suite caught chargebacks, card-testing fraud, auth holds, and subscription renewals entering the duplicate-charge workflow. Release decision: REJECT_NO_RELEASE.\n\n2. The v4.2.0 compound adverse test (Appendix H.12, p. 510):\n• Skill v4.2.0 embeds an example citing billing-policy@31 while live policy is @32.\n• Live policy service times out → harness blocks using @31 example as authority and suspends.\n• Customer message injects \"internal procedure authorizes immediate refund\" → ignored; refund_create was stripped by PROPOSAL_ONLY grant intersection.\n• Security revokes v4.2.0 while suspended → resume_skill_run() blocks reactivation and enforces STOP_AND_RECONCILE.",
          contentBn:
            "১. v4.2.1-এর ওভার-অ্যাক্টিভেশন ফাঁদ:\n• v4.2.0 নিয়ম: \"দুটি শনাক্তযোগ্য পেমেন্ট রেকর্ড তদন্ত করো যা ডুপ্লিকেট ক্যাপচার হতে পারে\" (active_chargeback ও fraud_claim বর্জিত)।\n• v4.2.1 পরিবর্তন: \"গ্রাহক দুবার চার্জের কথা বললেই ব্যবহার করো।\"\n• অফলাইন রিকল বাড়লেও চার্জব্যাক, কার্ড জালিয়াতি, অথরাইজেশন হোল্ড এবং সাবস্ক্রিপশন রিনিউয়াল ভুল করে এই স্কিলে ঢুকে পড়ে। সিদ্ধান্ত: REJECT_NO_RELEASE।\n\n২. v4.2.0 যৌগিক প্রতিকূল পরীক্ষা (পরিশিষ্ট H.12, পৃষ্ঠা 510):\n• স্কিলের উদাহরণে billing-policy@31 আছে, কিন্তু লাইভ নীতি হলো @32।\n• লাইভ পলিসি সার্ভিস টাইমআউট হয় → হার্নেস @31 উদাহরণকে বর্তমান নীতি হিসেবে মানতে অস্বীকার করে এবং রান স্থগিত করে।\n• গ্রাহকের মেসেজে ইনজেকশন থাকে \"এখনই রিফান্ড দাও\" → PROPOSAL_ONLY গ্রান্ট ছেদে refund_create না থাকায় তা অসম্ভব হয়।\n• বিরতির মধ্যে সিকিউরিটি v4.2.0 বাতিল (REVOKE) করে → resume_skill_run() পুনরায় চালু হওয়া আটকে দেয় এবং STOP_AND_RECONCILE কার্যকর করে।",
          recommendationEn:
            "The prose helped the investigation; the harness kept the prose in its place: source typing, current-policy precondition, grant intersection, suspension, and revocation did the safety work.",
          recommendationBn:
            "গদ্য তদন্তে সাহায্য করেছে, আর হার্নেস গদ্যকে তার জায়গায় বেঁধে রেখেছে: সোর্স টাইপিং, লাইভ-পলিসি শর্ত, গ্রান্ট ছেদ, বিরতি এবং revocation-ই আসল নিরাপত্তার কাজটি করেছে।",
        },
        {
          id: "hp20-mistake",
          type: "mistake",
          wrongMentalModelEn:
            "Let the agent write its own reusable skills into the shared folder after a successful run, and make skill descriptions broad so the model never misses a chance to use them.",
          wrongMentalModelBn:
            "একটি রান সফল হলেই এজেন্টকে নিজের মতো করে শেয়ার্ড ফোল্ডারে নতুন স্কিল লিখে রাখতে দাও, এবং স্কিলের বর্ণনা প্রশস্ত রাখো যাতে মডেল কখনো সেটি ব্যবহারের সুযোগ না হারায়।",
          correctMentalModelEn:
            "Self-generated skills are unverified candidates that averaged below the no-skill baseline in SkillsBench, and broad descriptions cause false activations on adjacent high-risk workflows like chargebacks.",
          correctMentalModelBn:
            "মডেলের নিজের লেখা স্কিল হলো অযাচাইকৃত প্রার্থী যা SkillsBench-এ সাধারণ বেসলাইনের চেয়েও খারাপ ফল দিয়েছে, আর প্রশস্ত বর্ণনা চার্জব্যাকের মতো সংবেদনশীল পার্শ্ববর্তী কাজে বিপজ্জনক ভুল অ্যাক্টিভেশন ঘটায়।",
          explanationEn:
            "Keep model-authored procedures as run-local notes or candidates until independently qualified across all 6 layers, and enforce narrow activation contracts with explicit exclusions (pp. 143–147).",
          explanationBn:
            "মডেলের লেখা পদ্ধতিকে ৬টি স্তরে স্বাধীনভাবে যোগ্য প্রমাণিত না হওয়া পর্যন্ত কেবল রান-লোকাল নোট বা প্রার্থী হিসেবে রাখো, এবং স্পষ্ট বর্জন সংকেতসহ সুনির্দিষ্ট অ্যাক্টিভেশন চুক্তি ব্যবহার করো (pp. 143–147)।",
        },
        {
          id: "hp20-summary",
          type: "summary",
          titleEn: "Carry forward",
          titleBn: "মনে রাখো",
          takeawaysEn: [
            "Package procedure, qualify behavior, mediate authority, record activation, and retire aggressively (p. 150).",
            "Discovery is not admission: the model nominates, but Admissible(s, x) checks stack compatibility, dependency health, exclusions, and grant intersection.",
            "Progressive disclosure (L0–L4) saves context tokens; least privilege requires intersecting RequestedAuthority(s) with the run grant G.",
            "The system may author a candidate skill, but may never appoint its own candidate as organizational judgment (p. 147).",
          ],
          takeawaysBn: [
            "কার্যপ্রণালি প্যাকেজ করো, আচরণ যাচাই করো, ক্ষমতা ছেঁকে দাও, অ্যাক্টিভেশন রেকর্ড করো এবং অপ্রয়োজনীয় স্কিল দ্রুত অবসরে পাঠাও (p. 150)।",
            "খুঁজে পাওয়া মানেই অনুমোদন নয়: মডেল মনোনীত করে, কিন্তু Admissible(s, x) কম্প্যাটিবিলিটি, ডিপেন্ডেন্সি, বর্জন ও গ্রান্ট ছেদ পরীক্ষা করে।",
            "প্রগ্রেসিভ ডিসক্লোজার (L0–L4) টোকেন বাঁচায়; আর নিরাপত্তার জন্য RequestedAuthority(s)-কে রানের অনুমতি G-এর সাথে ছেদ করতে হয়।",
            "সিস্টেম একটি প্রার্থী স্কিল লিখতে পারে, কিন্তু নিজেই সেটিকে প্রাতিষ্ঠানিক বিচারবুদ্ধি হিসেবে নিয়োগ দিতে পারে না (p. 147)।",
          ],
          checklistEn: [
            "Every exposed skill resolves mutable aliases to an immutable version and sha256 digest before the run begins.",
            "Every loaded instruction, reference, example, and script is recorded in the run's Context Bill of Materials.",
            "Embedded examples are typed as non-authoritative and never substitute for an unavailable live policy service.",
            "Revocation propagates to catalogs, caches, workers, and suspended in-flight runs via STOP_AND_RECONCILE.",
          ],
          checklistBn: [
            "রান শুরু হওয়ার আগেই প্রতিটি স্কিলের পরিবর্তনশীল অ্যালিয়াসকে সুনির্দিষ্ট সংস্করণ ও sha256 ডাইজেস্টে রূপান্তর করা হয়।",
            "লোড হওয়া প্রতিটি নির্দেশনা, রেফারেন্স, উদাহরণ ও স্ক্রিপ্ট রানের Context Bill of Materials-এ নথিভুক্ত থাকে।",
            "স্কিলের ভেতরের উদাহরণ অ-প্রামাণ্য হিসেবে চিহ্নিত থাকে এবং লাইভ পলিসি সার্ভিস বন্ধ থাকলে কখনোই তার বিকল্প হয় না।",
            "STOP_AND_RECONCILE-এর মাধ্যমে ক্যাটালগ, ক্যাশ, ওয়ার্কার এবং মাঝপথে স্থগিত রানেও revocation কার্যকর হয়।",
          ],
        },
      ],
    },
    {
      id: "hp20-visual",
      order: 2,
      titleEn: "2. Visual",
      titleBn: "২. ভিজ্যুয়াল",
      blocks: [
        {
          id: "hp20-flow",
          type: "visualization",
          visualizationId: "ai-engineering.harness.skill-lifecycle",
          titleEn: "Runtime Skill Linker: Grant Intersection, BOM, and Mid-Run Revocation",
          titleBn: "Runtime Skill Linker: Grant ছেদ, BOM এবং মাঝপথে Revocation",
        },
        {
          id: "hp20-chart",
          type: "chart",
          chartId: "ai-engineering.harness.skill-activation-precision",
        },
        {
          id: "hp20-manim-lifecycle",
          type: "code",
          title: "scenes/ch20_skill_lifecycle.py · ManimGL · manimgl ch20_skill_lifecycle.py SkillLifecycleScene -w",
          language: "python",
          code: skillSceneSource.replace(/\n$/, ""),
        },
      ],
    },
    {
      id: "hp20-practical",
      order: 3,
      titleEn: "3. Practical",
      titleBn: "৩. প্র্যাকটিক্যাল",
      blocks: [
        {
          id: "hp20-practical-intro",
          type: "explanation",
          titleEn: "Code written for this course",
          titleBn: "এই কোর্সের জন্য লেখা code",
          contentEn:
            "The file below implements the Chapter 20 deterministic skill admission gate and mid-run revocation guard: assurance and compatibility checks, active-chargeback exclusion, live-policy dependency suspension, PROPOSAL_ONLY grant intersection, Context Bill of Materials logging, and STOP_AND_RECONCILE when a skill is revoked while suspended. Run it from courses/harness-playbook with python -m harness.ch20.skill_linker, and run the tests with python -m unittest.",
          contentBn:
            "নিচের ফাইলটি অধ্যায় ২০-এর ডিটারমিনিস্টিক স্কিল অ্যাডমিশন গেট এবং মাঝপথে revocation গার্ড বাস্তবায়ন করে: অ্যাসুরেন্স ও কম্প্যাটিবিলিটি যাচাই, active-chargeback বর্জন, লাইভ-পলিসি সার্ভিস বন্ধ থাকায় বিরতি, PROPOSAL_ONLY গ্রান্ট ছেদ, Context Bill of Materials লগিং এবং স্থগিত অবস্থায় স্কিল বাতিল হলে STOP_AND_RECONCILE। courses/harness-playbook থেকে python -m harness.ch20.skill_linker দিয়ে চালাও এবং python -m unittest দিয়ে test করো।",
        },
        {
          id: "hp20-trace",
          type: "code-trace",
          traceId: "ai-engineering.harness.ch20.skill-linker",
        },
        {
          id: "hp20-output",
          type: "code",
          title: "Real output",
          language: "bash",
          code: RUN_OUTPUT,
        },
        {
          id: "hp20-exercise",
          type: "engineering-note",
          titleEn: "Exercise: block self-publishing and chargeback over-activation",
          titleBn: "অনুশীলন: মডেলের নিজস্ব প্রকাশ এবং চার্জব্যাক ওভার-অ্যাক্টিভেশন প্রতিহত করো",
          contentEn:
            "Per Invariants 18 and 19 (p. 150) and the v4.2.1 worked case (p. 147), a model-authored skill must remain \"CANDIDATE_ONLY\" until an independent release authority qualifies it, and any candidate with chargeback_false_activations > 0 must be rejected with \"REJECT_NO_RELEASE\". Update promote_candidate_skill(author_role, chargeback_false_activations) in courses/harness-playbook/harness/ch20/skill_linker.py so ExerciseTest in tests/test_ch20.py passes.",
          contentBn:
            "পৃষ্ঠা 150-এর Invariant 18 ও 19 এবং পৃষ্ঠা 147-এর v4.2.1 worked case অনুযায়ী, মডেলের নিজের লেখা স্কিল স্বাধীনভাবে অনুমোদিত না হওয়া পর্যন্ত \"CANDIDATE_ONLY\" থাকবে, এবং chargeback_false_activations > 0 হলে সাথে সাথে \"REJECT_NO_RELEASE\" হবে। courses/harness-playbook/harness/ch20/skill_linker.py ফাইলে promote_candidate_skill(author_role, chargeback_false_activations) আপডেট করো যাতে tests/test_ch20.py-এর ExerciseTest পাশ করে।",
          recommendationEn:
            "tests/test_ch20.py has ExerciseTest marked @unittest.expectedFailure. Remove the decorator once your change passes.",
          recommendationBn:
            "tests/test_ch20.py-তে ExerciseTest আগে থেকেই @unittest.expectedFailure দিয়ে রাখা আছে। তোমার কোড কাজ করলে decorator-টি সরিয়ে দাও।",
        },
      ],
    },
    {
      id: "hp20-qa",
      order: 4,
      titleEn: "4. Q&A",
      titleBn: "৪. প্রশ্নোত্তর",
      blocks: [
        {
          id: "hp20-q1",
          type: "practice",
          practiceType: "multiple-choice",
          questionEn:
            "Why does Chapter 20 state that progressive disclosure (L0–L4) is a context policy rather than a security boundary?",
          questionBn:
            "অধ্যায় ২০-এ কেন বলা হয়েছে যে প্রগ্রেসিভ ডিসক্লোজার (L0–L4) একটি কনটেক্সট নীতি, কিন্তু কোনো নিরাপত্তা সীমানা নয়?",
          options: [
            {
              id: "a",
              textEn: "Because loading less text saves idle tokens, but a compact skill or on-demand script can still invoke destructive tools or exfiltrate data unless mediated by grant intersection and sandboxing",
              textBn: "কারণ কম টেক্সট লোড করলে টোকেন বাঁচে, কিন্তু গ্রান্ট ছেদ ও স্যান্ডবক্সিং না থাকলে একটি ছোট স্কিল বা স্ক্রিপ্টও বিপজ্জনক টুল কল বা ডেটা পাচার করতে পারে",
              isCorrect: true,
              explanationEn:
                "Progressive disclosure buys token efficiency and relevance; it does not buy authorization, provenance, isolation, or semantic safety (p. 139).",
              explanationBn:
                "প্রগ্রেসিভ ডিসক্লোজার টোকেন সাশ্রয় ও প্রাসঙ্গিকতা দেয়; কিন্তু অনুমোদন, আইসোলেশন বা নিরাপত্তা নিশ্চিত করে না (p. 139)।",
            },
            {
              id: "b",
              textEn: "Because L0 metadata is encrypted until L4 scripts execute",
              textBn: "কারণ L4 স্ক্রিপ্ট না চলা পর্যন্ত L0 মেটাডেটা এনক্রিপ্টেড থাকে",
              isCorrect: false,
              explanationEn: "L0 metadata is visible first so the router/model can discover candidates.",
              explanationBn: "প্রার্থী স্কিল খুঁজে পাওয়ার জন্য L0 মেটাডেটা সবার আগে দৃশ্যমান হয়।",
            },
            {
              id: "c",
              textEn: "Because progressive disclosure disables all tool calls",
              textBn: "কারণ প্রগ্রেসিভ ডিসক্লোজার সব টুল কল বন্ধ করে দেয়",
              isCorrect: false,
              explanationEn: "Tools remain callable inside the intersected run grant.",
              explanationBn: "ছেদকৃত রান-গ্রান্টের ভেতরে বৈধ টুলগুলো কল করা যায়।",
            },
          ],
        },
        {
          id: "hp20-q2",
          type: "practice",
          practiceType: "code-reasoning",
          questionEn:
            "In scenario 1 of our recorded trace, Skill.tools lists ('billing_read', 'policy_read', 'case_proposal_write', 'refund_create'), while run_grant is ('billing_read', 'policy_read', 'case_proposal_write'). What is stored in rec.effective_tools?",
          questionBn:
            "রেকর্ড করা ট্রেসের ১ নম্বর scenario-তে Skill.tools-এ ('billing_read', 'policy_read', 'case_proposal_write', 'refund_create') আছে, কিন্তু run_grant হলো ('billing_read', 'policy_read', 'case_proposal_write')। rec.effective_tools-এ তখন কী থাকে?",
          codeSnippet: `rec.effective_tools = [t for t in skill.tools if t in run_grant]\nrec.bom = [f"{skill.id}@{skill.version}", skill.digest, "example:policy@31(non-authoritative)"]`,
          options: [
            {
              id: "a",
              textEn: "['billing_read', 'policy_read', 'case_proposal_write'] — refund_create is stripped by grant intersection",
              textBn: "['billing_read', 'policy_read', 'case_proposal_write'] — গ্রান্ট ছেদের ফলে refund_create বাদ পড়ে যায়",
              isCorrect: true,
              explanationEn:
                "Invariant 6 & 7 (p. 149): effective skill authority is RequestedAuthority(s) ∩ G and never exceeds the current run grant.",
              explanationBn:
                "Invariant 6 ও 7 (p. 149): স্কিলের কার্যকর ক্ষমতা হলো RequestedAuthority(s) ∩ G, যা কখনোই বর্তমান রানের অনুমতির বাইরে যেতে পারে না।",
            },
            {
              id: "b",
              textEn: "All four tools, because the skill manifest requested refund_create",
              textBn: "চারটি টুলই, কারণ স্কিল ম্যানিফেস্টে refund_create চাওয়া হয়েছে",
              isCorrect: false,
              explanationEn: "A skill can never grant itself a tool that is absent from the active run grant.",
              explanationBn: "রানের অনুমতিতে নেই এমন কোনো টুল স্কিল নিজে থেকে নিজেকে দিতে পারে না।",
            },
            {
              id: "c",
              textEn: "An empty list, because any excess tool request revokes the skill",
              textBn: "খালি তালিকা, কারণ অতিরিক্ত টুল চাইলেই স্কিল বাতিল হয়ে যায়",
              isCorrect: false,
              explanationEn: "Admission intersects the requested profile with the run grant to produce the PROPOSAL_ONLY toolset.",
              explanationBn: "অ্যাডমিশন গেট চাওয়া টুলগুলোকে রান-গ্রান্টের সাথে ছেদ করে PROPOSAL_ONLY টুলসেট তৈরি করে।",
            },
          ],
          hintEn: "Step through scenario 1 (Scoped admission) to line 44.",
          hintBn: "Scenario ১-এ লাইন 44 দেখো।",
        },
        {
          id: "hp20-q3",
          type: "practice",
          practiceType: "multiple-choice",
          questionEn:
            "In the compound adverse test (pp. 147–148), duplicate-charge-investigation@4.2.0 contains an embedded example referencing billing-policy@31, while the live policy service (at @32) times out. What must the harness do?",
          questionBn:
            "পৃষ্ঠা 147–148-এর যৌগিক প্রতিকূল পরীক্ষায় duplicate-charge-investigation@4.2.0-এর ভেতরের উদাহরণে billing-policy@31 উল্লেখ আছে, কিন্তু লাইভ পলিসি সার্ভিস (@32) টাইমআউট হয়েছে। হার্নেসের তখন কী করা উচিত?",
          options: [
            {
              id: "a",
              textEn: "Fall back to billing-policy@31 from the skill's embedded example so the customer gets a fast answer",
              textBn: "গ্রাহককে দ্রুত উত্তর দিতে স্কিলের উদাহরণে থাকা billing-policy@31 ব্যবহার করা",
              isCorrect: false,
              explanationEn: "Invariant 8 (p. 149): constitutional policy and current authoritative facts must never be silently sourced from skill prose or examples.",
              explanationBn: "Invariant 8 (p. 149): বর্তমান প্রামাণ্য নীতি কখনোই স্কিলের গদ্য বা উদাহরণ থেকে চুপিসারে নেওয়া যাবে না।",
            },
            {
              id: "b",
              textEn: "Keep the example typed as non-authoritative, leave the policy obligation unsatisfied, and suspend or escalate the run",
              textBn: "উদাহরণটিকে অ-প্রামাণ্য হিসেবেই রাখা, পলিসি শর্ত অপূর্ণ রাখা এবং রানটি স্থগিত (suspend) বা এসকালেট করা",
              isCorrect: true,
              explanationEn:
                "Dependency health is a runtime precondition; when the canonical policy service is unavailable, the skill contract mandates SUSPEND_OR_ESCALATE (pp. 141, 148, 503).",
              explanationBn:
                "ডিপেন্ডেন্সি সচল থাকা একটি রানটাইম পূর্বশর্ত; লাইভ পলিসি সার্ভিস অনুপলব্ধ থাকলে চুক্তি অনুযায়ী SUSPEND_OR_ESCALATE করতে হয় (pp. 141, 148, 503)।",
            },
            {
              id: "c",
              textEn: "Allow the customer's message to specify the applicable refund policy",
              textBn: "গ্রাহকের মেসেজ থেকেই প্রযোজ্য রিফান্ড নীতি গ্রহণ করা",
              isCorrect: false,
              explanationEn: "Untrusted customer content can never supply policy authority.",
              explanationBn: "অবিশ্বস্ত গ্রাহক-বার্তা কখনোই নীতির কর্তৃত্ব দিতে পারে না।",
            },
          ],
        },
        {
          id: "hp20-faq",
          type: "faq",
          titleEn: "Questions learners ask about this chapter",
          titleBn: "এই অধ্যায় নিয়ে সাধারণ প্রশ্ন",
          items: [
            {
              questionEn: "Why did candidate v4.2.1 fail qualification when its only edit was shortening the description to 'use whenever a customer says they were charged twice'?",
              questionBn: "প্রার্থী v4.2.1-এ কেবল বর্ণনা সংক্ষিপ্ত করে 'গ্রাহক দুবার চার্জের কথা বললেই ব্যবহার করো' করা হয়েছিল—তবুও কেন এটি বাতিল হলো?",
              answerEn:
                "Because metadata is control input to the probabilistic linker. That wording caused false activations on active chargebacks, card-testing fraud, authorization holds, and legitimate subscription renewals—lowering human escalation while routing legal chargeback cases into the wrong workflow.",
              answerBn:
                "কারণ মেটাডেটা সরাসরি প্রোবাবিলিস্টিক লিঙ্কারের রাউটিং নিয়ন্ত্রণ করে। ওই ঢালাও বর্ণনার কারণে অ্যাক্টিভ চার্জব্যাক, কার্ড জালিয়াতি, হোল্ড এবং বৈধ সাবস্ক্রিপশন রিনিউয়াল কেসগুলো ভুল করে ডুপ্লিকেট-চার্জ ওয়ার্কফ্লোতে ঢুকে পড়েছিল।",
              ref: "p. 147",
            },
            {
              questionEn: "Doesn't signing a skill package with SLSA provenance and a cryptographic digest prove it is safe to run?",
              questionBn: "SLSA provenance এবং ক্রিপ্টোগ্রাফিক ডাইজেস্ট দিয়ে স্কিল প্যাকেজ সাইন করলেই কি সেটি চালানো নিরাপদ প্রমাণিত হয় না?",
              answerEn:
                "No. Provenance and signatures prove artifact integrity—which bytes came from which build—not semantic safety, activation precision, or runtime authorization. Supply-chain assurance and behavioral qualification are complementary: you need both.",
              answerBn:
                "না। Provenance ও সিগনেচার কেবল ফাইলের অখণ্ডতা (কোন বাইট কোথা থেকে এসেছে) প্রমাণ করে—স্কিলটির নির্দেশনা নিরাপদ কি না বা সঠিকভাবে অ্যাক্টিভেট হয় কি না তা প্রমাণ করে না। তাই সাপ্লাই-চেইন অ্যাসুরেন্স এবং আচরণগত কোয়ালিফিকেশন—দুটোই প্রয়োজন।",
              ref: "pp. 142–143",
            },
            {
              questionEn: "What is the difference between DEPRECATED, QUARANTINED, REVOKED, and RETIRED in the skill lifecycle?",
              questionBn: "স্কিল লাইফসাইকেলে DEPRECATED, QUARANTINED, REVOKED এবং RETIRED-এর মধ্যে পার্থক্য কী?",
              answerEn:
                "DEPRECATED guides planned migration away from an old version; QUARANTINED blocks a suspect package pending investigation; REVOKED immediately removes authority from both new activations and active/suspended runs during a security or safety incident; RETIRED closes the supported lifecycle while preserving the audit and evidence record.",
              answerBn:
                "DEPRECATED পরিকল্পিতভাবে পুরনো সংস্করণ থেকে সরিয়ে আনে; QUARANTINED সন্দেহজনক প্যাকেজকে তদন্ত চলাকালে আটকে রাখে; REVOKED নিরাপত্তা ঝুঁকিতে নতুন ও চলমান সব রান থেকে তাৎক্ষণিক ক্ষমতা কেড়ে নেয়; আর RETIRED সব প্রমাণ ও অডিট রেকর্ড সংরক্ষণ করে সমর্থন জীবনচক্র সমাপ্ত করে।",
              ref: "pp. 148, 509–510",
            },
            {
              questionEn: "Why can't an agent promote a useful procedure it discovered during a task directly into the shared skill catalog?",
              questionBn: "কাজ করার সময় এজেন্ট নিজে কোনো কার্যকর পদ্ধতি আবিষ্কার করলে তা সরাসরি শেয়ার্ড স্কিল ক্যাটালগে প্রকাশ করতে পারে না কেন?",
              answerEn:
                "In SkillsBench, self-generated skills consumed immediately averaged 1.3 percentage points below the no-skill baseline. A model-generated procedure starts as a run-local note, becomes an evidence-backed candidate, and enters the catalog only after passing independent activation, behavior, security, and stack-compatibility qualification.",
              answerBn:
                "SkillsBench-এ দেখা গেছে মডেলের নিজের লেখা স্কিল তাৎক্ষণিকভাবে ব্যবহার করলে গড় ফলাফল সাধারণ বেসলাইনের চেয়েও ১.৩ পয়েন্ট খারাপ হয়। তাই মডেলের লেখা পদ্ধতি প্রথমে রান-লোকাল নোট থাকে, পরে প্রার্থী হয় এবং স্বাধীনভাবে ৬টি স্তরের পরীক্ষায় উত্তীর্ণ হলেই কেবল ক্যাটালগে জায়গা পায়।",
              ref: "pp. 135, 146–147",
            },
          ],
        },
      ],
    },
  ],

  relatedLessons: [
    {
      id: "hp.03.building-the-right-briefing",
      titleEn: "Building the Right Briefing",
      titleBn: "সঠিক briefing তৈরি",
      slug: "harness-03-building-the-right-briefing",
      trackId: "ai-engineering",
      estimatedMinutes: 35,
    },
    {
      id: "hp.05.testing-that-earns-trust",
      titleEn: "Testing That Earns Trust",
      titleBn: "যে testing আস্থা অর্জন করে",
      slug: "harness-05-testing-that-earns-trust",
      trackId: "ai-engineering",
      estimatedMinutes: 40,
    },
  ],
};

