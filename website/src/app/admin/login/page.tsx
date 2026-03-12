"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setError("Email ou password incorretos");
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gold-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            IGJ
          </div>
          <h1 className="text-2xl font-bold text-white">Administração</h1>
          <p className="text-gray-400 text-sm mt-1">Inspecção-Geral de Jogos</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="email"
              type="email"
              label="Email"
              placeholder="admin@igj.cv"
              required
            />
            <Input
              name="password"
              type="password"
              label="Password"
              placeholder="Introduza a password"
              required
            />

            {error && (
              <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full">
              Entrar
            </Button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          &copy; {new Date().getFullYear()} IGJ - Inspecção-Geral de Jogos
        </p>
      </div>
    </div>
  );
}
