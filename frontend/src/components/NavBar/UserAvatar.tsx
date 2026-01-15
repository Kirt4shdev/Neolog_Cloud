import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth/useAuth";
import styles from "@styles/components/UserAvatar.module.css";
import type { UserProfileEntity } from "@core/user-profile/entities/UserProfileEntity";

export function UserAvatar({ user }: { user: UserProfileEntity }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setIsDropdownOpen(false);
  };

  const menuOptions = [
    {
      label: "Perfil",
      icon: "👤",
      action: () => {
        navigate("/profile");
        setIsDropdownOpen(false);
      },
    },
    {
      label: "Configuración",
      icon: "⚙️",
      action: () => {
        navigate("/configuration");
        setIsDropdownOpen(false);
      },
    },
    {
      label: "Ayuda",
      icon: "❓",
      action: () => {
        navigate("/help");
        setIsDropdownOpen(false);
      },
    },
    {
      label: "Cerrar sesión",
      icon: "🚪",
      action: handleLogout,
      isLogout: true,
    },
  ];

  return (
    <div className={styles["avatar-content"]} ref={dropdownRef}>
      {user?.user?.name || user?.user?.email}
      <div
        className={styles["avatar-circle"]}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        👤
      </div>

      {isDropdownOpen && (
        <div className={styles["dropdown-menu"]}>
          <div className={styles["dropdown-header"]}>
            <div className={styles["dropdown-user-info"]}>
              <div className={styles["dropdown-avatar"]}>👤</div>
              <div>
                <div className={styles["dropdown-name"]}>
                  {user?.user?.name}
                </div>
                <div className={styles["dropdown-email"]}>
                  {user?.user?.email}
                </div>
              </div>
            </div>
          </div>
          <div className={styles["dropdown-divider"]}></div>
          {menuOptions.map((option, index) => (
            <button
              key={index}
              className={`${styles["dropdown-item"]} ${
                option.isLogout ? styles["logout-item"] : ""
              }`}
              onClick={option.action}
            >
              <span className={styles["dropdown-icon"]}>{option.icon}</span>
              <span className={styles["dropdown-label"]}>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
