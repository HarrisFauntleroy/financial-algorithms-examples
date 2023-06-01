import { Select, Stack } from "@mantine/core";
import { useState } from "react";
import FinanceChart from "./FinanceChart";

export interface DataPoint {
  x: number;
  y: number;
}

const FinancialAlgoPlayground = () => {
  const [model, setModel] = useState<string | null>("linear");

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
      <FinanceChart model={model} />
    </Stack>
  );
};

export default FinancialAlgoPlayground;
