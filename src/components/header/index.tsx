'use client'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowDown, ArrowUp } from '@phosphor-icons/react'

import { Button, Text } from '@/components'
import Login from '@/app/login'
import { cookie, localStorage } from '@/helpers'

import images from '../../../public'

export default function Header() {
    const [login, setLogin] = useState(false)
    const [showUserInfo, setShowUserInfo] = useState(false)

    const token = cookie.get('token')
    const user = localStorage.get('user', '')

    const handleUserInfo = () => setShowUserInfo(v => !v)

    const logOut = () => {
        cookie.remove('token')
        localStorage.remove('user')
        window.location.reload()
    }

    const UserInfo = () => (
        <div className='relative h-full'>
            <div className='flex items-center ml-6' onClick={handleUserInfo}>
                <Text color='black' size='xs' pointer>{`Welcome ${user.name}!`}</Text>
                { 
                    showUserInfo
                    ? <ArrowUp size={16} />
                    : <ArrowDown size={16} />
                }
            </div>
            
            {
                showUserInfo && (
                    <div 
                        className='absolute flex items-center justify-start px-4 h-8 top-6 right-0 border border-quaternary max-[410px]:top-10'
                        onClick={logOut}
                    >
                        <Text color='black' size='sm' pointer>Log out</Text>
                    </div>
                )
            }
        </div>
    ) 

    return (
        <header className='flex m-4 justify-between items-center'>
            <Image 
                src={images.logo}
                className='w-56 h-12'
                alt='logo'
            />
            {
                token
                ? <UserInfo />
                : <Button 
                    size='sm' 
                    type='black' 
                    onClick={() => setLogin(true)}
                >
                    <Text>Entrar</Text>
                </Button>
            }

            {login && <Login  onClose={() => { setLogin(false) }} />}
        </header>
    )
}