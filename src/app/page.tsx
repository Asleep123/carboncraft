"use client";

import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";

export default function Home() {
  
  return (
    <Link className={buttonVariants({ variant: "default" })} href="/api/auth/login">Authenticate</Link>
  )
}
