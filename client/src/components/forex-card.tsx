import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Chart from "./chart";
import {
  API_URL,
  CURRENCY_OPTIONS,
  DATAKEY_OPTIONS,
  PERIOD_OPTIONS,
} from "@/lib/config";
import { DataKeyOptions, ForexData } from "@/interface";

export function ForexCard() {
  const [historyData, setHistoryData] = useState<ForexData[]>([]);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState("GBP");
  const [period, setPeriod] = useState("1m");
  const [dataKey, setDataKey] = useState<DataKeyOptions>("close");

  const lastVal =
    historyData.length > 0
      ? historyData[historyData.length - 1][dataKey]
      : null;

  const fetchForexData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/forex-data/?from=${currency}&to=INR&period=${period}`,
        { method: "POST" }
      );
      const data = await response.json();
      setHistoryData(data);
    } catch (error) {
      console.error("Error fetching forex data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForexData();
  }, [currency, period]);

  return (
    <Card className="w-full max-w-2xl  bg-background text-gray-50 border-neutral-600">
      <CardHeader>
        <CardTitle>Forex Exchange Rates</CardTitle>
        <CardDescription>
          Track exchange rates against Indian Rupee (INR)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger
              id="currency"
              className="w-[120px] min-w-fit bg-background border-gray-50/50 text-gray-50"
            >
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              className="bg-background border-gray-50/20 text-gray-50"
            >
              {Object.entries(CURRENCY_OPTIONS).map(([code, details]) => (
                <SelectItem
                  key={code}
                  value={code}
                  className="hover:bg-neutral-600 focus:bg-neutral-600 cursor-pointer hover:text-gray-50"
                >
                  <span className=" font-bold"> {details.country}</span>{" "}
                  <span>
                    {details.symbol} {code}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            {PERIOD_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={period === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setPeriod(option.value)}
                className="border-gray-50/20"
              >
                {option.value.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <Chart historyData={historyData} dataKey={dataKey} />
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between flex-wrap-reverse gap-y-2">
        <div className="text-left">
          <p>
            {lastVal && (
              <div className="text-2xl font-bold ">₹{lastVal.toFixed(4)}</div>
            )}
          </p>
          <span className="text-xs text-muted-foreground">
            as on{" "}
            {new Date(historyData[historyData.length - 1]?.date).toUTCString()}
          </span>
        </div>
        <div>
          <Select
            value={dataKey}
            onValueChange={(value) => setDataKey(value as DataKeyOptions)}
          >
            <SelectTrigger
              id="dataKey"
              className="w-[120px] min-w-fit bg-background border-gray-50/50 text-gray-50"
            >
              <SelectValue placeholder=" Select Chart Data" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              className="bg-background border-gray-50/20 text-gray-50"
            >
              {DATAKEY_OPTIONS.map((code) => (
                <SelectItem
                  key={code}
                  value={code}
                  className="hover:bg-neutral-600 focus:bg-neutral-600 cursor-pointer hover:text-gray-50"
                >
                  <span className=" font-bold"> {code.toUpperCase()}</span>{" "}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardFooter>
    </Card>
  );
}

export default ForexCard;
