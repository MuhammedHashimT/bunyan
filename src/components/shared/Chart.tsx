// import { useRef, useEffect, useCallback, useMemo } from 'react'
// import ApexChart from 'react-apexcharts'
// import {
//     apexLineChartDefaultOption,
//     apexBarChartDefaultOption,
//     apexAreaChartDefaultOption,
//     apexDonutChartDefaultOption,
//     apexRadarChartDefultOption,
// } from '@/configs/chart.config'
// import { DIR_RTL } from '@/constants/theme.constant'
// import type { ApexOptions } from 'apexcharts'
// import type { Direction } from '@/@types/theme'
// import type { ReactNode } from 'react'

// const notDonut = ['line', 'bar', 'area']

// type ChartType = 'line' | 'bar' | 'area' | 'donut' | 'radar'

// export interface ChartProps {
//     series?: ApexOptions['series']
//     width?: string | number
//     height?: string | number
//     /* eslint-disable @typescript-eslint/no-explicit-any */
//     xAxis?: any
//     customOptions?: ApexOptions
//     type?: ChartType
//     direction?: Direction
//     donutTitle?: string | ReactNode
//     donutText?: string | ReactNode
//     className?: string
// }

// const Chart = (props: ChartProps) => {
//     const {
//         series = [],
//         width = '100%',
//         height = 300,
//         xAxis,
//         customOptions,
//         type = 'line',
//         direction,
//         donutTitle,
//         donutText,
//         className,
//         ...rest
//     } = props

//     const chartRef = useRef<HTMLDivElement>(null)

//     const chartDefaultOption = useMemo(() => {
//         switch (type) {
//             case 'line':
//                 return apexLineChartDefaultOption
//             case 'bar':
//                 return apexBarChartDefaultOption
//             case 'area':
//                 return apexAreaChartDefaultOption
//             case 'donut':
//                 return apexDonutChartDefaultOption
//             case 'radar':
//                 return apexRadarChartDefultOption
//             default:
//                 return apexLineChartDefaultOption
//         }
//     }, [type])

//     let options = JSON.parse(JSON.stringify(chartDefaultOption))
//     const isMobile = window.innerWidth < 768

//     const setLegendOffset = useCallback(() => {
//         if (chartRef.current) {
//             const lengend = chartRef.current.querySelectorAll<HTMLDivElement>(
//                 'div.apexcharts-legend',
//             )[0]
//             if (direction === DIR_RTL) {
//                 lengend.style.right = 'auto'
//                 lengend.style.left = '0'
//             }
//             if (isMobile) {
//                 lengend.style.position = 'relative'
//                 lengend.style.top = '0'
//                 lengend.style.justifyContent = 'start'
//                 lengend.style.padding = '0'
//             }
//         }
//     }, [direction, isMobile])

//     useEffect(() => {
//         if (notDonut.includes(type as ChartType)) {
//             setLegendOffset()
//         }
//     }, [type, setLegendOffset])

//     if (notDonut.includes(type as ChartType)) {
//         options.xaxis.categories = xAxis
//     }

//     if (customOptions) {
//         options = { ...options, ...customOptions }
//     }

//     if (type === 'donut') {
//         if (donutTitle) {
//             options.plotOptions.pie.donut.labels.total.label = donutTitle
//         }
//         if (donutText) {
//             options.plotOptions.pie.donut.labels.total.formatter = () =>
//                 donutText
//         }
//     }

//     return (
//         <div
//             ref={chartRef}
//             style={direction === DIR_RTL ? { direction: 'ltr' } : {}}
//             className="chartRef"
//         >
//             <ApexChart
//                 options={options}
//                 type={type}
//                 series={series}
//                 width={width}
//                 height={height}
//                 className={className}
//                 {...rest}
//             />
//         </div>
//     )
// }

// export default Chart



import { useRef, useEffect, useCallback, useMemo } from 'react';
import ApexChart from 'react-apexcharts';
import {
    apexLineChartDefaultOption,
    apexBarChartDefaultOption,
    apexAreaChartDefaultOption,
    apexDonutChartDefaultOption,
    apexRadarChartDefultOption,
} from '@/configs/chart.config';
import { DIR_RTL } from '@/constants/theme.constant';
import type { ApexOptions } from 'apexcharts';
import type { Direction } from '@/@types/theme';
import type { ReactNode } from 'react';

const notDonut = ['line', 'bar', 'area'];

type ChartType = 'line' | 'bar' | 'area' | 'donut' | 'radar';

export interface ChartProps {
    series?: ApexOptions['series'];
    width?: string | number;
    height?: string | number;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    xAxis?: any;
    customOptions?: ApexOptions;
    type?: ChartType;
    direction?: Direction;
    donutTitle?: string | ReactNode;
    donutText?: string | ReactNode;
    className?: string;
}

const Chart = (props: ChartProps) => {
    const {
        series = [],
        width = '100%',
        height = 300,
        xAxis,
        customOptions,
        type = 'line',
        direction,
        donutTitle,
        donutText,
        className,
        ...rest
    } = props;

    const chartRef = useRef<HTMLDivElement>(null);

    const chartDefaultOption = useMemo(() => {
        switch (type) {
            case 'line':
                return apexLineChartDefaultOption;
            case 'bar':
                return apexBarChartDefaultOption;
            case 'area':
                return apexAreaChartDefaultOption;
            case 'donut':
                return apexDonutChartDefaultOption;
            case 'radar':
                return apexRadarChartDefultOption;
            default:
                return apexLineChartDefaultOption;
        }
    }, [type]);

    const options = useMemo(() => {
        const baseOptions = { ...chartDefaultOption };
    
        if (notDonut.includes(type)) {
            baseOptions.xaxis = { categories: xAxis };
        }
    
        if (customOptions) {
            return { ...baseOptions, ...customOptions };
        }
    
        if (type === 'donut') {
    if (donutTitle) {
        // Ensure donutTitle is a string
        baseOptions.plotOptions = baseOptions.plotOptions || {};
        baseOptions.plotOptions.pie = baseOptions.plotOptions.pie || {};
        baseOptions.plotOptions.pie.donut = baseOptions.plotOptions.pie.donut || {};
        baseOptions.plotOptions.pie.donut.labels =
            baseOptions.plotOptions.pie.donut.labels || {};
        baseOptions.plotOptions.pie.donut.labels.total =
            baseOptions.plotOptions.pie.donut.labels.total || {};
        baseOptions.plotOptions.pie.donut.labels.total.label = String(donutTitle);
    }
    if (donutText) {
        // Ensure donutText is a string and formatter returns a string
        baseOptions.plotOptions = baseOptions.plotOptions || {};
        baseOptions.plotOptions.pie = baseOptions.plotOptions.pie || {};
        baseOptions.plotOptions.pie.donut = baseOptions.plotOptions.pie.donut || {};
        baseOptions.plotOptions.pie.donut.labels =
            baseOptions.plotOptions.pie.donut.labels || {};
        baseOptions.plotOptions.pie.donut.labels.total =
            baseOptions.plotOptions.pie.donut.labels.total || {};
        baseOptions.plotOptions.pie.donut.labels.total.formatter = () =>
            String(donutText);
    }
}

    
        return baseOptions;
    }, [chartDefaultOption, xAxis, customOptions, type, donutTitle, donutText]);
    

    const setLegendOffset = useCallback(() => {
        if (chartRef.current) {
            const legend = chartRef.current.querySelector<HTMLDivElement>(
                'div.apexcharts-legend'
            );
            if (legend) {
                if (direction === DIR_RTL) {
                    legend.style.right = 'auto';
                    legend.style.left = '0';
                }
                if (window.innerWidth < 768) {
                    legend.style.position = 'relative';
                    legend.style.top = '0';
                    legend.style.justifyContent = 'start';
                    legend.style.padding = '0';
                }
            }
        }
    }, [direction]);

    useEffect(() => {
        if (notDonut.includes(type)) {
            setLegendOffset();
        }
    }, [type, setLegendOffset]);

    return (
        <div
            ref={chartRef}
            style={direction === DIR_RTL ? { direction: 'ltr' } : {}}
            className={`chartRef ${className}`}
        >
            <ApexChart
                options={options}
                type={type}
                series={series}
                width={width}
                height={height}
                {...rest}
            />
        </div>
    );
};

export default Chart;
