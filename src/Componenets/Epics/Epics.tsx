import { useAppSelector } from "../../Store/hooks";

export default function Epics() {
       const { user } = useAppSelector((state) => state.User);
       console.log(user)
  return (
    <div className="flex">
      <div>Epics</div>
    </div>
  );
}
