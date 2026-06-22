export default function DetailsModalSkeleton() {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 rounded" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
          </div>
          <div className="h-5 w-2/3 bg-gray-200 rounded" />
        </div>
        <div className="w-5 h-5 bg-gray-200 rounded" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
      </div>

      <div className="flex justify-between gap-3 max-sm:flex-wrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="h-3 w-16 bg-gray-200 rounded" />
            <div className="flex items-center gap-1">
              <div className="w-7 h-7 rounded-full bg-gray-200 shrink-0" />
              <div className="h-3 w-16 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <div className="h-5 w-16 bg-gray-200 rounded" />
          <div className="h-5 w-20 bg-gray-200 rounded" />
        </div>
        <div className="min-h-64 bg-[#F1F3FF] p-5 flex flex-col justify-center w-full gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex justify-between w-full max-sm:flex-wrap gap-4"
            >
              <div className="flex gap-2 items-center w-full">
                <div className="w-8 h-8 bg-gray-200 rounded shrink-0" />
                <div className="flex flex-col gap-2 w-full">
                  <div className="h-4 w-1/3 bg-gray-200 rounded" />
                  <div className="flex gap-1 items-center">
                    <div className="w-7 h-7 rounded-full bg-gray-200" />
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-3 w-12 bg-gray-200 rounded" />
                <div className="h-3 w-16 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
