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
