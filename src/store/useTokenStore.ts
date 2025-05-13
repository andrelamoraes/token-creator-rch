import { create } from 'zustand';
import { Token } from '../models/Token';

interface TokenState {
    token: Token | null;
    setToken: (token: Token) => void;
  }

export const useTokenStore = create<TokenState>((set) => ({
    token: null,
    setToken: (token: Token) => set({ token }),
  }));