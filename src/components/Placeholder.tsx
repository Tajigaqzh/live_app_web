import { NavLink } from "react-router-dom";
import { Settings } from "lucide-react";

export function Placeholder({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="content">
      <div className="empty-page">
        <div className="overlay-icon">
          <Settings size={22} />
        </div>
        <h2>{title}</h2>
        <p>{copy}</p>
        <NavLink to="/" className="back-button">
          返回实时监看
        </NavLink>
      </div>
    </div>
  );
}
