import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { PopoverClose } from "@radix-ui/react-popover"
import { TrashIcon } from "lucide-react"

export function DeletePopconfirm({ onConfirm, title, label, description, confirmText, cancelText }: { onConfirm: () => void, title: string, label?: string, description?: string, confirmText: string, cancelText: string }) {
    return (
        <Popover>
            <PopoverContent
                side="top"
                className="w-auto p-2 flex flex-col gap-2">
                <span className="text-sm">{title}</span>
                <span className="text-sm">{description}</span>
                <div className="flex gap-2 justify-end">
                    <PopoverClose asChild>
                        <button
                            onClick={onConfirm}
                            className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                        >
                            {confirmText}
                        </button>
                    </PopoverClose>
                    <PopoverClose asChild>
                        <button
                            className="px-2 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
                        >
                            {cancelText}
                        </button>
                    </PopoverClose>
                </div>
            </PopoverContent>
            <PopoverTrigger asChild>
                <button className="p-1 text-sm text-gray-500 hover:text-red-600 cursor-pointer">
                    <TrashIcon className="w-4 h-4" /> {label}
                </button>
            </PopoverTrigger>
        </Popover>
    )
}
