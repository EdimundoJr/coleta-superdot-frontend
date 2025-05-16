import { Skeleton, Table } from "@radix-ui/themes"

interface SkeletonTableBodyProps {
  itens: number;
  columns: number;
}


const SkeletonTableBody = ({ itens, columns }: SkeletonTableBodyProps) => {
  return (
    <Table.Body>
      {[...Array(itens)].map((_, i) => (
        <Table.Row key={i}>
          {Array(columns).fill(0).map((_, j) => (
            <Table.Cell key={j}>
              <Skeleton className="h-[20px] w-full" />
            </Table.Cell>
          ))}
        </Table.Row>
      ))}
    </Table.Body>
  )
}

export default SkeletonTableBody;


