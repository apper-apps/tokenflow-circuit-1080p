import { useState, useEffect, createContext, useContext } from "react";

// Create context for mobile menu state
const MobileMenuContext = createContext();

// Provider component
export const MobileMenuProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  // Close menu when clicking outside or on route change
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const value = {
    isOpen,
    toggle,
    open,
    close
  };

  return (
    <MobileMenuContext.Provider value={value}>
      {children}
    </MobileMenuContext.Provider>
  );
};

// Hook to use mobile menu context
export const useMobileMenuContext = () => {
  const context = useContext(MobileMenuContext);
  if (!context) {
    throw new Error('useMobileMenuContext must be used within a MobileMenuProvider');
  }
  return context;
};

// Backward compatibility - original hook for any components that still use it
export const useMobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  // Close menu when clicking outside or on route change
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    isOpen,
    toggle,
    open,
    close
  };
};