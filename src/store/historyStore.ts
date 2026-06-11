/**
 * Completed-game history — Zustand + AsyncStorage. Fully offline, no accounts.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GameConfig, TeamId } from '@/domain/scoring';

export interface CompletedGame {
  id: string;
  endedAt: string;
  startedAt: string | null;
  config: GameConfig;
  scoreA: number;
  scoreB: number;
  winner: TeamId | null;
  rallies: number;
}

interface HistoryStore {
  games: CompletedGame[];
  addGame: (game: CompletedGame) => void;
  removeGame: (id: string) => void;
  clearAll: () => void;
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set, get) => ({
      games: [],
      addGame: (game) => set({ games: [game, ...get().games] }),
      removeGame: (id) =>
        set({ games: get().games.filter((g) => g.id !== id) }),
      clearAll: () => set({ games: [] }),
    }),
    {
      name: 'psk_history',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export function newGameId(): string {
  return `g_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
