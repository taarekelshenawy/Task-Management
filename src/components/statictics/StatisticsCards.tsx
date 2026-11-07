import TotalTaskImg from '../../assets/totalTask.png';
import CompleteTaskImg from '../../assets/completTask.png';
import OverdueTaskImg from '../../assets/overdueIcon.png';

type StatisticsCardsProps = {
  data: {
    total_tasks: number;
    done_tasks: number;
    overdue_tasks: number;
  } | null;
};
export default function StatisticsCards({ data }: StatisticsCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-10">
      <div className="flex justify-between rounded bg-white p-4 items-center  max-sm:flex-col-reverse max-sm:gap-2 max-sm:items-start ">
        <div>
          <p className="font-bold text-slate-dark/60 text-sm">TOTAL TASKS</p>
          <p className="text-3xl font-bold mt-2 text-slate-dark">{data?.total_tasks}</p>
        </div>
        <div className='bg-brand-blue-light w-12 h-12 flex justify-center items-center rounded-xs'>
          <img src={TotalTaskImg}></img>
        </div>
      </div>
      <div className="flex justify-between rounded bg-white p-4 items-center max-sm:flex-col-reverse max-sm:gap-2 max-sm:items-start ">
        <div>
          <p className="font-bold text-slate-dark/60 text-sm">COMPLETED TASKS</p>
          <p className="text-3xl font-bold mt-2 text-slate-dark">{data?.done_tasks}</p>
        </div>
         <div className='bg-brand-green-light/10 w-12 h-12 flex justify-center items-center rounded-xs'>
          <img src={CompleteTaskImg}></img>
        </div>
      </div>
      <div className="flex justify-between bg-white p-4 rounded items-center max-sm:flex-col-reverse max-sm:gap-2 max-sm:items-start">
        <div>
          <p className="font-bold text-slate-dark/60 text-sm">OVERDUE TASKS</p>
          <p className="text-3xl font-bold mt-2 text-status-blocked">
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
