import { Metadata } from "next";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/ui/components/button";
import { UserAuthForm } from "../components/UserAuthForm";
import { logout } from "@/lib/api";
import { UserLogout } from "../components/UserLogout";

export const metadata: Metadata = {
  title: "Login",
  description: "Authentication forms built using the components.",
};

export default async function LogoutPage() {
  return <UserLogout />;
}
