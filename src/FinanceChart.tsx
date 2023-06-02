import { Card, Code, Select, Text } from "@mantine/core";
import {
  CategoryScale,
  Chart,
  LineElement,
  LinearScale,
  PointElement,
} from "chart.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import { calculatePredictions, getFinancialData } from "./calculations";
import {
  ExponentialGrowthModel,
  LinearRegressionModel,
  PolynomialRegressionModel,
  PredictionModel,
} from "./predictionModels";

Chart.register({
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
});

export interface DataPoint {
  x: number;
  y: number;
}

function getModel(model: string | null) {
  const models: Record<string, PredictionModel> = {
    linear: new LinearRegressionModel(),
    exponential: new ExponentialGrowthModel(),
    polynomial: new PolynomialRegressionModel(2),
  };
  return models[model || "linear"];
}

const FinanceChart = ({ model }: { model: string | null }) => {
  const [, setLoading] = useState(true);
  const [financialData, setFinancialData] = useState<DataPoint[]>([]);
  const [predictionData, setPredictionData] = useState<DataPoint[]>([]);
  const [type, setType] = useState<string | null>("steadyIncrease");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFinancialData(type);
      setFinancialData(data);
      const futurePredictions = calculatePredictions(data, 5, getModel(model));
      setPredictionData([...data, ...futurePredictions]);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  }, [model, type]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const modelColor = useMemo(() => {
    const colorMap: Record<string, string> = {
      linear: "rgb(255, 99, 132)",
      exponential: "rgb(75, 192, 192)",
      polynomial: "rgb(153, 102, 255)",
    };
    return colorMap[model || "linear"];
  }, [model]);

  const chartData = useMemo(
    () => ({
      labels: predictionData.map((item) => item.x.toString()),
      datasets: [
        {
          label: "Historical Financial Data",
          data: financialData,
          fill: false,
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgba(255, 99, 132, 0.2)",
        },
        {
          label: `${model} Prediction`,
          data: predictionData,
          fill: false,
          backgroundColor: modelColor,
          borderColor: modelColor,
        },
      ],
    }),
    [financialData, modelColor, model, predictionData]
  );

  function getModelDescription(): string {
    const modelDescriptions: Record<string, string> = {
      linear:
        "Linear regression is used when data shows a linear trend. The model predicts future data points along this linear line.",
      exponential:
        "Exponential growth model is used when data shows exponential growth. It's commonly used in finance, especially in interest and growth scenarios.",
      polynomial:
        "Polynomial regression model is used for more complex data trends, which may have multiple fluctuations. It fits a curve to the data points.",
    };

    return modelDescriptions[model || "linear"];
  }

  function getDataDescription(): string {
    const dataDescriptions: Record<string, string> = {
      steadyIncrease:
        "Steady increase data shows a steady increase in value over time. It's a linear trend.",
      fluctuatingSavings:
        "Fluctuating savings data shows a linear trend with fluctuations. It's a linear trend with noise.",
      exponentialGrowth:
        "Exponential growth data shows exponential growth. It's a exponential trend.",
    };

    return dataDescriptions[type || "steadyIncrease"];
  }

  const selectOptions = [
    { value: "steadyIncrease", label: "Steady Increase" },
    { value: "fluctuatingSavings", label: "Fluctuating Savings" },
    { value: "exponentialGrowth", label: "Exponential Growth" },
  ];

  return (
    <Card maw="100%">
      <Text>{getModelDescription()}</Text>
      <Line data={chartData} />
      <Select
        label="Select Data Set"
        placeholder="Select one"
        value={type}
        data={selectOptions}
        onChange={setType}
      />
      <Text>{getDataDescription()}</Text>
      <Code>{JSON.stringify(chartData)}</Code>
    </Card>
  );
};

export default FinanceChart;
