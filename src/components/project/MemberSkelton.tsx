export const MemberSkeleton = () => {
  return (
    <tr className="animate-pulse">
      {/* MEMBER */}
      <td className="p-4">
        <div className="flex items-center gap-3">
          {/* avatar */}
          <div className="w-12 h-12 rounded-xl bg-gray-300" />

          {/* name + email */}
          <div className="flex flex-col gap-2">
            <div className="h-4 w-24 bg-gray-300 rounded" />
            <div className="h-3 w-32 bg-gray-200 rounded" />
          </div>
        </div>
      </td>

      {/* ROLE */}
      <td className="p-4">
        <div className="h-6 w-20 bg-gray-300 rounded-full" />
      </td>

      {/* ACTIONS */}
      <td className="p-4">
        <div className="h-8 w-16 bg-gray-300 rounded-md" />
      </td>
    </tr>
  );
};
