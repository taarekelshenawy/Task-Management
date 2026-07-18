import { STATUS_COLORS } from '../constants/constants';

type ChartDataProps = {
  item: {
    value: number;
    name: string;
  };
  total: number;
};

export default function ChartData({ item, total }: ChartDataProps) {
  const perCentage = (item: number) => {
    const result = (item / total) * 100;
    return result;
  };
  return (
    <div className="flex flex-col gap-2 ">
      <div className="flex justify-between">
        <p>{item.name}</p>
        <p>{item.value}</p>
      </div>
      <div className="w-full relative h-2 bg-gray-300 rounded-2xl">
        <div
          className="h-full rounded-full"
          style={{
            width: `${perCentage(item.value)}%`,
            backgroundColor: STATUS_COLORS[item.name],
          }}
        />
      </div>
    </div>
  );
}
