/* eslint-disable import/named */
import { DataPoint } from "./App";
import { PredictionModel } from "./predictionModels";

export const calculateMean = (
  data: DataPoint[]
): { meanX: number; meanY: number } => {
  const len = data.length;
  const meanX = data.reduce((sum, val) => sum + val.x, 0) / len;
  const meanY = data.reduce((sum, val) => sum + val.y, 0) / len;

  return { meanX, meanY };
};

export const calculateSlopeAndYIntercept = (
  data: DataPoint[],
  meanX: number,
  meanY: number
): { m: number; b: number } => {
  const { numerator, denominator } = data.reduce(
    (acc, val) => {
      acc.numerator += (val.x - meanX) * (val.y - meanY);
      acc.denominator += Math.pow(val.x - meanX, 2);
      return acc;
    },
    { numerator: 0, denominator: 0 }
  );

  const m = numerator / denominator;
  const b = meanY - m * meanX;

  return { m, b };
};

export const generatePredictions = (
  lastX: number,
  futurePoints: number,
  m: number,
  b: number
): DataPoint[] => {
  const predictionData: DataPoint[] = [];

  let prevY = m * (lastX + 1) + b;
  predictionData.push({ x: lastX + 1, y: prevY });

  for (let i = 2; i <= futurePoints; i++) {
    prevY += m;
    predictionData.push({ x: lastX + i, y: prevY });
  }

  return predictionData;
};

export const getFinancialData = async (
  type: string | null
): Promise<DataPoint[]> => {
  try {
    let data: DataPoint[] = [];

    switch (type) {
      case "steadyIncrease":
        data = [
          { x: 1, y: 1000 },
          { x: 2, y: 1200 },
          { x: 3, y: 1400 },
          { x: 4, y: 1600 },
          { x: 5, y: 1800 },
        ];
        break;

      case "fluctuatingSavings":
        data = [
          { x: 1, y: 1000 },
          { x: 2, y: 1200 },
          { x: 3, y: 1100 },
          { x: 4, y: 1300 },
          { x: 5, y: 1400 },
          { x: 6, y: 1600 },
          { x: 7, y: 1500 },
          { x: 8, y: 1700 },
          { x: 9, y: 1800 },
          { x: 10, y: 2000 },
        ];
        break;

      case "exponentialGrowth":
        data = [
          { x: 1, y: 100 },
          { x: 2, y: 200 },
          { x: 3, y: 300 },
          { x: 4, y: 1000 },
          { x: 5, y: 10000 },
        ];
        break;

      default:
        throw new Error(`Invalid data type: ${type}`);
    }

    return new Promise((resolve) => setTimeout(() => resolve(data), 1000));
  } catch (error) {
    console.error(`Failed to get financial data: ${error}`);
    throw error;
  }
};

export const calculatePredictions = (
  data: DataPoint[],
  futurePoints: number,
  model: PredictionModel
): DataPoint[] => {
  return model.calculate(data, futurePoints);
};
