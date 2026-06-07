import SignUpIcon from '../../assets/Icon.svg';

export default function Header() {
  return (
  <div className="flex items-center  gap-2 font-bold px-10 py-8 ">
        <img src={SignUpIcon} />
        <h1 className="text-slate-dark text-xl">TASKLY</h1>
 </div>
  )
}
