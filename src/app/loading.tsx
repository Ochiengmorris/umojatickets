import Spinner from "@/components/loaders/Spinner";
import { Loader } from "@/components/loaders/SpinnerTwo";

function Loading() {
  return (
    <div className=" absolute top-1/2 right-1/2">
      <Loader />
    </div>
  );
}

export default Loading;
