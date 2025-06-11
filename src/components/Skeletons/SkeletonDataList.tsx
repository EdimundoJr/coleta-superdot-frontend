import { Box, DataList, Skeleton, Separator, Flex } from "@radix-ui/themes"

interface SkeletonTableBodyProps {
  itens: number;
  titles: number;
  columns: number;
  actionButton?: boolean;
}


const SkeletonDataList = ({ itens, titles, columns, actionButton }: SkeletonTableBodyProps) => {
  return (
    [...Array(itens)].map((_, i) => (
      <DataList.Item
        key={i}
        className="w-full p-4 rounded-lg mb-5 border-2 card-container mobo"
      >
        <p className="text-[16px] font-bold text-center mb-1">
          <Skeleton className="h-[20px] w-[60%] mx-auto" />
        </p>
        {[...Array(titles)].map((_, i) => (
          <>
            {[...Array(columns)].map((_, j) => (
              <Box key={j} mb="3">
                <Skeleton className="h-[14px] w-[30%]" />
                <Skeleton className="h-[20px] w-full mt-1" />
                <Separator size="4" className="my-1" />
              </Box>
            ))}
          </>
        ))}
        {actionButton ? (
          <p className=" text-[16px] font-bold  mb-1">
            <Flex justify={"end"}>
              <Skeleton className="h-[20px] w-[70%] mb-1" />
            </Flex>
            <Flex justify={"end"}>
              <Skeleton className="h-[20px] w-[30%]" />
            </Flex>

          </p>
        ) : <></>}





      </DataList.Item>
    ))
  )
}

export default SkeletonDataList;


