// @/src/lib/experience.ts
import type { ExperienceItem } from '@/types/experience';
import { Briefcase, Zap, Lightbulb, BrainCircuit, Code } from 'lucide-react';

export const experienceData: ExperienceItem[] = [
  {
    id: '1',
    title: 'Lead Futurist & UI Architect',
    company: 'Chrono Dynamics Corp.',
    period: '2077 – Present',
    description: 'Pioneering next-generation user interfaces for temporal displacement technologies. Spearheaded the "Flux UI" initiative, resulting in a 40% increase in temporal navigation efficiency and enhanced user precognition in simulated environments.',
    icon: Zap,
  },
  {
    id: '2',
    title: 'Senior Experience Designer',
    company: 'Aether Systems Ltd.',
    period: '2073 – 2077',
    description: 'Designed and prototyped holographic interfaces for advanced AI companions. Led a team of 5 designers in creating intuitive and emotionally resonant interactions, focusing on neuro-haptic feedback systems.',
    icon: BrainCircuit,
  },
  {
    id: '3',
    title: 'UX Developer',
    company: 'Quantum Leap Innovations',
    period: '2070 – 2073',
    description: 'Developed user flows and interactive prototypes for early-stage quantum computing applications. Contributed to research on human-quantum computer interaction (HQCI) and built VR training modules.',
    icon: Code,
  },
   {
    id: '4',
    title: 'Junior UI/UX Intern',
    company: 'SynthNet Solutions',
    period: '2068 – 2070',
    description: 'Assisted senior designers with UI mockups, user testing, and asset creation for AI-driven network optimization tools. First exposure to neural network visualization challenges.',
    icon: Lightbulb,
  }
];

export function getExperience(): ExperienceItem[] {
  return experienceData;
}
