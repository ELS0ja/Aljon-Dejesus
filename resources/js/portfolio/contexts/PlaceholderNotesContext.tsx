import React, { createContext, useContext } from 'react';

const PlaceholderNotesContext = createContext<boolean>(true);

interface PlaceholderNotesProviderProps {
  show: boolean;
  children: React.ReactNode;
}

export function PlaceholderNotesProvider({ show, children }: PlaceholderNotesProviderProps) {
  return <PlaceholderNotesContext.Provider value={show}>{children}</PlaceholderNotesContext.Provider>;
}

export function useShowPlaceholderNotes(): boolean {
  return useContext(PlaceholderNotesContext);
}
