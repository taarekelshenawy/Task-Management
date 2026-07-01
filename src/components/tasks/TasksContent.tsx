import TasksHeader from './TasksHeader';
import { useLocation } from 'react-router-dom';
import ListView from './ListView';
import BreadCrumb from '../../shared/BreadCrumb';
import { useState } from 'react';
import TasksMobile from './TasksMobile';
import BoardView from './BoardView';
import { useEffect } from 'react';


export default function TasksContent() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const view = searchParams.get('view');
  const [searchValue, setSearchValue] = useState('');
  const [isMobile,setIsMobile]=useState(false);
 
  useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 640);
  };

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);
  return (
    <div className="p-6">
      <BreadCrumb
        items={[
          { label: 'Projects', href: '/project' },
          { label: 'PROJECT ALPHA', href: '/project' },
          { label: 'TASKS' },
        ]}
      />
      {/* Header */}
      <TasksHeader setSearchValue={setSearchValue} />

      {/* Board */}
      {view === 'board' ? (
        <BoardView searchValue={searchValue}/>
      ) : (
        <ListView searchValue={searchValue} />
      )}
      {isMobile ? <TasksMobile searchValue={searchValue} /> :""}
      
    </div>
  );
}
