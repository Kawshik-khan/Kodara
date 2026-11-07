import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Topbar } from "@/components/navigation/Topbar";
import { Sidebar } from "@/components/navigation/Sidebar";
import { MobileNav } from "@/components/navigation/MobileNav";
import "./AppLayout.css";

export const AppLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const location = useLocation();

  // Full immersive layout when inside a lesson (/learn/:trackId/:lessonSlug)
  const isLessonActive = /^\/learn\/[^/]+\/[^/]+/.test(location.pathname);

  return (
    <div className={`app-layout ${isLessonActive ? "app-layout--lesson-mode" : ""}`}>
      {/* Background Cartesian coordinate grid layer */}
      <div className="bg-grid-layer" aria-hidden="true" />

      {/* Foreground application content */}
      <Topbar
        onMenuToggle={() => setIsMobileNavOpen(true)}
        showMenuButton={isLessonActive}
      />
      <div className="app-layout__body">
        {/* Hide global sidebar when in lesson mode to give full layout to the learning experience */}
        {!isLessonActive && (
          <Sidebar
            collapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          />
        )}
        <MobileNav
          open={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
        />
        <main className={`app-layout__main ${isLessonActive ? "app-layout__main--lesson" : ""}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

