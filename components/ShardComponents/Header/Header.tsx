import { ArrowLeft } from "lucide-react";



export interface HeaderProps {
    title: string;
    subtitle?: string;
    addButtonText?: string;
    isIcon?: boolean;
    onAddButtonClick?: () => void;
    editButtonText?: string;
    onEditButtonClick?: () => void;

}



export default function Header({ params }: { params: HeaderProps }) {
    return (
        <div className="flex flex-col gap-3" >
            <div className="flex text-myColor dark:text-myDarkColor flex-row items-center" >
                {params.isIcon && <span className="mr-2">
                    <ArrowLeft className="h-6 w-6 cursor-pointer" />
                </span>}
                <h1 className="text-2xl font-bold">{params.title}</h1>
            </div>

            {params.subtitle && <p className="text-xs md:text-xl text-gray-500 font-normal"> {params.subtitle} </p>}

        </div>
    )
}
