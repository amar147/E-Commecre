"use client";

import { usePathname } from "next/navigation";

import Footer from "@/app/_components/Footer/Footer";
import Navbar from "@/app/_components/Navbar/Navbar";

interface AppChromeProps {
  children: React.ReactNode;
}

export default function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname();
  const isMaintenancePage = pathname === "/maintenance";

  if (isMaintenancePage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
