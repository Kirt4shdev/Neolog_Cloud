import { useState } from "react";
import { SpinnerContext } from "./SpinnerContext";

export function SpinnerProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <SpinnerContext.Provider
      value={{
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </SpinnerContext.Provider>
  );
}
