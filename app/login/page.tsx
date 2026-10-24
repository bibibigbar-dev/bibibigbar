import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { loginAction } from "@/lib/actions/auth";
import { getCurrentUser } from "@/lib/queries";
import { safeNextPath } from "@/lib/utils";

export const metadata = { title: "Log in" };

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;
  const nextPath = safeNextPath(next || "");
  const user = await getCurrentUser();
  if (user) redirect(nextPath || (user.role === "admin" ? "/admin" : "/my"));

  return (
    <>
      <AuthForm
        action={loginAction}
        title="Welcome back"
        subtitle="Sign in with the site owner account."
        submitLabel="Log in"
        nextPath={nextPath}
      />
    </>
  );
}
