import ProjectHeader from '../project/ProjectHeader';
import Select from 'react-select';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { statisticStatusOptions } from '../constants/constants';
import useGetTaskStatistics from '../../hooks/useGetTasksStatistics';
import { differenceInCalendarDays } from 'date-fns';
import { toast } from 'react-toastify';
import useGetTasksCountPerProject from '../../hooks/useGetTasksCountPerProject';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { STATUS_COLORS } from '../constants/constants';
import StatisticsCards from './StatisticsCards';
import StatisticsCalender from './StatisticsCalender';
import ChartData from './ChartData';
import ProjectCounts from './ProjectCounts';

export default function Statictics() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const { data: projectCounts } = useGetTasksCountPerProject(
    startDate,
    endDate,
  );

  const projectOptions = [
    { value: 'All Projects', label: 'All Projects' },
    ...(projectCounts?.map((project) => ({
      value: project.project_name,
      label: project.project_name,
    })) ?? []),
  ];

  const { data } = useGetTaskStatistics(
    startDate,
    endDate,
    selectedProject,
    selectedStatus,
  );

  const statuses: Record<string, number> = {};

  data?.daily.forEach((day) => {
    Object.entries(day.statuses).forEach(([status, count]) => {
      statuses[status] = (statuses[status] || 0) + count;
    });
  });

  const chartData = Object.entries(statuses).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);
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
            <div
              className="absolute top-14 p-3 bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <DayPicker
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  if (!range) return;

                  if (range.from && range.to) {
                    const days = differenceInCalendarDays(range.to, range.from);

                    if (days > 6) {
                      toast.error('You can select a maximum of 7 days');
                      return;
                    }
                  }

                  setDateRange(range);

                  if (range.from) {
                    setStartDate(format(range.from, 'yyyy-MM-dd'));
                  }

                  if (range.to) {
                    setEndDate(format(range.to, 'yyyy-MM-dd'));
                    setOpen(false);
                  }
                }}
              />
            </div>
          )}
        </div>

        <div className="flex gap-16">
          <Select
            options={projectOptions}
            defaultValue={projectOptions[0]}
            onChange={(selected) =>
              setSelectedProject(
                selected?.value === 'All Projects'
                  ? null
                  : (selected?.value ?? null),
              )
            }
          />
          <Select
            options={statisticStatusOptions}
            defaultValue={statisticStatusOptions[0]}
            onChange={(selected) =>
              setSelectedStatus(
                selected?.value === 'All Statuses'
                  ? null
                  : (selected?.value ?? null),
              )
            }
          />
        </div>
      </div>
      <StatisticsCards data={data} />

      {/* calender */}
      <div className="flex gap-5 items-center">
        {data?.daily.map((item) => (
          <StatisticsCalender item={item} />
        ))}
      </div>

      <div className="flex items-center justify-between px-8 mt-20">
        {/* Left Side */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-slate-dark mb-6">
            Tasks by Status
          </h2>

          <div className="flex items-center gap-8">
            {/* Pie Chart */}
            <div className="relative h-64 w-80 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {chartData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={STATUS_COLORS[entry.name] ?? '#CBD5E1'}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-sm text-gray-500">Total</span>
                <span className="text-3xl font-bold">{total}</span>
              </div>
            </div>

            {/* Status Legend */}
            <div className="flex flex-col gap-4">
              {chartData.map((item) => (
                <ChartData item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="flex flex-col gap-4  ">
          <h2 className="font-bold text-xl">All Projects</h2>
          {projectCounts?.map((project) => (
            <ProjectCounts project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
