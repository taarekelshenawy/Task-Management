import SignUpIcon from '../../assets/Icon.svg';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <div className="flex items-center  gap-2 font-bold px-10 py-8 ">
      <img src={SignUpIcon} />
      <h1 className="text-slate-dark text-xl">
        <Link to="/"> TASKLY</Link>
      </h1>
    </div>
  );
}
