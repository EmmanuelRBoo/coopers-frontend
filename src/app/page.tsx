'use client'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Check, X } from '@phosphor-icons/react'

import { Text, Button, Card, Footer } from '@/components'
import { ITaks } from '@/interfaces'
import { api } from '@/api'

import image from '../../public'

export default function Home() {
    const scrollRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const inputNewRef = useRef<HTMLInputElement>(null)

    const [showInput, setShowInput] = useState<{ id: string, title: string } | null>(null)
    const [done, setDone] = useState<Array<ITaks> | []>([])
    const [undone, setUndone] = useState<Array<ITaks> | []>([])

    const handleShowInput = (data: { id: string, title: string }) => setShowInput(data) 

    const handleScroll = () => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleChangeTitle = ({ id, index }: { id: string, index: number }) => {
        setUndone(prev => {
            let tasks = prev.filter(({ id }) => id != showInput?.id)

            const newTask = {
                id,
                order: index,
                title: String(inputRef.current?.value)
            }

            tasks.splice(index, 0, newTask)

            return [...tasks]
        })

        setShowInput(null)
    }

    const reorder = (list: any, startIndex: any, endIndex: any) => {
        const result = Array.from(list)
        const [removed] = result.splice(startIndex, 1)
        result.splice(endIndex, 0, removed)
      
        return result
    }

    const onDragEnd = (result: any) => {
        if (!result.destination) {
            return
        }
      
        const items: any = reorder(
            result.destination == 'done' ? done : undone,
            result.source.index,
            result.destination.index
        )
        
        // const itemsOrdenated = items.forEach((item: any, index: any) => console.log({
        //     title: item.title,
        //     order: index,
        //     id: item.id
        // }))

        // if (!token) {
        //     localStorage.set({ key: result.destination , data: itemsOrdenated })
        // }


        if (result.destination == 'done') { 
            setDone(items)
        } else {
            setUndone(items)
        }
    }

    const getTask = () => {
        const task = api.get('/task')

        task.then(({ data }) => {
            setDone(data.data.done)
            setUndone(data.data.toDo)
        })
    } 

    const createTask = ({ title, order }: { title: string, order: number }) => {
        api.post('/task', { title, order })
    }

    useEffect(() => {
        getTask()
    },[])

    return (
		<main>
            <section className='flex flex-col'>
                <div className='text-center mb-4'>
                    <Text 
                        weight='bold'
                        color='black'
                        size='6xl'
                    >
                        Organize
                    </Text>
                    <Text 
                        weight='normal'
                        color='primary'
                        size='4xl'
                    >
                        your daily jobs
                    </Text>
                

                    <Text 
                        margin='my-20'
                        size='xl'
                        color='black'
                        weight='bold'
                    >
                        The only way to get things done
                    </Text>

                    <Button radius type='primary' size='md' onClick={handleScroll}>
                        <Text>Go to To-do list</Text>
                    </Button>

                    <Image
                        alt='icon scroll'
                        src={image.icon_scroll}
                        className='pt-12 m-auto'
                    />

                    <div className='flex flex-col relative items-center justify-center w-full h-56'>
                        <Image 
                            src={image.to_do_bg} 
                            alt='bg-to-do'
                            className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10'
                        />
                        <div className='mb-4'>
                            <Text size='4xl'>To-do List</Text>
                            <div className='bg-primary h-1 w-full'></div>
                        </div>
                        <Text>Drag and drop to set your main priorities, check when done and create what´s new.</Text>
                    </div>
                </div>

                <div className='m-4' ref={scrollRef}>   
                    <div className='text-center max-w-96 w-full mb-10 shadow-xl pb-2'>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <div className='w-full h-6 bg-secondary'></div>

                            <Text size='3xl' weight='bold' color='black'>To-do</Text>
                            <Text color='black' size='xl'>Take a breath.</Text>
                            <Text color='black' size='xl'>Start doing.</Text>

                            <Droppable droppableId='undone'>
                                {(provided, snapshot) => (
                                    <ul
                                        {...provided.droppableProps} 
                                        ref={provided.innerRef}
                                        className='m-2'
                                    >
                                        {
                                            undone.map(({ id, order, title }, index) => {
                                                if (showInput?.id == id) {
                                                    return (
                                                        <div key={id} className='flex items-center justify-start'>
                                                            <div className='min-h-6 min-w-6 rounded-full border border-secondary mr-4'></div>
                                                            
                                                            <input 
                                                                type='text' 
                                                                ref={inputRef}
                                                                defaultValue={showInput.title}
                                                                className='focus:outline-none text-secondary border-b border-secondary'
                                                                autoFocus={true}
                                                            />

                                                            <Check 
                                                                className='text-primary w-7 h-7 border rounded border-primary cursor-pointer mx-4' 
                                                                onClick={() => handleChangeTitle({ id, index })} 
                                                            />

                                                            <X 
                                                                className='text-secondary w-7 h-7 border rounded border-secondary cursor-pointer ' 
                                                                onClick={() => setShowInput(null)}
                                                            />
                                                        </div>
                                                    )
                                                }

                                                return (
                                                    <Draggable key={id} draggableId={id} index={index}>
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef} 
                                                                {...provided.draggableProps} 
                                                                {...provided.dragHandleProps}
                                                                className='flex items-center w-full my-2'
                                                            >
                                                                <div className='min-h-6 min-w-6 rounded-full border border-secondary mr-4'></div>
                                                                
                                                                <Card 
                                                                    id={id}
                                                                    title={title}
                                                                    color='secondary'
                                                                    onDelete={() => {}}
                                                                    onUpdateOrder={() => {}}
                                                                    onUpdateTitle={handleShowInput}
                                                                    order={order}
                                                                    key={id}
                                                                />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                )
                                            })
                                        }
                                        <div className='flex items-center justify-start'>
                                            <div className='min-h-6 min-w-6 rounded-full border border-secondary mr-4'></div>
                                                            
                                            <input 
                                                type='text' 
                                                ref={inputNewRef}
                                                placeholder='Add an item...'
                                                className='focus:outline-none text-secondary border-b border-secondary'
                                                autoFocus={true}
                                            />

                                            <Check 
                                                className='text-primary w-7 h-7 border rounded border-primary cursor-pointer mx-4' 
                                                onClick={() => createTask({ order: undone.length + 1, title: String(inputNewRef.current?.value) })} 
                                            />
                                        </div>
                                    </ul>
                                )}
                            </Droppable>

                            {
                                undone.length != 0 && (
                                    <div className='mt-6'>
                                        <Button 
                                            onClick={() => {}}
                                            type='black'
                                            size='full'
                                            radius
                                        >
                                            <Text size='lg'>Erase all</Text>
                                        </Button>
                                    </div>
                                )
                            }
                        </DragDropContext>
                    </div>

                    <div className='text-center max-w-96 w-full shadow-xl pb-2'>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <div className='w-full h-6 bg-primary'></div>
                            <Text size='3xl' weight='bold' color='black'>Done</Text>
                            
                            {
                                done.length != 0 && (
                                    <>
                                        <Text color='black' size='xl'>Congratulations!</Text>
                                        <Text color='black' weight='bold' size='xl'>{`You have done ${String(done.length)} tasks`}</Text>
                                    </>
                                )
                            }

                            <Droppable droppableId='done'>
                                {(provided, snapshot) => (
                                    <ul
                                        {...provided.droppableProps} 
                                        ref={provided.innerRef}
                                        className='my-4s'
                                    >
                                        {
                                            done.length == 0 
                                            ? <Text color='black' size='lg'>You don&#39;t have tasks done</Text>
                                            : done.map(({ id, order, title }, index) => {
                                                if (showInput?.id == id) {
                                                    return (
                                                        <div key={id} className=' flex items-center justify-start'>
                                                            <Image
                                                                className='min-h-6 min-w-6 rounded-full mr-4'
                                                                src={image.checkbox}
                                                                alt='checkbox'
                                                            />
                                                            
                                                            <input 
                                                                type='text' 
                                                                ref={inputRef}
                                                                defaultValue={showInput.title}
                                                                className='focus:outline-none text-secondary border-b border-secondary'
                                                                autoFocus={true}
                                                            />

                                                            <Check 
                                                                className='text-primary w-7 h-7 border rounded border-primary cursor-pointer mx-4' 
                                                                onClick={() => handleChangeTitle({ id, index })} 
                                                            />

                                                            <X 
                                                                className='text-secondary w-7 h-7 border rounded border-secondary cursor-pointer' 
                                                                onClick={() => setShowInput(null)}
                                                            />
                                                        </div>
                                                    )
                                                }

                                                return (
                                                    <Draggable key={id} draggableId={id} index={index}>
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef} 
                                                                {...provided.draggableProps} 
                                                                {...provided.dragHandleProps}
                                                                className='flex items-center w-full my-2'
                                                            >
                                                                <Image
                                                                    className='min-h-6 min-w-6 rounded-full mr-4'
                                                                    src={image.checkbox}
                                                                    alt='checkbox'
                                                                />
                                                                
                                                                <Card 
                                                                    id={id}
                                                                    title={title}
                                                                    color='secondary'
                                                                    onDelete={() => {}}
                                                                    onUpdateOrder={() => {}}
                                                                    onUpdateTitle={handleShowInput}
                                                                    order={order}
                                                                    key={id}
                                                                />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                )
                                            })
                                        }
                                    </ul>
                                )}
                            </Droppable>

                            {
                                done.length != 0 && (
                                    <div className='mt-6'>
                                        <Button 
                                            onClick={() => {}}
                                            type='black'
                                            size='full'
                                            radius
                                        >
                                            <Text size='lg'>Erase all</Text>
                                        </Button>
                                    </div>
                                )
                            }
                        </DragDropContext>
                    </div>
                </div>

                <form className='flex flex-col items-center mt-20 px-2 shadow-lg pb-2'>
                    <div className='bg-primary w-1/3 h-5'></div>

                    <div className='mt-6 w-full flex items-center my-4'>
                        <Image
                            src={image.mail_icon}
                            alt='mail image'
                            className='w-16 h-16 bg-primary p-4 rounded-md'
                        />

                        <div className='ml-2'>
                            <Text color='black' size='xl'>GET IN</Text>
                            <Text color='black' size='xl' weight='bold'>TOUCH</Text>
                        </div>
                    </div>

                    <label htmlFor="name" className='w-full'>
                        <Text color='black'>Name</Text>
                        <input 
                            type='text' 
                            name='name'
                            placeholder='type your name here...'
                            id='name'
                            className='w-full h-12 border border-tertiary rounded-md focus:outline-none pl-2 mt-1'
                        />
                    </label>

                    <div className='w-full flex flex-col gap-4 my-4'>
                        <label htmlFor="email" className='w-full'>
                            <Text color='black'>Email*</Text>
                            <input 
                                type='email' 
                                name='email'
                                placeholder='example@example.com' 
                                id='email'
                                className='w-full h-12 border border-tertiary rounded-md focus:outline-none pl-2 mt-1'
                            />
                        </label>

                        <label htmlFor="phone" className='w-full'>
                            <Text color='black'>Telephone*</Text>
                            <input 
                                type='tel' 
                                name='phone' 
                                placeholder='( ) ____-____'
                                id='phone'
                                className='w-full h-12 border border-tertiary rounded-md focus:outline-none pl-2 mt-1'
                            />
                        </label>
                    </div>

                    <label htmlFor='message' className='w-full mb-8'>
                        <Text color='black'>Message*</Text>
                        <textarea 
                            rows={5} 
                            placeholder='Type what you want to say to us'
                            className='w-full border border-tertiary rounded-md focus:outline-none pl-2 mt-1'
                        >
                        </textarea>
                    </label>

                    <Button 
                        onClick={() => {}}
                        size='full'
                        type='primary'
                        radius
                    >
                        <Text>SEND NOW</Text>
                    </Button>
                </form>
            </section>

            <Footer />
		</main>
    )
}
