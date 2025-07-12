import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import { MobileMenuProvider } from "@/hooks/useMobileMenu";
import { useTheme } from "@/hooks/useTheme";
import { useEffect } from "react";

const Layout = () => {
  const { theme } = useTheme();
  
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

return (
    <MobileMenuProvider>
      <div className="min-h-screen bg-surface-900 flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        
        {/* Mobile Sidebar */}
        <MobileSidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:ml-64">
          <Header />
          <main className="flex-1 p-6 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </MobileMenuProvider>
  );
};

export default Layout;