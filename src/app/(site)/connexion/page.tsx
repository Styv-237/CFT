import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { LoginForm } from "./_components/login-form";

export const metadata: Metadata = {
  title: "Connexion",
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Connexion</CardTitle>
          <p className="text-sm text-muted-foreground">Accédez à votre espace CFT.</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 pb-6">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
          <div className="rounded-xl bg-secondary/60 p-3 text-xs text-muted-foreground">
            Comptes de démonstration (mot de passe <strong>Password123!</strong>) : admin@cft.cm ·
            recruteur@cft.cm · club@cft.cm · joueur@cft.cm
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="font-medium text-primary hover:underline dark:text-accent">
              Créer un compte
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
