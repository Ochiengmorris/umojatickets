import { Skeleton } from "./ui/skeleton";

const EventCardSkeleton = () => {
  return (
    <div className="min-h-[400px] rounded-xl overflow-hidden ">
      <div className="h-48">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="w-full flex items-center gap-2">
            <Skeleton className="grow h-6" />
            <Skeleton className="h-6 w-3/12" />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <Skeleton className="w-7/12 h-5" />
          <Skeleton className="w-6/12 h-5" />
          <Skeleton className="w-5/12 h-5" />
        </div>
      </div>
    </div>
  );
};
export default EventCardSkeleton;
