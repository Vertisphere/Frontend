import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Bug,
  CheckCircle2,
  Circle,
  HelpCircle,
  PackagePlus,
  ScrollText,
  Timer,
  XCircle,
} from "lucide-react";

export const status_options = [
  {
    value: "Active",
    label: "Active",
    icon: HelpCircle,
  },
  {
    value: "Not Active",
    label: "Not Active",
    icon: Circle,
  },
];

export const label_options = [
  {
    value: "bug",
    label: "Bug",
    icon: Bug,
  },
  {
    value: "feature",
    label: "Feature",
    icon: PackagePlus,
  },
  {
    value: "documentation",
    label: "Documentation",
    icon: ScrollText,
  },
];

export const priority_options = [
  {
    value: "low",
    label: "Low",
    icon: ArrowDown,
  },
  {
    value: "medium",
    label: "Medium",
    icon: ArrowRight,
  },
  {
    value: "high",
    label: "High",
    icon: ArrowUp,
  },
];
