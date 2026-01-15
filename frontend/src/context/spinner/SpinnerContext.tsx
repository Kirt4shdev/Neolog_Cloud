import { createContext, type Dispatch, type SetStateAction } from "react";

interface SpinnerContextType {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export const SpinnerContext = createContext<SpinnerContextType>({
  isLoading: false,
  setIsLoading: function () {},
});
