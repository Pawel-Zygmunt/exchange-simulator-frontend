import React, { createContext, useContext, useState } from "react";

type Transaction = {
  id: string;
};
interface UserInterface {
  email: string;
  accountBalance: number;
  ownedStocksAmount: number;
  transactions: Transaction[];
}

interface ContextInterface {
  user: UserInterface | undefined;
  setUser: React.Dispatch<React.SetStateAction<UserInterface | undefined>>;
}

const contextInitState: ContextInterface = {
  user: undefined,
  setUser: () => {},
};

const AppContext = createContext(contextInitState);

export const useAppContext = () => useContext(AppContext);

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<UserInterface | undefined>();

  return (
    <AppContext.Provider value={{ user: state, setUser: setState }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
