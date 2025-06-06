import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";
import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";

export const dynamic = 'force-dynamic';

async function page() {
  const session = await caller.auth.session();
  if (session.user) {
    redirect("/");
  }
  return <SignUpView />;
}

export default page;
