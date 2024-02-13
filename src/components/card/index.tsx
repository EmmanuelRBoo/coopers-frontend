'use client'
import { ICard } from '@/interfaces'
import { Text } from '@/components'

export default function Card({ id, title, order, color, onDelete, onUpdateOrder, onUpdateTitle }: ICard) {
    return (
        <div className='flex justify-between items-center w-full'>
            <div onClick={() => onUpdateTitle({ id, title })}>
                <Text color='black'>{title}</Text>
            </div>

            <div onClick={() => onDelete(id)}>
                <Text color='black' size='xs' pointer>delete</Text>
            </div>
        </div>
    )
}