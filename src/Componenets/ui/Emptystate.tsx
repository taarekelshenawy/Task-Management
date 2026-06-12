import EmptyIcon from '../../assets/EmptyIcon.png';
import { Link } from 'react-router-dom';

type EmptyStateProps = {
  title: string;
  description: string;
  link: string;
  buttonText: string;
};
export default function Emptystate({
  title,
  link,
  description,
  buttonText,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <div className="max-w-75 text-center flex flex-col gap-5">
        <img src={EmptyIcon} className="max-w-[288px]" />
        <h1 className="font-bold text-2xl">{title}</h1>
        <p>{description}</p>

        <div className="flex justify-center">
          <Link to={`${link}`}>
            <button className="flex items-center gap-2 bg-primary w-45 h-11 justify-center text-white">
              <span className="font-bold">{buttonText}</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
