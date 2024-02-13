'use client'
import { IButton } from '@/interfaces'

export default function Button({ onClick, size, type, children, radius }: IButton) {
    let btnSize;
    let btnType;

    switch(type) {
        case 'primary': btnType = 'bg-primary'; break;
        case 'black': btnType = 'bg-black'; break;
        default: btnType = 'bg-black'; break;
    }

    switch(size) {
        case 'sm': btnSize = 'w-24 h-8'; break;
        case 'md': btnSize = 'w-[18.75rem] h-16'; break;
        case 'full': btnSize = 'w-full h-[3.25rem]'; break;
        default: btnSize = 'w-[18.75rem] h-16'; break;
    }

    return (
        <button 
            type='button' 
            onClick={onClick}
            className={`bg-${type} ${btnSize} ${radius && 'rounded-lg'}`}
        >
            {children}
        </button>
    )
}