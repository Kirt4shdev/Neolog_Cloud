import styles from "@styles/components/AppLogo.module.css";

export function AppLogo() {
  function goToHomePage() {
    return (document.location.href = "/home");
  }

  return (
    <span className={styles["app-logo"]} onClick={goToHomePage}>
      AppLogo
    </span>
  );
}
