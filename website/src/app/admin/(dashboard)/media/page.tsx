export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

export default async function AdminMediaPage() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media</h1>
          <p className="text-sm text-gray-500 mt-1">{media.length} ficheiros</p>
        </div>
      </div>

      {media.length === 0 ? (
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400 mb-2">Nenhum ficheiro carregado</p>
              <p className="text-sm text-gray-400">
                O sistema de upload de ficheiros será configurado com Google Cloud Storage.
              </p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((item) => (
            <div key={item.id} className="group rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {item.mimeType.startsWith("image/") ? (
                <div className="aspect-square">
                  <img src={item.url} alt={item.alt || item.filename} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-square bg-gray-50 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              )}
              <div className="p-2">
                <p className="text-xs text-gray-700 truncate">{item.filename}</p>
                <p className="text-xs text-gray-400">{(item.size / 1024).toFixed(0)} KB</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
