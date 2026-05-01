import { redirect } from "next/navigation";

import { ROUTES } from "@/lib/constants/routes";
import { getCurrentUser } from "@/lib/supabase/auth";

export default async function HomePage() {
  const user = await getCurrentUser();
  redirect(user ? ROUTES.DASHBOARD : ROUTES.LOGIN);
}
