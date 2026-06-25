export default function SearchEpics({
  setSearch,
}: {
  setSearch: (value: string) => void;
}) {
  return (
    <div>
      <input
        type="text"
        placeholder="Search epics..."
        className="w-full
        rounded bg-surface-high h-10 px-4"
        onChange={(e) => setSearch(e.target.value)}
      ></input>
    </div>
  );
}
