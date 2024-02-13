import type { Metadata } from 'next'

import { ILayout } from '@/interfaces'
import { Header } from '@/components'

import './globals.css'

export const metadata: Metadata = {
    title: 'Coopers',
}

export default function RootLayout({ children }: ILayout) {
    return (
        <html>
          	<body>
				<Header />
            	{children}
            </body>
        </html>
    )
}
