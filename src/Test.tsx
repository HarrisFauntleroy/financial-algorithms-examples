import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  getFinancialData,
  calculatePredictions,
  ExponentialGrowthModel,
  LinearRegressionModel,
} from "./finance";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

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

const FinanceChart: React.FC = () => {
  const [financialData, setFinancialData] = useState<DataPoint[]>([]);
  const [predictionData, setPredictionData] = useState<DataPoint[]>([]);

  useEffect(() => {
    const linearRegressionModel = new LinearRegressionModel();
    const exponentialGrowthModel = new ExponentialGrowthModel();

    getFinancialData().then((data) => {
      setFinancialData(data);
      const futurePredictions = calculatePredictions(data, 5, linearRegressionModel);
      setPredictionData([...data, ...futurePredictions]);
    });
  }, []);

  const data = {
    labels: predictionData.map((item) => item.x.toString()),
    datasets: [
      {
        label: "Financial Data",
        data: financialData,
        fill: false,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 99, 132, 0.2)",
      },
      {
        label: "Prediction",
        data: predictionData,
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  return <Line data={data} />;
};

export default FinanceChart;
