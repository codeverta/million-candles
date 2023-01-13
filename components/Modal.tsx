import React from "react";

interface Props {
  children: React.ReactNode
}

export default function Modal({children}: Props) {
    return (
        <div tabIndex={-1} aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
            <div className="relative w-full h-full max-w-2xl md:h-auto">
                {/* <!-- Modal content --> */}
                { children }
            </div>
        </div>
    )
}