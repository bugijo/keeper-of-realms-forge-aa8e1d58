
export interface GamePlayer {
  id: string;
  name: string;
  characterId: string | null;
  characterName: string | null;
  characterClass: string | null;
  characterRace: string | null;
  characterLevel: number | null;
  online: boolean;
}

export interface MapToken {
  id: string;
  x: number;
  y: number;
  color: string;
  label: string;
  size: number;
}

export interface CombatCharacter {
  id: string;
  name: string;
  initiative: number;
  armorClass: number;
  hitPoints: number;
  maxHitPoints: number;
  conditions: string[];
  type: 'player' | 'monster' | 'npc';
}

export interface ProfileData {
  id: string;
  display_name: string;
}
