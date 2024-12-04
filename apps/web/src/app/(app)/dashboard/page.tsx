import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { WelcomeSection } from "./components/WelcomeSection";

const DashboardPage = async () => {
  const user = await getCurrentUser();
  console.log(user);

  if (!user) {
    redirect("/login");
  }
  return (
    <>
      <WelcomeSection username={user.username} />
    </>
  );
};

export default DashboardPage;
