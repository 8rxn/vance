import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DataKeyOptions, ForexData } from "../interface";

type Props = {
  historyData: ForexData[];
  dataKey?: DataKeyOptions;
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number }[];
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip p-2 rounded-full bg-[#7265EE]">
        <p className="label font-semibold">{`₹ ${payload[0].value.toFixed(
          4
        )}`}</p>
      </div>
    );
  }

  return null;
};

const Chart = ({ historyData, dataKey }: Props) => {
  if (!dataKey) {
    dataKey = "close";
  }
  return (
    <div className="h-[300px] w-full ">
      <ResponsiveContainer
        width="100%"
        height="100%"
        className={"border-gray-50/20"}
      >
        <AreaChart data={historyData}>
          <defs>
            <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(144, 70%, 69%)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="hsl(144, 70%, 69%)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tickFormatter={(date) => {
              let d = new Date(date);

              return `${d.getDate()}/${d.getMonth()}`;
            }}
          />

          <YAxis
            domain={["auto", "auto"]}
            tickFormatter={(value) => `₹${value.toFixed(1)}`}
          />
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-primary"
            strokeOpacity={0.1}
            strokeWidth={1}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke="hsl(144, 70%, 69%)"
            fillOpacity={1}
            fill="url(#colorClose)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
