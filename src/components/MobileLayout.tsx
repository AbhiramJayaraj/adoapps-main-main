import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";

const MobileLayout = ({ children, hideNav }: { children: ReactNode; hideNav?: boolean }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background">
      <div className={hideNav ? "" : "pb-20"}>{children}</div>
      {!hideNav && <BottomNav />}
    </div>
  );
};

export default MobileLayout;
