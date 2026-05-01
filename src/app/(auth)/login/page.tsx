import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string; mode?: string }>;
}

const SIGNUP_MODE = "signup";

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const isSignup = params.mode === SIGNUP_MODE;
  const redirectTo = params.redirect;

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-6">
        <header className="space-y-1 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Bluefields
          </p>
          <h1 className="text-2xl font-semibold">Acompanhamento de Startups</h1>
          <p className="text-sm text-muted-foreground">
            Acesso restrito ao time interno.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>{isSignup ? "Criar conta" : "Entrar"}</CardTitle>
            <CardDescription>
              {isSignup
                ? "Cadastre-se com seu e-mail Bluefields para começar a acompanhar as startups."
                : "Use seu e-mail e senha do time Bluefields."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSignup ? <SignupForm /> : <LoginForm redirectTo={redirectTo} />}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          {isSignup ? (
            <>
              Já tem conta?{" "}
              <Link className="text-primary underline-offset-2 hover:underline" href="/login">
                Entrar
              </Link>
            </>
          ) : (
            <>
              Primeiro acesso?{" "}
              <Link
                className="text-primary underline-offset-2 hover:underline"
                href="/login?mode=signup"
              >
                Criar conta
              </Link>
            </>
          )}
        </p>
      </div>
    </main>
  );
}
