/* eslint-disable import/named */
import {
  add,
  exp,
  index,
  inv,
  log,
  lusolve,
  matrix,
  multiply,
  pow,
  transpose,
} from "mathjs";
import { DataPoint } from "./Test";

const calculateMean = (data: DataPoint[]): { meanX: number; meanY: number } => {
  const len = data.length;
  const meanX = data.reduce((sum, val) => sum + val.x, 0) / len;
  const meanY = data.reduce((sum, val) => sum + val.y, 0) / len;

  return { meanX, meanY };
};

const calculateSlopeAndYIntercept = (
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

const generatePredictions = (
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

export interface PredictionModel {
  calculate: (data: DataPoint[], futurePoints: number) => DataPoint[];
}

export class LinearRegressionModel implements PredictionModel {
  calculate(data: DataPoint[], futurePoints: number): DataPoint[] {
    const { meanX, meanY } = calculateMean(data);
    const { m, b } = calculateSlopeAndYIntercept(data, meanX, meanY);
    const lastX = data[data.length - 1].x;

    return generatePredictions(lastX, futurePoints, m, b);
  }
}

export class PolynomialRegressionModel implements PredictionModel {
  private degree: number;

  constructor(degree: number) {
    this.degree = degree;
  }

  calculate(data: DataPoint[], futurePoints: number): DataPoint[] {
    const coefficients = this.calculatePolynomialCoefficients(data);
    const lastX = data[data.length - 1].x;

    const predictionData: DataPoint[] = [];
    for (let i = 1; i <= futurePoints; i++) {
      const x = add(lastX, i) as number;
      let y = 0;
      for (let j = 0; j < this.degree + 1; j++) {
        y += multiply(coefficients[j], pow(x, j)) as number;
      }
      predictionData.push({ x, y: y as number });
    }

    return predictionData;
  }

  private calculatePolynomialCoefficients(data: DataPoint[]): number[] {
    const X = matrix(Array(data.length).fill(Array(this.degree + 1).fill(0)));
    const Y = matrix(Array(data.length).fill([0]));

    data.forEach((point, i) => {
      for (let j = 0; j < this.degree + 1; j++) {
        X.subset(index(i, j), pow(point.x, j));
      }
      Y.subset(index(i, 0), point.y);
    });

    // Solve for the coefficients using least squares
    // X.T * X * a = X.T * Y
    const coefficientsMatrix = lusolve(
      multiply(transpose(X), X),
      multiply(transpose(X), Y)
    );

    // Convert the Matrix to a JavaScript array of arrays, then flatten to a single array
    return coefficientsMatrix.toArray().flat() as number[];
  }
}

export class ExponentialGrowthModel implements PredictionModel {
  calculate(data: DataPoint[], futurePoints: number): DataPoint[] {
    const xs = data.map((point) => point.x);
    const ys = data.map((point) => log(point.y));

    const lhs = transpose([xs, xs.map(() => 1)]);
    const rhs = transpose([ys]);

    const exponentialCoefficients = multiply(
      inv(multiply(transpose(lhs), lhs)),
      multiply(transpose(lhs), rhs)
    );

    const predictionData: DataPoint[] = [];
    const lastX = data[data.length - 1].x;

    for (let i = 1; i <= futurePoints; i++) {
      const x = add(lastX, i) as number;
      const y = exp(
        add(
          multiply(exponentialCoefficients[0][0] as number, x),
          exponentialCoefficients[1][0]
        )
      ) as number;
      predictionData.push({ x, y });
    }

    return predictionData;
  }
}

export const getFinancialData = async (): Promise<DataPoint[]> => {
  try {
    const data: DataPoint[] = [
      { x: 1, y: 100 },
      { x: 2, y: 200 },
      { x: 3, y: 300 },
      { x: 4, y: 1000 },
      { x: 5, y: 10000 },
    ];

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
