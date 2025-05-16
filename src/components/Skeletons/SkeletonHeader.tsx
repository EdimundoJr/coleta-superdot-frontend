import { Box, Skeleton } from "@radix-ui/themes"

interface SkeletonHeaderProps {
  filter?: boolean;
  buttons?: boolean;
}


const SkeletonHeader = ({ filter, buttons }: SkeletonHeaderProps) => {
  return (
    <>
      <Box className="px-4 md:px-8 lg:px-0 max-w-7xl mx-auto desktop">
        <header className="pt-8 pb-6 border-b border-gray-200 mb-8">

          <Skeleton className="h-6 w-[400px] mb-2 m-auto" />
          <Skeleton className="h-6 w-[700px] mb-2 m-auto" />
        </header>
      </Box>
      <header className="pt-8 pb-6 border-b border-gray-200 mb-8 mobo">
        <Skeleton className="h-6  sm:w-3/4 md:w-[400px] lg:w-[500px] mb-2 mx-auto" />
        <Skeleton className="h-6  sm:w-4/5 md:w-[700px] lg:w-[800px] mb-2 mx-auto" />
        <div className="hidden max-sm:block">
          <Skeleton className="h-6  sm:w-4/5 md:w-[700px] lg:w-[800px] mb-2 mx-auto" />
        </div>

      </header>
      {filter ? (
        <Box className="hidden lg:grid grid-cols-4 gap-4 mb-4 m-auto">
          <div className="flex flex-col xl:flex-row xl:items-end gap-3 w-full">
            <Skeleton className="h-[40px] w-full xl:w-[150px] rounded-md" />

            <Skeleton className="h-[40px] w-full xl:w-[330px] rounded-md" />

            <Skeleton className="h-[40px] w-full xl:w-[180px] rounded-md" />

            <Skeleton className="h-[40px] w-full xl:w-[230px] rounded-md" />

            <Skeleton className="h-[40px] w-full xl:w-[150px] rounded-md" />
          </div>
        </Box>
      ) : null}
      {buttons ? (
        <Box className="hidden lg:grid grid-cols-3 gap-4 mb-4 m-auto">
          <div className="flex flex-col xl:flex-row xl:items-end gap-20 w-full m-auto">
            <Skeleton className="h-[40px] w-full xl:w-[300px] rounded-md" />
            <Skeleton className="h-[40px] w-full xl:w-[300px] rounded-md" />
            <Skeleton className="h-[40px] w-full xl:w-[300px] rounded-md" />

          </div>
        </Box>
      ) : null}
    </>
  )
}

export default SkeletonHeader;


