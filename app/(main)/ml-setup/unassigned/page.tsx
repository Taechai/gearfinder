// import { DocumentIcon } from "@heroicons/react/20/solid";
import { DocumentIcon } from "@/app/icons/myIcons";
import Link from "next/link";
export default function Page() {
  return (
    <div className="col-span-2 row-span-2 flex flex-wrap gap-[10px] h-fit">
      {[
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33,
      ].map((index) => (
        <Link
          href={`/ml-setup/file${index}`}
          key={index}
          className=" hover:bg-error-light/10 rounded-[10px] cursor-pointer p-[10px] transition-all"
        >
          <DocumentIcon className="text-error-dark/80 size-[60px]" />
          <p className="text-center text-md text-error-dark font-semibold">
            File {index}
          </p>
        </Link>
      ))}
    </div>
  );
}
