'use client'

import { useRef } from 'react'

import { Text, Button } from '@/components'
import { api } from '@/api'
import { localStorage, cookie } from '@/helpers'
import image from '../../public'
import Image from 'next/image'

export default function Login({ onClose }: { onClose: () => void }) {
    const name = useRef<HTMLInputElement>(null)
    const password = useRef<HTMLInputElement>(null)

    const login = () => {
        const data = {
            password: password.current?.value,
            name: name.current?.value
        }

        api
            .post('/auth/login', data)
            .then(res => {
                onClose()
                cookie.set({ key: 'token', value: res.data.token })
                localStorage.set({ key: 'user', data: { id: res.data.id, name: res.data.name } }) 
            })
            .catch(err => alert(err.response.data))

        
    }

    return (
        <div className='w-screen flex items-center justify-center min-h-screen bg-black bg-opacity-60 fixed top-o left-0 bottom-0 z-20 overflow-hidden' onClick={onClose}>
            <form className='bg-white w-full mx-8 flex flex-col items-center max-w-2xl p-4' onClick={e =>  e.stopPropagation()}>
                <div 
                    className='w-full text-end'
                    onClick={onClose}
                >
                    <Text color='black' weight='bold' size='xs' pointer>close</Text>
                </div>
                
                <div className='flex items-center max-sm:justify-center w-full'>
                    <Image 
                        src={image.login_image}
                        alt='login image'
                        className='w-40 mr-5 max-sm:hidden'
                    />
                    <div className='text-start max-sm:text-center'>
                        <Text size='5xl' weight='bold' color='black'>Sig in</Text>
                        <Text size='3xl' color='primary'>to access your list</Text>
                    </div>
                </div>

                <div className='flex flex-col w-full items-center max-w-72'>
                    <label htmlFor='user' className='mt-3 w-full'>
                        <Text color='black'>User:</Text>
                        <input 
                            type='text'
                            ref={name} 
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
                            ref={password} 
                            name='password' 
                            id='password'
                            defaultValue={''}
                            className='w-full pl-2 h-12 border border-quaternary rounded-md focus:outline-none mt-1'
                        />
                    </label>

                    <div className='m-6 w-full'>
                        <Button size='full' type='primary' onClick={login} radius>
                            <Text>Sign in</Text>
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}