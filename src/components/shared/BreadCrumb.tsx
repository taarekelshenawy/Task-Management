import { Link } from 'react-router-dom';
import arrowIcon from '../../assets/arrowIcon.png';

type ItemsProps = {
  items: {
    label: string;
    href?: string;
  }[];
};

export default function BreadCrumb({ items }: ItemsProps) {
  return (
    <header className="flex items-center gap-2 max-sm:hidden">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={item.label} className="flex items-center gap-2">
            {isLast ? (
              <p className="font-bold text-primary">{item.label}</p>
            ) : (
              <Link
                to={item.href || '#'}
                className="font-bold text-secondary hover:underline"
              >
                {item.label}
              </Link>
            )}

            {!isLast && <img src={arrowIcon} alt="arrow" className="w-2" />}
          </div>
        );
      })}
    </header>
  );
}
