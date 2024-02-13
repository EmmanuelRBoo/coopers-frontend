import { IText } from '@/interfaces'

export default function Text({ size = 'md', children, color, font = 'primary', weight= 'normal', margin, pointer }: IText) {
    let textFont;
    let textWeight;
    let textColor;

    switch(color) {
        case 'primary': textColor = 'text-primary'; break;
        case 'secondary': textColor = 'text-[]'; break;
        case 'black': textColor = 'text-black'; break;
        case 'white': textColor = 'text-white'; break;
        default: textColor = 'text-white'; break;
    }

    switch(weight) {
        case 'bold': textWeight = 'font-bold'; break;
        case 'semibold': textWeight = 'font-semibold'; break;
        case 'normal': textWeight = 'font-normal'; break;
        default: textWeight = 'font-normal'; break;
    }

    const classname = `${textColor} ${textFont} ${textWeight} ${margin} ${pointer && 'cursor-pointer'}`

    switch(size) {
        case 'xs': return <small className={`${classname} text-xs`}>{children}</small>
        case 'sm': return <small className={`${classname} text-sm`}>{children}</small>
        case 'md': return <p className={`${classname}`}>{children}</p>
        case 'lg': return <p className={`${classname} text-lg`}>{children}</p>
        case 'xl': return <h5 className={`${classname} text-xl`}>{children}</h5>
        case '2xl': return <h5 className={`${classname} text-2xl`}>{children}</h5>
        case '3xl': return <h4 className={`${classname} text-[2.5rem]`}>{children}</h4>
        case '4xl': return <h3 className={`${classname} text-5xl`}>{children}</h3>
        case '5xl': return <h2 className={`${classname} text-[3.70rem]`}>{children}</h2>
        case '6xl': return <h1 className={`${classname} text-[5rem]`}>{children}</h1>
        default: <p className={`${classname}`}>{children}</p>
    }
}