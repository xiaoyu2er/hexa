
"use client";

import { FC } from "react";

interface DividerProps {
    children?: React.ReactNode
}
export const Divider: FC<DividerProps> = ({children}) => {
    return <div className="my-2 flex items-center">
        <div className="flex-grow border-t border-muted" />
        <div className="mx-2 text-muted-foreground">{children}</div>
        <div className="flex-grow border-t border-muted" />
    </div>
}