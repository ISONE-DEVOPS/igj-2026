export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSetting.findMany({ orderBy: { key: "asc" } });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configurações do Site</h1>
        <p className="text-sm text-gray-500 mt-1">Configurações gerais do website IGJ</p>
      </div>

      <Card>
        <CardBody>
          <div className="space-y-4">
            {settings.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Nenhuma configuração encontrada.</p>
            ) : (
              settings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{setting.label || setting.key}</p>
                    <p className="text-xs text-gray-400">{setting.key}</p>
                  </div>
                  <p className="text-sm text-gray-600 max-w-md text-right">{setting.value}</p>
                </div>
              ))
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
