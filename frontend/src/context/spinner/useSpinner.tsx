import { useContext } from "react";
import { SpinnerContext } from "./SpinnerContext";

export function useSpinner() {
  const context = useContext(SpinnerContext);

  if (!context)
    throw new Error("useSpinner must be used with a SpinnerProvider");

  return context;
}
