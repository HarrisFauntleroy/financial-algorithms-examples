import { MantineProvider } from "@mantine/core";
import FinanceChart from "./Test";

export default function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <FinanceChart />
    </MantineProvider>
  );
}
