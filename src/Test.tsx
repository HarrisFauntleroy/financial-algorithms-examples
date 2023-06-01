import { Code, Select, Stack, Text } from "@mantine/core";
import {
  CategoryScale,
  Chart,
  LineElement,
  LinearScale,
  PointElement,
} from "chart.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  ExponentialGrowthModel,
  LinearRegressionModel,
  PolynomialRegressionModel,
  PredictionModel,
  calculatePredictions,
  getFinancialData,
} from "./finance";

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

function getModelDescription(model: string | null): string {
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

const FinanceChart = () => {
  const [isLoading, setLoading] = useState(true);
  const [financialData, setFinancialData] = useState<DataPoint[]>([]);
  const [predictionData, setPredictionData] = useState<DataPoint[]>([]);
  const [model, setModel] = useState<string | null>("linear");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFinancialData();
      setFinancialData(data);
      const futurePredictions = calculatePredictions(data, 5, getModel(model));
      setPredictionData([...data, ...futurePredictions]);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  }, [model]);

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

  const selectOptions = [
    { value: "linear", label: "Linear" },
    { value: "exponential", label: "Exponential" },
    { value: "polynomial", label: "Polynomial" },
  ];

  return (
    <Stack p="8px">
      <Select
        label="Select Prediction Model"
        placeholder="Select one"
        value={model}
        data={selectOptions}
        onChange={setModel}
      />
      <Line data={chartData} />
      {isLoading ? (
        <Code>Loading...</Code>
      ) : (
        <Text>{getModelDescription(model)}</Text>
      )}
      Data: <Code>{JSON.stringify(chartData)}</Code>
    </Stack>
  );
};

export default FinanceChart;
