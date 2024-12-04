import { APP_URL } from "@/lib/env";
import { cookies } from "next/headers";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();

  const res = await fetch(`${APP_URL}/api/auth/me`, {
    headers: {
      Cookie: cookieString,
    },
    cache: "no-cache",
  });

  if (!res.ok) {
    return undefined;
  }

  const data = await res.json();

  if (!data?.id) {
    return undefined;
  }

  return data;
}
