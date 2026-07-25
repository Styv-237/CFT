"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2Icon, ShieldIcon, TrophyIcon, UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { registerUser } from "@/server/actions/auth";

const ROLES = [
  { value: "PLAYER" as const, label: "Joueur", icon: UserIcon, description: "Créez votre profil sportif" },
  { value: "CLUB" as const, label: "Club", icon: ShieldIcon, description: "Gérez votre effectif" },
  { value: "RECRUITER" as const, label: "Recruteur", icon: TrophyIcon, description: "Découvrez des talents" },
];

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: (defaultRole === "CLUB" || defaultRole === "RECRUITER" ? defaultRole : "PLAYER") as RegisterInput["role"],
    },
  });

  const role = watch("role");

  const onSubmit = async (data: RegisterInput) => {
    const result = await registerUser(data);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    const signInResult = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (signInResult?.error) {
      toast.success("Compte créé, connectez-vous.");
      router.push("/connexion");
      return;
    }
    toast.success("Compte créé avec succès");
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-2">
        {ROLES.map((r) => (
          <button
            key={r.value}
            type="button"
            onClick={() => setValue("role", r.value)}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition-colors",
              role === r.value ? "border-primary bg-primary/5" : "border-border hover:bg-secondary"
            )}
          >
            <r.icon className={cn("size-5", role === r.value ? "text-primary dark:text-accent" : "text-muted-foreground")} />
            <span className="text-xs font-semibold">{r.label}</span>
          </button>
        ))}
      </div>
      {errors.role && <p className="-mt-3 text-xs text-destructive">{errors.role.message}</p>}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nom complet</Label>
        <Input id="name" placeholder="Jean Mbarga" {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="vous@exemple.com" {...register("email")} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Mot de passe</Label>
        <Input id="password" type="password" placeholder="8 caractères minimum" {...register("password")} />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
        <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
        {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting} className="mt-2 gap-2">
        {isSubmitting && <Loader2Icon className="size-4 animate-spin" />}
        Créer mon compte
      </Button>
    </form>
  );
}
