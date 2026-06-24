import Select from 'react-select';
import { useNavigate, useParams } from 'react-router-dom';

const options = [
  { value: 'board', label: 'Board View' },
  { value: 'list', label: 'List View' },
];

export default function TasksHeader() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  return (
    <div className="flex items-center justify-between mb-6 max-sm:flex-wrap gap-5">
      <div>
        <h1 className="font-bold text-3xl">Active Workboard</h1>
        <p className="text-[#64748B]">
          Curating Project Alpha's production pipeline and milestones.
        </p>
      </div>
      <input
        placeholder="Search tasks..."
        className="border rounded px-3 py-2 w-64 bg-surface-high"
      />

      <Select
        options={options}
        onChange={(selectOptions) =>
          navigate(`/project/${projectId}/tasks?view=${selectOptions?.value}`)
        }
      />
    </div>
  );
}
