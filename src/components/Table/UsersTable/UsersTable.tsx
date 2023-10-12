import { Pencil1Icon } from "@radix-ui/react-icons";
import Pagination from "../Pagination/Pagination";
import { PAGE_SIZE, ResearchersPaginated } from "../../../api/researchers.api";

interface UsersTableProps {
    data?: ResearchersPaginated;
    currentPage: number;
    setCurrentPage: (newPage: number) => void;
    onClickPencil: (itemId: string) => void;
}

const UsersTable = ({ data, currentPage, setCurrentPage, onClickPencil }: UsersTableProps) => {
    return (
        <table className="bg-dark-gradient mx-auto w-11/12 border-collapse rounded-md text-alternative-text">
            <thead>
                <tr>
                    <th className=" px-6 py-3">Nome do usuário</th>
                    <th className=" px-6 py-3">E-mail do usuário</th>
                    <th className=" px-6 py-3">Perfil do usuário</th>
                    <th className=" px-6 py-3">Ações</th>
                </tr>
            </thead>
            <tbody className="bg-white text-primary">
                {data?.researchers?.map((user) => (
                    <tr key={user._id} className="odd:bg-gray-200">
                        <td className="border-x-2 border-primary px-6 py-3">{user.fullname}</td>
                        <td className="border-x-2 border-primary px-6 py-3">{user.email}</td>
                        <td className="border-x-2 border-primary px-6 py-3">{user.role}</td>
                        <td className="border-x-2 border-primary px-6 py-3 text-center">
                            <div className="flex justify-center">
                                <Pencil1Icon className="cursor-pointer" onClick={() => onClickPencil(user._id)} />
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr className="text-right">
                    <td className="px-6 py-3" colSpan={3}>
                        <Pagination
                            currentPage={currentPage}
                            pageSize={PAGE_SIZE}
                            totalCount={data?.totalResearchers || 1}
                            onPageChange={(page: number) => setCurrentPage(page)}
                        />
                    </td>
                </tr>
            </tfoot>
        </table>
    );
};

export default UsersTable;
