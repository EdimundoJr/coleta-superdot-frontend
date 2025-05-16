import { Flex, Separator, Skeleton } from "@radix-ui/themes"


const SkeletonURLCard = () => {
  return (
    <Flex direction="column" gap="4">
      {/* Título e Ícone */}
      <Flex align="center" gap="2">
        <Skeleton className="h-6 w-6 rounded-full bg-primary-300" />
        <Skeleton className="h-5 w-40" />
      </Flex>

      {/* URL */}
      <Flex align="center" gap="3" className="bg-violet-200 p-3 rounded">
        <div className="flex-1">
          <Skeleton className="h-10 w-full rounded bg-gray-100" />
        </div>
        <Skeleton className="h-5 w-5 rounded bg-gray-300" />
      </Flex>

      <Separator size="4" />

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 rounded bg-gray-100">
            <Skeleton className="h-5 w-5 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}

        {/* Botão de adicionar participantes (condicional) */}
        <Skeleton className="h-10 w-full md:w-auto rounded" />
      </div>
    </Flex>
  )
}

export default SkeletonURLCard;


