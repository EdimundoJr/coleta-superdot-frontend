import { Skeleton } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";

interface DcardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  style?: string;
  linkTo?: string;
  colorBadge?: "gray" | "gold" | "bronze" | "brown" | "yellow" | "amber" | "orange" | "tomato" | "red" | "ruby" | "crimson" | "pink" | "plum" | "purple" | "violet" | "iris" | "indigo" | "blue" | "cyan" | "teal" | "jade" | "green" | "grass" | "lime" | "mint" | "sky" | undefined;
  loading?: boolean;
  value?: number | string;
}

export default function Dcard({ title, icon, style, linkTo, loading, value }: DcardProps) {

  const navigate = useNavigate();
  function link() {

    navigate(`${linkTo}`);
  };


  return (

    <Skeleton loading={loading} className="h-full">
      <div className={`p-6 rounded-xl ${style}  transition-shadow card-container-variant-border`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white mb-1">{title}</p>
            <p className="text-2xl font-semibold text-white">
              {value?.toLocaleString() || 0}
            </p>
          </div>
          <div className={`justify-center text-white`}>
            {icon}
          </div>
        </div>
        {/* <Flex justify="end" className={`group/edit  group-hover/item:visible`}>
          <button
            className={`${styleButton} ${seeButton}  py-0.5 px-4 rounded-t transition-all ease-in-out flex  items-center hover:text-white hover:translate-x-1`}
            onClick={() => link()}
          >
            <Text as="label" className="hover:cursor-pointer">Veja mais</Text>
            <Icon.CaretRight className={`group/edit group-hover/item:${seeButton}`} />
          </button>
        </Flex> */}
      </div>
    </Skeleton>
  );
}
