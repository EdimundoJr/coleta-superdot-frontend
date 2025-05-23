import * as Icon from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { DashboardInfo, getinfoDashboard } from "../../api/sample.api";
import Dcard from "../../components/DashboardCard/DCard";
import ApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import Notify from "../../components/Notify/Notify";
import ChartContainer from "../../components/Charts/GenderChart";
import NewUser from "../../components/NewUser/NewUser";
import { useLocation } from "react-router-dom";

function DashBoardPage() {
    const [dados, setDados] = useState<null | DashboardInfo>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notificationData, setNotificationData] = useState({
        title: "",
        description: "",
        type: "",
    });
    const location = useLocation();
    const isNewUser = location.state?.isNewUser || false;
    const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);

    useEffect(() => {
        const shouldOpen = isNewUser && !localStorage.getItem('dontShowWelcome');
        setIsWelcomeOpen(shouldOpen);
    }, [isNewUser]);

    useEffect(() => {
        const fetchDados = async () => {
            try {
                const response = await getinfoDashboard()
                setDados(response);
                setLoading(false);
            } catch (error: any) {
                setError(error.message);
                setNotificationData({
                    title: "Erro no servidor",
                    description: "Não foi possível carregar os dados do Dashboard",
                    type: "error"
                });
            }
        };

        fetchDados();
    }, []);

    const genderChartOptions: ApexOptions = {
        chart: {
            type: 'donut',
            fontFamily: 'Roboto, sans-serif',
        },
        labels: ['Feminino', 'Masculino'],
        colors: ['#2A5C8B', '#4CAF50'],
        dataLabels: {
            style: {
                fontSize: '14px',
                fontWeight: 500,
            }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total',
                            fontSize: '16px'
                        }
                    }
                }
            }
        },
        legend: {
            position: 'bottom',
            horizontalAlign: 'center'
        }
    };

    const genderSeries = [
        dados?.result.count_female || 0,
        dados?.result.count_male || 0
    ];

    return (
        <>
            <Notify
                open={!!notificationData.title}
                onOpenChange={() => setNotificationData({ title: "", description: "", type: "" })}
                title={notificationData.title}
                description={notificationData.description}
                icon={notificationData.type === "erro" ? <Icon.XCircle size={30} color="white" weight="bold" /> : notificationData.type === "aviso" ? <Icon.WarningCircle size={30} color="white" weight="bold" /> : <Icon.CheckCircle size={30} color="white" weight="bold" />}
                className={notificationData.type === "erro" ? "bg-red-500" : notificationData.type === "aviso" ? "bg-yellow-400" : notificationData.type === "success" ? "bg-green-500" : ""}
            />
            {isNewUser ? (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <NewUser
                        open={isWelcomeOpen}
                        setOpen={setIsWelcomeOpen}
                        isNewUser={isNewUser}
                        username="Nome do Usuário" />
                </div>
            ) : null}


            {/* Top Cards Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <Dcard
                    loading={loading}
                    title="Total de Amostras"
                    value={dados?.result.total_samples}
                    icon={<Icon.Swatches size={32} />}
                    colorBadge="blue"
                    style="!bg-gradient-to-l from-red-500 to-amber-500" />

                <Dcard
                    loading={loading}
                    title="Participantes"
                    value={dados?.result.total_participants}
                    icon={<Icon.UsersThree size={32} />}
                    colorBadge="green"
                    style="!bg-gradient-to-l from-lime-500 to-sky-500"
                />

                <Dcard
                    loading={loading}
                    title="Instituições"
                    value={dados?.result.total_unique_instituition}
                    icon={<Icon.GraduationCap size={32} />}
                    colorBadge="purple"
                    style="!bg-gradient-to-l from-violet-500 to-pink-500"
                />

            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
                <ChartContainer
                    title="Distribuição por Gênero"
                    loading={loading}

                >
                    <ApexChart
                        options={genderChartOptions}
                        series={genderSeries}
                        type="donut"
                        height={350}
                    />
                </ChartContainer>

                <ChartContainer
                    title="Progresso de Coletas"
                    loading={loading}
                >
                    <div className="text-gray-500 text-center py-12">
                        <Icon.ChartBar size={48} className="mx-auto mb-4" />
                        <p>Gráfico em desenvolvimento</p>
                    </div>
                </ChartContainer>

            </div>
        </>
    );
};



export default DashBoardPage;