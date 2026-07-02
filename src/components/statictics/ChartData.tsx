import { STATUS_COLORS } from '../constants/constants';
export default function ChartData({ item }) {
  return (
    <div key={item.name} className="flex items-center gap-3">
      <span
        className="w-4 h-4 rounded-full"
        style={{
          backgroundColor: STATUS_COLORS[item.name] ?? '#CBD5E1',
        }}
      />

      <span className="capitalize text-slate-dark">
        {item.name.replaceAll('_', ' ')}
      </span>
    </div>
  );
}
