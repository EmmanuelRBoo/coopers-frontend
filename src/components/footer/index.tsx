import Image from 'next/image'

import image from '../../../public'
import { Text } from '@/components'

export default function Footer() {
    return (
        <footer className='relative mt-20 flex flex-col items-center justify-center'>
            <Image
                src={image.footer}
                alt='footer bg'
                className='w-full h-40 m- absolute bottom-0 -z-10'
            />

            <Text size='lg' weight='bold' margin='mb-2'>Need help?</Text>
            <Text size='lg' weight='semibold'>coopers@coopers.pro</Text>
            <Text size='xs' margin='mb-14'>© 2021 Coopers. All rights reserved.</Text>

            <Image
                src={image.footer_detail}
                alt='footer detail'
                className='absolute bottom-0 w-1/3 h-8 z-0'
            />
        </footer>
    )
}