'use client'
import Image from 'next/image'
import { useState } from 'react'

import { Button, Text } from '@/components'
import Login from '@/app/login'

import images from '../../../public'

export default function Header() {
    const [login, setLogin] = useState(false)

    return (
        <header className='flex m-4 justify-between items-center'>
            <Image 
                src={images.logo}
                className='w-56 h-12'
                alt='logo'
            />
            <Button 
                size='sm' 
                type='black' 
                onClick={() => setLogin(true)}
            >
                <Text>Entrar</Text>
            </Button>

            {login && <Login  onClose={() => { setLogin(false) }} />}
        </header>
    )
}