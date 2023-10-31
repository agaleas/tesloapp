import { useReducer } from 'react';
import { UiContext, uiReducer } from './';

export interface UiState {
  isMenuOpen: boolean;
}

const UI_INITIAL_STATE: UiState = {
  isMenuOpen: false,
};

export const UiProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

  const toggleSideMenu = () => {
    dispatch({ type: '[Ui] - ToggleMenu' });
  };
  return (
    <UiContext.Provider
      value={{
        ...state,

        //methods
        toggleSideMenu,
      }}
    >
      {children}
    </UiContext.Provider>
  );
};
