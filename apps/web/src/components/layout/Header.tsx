import { getCurrentUser } from "@/lib/session";
import { HeaderContent } from "./HeaderContent";

export async function Header() {
  const user = await getCurrentUser();

  return <HeaderContent user={user} />;
}
