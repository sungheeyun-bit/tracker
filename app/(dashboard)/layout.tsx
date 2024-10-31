import Navbar from "@/components/Navbar";
import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-screen flex-col container mx-auto">
      <Navbar />
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default layout;
