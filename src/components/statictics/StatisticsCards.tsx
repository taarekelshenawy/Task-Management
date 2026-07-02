import TotalTaskImg from '../../assets/totalTask.png';
import CompleteTaskImg from '../../assets/completTask.png';
import OverdueTaskImg from '../../assets/overduetask.png';

export default function StatisticsCards({ data }) {
  return (
    <div className="grid grid-cols-3 gap-10">
      <div className="flex justify-between rounded bg-white p-4">
        <div>
          <p className="font-bold text-slate-dark/60">TOTAL TASKS</p>
          <p className="text-3xl font-bold mt-2">{data?.total_tasks}</p>
        </div>
        <div>
          <img src={TotalTaskImg}></img>
        </div>
      </div>
      <div className="flex justify-between rounded bg-white p-4 items-center">
        <div>
          <p className="font-bold text-slate-dark/60">COMPLETED TASKS</p>
          <p className="text-3xl font-bold mt-2">{data?.done_tasks}</p>
        </div>
        <div>
          <img src={CompleteTaskImg}></img>
        </div>
      </div>
      <div className="flex justify-between bg-white p-4 rounded">
        <div>
          <p className="font-bold text-slate-dark/60">OVERDUE TASKS</p>
          <p className="text-3xl font-bold mt-2 text-red-500">
            {data?.overdue_tasks}
          </p>
        </div>
        <div>
          <img src={OverdueTaskImg}></img>
        </div>
      </div>
    </div>
  );
}
