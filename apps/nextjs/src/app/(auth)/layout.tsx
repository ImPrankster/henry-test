import { redirect } from "next/navigation";

import { createClient } from "~/server/supabase";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/");
  }
  return <>{children}</>;
}
