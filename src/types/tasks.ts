export type TaskProps = {
  id: string;
  title: string;
  status: string;
  assignee: { name: string };
  due_date: string;
};
