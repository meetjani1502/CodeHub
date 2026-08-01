import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FlightState {
  flights: any[];
  addFlight: (flight: any) => void;
}

export const useFlightStore = create<FlightState>()(
  persist(
    (set) => ({
      flights: [],
      addFlight: (flight) =>
        set((state) => ({ flights: [...state.flights, flight] })),
    }),
    {
      name: 'flight-storage', // Key name in localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);