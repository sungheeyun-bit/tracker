import { PiggyBank } from "lucide-react";
import Link from "next/link";
import React from "react";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <PiggyBank className="stroke h-11 w-11 stroke-amber-400 stoke-[1.7]" />
    </Link>
  );
}

export default Logo;
