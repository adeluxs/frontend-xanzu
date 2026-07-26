import noDataFound from "@/assets/noDataFound/no-data-found.jpg";
import Image from "next/image";
const NoDataFound = ({ message }) => {
  return (
    <div className="flex flex-col items-center">
      <Image
        src={noDataFound}
        alt="No Data Found"
        className="w-[65px] h-auto"
      />
      <p className="text-[#596A6E] text-base font-medium mt-1">{message}</p>
    </div>
  );
};

export default NoDataFound;
