// SidebarMenu.jsx
import React, { useState } from "react";
import "./SideBarMenu.css";

function SideBarMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // body 스크롤 방지 (메뉴 열릴 때)
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div>
      {/* 햄버거 버튼 */}
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      {/* 오버레이 */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}

      {/* 사이드 메뉴 */}
      <nav className={`sidebar${isOpen ? " open" : ""}`}>
        <div className="sidebar-header">
          <h2>Sidebar</h2>
          <button className="sidebar-close" onClick={() => setIsOpen(false)}>
            &times;
          </button>
        </div>
        <div className="sidebar-content">
          <ul>
            <li onClick={() => setIsOpen(false)}>Test 1</li>
            <li onClick={() => setIsOpen(false)}>Test 2</li>
            <li onClick={() => setIsOpen(false)}>Test 3</li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default SideBarMenu;
