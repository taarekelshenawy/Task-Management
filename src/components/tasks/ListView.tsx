import arrowLeft from '../../assets/arrowleft.png';
import arrowRight from '../../assets/arrowRight.png';
import { useEffect, useState } from 'react';
import { fetchAllTasks } from '../../services/taskService';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import TaskModal from './TaskModal';

type AllTaskProps = {
  task_id: string;
  title: string;
  assignee: { name: string };
  due_date: string;
  status: string;
};



export default function ListView() {
  const { projectId } = useParams();
  const [allTasks, setAllTasks] = useState([]);
  const [openModal,setOpenModal]=useState(false);
  const [taskId,setTaskId]=useState('');

  const [currentPage, setCurrentPage] = useState(1);
const [contentRange, setContentRange] = useState('');
const limit = 10;
const offset = (currentPage - 1) * limit;

  if (!projectId) {
    throw new Error('there is no projectId');
  }

  

  useEffect(() => {
  const getTasks = async () => {
    const response = await fetchAllTasks(
      projectId,
      limit,
      offset,
    );

    const data = await response.json();

    setAllTasks(data);

    setContentRange(
      response.headers.get('Content-Range') || '',
    );
  };

  getTasks();
}, [projectId, offset]);

const total = Number(contentRange.split('/')[1] || 0);

const totalPages = Math.ceil(total / limit);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-225 w-full text-center  border-separate border-spacing-0 bg-white">
        <thead className=" font-extrabold text-secondary bg-background uppercase">
          <tr>
            <th className="py-4 font-extrabold ">Task ID</th>
            <th className="py-4 font-extrabold">Title</th>
            <th className="py-4 font-extrabold">Status</th>
            <th className="py-4 font-extrabold">Due Date</th>
            <th className="py-4 font-extrabold">Assignee</th>
            <th className="py-4 font-extrabold"></th>
          </tr>
        </thead>

        <tbody className="font-medium">
          {allTasks.map((el: AllTaskProps) => {
            return (
              <tr className="bg-white ">
                <td className="py-4 text-primary font-medium ">{el.task_id}</td>
                <td className="py-4 font-bold" onClick={()=>{return(setTaskId(el.id),setOpenModal(true))}}>{el.title}</td>
                <td className=" py-4 ">
                  <span className="bg-surface-high  px-3 py-1 rounded-full text-sm">
                    {el.status}
                  </span>
                </td>
                <td className="py-4">{el.due_date}</td>
                <td className="py-4">{el.assignee.name}</td>
                <td className="py-4">
                  <button>⋯</button>
                </td>
              </tr>
            );
          })}
        </tbody>

        <tfoot>
          <tr>
            <td colSpan={6}>
              {/* <div className="flex justify-between bg-white p-4 items-center w-full">
                <p className="font-bold text-secondary">
                  Showing 5 of 24 tasks
                </p>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 border flex items-center justify-center">
                    <img src={arrowLeft} className="w-1 h-2" />
                  </button>
                  <button className="w-8 h-8 border flex items-center justify-center">
                    <img src={arrowRight} className="w-1 h-2" />
                  </button>
                </div>
              </div> */}
              <div className="flex justify-between bg-white p-4 items-center w-full">
          <p className="font-bold text-secondary">
  Showing {allTasks.length} of {total} tasks
</p>

<div className="flex items-center gap-2">

  <button
    onClick={() => setCurrentPage((p) => p - 1)}
    disabled={currentPage === 1}
    className="w-8 h-8 border flex items-center justify-center disabled:opacity-40"
  >
    <img src={arrowLeft} className="w-1 h-2" />
  </button>

  {Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;

    return (
      <button
        key={page}
        onClick={() => setCurrentPage(page)}
        className={`w-8 h-8 border ${
          currentPage === page
            ? 'bg-primary text-white'
            : ''
        }`}
      >
        {page}
      </button>
    );
  })}

  <button
    onClick={() => setCurrentPage((p) => p + 1)}
    disabled={currentPage === totalPages}
    className="w-8 h-8 border flex items-center justify-center disabled:opacity-40"
  >
    <img src={arrowRight} className="w-1 h-2" />
  </button>

</div>
              </div>
    
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="flex justify-end mt-80">
        <Link to={`/project/:${projectId}/tasks/new`}>
          <button className="bg-primary w-18 h-15 rounded-xl text-3xl text-white cursor-pointer">
            +
          </button>
        </Link>
      </div>
      {openModal && <TaskModal projectId={projectId} taskId={taskId}/>}
    </div>
  );
}
