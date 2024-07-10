import { FaPowerOff } from "react-icons/fa6";
import { useRouter } from "next/navigation";


interface ProfileBoxContainerProps {
  isHovered: boolean;
}

export default function ProfileBoxContainer({
  isHovered,
}: ProfileBoxContainerProps) {
  const router = useRouter();

  return (
    <div
      className={`
        bg-white 
        relative 
        right-0  
        mt-4 
        flex
        justify-end 
        items-end 
        w-40 h-20 
        
        p-4 
        rounded-lg 
        border-orange
        border-solid
        border-2
        before:content-[''] 
        before:absolute 
        before:-top-2
        before:left-3/4 
        before:w-0 before:h-0
        before:border-l-8 
        before:border-l-transparent 
        before:border-r-8 
        before:border-r-transparent 
        before:border-b-8 
        before:border-b-orange 
        before:border-solid
      ${isHovered ? `transition durantion-100 delay-200 opacity-100` : `opacity-0`}
      `}
    >
      <section className="flex justify-end gap-2 items-center">
        <h2
          className="text-orange font-bold cursor-pointer"
          onClick={() => {
            localStorage.removeItem("github-token");
            router.push("/");
          }}
        >
          Log out
        </h2>
        <FaPowerOff size={16} fill="#eb841a" className="cursor-pointer" />
      </section>
    </div>
  );
}
