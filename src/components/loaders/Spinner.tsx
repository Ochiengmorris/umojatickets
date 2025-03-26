import { LoaderIcon } from "lucide-react";

function Spinner() {
  return (
    <div className="flex items-center justify-center ">
      <LoaderIcon className="w-6 h-6 animate-spin" />
    </div>
  );
}

export default Spinner;
