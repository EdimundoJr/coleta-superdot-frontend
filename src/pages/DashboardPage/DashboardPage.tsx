import * as Icon from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { DashboardInfo, getinfoDashboard } from "../../api/sample.api";
import Dcard from "../../components/DashboardCard/DCard";
import ApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import Notify from "../../components/Notify/Notify";
import ChartContainer from "../../components/Charts/ChartContainer";
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

    // Dados fictícios para os novos gráficos
    const sampleData = {
        monthlyProgress: [30, 40, 35, 50, 49, 60, 70, 91, 125, 150, 170, 190],
        ageDistribution: [10, 41, 35, 51, 49, 62, 69, 91, 148, 120, 85, 40],
        institutionDistribution: {
            labels: ['USP', 'UNICAMP', 'UFMG', 'UFRJ', 'UFPR', 'Outras'],
            series: [120, 90, 75, 60, 45, 110]
        },
        collectionStatus: {
            completed: 75,
            pending: 25
        },
        regionalDistribution: {
            labels: ['Sudeste', 'Sul', 'Nordeste', 'Centro-Oeste', 'Norte'],
            series: [320, 150, 120, 80, 30]
        },
        timelineData: [
            { month: 'Jan', samples: 30, participants: 25 },
            { month: 'Fev', samples: 40, participants: 32 },
            { month: 'Mar', samples: 35, participants: 28 },
            { month: 'Abr', samples: 50, participants: 45 },
            { month: 'Mai', samples: 49, participants: 42 },
            { month: 'Jun', samples: 60, participants: 55 },
            { month: 'Jul', samples: 70, participants: 63 },
            { month: 'Ago', samples: 91, participants: 85 },
            { month: 'Set', samples: 125, participants: 110 },
            { month: 'Out', samples: 150, participants: 135 },
            { month: 'Nov', samples: 170, participants: 155 },
            { month: 'Dez', samples: 190, participants: 175 }
        ],
        heatmapData: {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            series: [
                { name: 'Manhã', data: [12, 15, 10, 8, 14, 5, 2] },
                { name: 'Tarde', data: [20, 22, 18, 25, 30, 15, 8] },
                { name: 'Noite', data: [5, 8, 6, 10, 12, 20, 25] }
            ]
        }
    };

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
            categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
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
                formatter: function (val) {
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
            categories: sampleData.institutionDistribution.labels,
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
                formatter: function (val) {
                    return val + " amostras";
                }
            }
        }
    };

    const ageDistributionOptions: ApexOptions = {
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: true
            }
        },
        colors: ['#2A5C8B'],
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: true,
            }
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: ['0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80', '81-90', '91-100', '101-110', '111+'],
            title: {
                text: 'Número de Participantes'
            }
        },
        yaxis: {
            title: {
                text: 'Faixa Etária'
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
                        formatter: function (val) {
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
        labels: sampleData.regionalDistribution.labels,
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
                formatter: function (val) {
                    return val + " amostras";
                }
            }
        }
    };

    const heatmapOptions: ApexOptions = {
        chart: {
            type: 'heatmap',
            height: 350,
            toolbar: {
                show: true
            }
        },
        dataLabels: {
            enabled: false
        },
        colors: ["#2A5C8B"],
        xaxis: {
            type: 'category',
            categories: sampleData.heatmapData.labels
        },
        plotOptions: {
            heatmap: {
                shadeIntensity: 0.5,
                radius: 0,
                useFillColorAsStroke: false,
                colorScale: {
                    ranges: [
                        {
                            from: 0,
                            to: 10,
                            name: 'Baixo',
                            color: '#E0F7FA'
                        },
                        {
                            from: 11,
                            to: 20,
                            name: 'Médio',
                            color: '#80DEEA'
                        },
                        {
                            from: 21,
                            to: 30,
                            name: 'Alto',
                            color: '#2A5C8B'
                        }
                    ]
                }
            }
        }
    };

    const genderSeries = [
        dados?.result.count_female || 0,
        dados?.result.count_male || 0
    ];

    const lineSeries = [
        {
            name: "Amostras",
            data: sampleData.timelineData.map(item => item.samples)
        },
        {
            name: "Participantes",
            data: sampleData.timelineData.map(item => item.participants)
        }
    ];

    const heatmapSeries = sampleData.heatmapData.series;

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
                    value={dados?.result.total_samples}
                    icon={<Icon.Swatches size={32} />}
                    style="bg-gradient-to-l from-red-500 to-amber-500" />

                <Dcard
                    loading={loading}
                    title="Participantes"
                    value={dados?.result.total_participants}
                    icon={<Icon.UsersThree size={32} />}
                    style="bg-gradient-to-l from-lime-500 to-sky-500"
                />

                <Dcard
                    loading={loading}
                    title="Instituições"
                    value={dados?.result.total_unique_instituition}
                    icon={<Icon.GraduationCap size={32} />}
                    style="bg-gradient-to-l from-violet-500 to-pink-500"
                />

                <Dcard
                    loading={loading}
                    title="Taxa de Completude"
                    value={`${sampleData.collectionStatus.completed}%`}
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

            {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <ChartContainer
                    title="Distribuição por Instituição"
                    loading={loading}
                    tooltip="Amostras coletadas por instituição participante"
                >
                    <ApexChart
                        options={barChartOptions}
                        series={[{ data: sampleData.institutionDistribution.series }]}
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
                        series={sampleData.regionalDistribution.series}
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
                        series={[sampleData.collectionStatus.completed, sampleData.collectionStatus.pending]}
                        type="radialBar"
                        height={350}
                    />
                </ChartContainer>
            </div> */}

            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <ChartContainer
                    title="Distribuição por Faixa Etária"
                    loading={loading}
                    tooltip="Número de participantes por faixa etária"
                >
                    <ApexChart
                        options={ageDistributionOptions}
                        series={[{ data: sampleData.ageDistribution }]}
                        type="bar"
                        height={350}
                    />
                </ChartContainer>

                <ChartContainer
                    title="Padrão de Coleta por Período"
                    loading={loading}
                    tooltip="Frequência de coletas por dia da semana e período"
                >
                    <ApexChart
                        options={heatmapOptions}
                        series={heatmapSeries}
                        type="heatmap"
                        height={350}
                    />
                </ChartContainer>
            </div> */}

            <div className="bg-white card-container p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 ">Resumo Estatístico</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50  p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                            <Icon.ChartPieSlice size={20} className="text-blue-500 mr-2" />
                            <span className="font-medium text-gray-700 ">Média Mensal</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-800 ">158</p>
                        <p className="text-sm text-gray-500 ">amostras/mês</p>
                    </div>
                    <div className="bg-gray-50  p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                            <Icon.TrendUp size={20} className="text-green-500 mr-2" />
                            <span className="font-medium text-gray-700 ">Crescimento</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-800 ">+28%</p>
                        <p className="text-sm text-gray-500 ">últimos 3 meses</p>
                    </div>
                    <div className="bg-gray-50  p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                            <Icon.CalendarCheck size={20} className="text-purple-500 mr-2" />
                            <span className="font-medium text-gray-700 ">Dias Ativos</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-800 ">92%</p>
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