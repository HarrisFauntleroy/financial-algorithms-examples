import { MantineProvider, Select, Stack } from "@mantine/core";
import { useState } from "react";
import FinanceChart from "./FinanceChart";

export interface DataPoint {
  x: number;
  y: number;
}

export function App() {
  const [model, setModel] = useState<string | null>("linear");

  const selectOptions = [
    { value: "linear", label: "Linear" },
    { value: "exponential", label: "Exponential" },
    { value: "polynomial", label: "Polynomial" },
  ];

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Stack p="8px" mah="100vh" maw="100vw">
        <Select
          label="Select Prediction Model"
          placeholder="Select one"
          value={model}
          data={selectOptions}
          onChange={setModel}
        />
        <FinanceChart model={model} />
      </Stack>
    </MantineProvider>
  );
}
