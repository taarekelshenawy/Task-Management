const getInitials = (name: string = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

export default function Helper({
  el,
}: {
  el: { metadata: { name: string }; email: string };
}) {
  const name = el?.metadata?.name ?? '';
  const initials = getInitials(name);
  return (
    <>
      <div className="flex items-center gap-3">
        {/* avatar */}
        <div className="w-12 h-12 rounded-xl bg-[#0052CC] flex items-center justify-center text-white font-bold">
          {initials}
        </div>

        {/* info */}
        <div className="flex flex-col">
          <h2 className="font-semibold text-gray-900">{name}</h2>
          <p className="text-sm text-gray-500">{el.email}</p>
        </div>
      </div>
    </>
  );
}
