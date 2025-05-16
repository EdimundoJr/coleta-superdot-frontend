import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { usePagination } from "./usePagination";
import { DOTS } from "../../../utils/consts.utils";

interface PaginationProps {
    currentPage: number;
    totalCount: number;
    siblingCount?: number;
    pageSize: number;
    onPageChange: (newPage: number) => void;
}

const Pagination = ({ currentPage, totalCount, siblingCount = 1, pageSize, onPageChange }: PaginationProps) => {
    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize,
    });

    if (currentPage === 0) {
        return null;
    }

    if (paginationRange && paginationRange.length < 2) {
        return null;
    }

    const onNext = () => {
        onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };

    let lastPage = 1;
    if (paginationRange) {
        lastPage = Number(paginationRange[paginationRange.length - 1]);
    }

    return (
        <nav aria-label="Paginação">
            <ul className="inline-flex -space-x-px text-sm">
                <li
                    onClick={onPrevious}
                    className={`${currentPage === 1 ? "hidden" : ""
                        } flex h-8 cursor-pointer items-center rounded-l-lg border border-gray-300 px-3 leading-tight text-white hover:bg-gray-100 hover:text-gray-700`}
                >
                    <ArrowLeftIcon />
                </li>
                {paginationRange?.map((pageNumber) => {
                    if (pageNumber === DOTS) {
                        return <li>&#8230;</li>;
                    }

                    return (
                        <li
                            onClick={() => onPageChange(Number(pageNumber))}
                            className={`${currentPage === pageNumber ? "bg-blue-600" : ""
                                } flex h-8 cursor-pointer items-center border border-gray-300 px-3 leading-tight text-white hover:bg-gray-100 hover:text-gray-700`}
                        >
                            {pageNumber}
                        </li>
                    );
                })}
                <li
                    onClick={onNext}
                    className={`${currentPage === lastPage ? "hidden" : ""
                        } flex h-8 cursor-pointer items-center rounded-r-lg border border-gray-300 px-3 leading-tight text-white hover:bg-gray-100 hover:text-gray-700`}
                >
                    <ArrowRightIcon />
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
