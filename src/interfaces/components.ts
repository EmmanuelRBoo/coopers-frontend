export interface IText {
    children: string
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
    color?: string
    weight?: 'normal' | 'semibold' | 'bold'
    font?: 'primary' | 'secondary'
    margin?: string
    pointer?: boolean
}

export interface IButton {
    onClick: () => void
    size?: 'sm' | 'md' | 'full'
    type?: 'primary' | 'black'
    children: React.ReactNode[] | React.ReactNode
    radius?: boolean
}

export interface ICard {
    id: string
    title: string
    order?: number
    color: 'primary' | 'secondary'
    onDelete: (id: string) => void
    onUpdateTitle: ({ id, title }: { id: string, title: string}) => void 
    onUpdateOrder: () => void
}

export interface ICheckbox {
    checked: boolean
    onClick: () => void
}