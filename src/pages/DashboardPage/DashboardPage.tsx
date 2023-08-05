import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { PieChart, BarChart } from "echarts/charts";
import { GridComponent, TooltipComponent, TitleComponent } from "echarts/components";
import { SVGRenderer } from "echarts/renderers";
import { Link } from "react-router-dom";

echarts.use([TitleComponent, TooltipComponent, GridComponent, PieChart, BarChart, SVGRenderer]);

const colors = ["#31327E", "#594DA3", "#826ACA", "#AD88F1"];

const INDICADORES_POR_GRUPO = [
    {
        name: "Educação Infantil",
        value: 13,
    },
    {
        name: "Adulto",
        value: 30,
    },
    {
        name: "Fundamental",
        value: 28,
    },
    {
        name: "Ensino Médio",
        value: 28,
    },
];

const INDICADORES_POR_GENERO = [
    {
        name: "Masculino",
        value: 37,
    },
    {
        name: "Feminino",
        value: 63,
    },
];

interface pieGraphData {
    name: string;
    value: number;
}

const pieGraph = (data: pieGraphData[], title: string) => {
    return {
        title: {
            text: title,
            left: "center",
        },
        color: colors,
        series: [
            {
                name: "Avaliados com indicadores de AH/SD por Grupo",
                type: "pie",
                label: {
                    show: true,
                    formatter: "{b}: {d}%",
                },
                data,
            },
        ],
    };
};

const barYearGraph = {
    title: {
        text: "Quantidade de Avaliados com indicadores de AH/SD por Ano",
        left: "center",
    },
    color: colors,
    xAxis: {
        data: [2010, 2011, 2012, 2013, 2014, 2015, 2016],
    },
    yAxis: {},
    series: [
        {
            type: "bar",
            label: {
                show: true,
            },
            data: [100, 130, 110, 115, 90, 120, 125],
        },
    ],
};

const barTotalGraph = {
    title: {
        text: "Quantidade de Avaliados que possuem indicadores de AH/SD",
        left: "center",
    },
    color: colors,
    xAxis: {
        data: ["Possuem indicadores", "Não possuem indicadores"],
    },
    yAxis: {},
    series: [
        {
            type: "bar",
            label: {
                show: true,
            },
            data: [100, 240],
        },
    ],
};

const DashBoardPage = () => {
    return (
        <>
            <header className="mt-6 text-2xl font-bold">Dashboard</header>
            <section className="my-9 grid justify-center gap-y-20 text-white lg:flex lg:gap-x-20">
                <div className="bg-dark-gradient m-auto grid w-80 gap-y-4 rounded-md px-6 py-3">
                    <h1>12</h1>
                    <h1>Minhas Amostras</h1>
                    <Link to="/app/my-samples">Ver mais {"->"}</Link>
                </div>
                <div className="bg-dark-gradient m-auto grid w-80 gap-y-4 rounded-md px-6 py-3">
                    <h1>87</h1>
                    <h1>Participantes</h1>
                </div>
                <div className="bg-dark-gradient m-auto grid w-80 gap-y-4 rounded-md px-6 py-3">
                    <h1>6</h1>
                    <h1>Instituições</h1>
                </div>
            </section>
            <div className="overflow-auto lg:flex">
                <ReactEChartsCore
                    className="w-full"
                    echarts={echarts}
                    option={pieGraph(INDICADORES_POR_GRUPO, "Avaliados com indicadores de AH/SD por Grupo")}
                />
                <ReactEChartsCore
                    className="w-full"
                    echarts={echarts}
                    option={pieGraph(INDICADORES_POR_GENERO, "Avaliados com indicadores de AH/SD por Gênero")}
                />
            </div>
            <ReactEChartsCore echarts={echarts} option={barYearGraph} />
            <ReactEChartsCore echarts={echarts} option={barTotalGraph} />
        </>
    );
};

export default DashBoardPage;
