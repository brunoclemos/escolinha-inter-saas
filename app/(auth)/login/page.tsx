import Link from "next/link";
import { redirect } from "next/navigation";
import { OnzeMark } from "@/components/onze-mark";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 flex flex-col items-center gap-3">
        <OnzeMark size="lg" />
        <p className="text-center text-sm text-muted-foreground text-balance">
          Acesse a plataforma da sua escolinha.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <LoginForm />
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Sua escolinha ainda não tem Onze?{" "}
        <Link href="/cadastrar-escola" className="text-brand hover:underline">
          Conhecer planos
        </Link>
      </p>
    </div>
  );
}
