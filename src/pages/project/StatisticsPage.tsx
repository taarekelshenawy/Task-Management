import Sidebar from '../../components/sidebar/leftSidebar';
import Statictics from '../../components/statictics/Statistics';
export default function StatisticsPage() {
  return (
    <div className="flex overflow-hidden">
      <Sidebar />
      <Statictics />
    </div>
  );
}
