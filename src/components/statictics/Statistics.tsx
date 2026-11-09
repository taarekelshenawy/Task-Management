import ProjectHeader from '../project/ProjectHeader';
import Select from 'react-select';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { statisticStatusOptions } from '../../constants/constants';
import useGetTaskStatistics from '../../hooks/useGetTasksStatistics';
import { differenceInCalendarDays } from 'date-fns';
import { toast } from 'react-toastify';
import useGetTasksCountPerProject from '../../hooks/useGetTasksCountPerProject';
import { PieChart, Pie, Cell } from 'recharts';
import StatisticsCards from './StatisticsCards';
import StatisticsCalender from './StatisticsCalender';
import ProjectCounts from './ProjectCounts';
import { startOfWeek, endOfWeek } from 'date-fns';
import { ResponsiveContainer } from 'recharts';
import ChartData from './ChartData';
import { STATUS_COLORS_Charts } from '../../constants/constants';

export default function Statictics() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [openCalender, setOpenCalender] = useState(false);

  const initialRange: DateRange = {
    from: startOfWeek(new Date(), { weekStartsOn: 6 }),
    to: endOfWeek(new Date(), { weekStartsOn: 6 }),
  };

  const [appliedRange, setAppliedRange] = useState<DateRange>(initialRange);
  const [draftRange, setDraftRange] = useState<DateRange | undefined>(
    initialRange,
  );
  const [startDate, setStartDate] = useState<string>(
    format(appliedRange.from!, 'yyyy-MM-dd'),
  );
  const [endDate, setEndDate] = useState<string>(
    format(appliedRange.to!, 'yyyy-MM-dd'),
  );

  const { data: projectCounts } = useGetTasksCountPerProject(
    startDate,
    endDate,
  );

  const { data } = useGetTaskStatistics(
    startDate,
    endDate,
    selectedProject,
    selectedStatus,
  );

  interface ChartDataItem {
    name: string;
    value: number;
  }

  const totals: ChartDataItem = data?.totals;
  const chartData = Object.entries(totals || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const projectOptions = [
    { value: 'All Projects', label: 'All Projects' },
    ...(projectCounts?.map((project) => ({
      value: project.project_name,
      label: project.project_name,
    })) ?? []),
  ];

  const total = data?.total_tasks;
  return (
    <div className="flex flex-col w-full overflow-hidden p-3 gap-10">
      <ProjectHeader />
      <div>
        <h1 className="text-3xl font-bold text-slate-dark">Weekly Planner</h1>
        <p className="font-medium text-secondary">
          Manage your deadlines and track team velocity.
        </p>
      </div>
      <div className="flex justify-between items-center bg-surface-low p-4 rounded-lg max-sm:flex-col max-sm:gap-2 max-sm:items-start">
        <div
          onClick={() => {
            setOpenCalender(!openCalender);

            setDraftRange(undefined);
          }}
          className="rounded-md px-4 py-2 cursor-pointer relative"
        >
          <p className="font-extrabold text-slate-dark text-sm">
            {appliedRange?.from && appliedRange?.to
              ? `${format(appliedRange.from, 'MMM dd')} - ${format(
                  appliedRange.to,
                  'MMM dd, yyyy',
                )}`
              : 'Select Date Range'}
          </p>

          {openCalender && (
            <div
              className="absolute top-14  bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <DayPicker
                mode="range"
                selected={draftRange}
                onSelect={(range) => {
                  if (!range) return;

                  if (range.from && range.to) {
                    const days = differenceInCalendarDays(range.to, range.from);

                    if (days !== 6) {
                      toast.error('Please select exactly 7 days');
                      return;
                    }

                    setAppliedRange(range);

                    setStartDate(format(range.from, 'yyyy-MM-dd'));
                    setEndDate(format(range.to, 'yyyy-MM-dd'));

                    setOpenCalender(false);
                    return;
                  }

                  setDraftRange(range);
                }}
                min={2}
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
        {data?.daily.map(
          (item: { day: string; statuses: Record<string, number> }) => (
            <StatisticsCalender item={item} />
          ),
        )}
      </div>

      <div className="flex items-center justify-between px-8 mt-20">
        {/* Left Side */}
        <div className="flex flex-col flex-1">
          <h2 className="text-2xl font-bold text-slate-dark mb-6">
            Tasks by Status
          </h2>

          <div className="flex items-center gap-8">
            {/* Pie Chart */}
            <div className="relative h-64 w-80 shrink-0">
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
                        fill={STATUS_COLORS_Charts[entry.name] ?? '#CBD5E1'}
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
            <div className="flex flex-col gap-4 max-w-50 w-full">
              {chartData.map((item) => (
                <ChartData item={item} total={total} />
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
