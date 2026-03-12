"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export function AdminHeader() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-medium text-gray-600">
          Painel de Administração
        </h2>
      </div>

      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
        >
          <div className="w-8 h-8 bg-navy-100 text-navy-600 rounded-full flex items-center justify-center font-medium text-xs">
            {session?.user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <span className="hidden sm:block">{session?.user?.name || "Admin"}</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
            <div className="px-4 py-2 border-b">
              <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
              <p className="text-xs text-gray-500">{session?.user?.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Terminar sessão
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
