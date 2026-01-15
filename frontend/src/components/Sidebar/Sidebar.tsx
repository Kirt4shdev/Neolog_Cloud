import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth/useAuth';
import { useTheme } from '@/context/theme/useTheme';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isExpanded: boolean;
  onToggle: (expanded: boolean) => void;
}

export function Sidebar({ isExpanded, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isAdmin = user?.roles?.includes('admin');
  const isClient = user?.roles?.includes('client');

  const toggleSidebar = () => {
    onToggle(!isExpanded);
  };

  const menuItems = [
    {
      label: 'Dashboard',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
      path: '/admin/dashboard',
      roles: ['admin'],
    },
    {
      label: 'Dispositivos',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      ),
      path: '/admin/devices',
      roles: ['admin'],
    },
    {
      label: 'Usuarios',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      path: '/admin/users',
      roles: ['admin'],
    },
    {
      label: 'Perfil',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      path: '/profile',
      roles: ['admin', 'client'],
    },
    {
      label: 'Configuración',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
      path: '/configuration',
      roles: ['admin', 'client'],
    },
    {
      label: 'Ayuda',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <circle cx="12" cy="17" r="0.5" fill="currentColor" />
        </svg>
      ),
      path: '/help',
      roles: ['admin', 'client'],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.some((role) => user?.roles?.includes(role))
  );

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Toggle Button - Rediseñado */}
      <button 
        className={`${styles.toggleButton} ${isExpanded ? styles.toggleExpanded : styles.toggleCollapsed}`}
        onClick={toggleSidebar} 
        aria-label="Toggle sidebar"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {isExpanded ? (
            <polyline points="15 18 9 12 15 6" />
          ) : (
            <polyline points="9 18 15 12 9 6" />
          )}
        </svg>
      </button>

      <aside className={`${styles.sidebar} ${isExpanded ? styles.expanded : styles.collapsed}`}>
        {/* Logo - Siempre muestra "N" para evitar saltos */}
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <span className={styles.logoN}>N</span>
            <span className={`${styles.logoText} ${!isExpanded ? styles.logoTextHidden : ''}`}>eoLogg Cloud</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className={styles.menu}>
          {filteredMenuItems.map((item) => (
            <button
              key={item.path}
              className={`${styles.menuItem} ${isActive(item.path) ? styles.active : ''}`}
              onClick={() => navigate(item.path)}
              title={!isExpanded ? item.label : undefined}
            >
              <span className={styles.menuIcon}>{item.icon}</span>
              {isExpanded && <span className={styles.menuLabel}>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Theme Toggle */}
        <div className={styles.themeToggle}>
          <button onClick={toggleTheme} className={styles.themeButton} title="Cambiar tema">
            {theme === 'dark' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
            {isExpanded && <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}</span>}
          </button>
        </div>

        {/* User Info */}
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          {isExpanded && (
            <div className={styles.userDetails}>
              <div className={styles.userName}>{user?.name || 'Usuario'}</div>
              <div className={styles.userRole}>
                {isAdmin ? 'Administrador' : isClient ? 'Cliente' : 'Usuario'}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
