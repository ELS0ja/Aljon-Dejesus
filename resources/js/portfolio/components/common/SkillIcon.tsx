import React from 'react';
import {
  Accessibility,
  Code,
  Database,
  KeyRound,
  LayoutTemplate,
  Network,
  Package,
  Server,
  ShieldCheck,
  Smartphone,
  Table,
  Terminal,
  Webhook,
  Workflow,
  Wrench,
  HardDrive,
} from 'lucide-react';
import { FaCss3Alt, FaGitAlt, FaGithub, FaHtml5, FaJs, FaPhp } from 'react-icons/fa';
import type { SkillIconKey } from '../../types/portfolio';

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const iconMap: Record<SkillIconKey, { Icon: IconComponent; color: string }> = {
  html: { Icon: FaHtml5, color: 'text-[#F06529]' },
  css: { Icon: FaCss3Alt, color: 'text-[#2965F1]' },
  js: { Icon: FaJs, color: 'text-[#F7DF1E]' },
  responsive: { Icon: Smartphone, color: 'text-brand' },
  a11y: { Icon: Accessibility, color: 'text-brand' },
  php: { Icon: FaPhp, color: 'text-[#8892BF]' },
  validation: { Icon: ShieldCheck, color: 'text-success' },
  api: { Icon: Webhook, color: 'text-brand-2' },
  auth: { Icon: KeyRound, color: 'text-brand-2' },
  mysql: { Icon: Database, color: 'text-[#4479A1]' },
  schema: { Icon: Network, color: 'text-brand' },
  sql: { Icon: Terminal, color: 'text-brand' },
  crud: { Icon: Table, color: 'text-brand' },
  relations: { Icon: Workflow, color: 'text-brand-2' },
  git: { Icon: FaGitAlt, color: 'text-[#F05032]' },
  github: { Icon: FaGithub, color: 'text-ink' },
  vscode: { Icon: Code, color: 'text-[#3B9CEB]' },
  xampp: { Icon: HardDrive, color: 'text-[#FB7A24]' },
  composer: { Icon: Package, color: 'text-[#C9A26D]' },
  frontend: { Icon: LayoutTemplate, color: 'text-brand' },
  backend: { Icon: Server, color: 'text-brand-2' },
  database: { Icon: Database, color: 'text-success' },
  tools: { Icon: Wrench, color: 'text-brand' },
};

interface SkillIconProps {
  icon: SkillIconKey;
  className?: string;
}

export function SkillIcon({ icon, className = 'size-4' }: SkillIconProps) {
  const { Icon, color } = iconMap[icon];
  return <Icon className={`${className} ${color}`} aria-hidden="true" />;
}
