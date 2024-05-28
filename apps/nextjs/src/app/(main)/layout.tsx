import { createClient } from "~/server/supabase";
import NavBar from "./nav";

async function MainLayout({ children }: { children: React.ReactNode }) {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <NavBar />
      {user?.email}
      {children}
    </div>
  );
}

export default MainLayout;
