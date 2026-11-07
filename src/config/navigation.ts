import React from "react";
import {
  Home,
  Box,
  Sparkles,
  PlayCircle,
  Trophy,
  Folder,
  Network,
  GitFork,
  Building2,
  BarChart2,
  Settings,
} from "lucide-react";
import { routes } from "./routes";
import { TsBadgeIcon, PythonIcon, ReactIcon } from "@/components/navigation/NavIcons";

export interface NavItemConfig {
  id: string;
  labelKey: string;
  href: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  badge?: string;
}


export interface NavSectionConfig {
  id: string;
  titleKey: string;
  items: NavItemConfig[];
}

export const navigationConfig: NavSectionConfig[] = [
  {
    id: "workspace",
    titleKey: "",
    items: [
      {
        id: "dashboard",
        labelKey: "navigation.dashboard",
        href: routes.dashboard,
        icon: Home,
      },
    ],
  },
  {
    id: "learn",
    titleKey: "navigation.learn",
    items: [
      {
        id: "typescript",
        labelKey: "navigation.typescript",
        href: routes.typescript,
        icon: TsBadgeIcon,
      },
      {
        id: "python",
        labelKey: "navigation.python",
        href: routes.python,
        icon: PythonIcon,
      },
      {
        id: "react",
        labelKey: "navigation.react",
        href: routes.react,
        icon: ReactIcon,
      },
      {
        id: "system-design",
        labelKey: "navigation.systemDesign",
        href: routes.systemDesign,
        icon: Box,
      },
      {
        id: "ai-engineering",
        labelKey: "navigation.aiEngineering",
        href: routes.aiEngineering,
        icon: Sparkles,
      },
    ],
  },
  {
    id: "practice",
    titleKey: "navigation.practice",
    items: [
      {
        id: "playground",
        labelKey: "navigation.playground",
        href: routes.playground,
        icon: PlayCircle,
      },
      {
        id: "challenges",
        labelKey: "navigation.challenges",
        href: routes.challenges,
        icon: Trophy,
      },
    ],
  },
  {
    id: "build",
    titleKey: "navigation.build",
    items: [
      {
        id: "projects",
        labelKey: "navigation.projects",
        href: routes.projects,
        icon: Folder,
      },
    ],
  },
  {
    id: "explore",
    titleKey: "navigation.explore",
    items: [
      {
        id: "concepts",
        labelKey: "navigation.concepts",
        href: routes.concepts,
        icon: Network,
      },
      {
        id: "skill-map",
        labelKey: "navigation.skillMap",
        href: routes.skillMap,
        icon: GitFork,
      },
      {
        id: "architecture-lab",
        labelKey: "navigation.architectureLab",
        href: routes.architectureLab,
        icon: Building2,
      },
    ],
  },
  {
    id: "system",
    titleKey: "",
    items: [
      {
        id: "progress",
        labelKey: "navigation.progress",
        href: routes.progress,
        icon: BarChart2,
      },
      {
        id: "settings",
        labelKey: "navigation.settings",
        href: routes.settings,
        icon: Settings,
      },
    ],
  },
];
