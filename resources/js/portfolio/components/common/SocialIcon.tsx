import React from 'react';
import { Mail } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import type { SocialIconKey } from '../../types/portfolio';

interface SocialIconProps {
  icon: SocialIconKey;
  className?: string;
}

export function SocialIcon({ icon, className = 'size-4' }: SocialIconProps) {
  if (icon === 'github') return <FaGithub className={className} aria-hidden="true" />;
  if (icon === 'linkedin') return <FaLinkedin className={className} aria-hidden="true" />;
  return <Mail className={className} aria-hidden="true" />;
}
