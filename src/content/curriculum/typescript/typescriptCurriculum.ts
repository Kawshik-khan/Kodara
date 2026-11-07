import { CurriculumGraph } from "@/features/curriculum/types/curriculum.types";
import { TYPESCRIPT_CONCEPTS } from "./concepts/typescriptConcepts";
import { TYPESCRIPT_PROJECTS } from "./projects/typescriptProjects";

import {
  MODULE_01_JS_FOUNDATIONS,
  MODULE_01_LESSONS,
} from "./modules/module01JsFoundations";
import {
  MODULE_02_TS_FUNDAMENTALS,
  MODULE_02_LESSONS,
} from "./modules/module02TsFundamentals";
import {
  MODULE_03_TYPE_SYSTEM,
  MODULE_03_LESSONS,
} from "./modules/module03TypeSystem";
import {
  MODULE_04_CONTROL_FLOW,
  MODULE_04_LESSONS,
} from "./modules/module04ControlFlow";
import {
  MODULE_05_FUNCTIONS_OBJECTS,
  MODULE_05_LESSONS,
} from "./modules/module05FunctionsObjects";
import {
  MODULE_06_GENERICS,
  MODULE_06_LESSONS,
} from "./modules/module06Generics";
import {
  MODULE_07_ADVANCED_TYPES,
  MODULE_07_LESSONS,
} from "./modules/module07AdvancedTypes";
import {
  MODULE_08_MODULES_CODE_ORG,
  MODULE_08_LESSONS,
} from "./modules/module08ModulesCodeOrg";
import {
  MODULE_09_COMPILER_AST,
  MODULE_09_LESSONS,
} from "./modules/module09CompilerAst";
import {
  MODULE_10_RUNTIME_INTEROP,
  MODULE_10_LESSONS,
} from "./modules/module10RuntimeInterop";
import {
  MODULE_11_PRODUCTION_TS,
  MODULE_11_LESSONS,
} from "./modules/module11ProductionTs";
import {
  MODULE_12_TS_REACT,
  MODULE_12_LESSONS,
} from "./modules/module12TsReact";
import {
  MODULE_13_EXPERT_TS,
  MODULE_13_LESSONS,
} from "./modules/module13ExpertTs";
import {
  MODULE_14_CAPSTONE_PROJECTS,
  MODULE_14_LESSONS,
} from "./modules/module14CapstoneProjects";

export const TYPESCRIPT_CURRICULUM: CurriculumGraph = {
  trackId: "typescript",
  trackTitleEn: "TypeScript: Deep Language Mechanics & Engineering",
  trackTitleBn: "TypeScript: গভীর ল্যাঙ্গুয়েজ মেকানিক্স এবং ইঞ্জিনিয়ারিং",
  curriculumVersion: "2.0.0",

  modules: [
    MODULE_01_JS_FOUNDATIONS,
    MODULE_02_TS_FUNDAMENTALS,
    MODULE_03_TYPE_SYSTEM,
    MODULE_04_CONTROL_FLOW,
    MODULE_05_FUNCTIONS_OBJECTS,
    MODULE_06_GENERICS,
    MODULE_07_ADVANCED_TYPES,
    MODULE_08_MODULES_CODE_ORG,
    MODULE_09_COMPILER_AST,
    MODULE_10_RUNTIME_INTEROP,
    MODULE_11_PRODUCTION_TS,
    MODULE_12_TS_REACT,
    MODULE_13_EXPERT_TS,
    MODULE_14_CAPSTONE_PROJECTS,
  ],

  lessons: [
    ...MODULE_01_LESSONS,
    ...MODULE_02_LESSONS,
    ...MODULE_03_LESSONS,
    ...MODULE_04_LESSONS,
    ...MODULE_05_LESSONS,
    ...MODULE_06_LESSONS,
    ...MODULE_07_LESSONS,
    ...MODULE_08_LESSONS,
    ...MODULE_09_LESSONS,
    ...MODULE_10_LESSONS,
    ...MODULE_11_LESSONS,
    ...MODULE_12_LESSONS,
    ...MODULE_13_LESSONS,
    ...MODULE_14_LESSONS,
  ],

  concepts: TYPESCRIPT_CONCEPTS,
  projects: TYPESCRIPT_PROJECTS,
};
