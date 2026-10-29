import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import SearchCommand from "./SearchCommand";

export default function Layout() {
  const [searchOpen, setSearchOpen] = useState(false);

  // Atalho global ⌘K / Ctrl+K
  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === "k") {
        ev.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="layout">
      <Sidebar onOpenSearch={() => setSearchOpen(true)} />
      <main className="main">
        <Outlet />
      </main>
      <SearchCommand open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
