import { Galindo } from "next/font/google";
import Link from "next/link";

const galindo = Galindo({ subsets: ["latin"], weight: "400" });

export default function CreateProjectPage() {
  return (
    <div className="flex flex-col justify-center items-center size-full gap-[10px] cursor-pointer">
      <Link
        href={"/create-project"}
        className={`${galindo.className} text-[200px] text-dark h-[200px]`}
      >
        +
      </Link>
      <p className="text-[20px] text-dark font-light">
        Create your first project!
      </p>
    </div>
  );
}
