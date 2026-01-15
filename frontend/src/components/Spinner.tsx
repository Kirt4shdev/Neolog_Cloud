import { useSpinner } from "@/context/spinner/useSpinner";
import styles from "@styles/components/Spinner.module.css";

export function Spinner() {
  const { isLoading } = useSpinner();

  if (!isLoading) return null;

  return (
    <div className={styles.spinner}>
      <p>Loading...</p>
    </div>
  );
}
