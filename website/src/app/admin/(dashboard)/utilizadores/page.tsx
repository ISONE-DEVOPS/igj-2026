export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Utilizadores</h1>
          <p className="text-sm text-gray-500 mt-1">{users.length} utilizadores</p>
        </div>
        <Link href="/admin/utilizadores/novo"><Button>+ Novo Utilizador</Button></Link>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-6 py-3 font-medium text-gray-500">Nome</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Email</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Papel</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Estado</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">Acções</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-navy-100 text-navy-600 rounded-full flex items-center justify-center font-medium text-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{user.email}</td>
                  <td className="px-6 py-4">
                    <Badge variant={user.role === "ADMIN" ? "info" : "default"}>
                      {user.role === "ADMIN" ? "Administrador" : "Editor"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={user.active ? "success" : "danger"}>
                      {user.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/utilizadores/${user.id}`} className="text-gold-600 hover:text-gold-700 font-medium">
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
