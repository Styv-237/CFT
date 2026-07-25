import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { RegisterForm } from "./_components/register-form";

export const metadata: Metadata = {
  title: "Créer un compte",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Créer un compte</CardTitle>
          <p className="text-sm text-muted-foreground">Rejoignez la plateforme CFT.</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 pb-6">
          <Suspense fallback={null}>
            <RegisterForm />
          </Suspense>
          <p className="text-center text-sm text-muted-foreground">
            Déjà inscrit ?{" "}
            <Link href="/connexion" className="font-medium text-primary hover:underline dark:text-accent">
              Se connecter
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
