export const STATUSES = [
  'TO_DO',
  'IN_PROGRESS',
  'BLOCKED',
  'IN_REVIEW',
  'READY_FOR_QA',
  'REOPENED',
  'READY_FOR_PRODUCTION',
  'DONE',
];

export const statusColor = {
  TO_DO: 'bg-status-todo',
  IN_PROGRESS: 'bg-status-in-progress',
  BLOCKED: 'bg-status-blocked',
  IN_REVIEW: 'bg-status-default',
  READY_FOR_QA: 'bg-status-default',
  REOPENED: 'bg-status-default',
  READY_FOR_PRODUCTION: 'bg-status-default',
  DONE: 'bg-status-default',
};

export const statusStyles = {
  TO_DO: 'bg-gray-200 text-gray-700',
  'in progress': 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
};

export const STATUS_OPTIONS = [
  { value: 'TO_DO', label: 'Todo' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' },
  { value: 'BLOCKED', label: 'Blocked' },
];

export const statisticStatusOptions = [
  { value: null, label: 'All Statuses' },
  { value: 'TO_DO', label: 'TO DO' },
  { value: 'IN_PROGRESS', label: 'IN PROGRESS' },
  { value: 'BLOCKED', label: 'BLOCKED' },
  { value: 'IN_REVIEW', label: 'IN REVIEW' },
  { value: 'READY_FOR_QA', label: 'READY FOR QA' },
  { value: 'REOPENED', label: 'REOPENED' },
  { value: 'READY_FOR_PRODUCTION', label: 'READY FOR PRODUCTION' },
  { value: 'DONE', label: 'DONE' },
];

export const STATUS_COLORS: Record<string, string> = {
  TO_DO: '#3B82F6',
  IN_PROGRESS: '#F59E0B',
  DONE: '#22C55E',
  OVERDUE: '#EF4444',
};
