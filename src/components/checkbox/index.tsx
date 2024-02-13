'use client'

import Image from 'next/image'

import image from '../../../public'
import { ICheckbox } from '@/interfaces'

export default function Checkbox({ checked, onClick }: ICheckbox) {

    if (checked) {
        return (
            <Image 
                className='w-6 h-6 cursor-pointer'
                onClick={onClick} 
                alt="checkbox" 
                src={image.checkbox} 
            />
        )
    }

    return (
        <div 
            className={`w-6 h-6 bg-transparent border-secondary border rounded-full cursor-pointer`}
            onClick={onClick} 
        >
        </div>
    )
}