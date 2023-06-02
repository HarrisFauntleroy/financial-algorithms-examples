import { DataPoint } from "./App";
import {
  ExponentialGrowthModel,
  LinearRegressionModel,
  PolynomialRegressionModel,
} from "./predictionModels";

const text = "should return an empty array when given an empty array";
const text2 = "should return the same number of points as futurePoints";
const text3 = "should return the correct y values for the future points";

describe("LinearRegressionModel", () => {
  const model = new LinearRegressionModel();

  it(text, () => {
    const data: DataPoint[] = [];
    const futurePoints = 5;
    const result = model.calculate(data, futurePoints);
    expect(result).toEqual([]);
  });

  it(text2, () => {
    const data: DataPoint[] = [
      { x: 1, y: 2 },
      { x: 2, y: 4 },
      { x: 3, y: 6 },
    ];
    const futurePoints = 5;
    const result = model.calculate(data, futurePoints);
    expect(result.length).toEqual(futurePoints);
  });

  it(text3, () => {
    const data: DataPoint[] = [
      { x: 1, y: 2 },
      { x: 2, y: 4 },
      { x: 3, y: 6 },
    ];
    const futurePoints = 5;
    const result = model.calculate(data, futurePoints);
    expect(result).toEqual([
      { x: 4, y: 8 },
      { x: 5, y: 10 },
      { x: 6, y: 12 },
      { x: 7, y: 14 },
      { x: 8, y: 16 },
    ]);
  });
});

describe("PolynomialRegressionModel", () => {
  const model = new PolynomialRegressionModel(2);

  it(text, () => {
    const data: DataPoint[] = [];
    const futurePoints = 5;
    const result = model.calculate(data, futurePoints);
    expect(result).toEqual([]);
  });

  it(text2, () => {
    const data: DataPoint[] = [
      { x: 1, y: 2 },
      { x: 2, y: 4 },
      { x: 3, y: 6 },
    ];
    const futurePoints = 5;
    const result = model.calculate(data, futurePoints);
    expect(result.length).toEqual(futurePoints);
  });

  it(text3, () => {
    const data: DataPoint[] = [
      { x: 1, y: 2 },
      { x: 2, y: 4 },
      { x: 3, y: 6 },
    ];
    const futurePoints = 5;
    const result = model.calculate(data, futurePoints);
    expect(result).toEqual([
      { x: 4, y: 8 },
      { x: 5, y: 10 },
      { x: 6, y: 12 },
      { x: 7, y: 14 },
      { x: 8, y: 16 },
    ]);
  });
});

describe("ExponentialGrowthModel", () => {
  const model = new ExponentialGrowthModel();

  it(text, () => {
    const data: DataPoint[] = [];
    const futurePoints = 5;
    const result = model.calculate(data, futurePoints);
    expect(result).toEqual([]);
  });

  it(text2, () => {
    const data: DataPoint[] = [
      { x: 1, y: 2 },
      { x: 2, y: 4 },
      { x: 3, y: 8 },
    ];
    const futurePoints = 5;
    const result = model.calculate(data, futurePoints);
    expect(result.length).toEqual(futurePoints);
  });

  it(text3, () => {
    const data: DataPoint[] = [
      { x: 1, y: 2 },
      { x: 2, y: 4 },
      { x: 3, y: 8 },
    ];
    const futurePoints = 5;
    const result = model.calculate(data, futurePoints);
    expect(result).toEqual([
      { x: 4, y: 16.000000000000007 },
      { x: 5, y: 32.000000000000014 },
      { x: 6, y: 64.00000000000003 },
      { x: 7, y: 128.00000000000009 },
      { x: 8, y: 256.00000000000017 },
    ]);
  });
});
