'use client'

import { useRef } from 'react'

import { Text, Button } from '@/components'
import { api } from '@/api'

export default function Login({ onClose }: { onClose: () => void }) {
    const userRef = useRef<HTMLInputElement>(null)
    const passRef = useRef<HTMLInputElement>(null)

    return (
        <div className='w-screen flex items-center justify-center min-h-screen bg-black bg-opacity-60 fixed top-o left-0 bottom-0 z-20 overflow-hidden'>
            <form className='bg-white w-full mx-8 flex flex-col items-center p-2'>
                <div 
                    className='w-full text-end'
                    onClick={onClose}
                >
                    <Text color='black' weight='bold' size='xs' pointer>close</Text>
                </div>
                
                <Text size='5xl' weight='bold' color='black'>Sig in</Text>
                <Text size='2xl' color='primary'>to access your list</Text>

                <div className='flex flex-col w-full items-center px-12'>
                    <label htmlFor='user' className='mt-3 w-full'>
                        <Text color='black'>User:</Text>
                        <input 
                            type='text' 
                            name='user' 
                            id='user'
                            defaultValue={''}
                            className='w-full pl-2 h-12 border border-quaternary rounded-md focus:outline-none mt-1'
                        />
                    </label>

                    <label htmlFor='password' className='mt-4 w-full'>
                        <Text color='black'>Password:</Text>
                        <input 
                            type='password' 
                            name='password' 
                            id='password'
                            defaultValue={''}
                            className='w-full pl-2 h-12 border border-quaternary rounded-md focus:outline-none mt-1'
                        />
                    </label>

                    <div className='m-6 w-full'>
                        <Button size='full' type='primary' onClick={() => alert('Api indisponível')} radius>
                            <Text>Sign in</Text>
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}