import { useAuth } from "@/context/auth/useAuth";
import { UserAvatar } from "./UserAvatar";
import { AppLogo } from "./AppLogo";
import { NavigationLinks } from "./NavigationLinks";
import styles from "@styles/components/NavBar.module.css";

export function NavBar() {
  const { isAuthenticated, user } = useAuth();

  if (!user || !isAuthenticated) return null;

  return (
    <nav className={styles.navbar}>
      <section className={styles["nav-logo-content"]}>
        <AppLogo />
      </section>
      <section className={styles["nav-links-content"]}>
        <NavigationLinks />
      </section>
      <section className={styles["nav-avatar-content"]}>
        <UserAvatar user={user} />
      </section>
    </nav>
  );
}
