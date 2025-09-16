import * as Icon from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { DashboardInfo, getinfoDashboard, MonthlyProgressItem } from "../../api/sample.api";
import Dcard from "../../components/DashboardCard/DCard";
import ApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import Notify from "../../components/Notify/Notify";
import ChartContainer from "../../components/Charts/ChartContainer";
import NewUser from "../../components/NewUser/NewUser";
import { useLocation } from "react-router-dom";

function DashBoardPage() {
    const [dados, setDados] = useState<DashboardInfo | null>(null);
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
                const response = await getinfoDashboard();
                setDados(response);
                console.log(response);
                setLoading(false);
            } catch (error: any) {
                setError(error.message);
                setNotificationData({
                    title: "Erro no servidor",
                    description: "Não foi possível carregar os dados do Dashboard",
                    type: "erro"
                });
            }
        };

        fetchDados();
    }, []);

    // Configurações dos gráficos
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

    const lineChartOptions: ApexOptions = {
        chart: {
            type: 'line',
            height: 350,
            zoom: {
                enabled: false
            },
            toolbar: {
                show: true
            }
        },
        colors: ['#4CAF50', '#2A5C8B'],
        stroke: {
            curve: 'smooth',
            width: 3
        },
        markers: {
            size: 5,
            hover: {
                size: 7
            }
        },
        xaxis: {
            categories: dados?.monthlyProgress.map((item: MonthlyProgressItem) => item.month) || [],
        },
        yaxis: {
            title: {
                text: 'Quantidade'
            }
        },
        tooltip: {
            shared: true,
            intersect: false,
            y: {
                formatter: function (val: number) {
                    return val + " unidades";
                }
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right'
        }
    };

    const barChartOptions: ApexOptions = {
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: true
            }
        },
        colors: ['#2A5C8B', '#4CAF50', '#FF9800', '#9C27B0', '#F44336'],
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 6
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: dados?.institutionDistribution?.labels || [],
        },
        yaxis: {
            title: {
                text: 'Quantidade de Amostras'
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function (val: number) {
                    return val + " amostras";
                }
            }
        }
    };

    const radialChartOptions: ApexOptions = {
        chart: {
            type: 'radialBar',
            height: 350,
        },
        colors: ['#4CAF50', '#FF9800'],
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 135,
                dataLabels: {
                    name: {
                        fontSize: '16px',
                        color: undefined,
                        offsetY: 120
                    },
                    value: {
                        offsetY: 76,
                        fontSize: '22px',
                        color: undefined,
                        formatter: function (val: number) {
                            return val + "%";
                        }
                    }
                }
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                shadeIntensity: 0.15,
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 50, 65, 91]
            },
        },
        stroke: {
            dashArray: 4
        },
        labels: ['Completas', 'Pendentes'],
    };

    const regionalDistributionOptions: ApexOptions = {
        chart: {
            type: 'polarArea',
            height: 350
        },
        colors: ['#2A5C8B', '#4CAF50', '#FF9800', '#9C27B0', '#F44336'],
        stroke: {
            colors: ['#fff']
        },
        fill: {
            opacity: 0.8
        },
        labels: dados?.regionalDistribution?.labels || [],
        legend: {
            position: 'bottom'
        },
        yaxis: {
            show: false
        },
        plotOptions: {
            polarArea: {
                rings: {
                    strokeWidth: 0
                },
                spokes: {
                    strokeWidth: 0
                },
            }
        },
        tooltip: {
            y: {
                formatter: function (val: number) {
                    return val + " amostras";
                }
            }
        }
    };

    const genderSeries = [
        dados?.count_female || 0,
        dados?.count_male || 0
    ];

    const lineSeries = [
        {
            name: "Amostras",
            data: dados?.monthlyProgress.map((item: MonthlyProgressItem) => item.samples) || []
        },
        {
            name: "Participantes",
            data: dados?.monthlyProgress.map((item: MonthlyProgressItem) => item.participants) || []
        }
    ];

    const collectionStatusSeries = [
        (dados?.collectionStatus.completed || 0),
        (dados?.collectionStatus.pending || 0)
    ]
    const calculateGrowth = () => {
        if (!dados?.monthlyProgress || dados.monthlyProgress.length < 6) return 0;

        const last3 = dados.monthlyProgress.slice(-3).map(m => m.participants).reduce((a, b) => a + b, 0) / 3;
        const prev3 = dados.monthlyProgress.slice(-6, -3).map(m => m.participants).reduce((a, b) => a + b, 0) / 3;

        if (prev3 === 0) return last3 > 0 ? 100 : 0;

        return (((last3 - prev3) / prev3) * 100).toFixed(0);
    };
    const activeDays = dados?.monthlyProgress.length || 0;
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
                    />
                </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                <Dcard
                    loading={loading}
                    title="Total de Amostras"
                    value={dados?.total_samples}
                    icon={<Icon.Swatches size={32} />}
                    style="bg-gradient-to-l from-red-500 to-amber-500" />

                <Dcard
                    loading={loading}
                    title="Participantes"
                    value={dados?.total_participants}
                    icon={<Icon.UsersThree size={32} />}
                    style="bg-gradient-to-l from-lime-500 to-sky-500"
                />

                <Dcard
                    loading={loading}
                    title="Instituições"
                    value={dados?.total_unique_instituition}
                    icon={<Icon.GraduationCap size={32} />}
                    style="bg-gradient-to-l from-violet-500 to-pink-500"
                />

                <Dcard
                    loading={loading}
                    title="Taxa de Completude"
                    value={`${dados?.collectionStatus?.completed || 0}%`}
                    icon={<Icon.ChartLineUp size={32} />}
                    style="bg-green-500"
                />

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <ChartContainer
                    title="Distribuição por Gênero"
                    loading={loading}
                    tooltip="Distribuição dos participantes por gênero"
                >
                    <ApexChart
                        options={genderChartOptions}
                        series={genderSeries}
                        type="donut"
                        height={350}
                    />
                </ChartContainer>

                <ChartContainer
                    title="Progresso Mensal"
                    loading={loading}
                    tooltip="Evolução mensal de amostras e participantes"
                >
                    <ApexChart
                        options={lineChartOptions}
                        series={lineSeries}
                        type="line"
                        height={350}
                    />
                </ChartContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <ChartContainer
                    title="Distribuição por Instituição"
                    loading={loading}
                    tooltip="Amostras coletadas por instituição participante"
                >
                    <ApexChart
                        options={barChartOptions}
                        series={[{ data: dados?.institutionDistribution?.series || [] }]}
                        type="bar"
                        height={350}
                    />
                </ChartContainer>

                <ChartContainer
                    title="Distribuição por Região"
                    loading={loading}
                    tooltip="Amostras coletadas por região do país"
                >
                    <ApexChart
                        options={regionalDistributionOptions}
                        series={dados?.regionalDistribution?.series || []}
                        type="polarArea"
                        height={350}
                    />
                </ChartContainer>

                <ChartContainer
                    title="Status das Coletas"
                    loading={loading}
                    tooltip="Porcentagem de coletas completas vs pendentes"
                >
                    <ApexChart
                        options={radialChartOptions}
                        series={collectionStatusSeries}
                        type="radialBar"
                        height={350}
                    />
                </ChartContainer>
            </div>


            <div className="bg-white card-container p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 ">Resumo Estatístico</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50  p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                            <Icon.ChartPieSlice size={20} className="text-blue-500 mr-2" />
                            <span className="font-medium text-gray-700 ">Média Mensal</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">
                            {((dados?.total_samples ?? 0) / (dados?.monthlyProgress?.length || 1)).toFixed(0)}
                        </p>

                        <p className="text-sm text-gray-500 ">amostras/mês</p>
                    </div>
                    <div className="bg-gray-50  p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                            <Icon.TrendUp size={20} className="text-green-500 mr-2" />
                            <span className="font-medium text-gray-700 ">Crescimento</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-800 ">{calculateGrowth()}%</p>
                        <p className="text-sm text-gray-500 ">últimos 3 meses</p>
                    </div>
                    <div className="bg-gray-50  p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                            <Icon.CalendarCheck size={20} className="text-purple-500 mr-2" />
                            <span className="font-medium text-gray-700 ">Dias Ativos</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-800 "> {activeDays}</p>
                        <p className="text-sm text-gray-500 ">coletas realizadas</p>
                    </div>
                </div>
                {/* Footer */}

                <div className="text-xs text-gray-400 mt-2 text-right">
                    Atualizado em {new Date().toLocaleTimeString()}
                </div>

            </div>
        </>
    );
};

export default DashBoardPage;