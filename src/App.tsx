import { MantineProvider } from "@mantine/core";
import FinanceChart from "./FinancialAlgoPlayground";

export default function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <FinanceChart />
    </MantineProvider>
  );
}
