import * as React from "react";
import { logout } from "@/lib/api";

export async function UserLogout() {
  await logout();
  return <div>Logout</div>;
}
