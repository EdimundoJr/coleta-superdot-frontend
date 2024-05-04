import * as Icon from "@phosphor-icons/react";
import { Box,  Flex, Skeleton } from "@radix-ui/themes";
import { Header } from "../../Components/Header/Header";
import { useEffect, useState } from "react";
import { DashboardInfo, getinfoDashboard } from "../../api/sample.api";
import Dcard from "../../Components/DashboardCard/DCard";
import ApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { GridComponent } from "../../Components/Grid/Grid";
import Notify from "../../components/Notify/Notify";

function DashBoardPage() {
    const [dados, setDados] = useState<null | DashboardInfo>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationDescription, setNotificationDescription] = useState("");

    useEffect(() => {
        const fetchDados = async () => {
            try {
                const response = await getinfoDashboard()// Rota do backend para buscar os dados
                setDados(response);
                console.log(dados)
                setLoading(false);
            } catch (error: any) {
                setError(error.message);
                setNotificationTitle("Erro no servidor.");
                setNotificationDescription("Não foi possível carregar os dados do Dashboard.");
            }
        };

        fetchDados();
    }, []);

    const series = [dados?.result.count_female || 0, dados?.result.count_male || 0];
    const options: ApexOptions = {
        chart: {
            type: 'donut',
        },
        labels: ['Feminino', 'Masculino'],
        colors: ['#0090ff', '#30a46c']
    };

    return (
        <Flex direction="column" className={`relative  ml-2 border-t-4 border-primary rounded-tl-[30px]  w-full bg-[#fbfaff] p-5`}>
            <Notify
                open={!!notificationTitle}
                onOpenChange={() => setNotificationTitle("")}
                title={notificationTitle}
                description={notificationDescription}
                icon={<Icon.XCircle size={20} color="red" />}
                className="border-red-400"
            ></Notify>
            <Skeleton loading={loading}>
                <Header title="Dashboard" icon={<Icon.SquaresFour size={20} />} />
            </Skeleton>

            <GridComponent
                clasName="gap-5"
                children={
                    <>
                        <Skeleton loading={loading}>
                            <Box>
                                <Dcard title={"Total de Amostra"} description={dados?.result.total_samples.toString()} iconBase={<Icon.Swatches size={60} />} seeButton={true} linkTo="/app/my-samples" colorBadge="tomato" style="border-[#e54d2e]" styleButton="hover:bg-[#e54d2e]"></Dcard>
                            </Box>
                        </Skeleton>
                        <Skeleton loading={loading}>
                            <Box>
                                <Dcard title={"Participantes"} description={dados?.result.total_participants.toString()} iconBase={<Icon.UsersThree size={60} />} seeButton={false} colorBadge="blue" style="border-[#0090ff]" ></Dcard>
                            </Box>
                        </Skeleton>
                        <Skeleton loading={loading}>
                            <Box>
                                <Dcard title={"Intituições"} description={dados?.result.total_unique_instituition.toString()} iconBase={<Icon.GraduationCap size={60} />} seeButton={false} colorBadge="green" style="border-[#30a46c]"></Dcard>
                            </Box>
                        </Skeleton>
                    </>
                }
                columns={3}>
            </GridComponent>
            <GridComponent
                clasName="gap-5"
                children={
                    <>
                        <Skeleton loading={loading} >
                            <Box className="rounded overflow-hidden  bg-white rounded-b-lg   group group/item transition-all pt-4 drop-shadow-[0_4px_16px_rgba(22,22,22,0.1)] font-roboto">
                                <ApexChart options={options} series={series} type="donut" height={350} />
                            </Box>
                        </Skeleton>
                        <Skeleton loading={loading} >
                            <Box className="rounded overflow-hidden  bg-white rounded-b-lg   group group/item transition-all pt-4 drop-shadow-[0_4px_16px_rgba(22,22,22,0.1)] font-roboto">
                                <ApexChart options={options} series={series} type="donut" height={350} />
                            </Box>
                        </Skeleton>
                        <Skeleton loading={loading}>
                            <Box className="rounded overflow-hidden  bg-white rounded-b-lg   group group/item transition-all pt-4 drop-shadow-[0_4px_16px_rgba(22,22,22,0.1)] font-roboto">
                                <ApexChart options={options} series={series} type="donut" height={350} />
                            </Box>
                        </Skeleton>
                        <Skeleton loading={loading}>
                            <Box className="rounded overflow-hidden  bg-white rounded-b-lg   group group/item transition-all pt-4 drop-shadow-[0_4px_16px_rgba(22,22,22,0.1)] font-roboto">
                                <ApexChart options={options} series={series} type="donut" height={350} />
                            </Box>
                        </Skeleton>
                    </>}
                columns={2}>
            </GridComponent>
        </Flex >

    );
};

export default DashBoardPage;
