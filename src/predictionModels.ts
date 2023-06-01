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
import { DataPoint } from "./FinancialAlgoPlayground";
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
