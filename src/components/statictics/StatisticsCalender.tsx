import { format } from 'date-fns';

export default function StatisticsCalender({ item }) {
  return (
    <div
      key={item.day}
      className="w-52 min-h-96 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
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
        {Object.entries(item.statuses).map(([status, count]) => (
          <div
            key={status}
            className="flex items-center justify-between rounded-lg bg-gray-100 px-3 py-2"
          >
            <span className="text-sm font-medium">
              {status.replaceAll('_', ' ')}
            </span>

            <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
