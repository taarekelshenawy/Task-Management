import { format } from 'date-fns';
import { STATUS_COLORS_Charts } from '../../constants/constants';

type StatisticsCalenderProps = {
  item: {
    day: string;
    statuses: Record<string, number>;
  };
};
export default function StatisticsCalender({ item }: StatisticsCalenderProps) {
  return (
    <div
      key={item.day}
      className=" min-h-96 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-4">
        <p className="text-sm text-gray-500 font-bold">
          {format(new Date(item.day), 'EEE')}
        </p>

        <h3 className="text-xl font-bold text-slate-dark">
          {format(new Date(item.day), 'dd MMM')}
        </h3>
      </div>

      {/* Statuses */}
      <div className="space-y-3 p-4">
        {Object.keys(item.statuses).length === 0 ? (
          <p className="text-center text-gray-500">There are no tasks.</p>
        ) : (
          Object.entries(item.statuses).map(([status, count]) => (
            <div
              key={status}
              className={`flex items-start gap-2 justify-between rounded-lg bg-gray-100 px-3 py-2`}
            >
              <span
                className={`text-sm font-bold`}
                style={{ color: STATUS_COLORS_Charts[status] }}
              >
                {status.replaceAll('_', ' ')}
              </span>

              <span className="rounded-full  px-2 py-0.5 text-xs text-slate-dark font-bold">
                {count}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
