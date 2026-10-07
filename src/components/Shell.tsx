import type { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Bell, CircleHelp, LayoutDashboard, Link2, Radio, Settings, Signal } from "lucide-react";

const navItems = [
  { to: "/", label: "实时监看", icon: LayoutDashboard },
  { to: "/streams", label: "流地址", icon: Link2 },
  { to: "/settings", label: "播放器设置", icon: Settings },
];

export function Shell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const title =
    location.pathname === "/streams"
      ? "流地址"
      : location.pathname === "/settings"
        ? "播放器设置"
        : "实时监看";
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">
            <Radio size={18} />
          </span>
          <span>
            STREAM<span className="brand-accent">/</span>DESK
          </span>
        </div>
        <div className="workspace">
          <span className="online-dot" /> SRS 本地节点 <span className="chevron">⌄</span>
        </div>
        <nav>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <Icon size={17} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="signal-card">
            <div className="signal-heading">
              <Signal size={15} /> 节点状态
            </div>
            <strong>在线</strong>
            <span>RTMP · 1935</span>
            <div className="signal-line">
              <i />
            </div>
          </div>
          <div className="profile">
            <div className="avatar">AL</div>
            <div>
              <strong>Alex Liu</strong>
              <small>管理员</small>
            </div>
            <CircleHelp size={16} className="muted-icon" />
          </div>
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <div>
            <span className="eyebrow">LIVE OPERATIONS</span>
            <h1>{title}</h1>
          </div>
          <div className="top-actions">
            <span className="clock">
              <span className="live-pulse" /> 系统正常
            </span>
            <button className="icon-button" aria-label="通知">
              <Bell size={17} />
            </button>
            <button className="avatar mini">AL</button>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
