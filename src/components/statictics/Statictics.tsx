import ProjectHeader from '../project/ProjectHeader';
import Select from 'react-select';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { statisticStatusOptions } from '../constants/constants';
import TotalTaskImg from '../../assets/totalTask.png';
import CompleteTaskImg from '../../assets/completTask.png';
import OverdueTaskImg from '../../assets/overduetask.png';

export default function Statictics() {
  const projectOptions = [
    { value: 'All Projects', label: 'All Projects' },
    { value: 'vue', label: 'List of projects' },
  ];
 
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  return (
    <div className="flex flex-col w-full overflow-hidden p-3 gap-10">
      <ProjectHeader />
      <div>
        <h1 className="text-3xl font-bold text-slate-dark">Weekly Planner</h1>
        <p className="font-medium text-secondary">
          Manage your deadlines and track team velocity.
        </p>
      </div>
      <div className="flex justify-between items-center">
        <div
          onClick={() => setOpen(!open)}
          className="rounded-md px-4 py-2 cursor-pointer relative"
        >
          <p className="font-extrabold">
            {dateRange?.from && dateRange?.to
              ? `< ${format(dateRange.from, 'MMM dd, yyyy')} - ${format(
                  dateRange.to,
                  'MMM dd, yyyy',
                )} >`
              : 'Select Date Range'}
          </p>

          {open && (
            <div className="absolute top-14 p-3 bg-white">
              <DayPicker
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range);
                  setOpen(false);
                }}
              />
            </div>
          )}
        </div>

        <div className="flex gap-16">
          <Select options={projectOptions} defaultValue={projectOptions[0]} />
          <Select options={statisticStatusOptions} defaultValue={statisticStatusOptions[0]} />
        </div>
      </div>

      <div className='grid grid-cols-3 gap-10'>
        <div className='flex justify-between rounded bg-white p-4'>
            <div>
                <p className='font-bold text-slate-dark/60'>TOTAL TASKS</p>
                <p className='text-3xl font-bold mt-2'>24</p>

            </div>
            <div>
                <img src={TotalTaskImg}></img>
            </div>
        </div>
           <div className='flex justify-between rounded bg-white p-4 items-center'>
            <div>
                <p className='font-bold text-slate-dark/60'>COMPLETED TASKS</p>
                <p className='text-3xl font-bold mt-2'>24</p>

            </div>
            <div>
                <img src={CompleteTaskImg}></img>
            </div>
        </div>
           <div className='flex justify-between bg-white p-4 rounded'>
            <div>
                <p className='font-bold text-slate-dark/60'>OVERDUE TASKS</p>
                <p className='text-3xl font-bold mt-2 text-red-500'>24</p>

            </div>
            <div>
                <img src={OverdueTaskImg}></img>
            </div>
        </div>
      </div>

      {/* calender */}
      <div className='flex justify-between items-center'>
        <div className="w-52 min-h-96 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
  {/* Header */}
  <div className=" p-4 ">
    <p className="text-sm text-gray-500 font-bold">Mon</p>
    <h3 className="text-xl font-bold text-slate-dark">12 Jul</h3>
  </div>

  {/* Statuses */}
  <div className="space-y-3 p-4">
    <div className="flex items-center justify-between rounded-lg bg-gray-100 px-3 py-2">
      <span className="text-sm font-medium">To Do</span>
      <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
        2
      </span>
    </div>

    <div className="flex items-center justify-between rounded-lg bg-gray-100 px-3 py-2">
      <span className="text-sm font-medium">In Progress</span>
      <span className="rounded-full bg-yellow-500 px-2 py-0.5 text-xs text-white">
        3
      </span>
    </div>

    <div className="flex items-center justify-between rounded-lg bg-gray-100 px-3 py-2">
      <span className="text-sm font-medium">Done</span>
      <span className="rounded-full bg-green-500 px-2 py-0.5 text-xs text-white">
        5
      </span>
    </div>

    <div className="flex items-center justify-between rounded-lg bg-gray-100 px-3 py-2">
      <span className="text-sm font-medium">Blocked</span>
      <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
        1
      </span>
    </div>
  </div>
</div>
 
      </div>
    </div>
  );
}
