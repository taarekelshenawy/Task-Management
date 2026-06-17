
export type Task = {
  id: string;
  title: string;
  status: string;
};

export const STATUSES = [
  "TO_DO",
  "IN_PROGRESS",
  "BLOCKED",
  "IN_REVIEW",
  "READY_FOR_QA",
  "REOPENED",
  "READY_FOR_PRODUCTION",
  "DONE",
];

// TasksBoardPage.tsx
import StatusColumn from "./StatusColumn";


export default function Boardview() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 max-sm:flex-wrap gap-5">
        <div>
            <h1 className="font-bold text-3xl">Active Workboard</h1>
            <p className="text-[#64748B]">Curating Project Alpha's production pipeline and milestones.</p>
        </div>
        <input
          placeholder="Search tasks..."
          className="border rounded px-3 py-2 w-64 bg-surface-high"
        />

        <select className="border border-slate-light/20 rounded px-3 py-2">
          <option>Board View</option>
          <option>List View</option>
        </select>
      </div>

      {/* Board */}
      <div className="flex gap-4 overflow-x-auto">
        {STATUSES.map((status) => (
          <StatusColumn key={status} status={status} />
        ))}
      </div>
    </div>
  );
}
