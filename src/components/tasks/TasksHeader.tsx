import Select from 'react-select';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const options = [
  { value: 'board', label: 'Board View' },
  { value: 'list', label: 'List View' },
];

export default function TasksHeader({
  setSearchValue,
}: {
  setSearchValue: (e: string) => void;
}) {
  const navigate = useNavigate();
  const { projectId } = useParams();
  return (
    <div className="flex items-center justify-between mb-6 max-sm:flex-wrap gap-5 mt-8">
      <div>
        <h1 className="font-bold text-3xl">Active Workboard</h1>
        <p className="text-[#64748B] max-sm:hidden">
          Curating Project Alpha's production pipeline and milestones.
        </p>
      </div>
      <input
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Search tasks..."
        className="border rounded px-3 py-2 w-64 bg-surface-high max-sm:w-full"
      />

      <button className="hidden max-sm:block w-full h-12 bg-primary text-white font-bold rounded text-lg">
        <Link to={`/project/:${projectId}/tasks/new`}>+ Create Task</Link>
      </button>

      <Select
        className="max-sm:hidden"
        options={options}
        onChange={(selectOptions) =>
          navigate(`/project/${projectId}/tasks?view=${selectOptions?.value}`)
        }
      />
    </div>
  );
}
