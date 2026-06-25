export type TaskProps = {
  id: string;
  title: string;
  status: string;
  assignee: { name: string };
  due_date: string;
};

export type TaskStatus = 'TO_DO' | 'IN_PROGRESS' | 'DONE';

export type CreateTaskPayload = {
  epic_id: string;
  title: string;
  description: string;
  assignee_id?: string;
  due_date: string;
  status: 'TO_DO' | 'IN_PROGRESS' | 'DONE';
  created_at?: string;
  assignee?: { name: string };
};

export type TaskDetailsProps = {
  id: string;
  task_id: string;
  title: string;
  description: string;
  status: string;
  due_date: string;
  created_at: string;

  assignee: {
    name: string;
  } ;

  epic_id: {
    id: string;
    epic_id: string;
  };
};
