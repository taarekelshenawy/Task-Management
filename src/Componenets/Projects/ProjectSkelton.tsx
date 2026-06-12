function ProjectSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mt-14 max-sm:grid-cols-1">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white max-w-76 max-h-55 rounded-lg p-6 flex flex-col justify-between shadow-sm min-h-55 animate-pulse"
        >
          <div>
            <div className="h-5 w-3/4 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
          </div>

          <div className="pt-4 flex justify-between">
            <div className="h-3 w-20 bg-gray-200 rounded"></div>
            <div className="h-3 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProjectSkeleton;
