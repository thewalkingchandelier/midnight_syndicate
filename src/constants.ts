/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CrewMember {
  id: string;
  name: string;
  role: 'Hacker' | 'Muscle' | 'Driver' | 'Grifter' | 'Infiltrator';
  description: string;
  skillLevel: number;
  perk: string;
}

export interface HeistChoice {
  id: string;
  text: string;
  consequence: string;
  riskModifier: number;
  nextStepId?: string;
  isTerminal?: boolean;
}

export interface HeistStep {
  id: string;
  title: string;
  description: string;
  choices: HeistChoice[];
}

export const CREW_MEMBERS: CrewMember[] = [
  {
    id: 'jax',
    name: 'Jax "Static" Miller',
    role: 'Hacker',
    description: 'Bypasses security grids in seconds. Former cyber-warfare specialist.',
    skillLevel: 9,
    perk: 'Bypasses digital locks with 10% higher success rate.'
  },
  {
    id: 'vega',
    name: 'Sofia Vega',
    role: 'Infiltrator',
    description: 'Expert gymnast and shadow-dweller. Can fit through ventilation ducts.',
    skillLevel: 8,
    perk: 'Avoids detection during movement phases.'
  },
  {
    id: 'tank',
    name: 'Marcus "Tank" Reed',
    role: 'Muscle',
    description: 'Ex-Special Forces. If brute force is the only way, he is the key.',
    skillLevel: 7,
    perk: 'Provides a second chance if things get violent.'
  },
  {
    id: 'ghost',
    name: 'Elena "Ghost" Voss',
    role: 'Driver',
    description: 'Can drive a semi through a needle. Specializes in rapid extraction.',
    skillLevel: 8,
    perk: 'Increases escape probability by 15%.'
  },
  {
    id: 'slick',
    name: 'Julian "Slick" Thorne',
    role: 'Grifter',
    description: 'Could sell ice to a polar bear. Expert in social engineering.',
    skillLevel: 7,
    perk: 'Can bluff past guards during social phases.'
  }
];

export const HEIST_STEPS: Record<string, HeistStep> = {
  'entry': {
    id: 'entry',
    title: 'The Incursion',
    description: 'The Diamond Gallery is protected by bioluminescent motion sensors and thermal cameras. How do we get inside?',
    choices: [
      {
        id: 'vent',
        text: 'Access through the roof vents.',
        consequence: 'Silent but slow.',
        riskModifier: 0.1,
        nextStepId: 'hallway'
      },
      {
        id: 'front',
        text: 'Bluff through the front desk as inspectors.',
        consequence: 'Risky social play.',
        riskModifier: 0.3,
        nextStepId: 'lobby'
      },
      {
        id: 'back',
        text: 'Cut through the delivery bay door.',
        consequence: 'Fast but loud.',
        riskModifier: 0.5,
        nextStepId: 'storage'
      }
    ]
  },
  'hallway': {
    id: 'hallway',
    title: 'The Service Corridor',
    description: 'You are in the vents. It\'s cramped. A guard is patrolling the floor below. You see a junction.',
    choices: [
      {
        id: 'wait',
        text: 'Wait for the patrol to pass.',
        consequence: 'Patience pays off.',
        riskModifier: -0.1,
        nextStepId: 'vault_approach'
      },
      {
        id: 'drop',
        text: 'Drop down and neutralize the guard.',
        consequence: 'Aggressive move.',
        riskModifier: 0.4,
        nextStepId: 'vault_approach'
      }
    ]
  },
  'lobby': {
    id: 'lobby',
    title: 'Main Lobby',
    description: 'The receptionist is eyeing your badges suspiciously. One wrong word and the alarm trips.',
    choices: [
      {
        id: 'bribe',
        text: 'Offer a generous "donation" to the staff fund.',
        consequence: 'Money talks.',
        riskModifier: 0.2,
        nextStepId: 'vault_approach'
      },
      {
        id: 'professional',
        text: 'Demand to see the manager for "security violations".',
        consequence: 'Confidence is key.',
        riskModifier: 0.1,
        nextStepId: 'vault_approach'
      }
    ]
  },
  'storage': {
    id: 'storage',
    title: 'Storage Bay',
    description: 'You\'ve cut the lock. The area is filled with crates. A security camera is panning the room.',
    choices: [
      {
        id: 'hack',
        text: 'Loop the camera feed.',
        consequence: 'Digital ghosting.',
        riskModifier: 0.05,
        nextStepId: 'vault_approach'
      },
      {
        id: 'dash',
        text: 'Dash between crates during the pan.',
        consequence: 'Physical test.',
        riskModifier: 0.3,
        nextStepId: 'vault_approach'
      }
    ]
  },
  'vault_approach': {
    id: 'vault_approach',
    title: 'The Vault Entrance',
    description: 'The "Heart of Midnight" diamond is just behind this 2-ton titanium door. A laser grid is active.',
    choices: [
      {
        id: 'careful',
        text: 'Carefully disable the lasers.',
        consequence: 'Steady hands.',
        riskModifier: 0.1,
        nextStepId: 'escape'
      },
      {
        id: 'brute',
        text: 'Override the central server to kill power.',
        consequence: 'Leaves a trail.',
        riskModifier: 0.4,
        nextStepId: 'escape'
      }
    ]
  },
  'escape': {
    id: 'escape',
    title: 'The Escape',
    description: 'Got the diamond! But the silent alarm tripped. Sirens are wailing in the distance. How do we disappear?',
    choices: [
      {
        id: 'wheels',
        text: 'High-speed chase through the city.',
        consequence: 'Maximum visibility.',
        riskModifier: 0.6,
        isTerminal: true
      },
      {
        id: 'sewers',
        text: 'Disappear into the underground tunnels.',
        consequence: 'Low visibility, slow exit.',
        riskModifier: 0.2,
        isTerminal: true
      }
    ]
  }
};
