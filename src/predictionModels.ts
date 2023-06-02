/* eslint-disable import/named */
import {
  add,
  exp,
  inv,
  log,
  lusolve,
  matrix,
  multiply,
  pow,
  transpose,
} from "mathjs";
import { DataPoint } from "./App";
import {
  calculateMean,
  calculateSlopeAndYIntercept,
  generatePredictions,
} from "./calculations";

export interface PredictionModel {
  calculate: (data: DataPoint[], futurePoints: number) => DataPoint[];
}

export class LinearRegressionModel implements PredictionModel {
  calculate(data: DataPoint[], futurePoints: number): DataPoint[] {
    if (!data.length) return [];

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
    if (!data.length) return [];

    const coefficients = this.calculatePolynomialCoefficients(data);
    console.log("Coefficients:", coefficients); // Add logging here

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

    console.log("Prediction Data:", predictionData); // Add logging here

    return predictionData;
  }

  private calculatePolynomialCoefficients(data: DataPoint[]): number[] {
    const X = matrix(
      data.map((point) =>
        Array.from({ length: this.degree + 1 }, (_, j) => Math.pow(point.x, j))
      )
    );
    const Y = matrix(data.map((point) => [point.y]));

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
    if (!data.length) return [];

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
