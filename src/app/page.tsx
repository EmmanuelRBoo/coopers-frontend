'use client'
import { useRef, useState, useEffect, useId } from 'react'
import Image from 'next/image'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Check, X } from '@phosphor-icons/react'
import { v4 } from 'uuid'

import { Text, Button, Card, Footer } from '@/components'
import { ITasks } from '@/interfaces'
import { cookie, localStorage } from '@/helpers'
import { api } from '@/api'

import image from '../../public'

export default function Home() {
    const scrollRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const inputNewRef = useRef<HTMLInputElement>(null)

    const token = cookie.get('token')
    const user = localStorage.get('user', null)
    const authorId = user ? user.id : 'guest'

    const [showInput, setShowInput] = useState<{ id: string, title: string } | null>(null)
    const [done, setDone] = useState<Array<ITasks>>([])
    const [undone, setUndone] = useState<Array<ITasks>>([])

    const handleShowInput = (data: { id: string, title: string }) => setShowInput(data) 

    const handleScroll = () => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleChangeTitle = ({ id, index, done }: { id: string, index: number, done: boolean }) => {
        if (token) {
            api.put('/task', { authorId, done, id, title: String(inputRef.current?.value) })
        }

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
            result.destination.droppableId == 'done' ? done : undone,
            result.source.index,
            result.destination.index
        )

        const data = items.map(({ id }: { id: string }, index: number ) => {
            return { id, order: index + 1 }
        })

        if (token) {
            api.put('/task/order', { authorId, data, done: result.destination.droppableId == 'done' })
        } else {
            localStorage.set({ key: result.destination , data })
        }

        if (result.destination.droppableId == 'done') { 
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
        
        if (token) {    
            api
                .post('/task', { title, order, authorId })
                .then(res => setUndone(prev => [...prev, { title, order, authorId, id: res.data.id }]))
        } else {
            const tasks = localStorage.get('taskUndone', [])
            localStorage.set({key:'taskUndone', data:  [...tasks, { title, order, authorId, id: String(v4()) }]})

            setUndone(prev => [...prev, { title, order, authorId, id: String(v4()) }])
        }
    }

    const handleChangeStatus = ({ id, done, title, order }: { id: string, done: boolean, title: string, order: number }) => {
        if (token) {
            api.put('/task/status', { authorId, done, id, title, order })
        } 

        const data = { id, title, order, authorId }
            
        if (done) {
            setDone(prev => prev.filter(({ id }) => id != data.id))
            setUndone(prev => {
                localStorage.set({ key: 'taskUndone', data: [...prev, data] })
                return [...prev, data]
            })
        } else {
            setUndone(prev => prev.filter(({ id }) => id != data.id))
            setDone(prev => {
                localStorage.set({ key: 'taskDone', data: [...prev, data] })
                return [...prev, data]
            })
        }
    } 

    const deleteTask = ({ id, done }: { id: string, done: boolean }) => {
        const data = { id, authorId, done }

        if (token) {    
            api.delete('/task', { data })
        } 

        if (done) {
            setDone(prev => {
                if (!token) {
                    localStorage.set({ key: 'taskDone', data: [...prev.filter(({ id }) => id != data.id)] })
                }
                return [...prev.filter(({ id }) => id != data.id)]
            })
        } else {
            setUndone(prev => {
                if (!token) {
                    localStorage.set({ key: 'taskUndone', data: [...prev.filter(({ id }) => id != data.id)] })
                }
                return [...prev.filter(({ id }) => id != data.id)]
            })
        } 
    }

    const deleteAllTask = (done: boolean) => {
        const data = { authorId, done }

        if (token) {
            api.delete('/task/all', { data })
        } 

        if (done) {
            if (!token) {
                localStorage.set({ key: 'taskDone', data: [] })
            }
            setDone([])
        } else {
            if (!token) {
                localStorage.set({ key: 'taskUndone', data: [] })
            }
            setUndone([])
        }
    }

    useEffect(() => {
        if(token) {
            getTask()
        } else {
            setDone(localStorage.get('taskDone', []))
            setUndone(localStorage.get('taskUndone', []))
        }
    },[token])
 
    return (
		<main>
            <section className='flex flex-col'>
                <div className='mb-4'>
                    <div className='flex justify-between items-center max-lg:justify-center'>
                        <div className='text-start max-lg:text-center'>
                            <Text 
                                weight='bold'
                                color='black'
                                size='6xl'
                            >
                                Organize
                            </Text>
                            <Text
                                margin='ml-2 max-md:ml-0'
                                weight='normal'
                                color='primary'
                                size='4xl'
                            >
                                your daily jobs
                            </Text>
                        

                            <Text 
                                margin='my-8 max-md:my-20'
                                size='xl'
                                color='black'
                                weight='bold'
                            >
                                The only way to get things done
                            </Text>

                            <Button radius type='primary' size='md' onClick={handleScroll}>
                                <Text>Go to To-do list</Text>
                            </Button>
                        </div>

                        <Image
                            src={image.room}
                            alt='room image'
                            className='w-[48rem] h-[48rem] max-lg:hidden'
                        />
                    </div>

                    <Image
                        alt='icon scroll'
                        src={image.icon_scroll}
                        className='pt-12 m-auto'
                    />

                    <div className='flex flex-col relative items-center justify-center w-full h-56 px-4'>
                        <Image 
                            src={image.to_do_bg} 
                            alt='bg-to-do'
                            className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10'
                        />
                        <div className='mb-4' ref={scrollRef}>
                            <Text size='4xl'>To-do List</Text>
                            <div className='bg-primary h-1 w-full'></div>
                        </div>
                        <Text>Drag and drop to set your main priorities, check when done and create what´s new.</Text>
                    </div>
                </div>

                <div className='m-4 flex flex-wrap gap-16 justify-center'>   
                    <div className='text-center max-w-96 w-full h-fit mb-10 shadow-xl pb-2'>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <div className='w-full h-6 bg-secondary'></div>

                            <Text size='3xl' weight='bold' color='black'>To-do</Text>
                            <Text color='black' size='xl'>Take a breath.</Text>
                            <Text color='black' size='xl'>Start doing.</Text>

                            <Droppable droppableId='undone' >
                                {(provided, snapshot) => (
                                    <ul
                                        ref={provided.innerRef}
                                        {...provided.droppableProps} 
                                        className='m-2'
                                    >
                                        <div className='mb-4'>
                                            {
                                                undone.map(({ id, order, title }, index) => {
                                                    if (showInput && showInput?.id == id) {
                                                        return (
                                                            <div key={id} className='flex items-center justify-start'>
                                                                <div 
                                                                    className='min-h-6 min-w-6 rounded-full border border-secondary mr-4'
                                                                >
                                                                </div>
                                                                
                                                                <input 
                                                                    type='text' 
                                                                    ref={inputRef}
                                                                    defaultValue={showInput.title}
                                                                    className='focus:outline-none text-secondary border-b border-secondary'
                                                                    autoFocus={true}
                                                                />

                                                                <Check 
                                                                    className='text-primary w-7 h-7 border rounded border-primary cursor-pointer mx-4' 
                                                                    onClick={() => handleChangeTitle({ id, index, done: false })} 
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
                                                                    <div 
                                                                        className='min-h-6 min-w-6 rounded-full border border-secondary mr-4'
                                                                        onClick={() => handleChangeStatus({ id, done: false, order, title })}
                                                                    >
                                                                    </div>
                                                                    
                                                                    <Card 
                                                                        id={id}
                                                                        title={title}
                                                                        color='secondary'
                                                                        onDelete={() => deleteTask({ id, done: false })}
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
                                        </div>
                                        <div className='flex items-end justify-start mt-4'>
                                            <div className='min-h-6 min-w-6 rounded-full border border-secondary mr-4'></div>
                                                            
                                            <input 
                                                type='text' 
                                                ref={inputNewRef}
                                                placeholder='Add an item...'
                                                className='focus:outline-none text-secondary border-b border-secondary w-full'
                                                autoFocus={true}
                                            />

                                            <Check 
                                                className='text-primary min-w-7 min-h-7 border rounded border-primary cursor-pointer mx-4' 
                                                onClick={() => {
                                                    createTask({ order: undone.length + 1, title: String(inputNewRef.current?.value) })
                                                    if (inputNewRef.current) {
                                                        inputNewRef.current.value = ''
                                                    }
                                                }} 
                                            />
                                        </div>
                                    </ul>
                                )}
                            </Droppable>

                            {
                                undone.length != 0 && (
                                    <div className='mt-6 mx-4'>
                                        <Button 
                                            onClick={() => deleteAllTask(false)}
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

                    <div className='text-center max-w-96 w-full h-fit mb-10 shadow-xl pb-2'>
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

                            <Droppable droppableId='done' >
                                {(provided, snapshot) => (
                                    <ul
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className='my-4 mb-4 px-2'
                                    >
                                        {provided.placeholder}
                                        {
                                            done.length == 0 
                                            ? <Text color='black' size='lg'>You don&#39;t have tasks done</Text>
                                            : done.map(({ id, order, title }, index) => {
                                                if (showInput?.id == id) {
                                                    return (
                                                        <div key={id} className='flex items-center justify-start'>
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
                                                                onClick={() => handleChangeTitle({ id, index, done: true })} 
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
                                                                    onClick={() => handleChangeStatus({ id, done: true, order, title })}
                                                                />
                                                                
                                                                <Card 
                                                                    id={id}
                                                                    title={title}
                                                                    color='secondary'
                                                                    onDelete={() => deleteTask({ id, done: true })}
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
                                    <div className='mt-6 mx-4'>
                                        <Button 
                                            onClick={() => deleteAllTask(true)}
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

                <form className='flex flex-col justify-self-center w-full m-auto items-center mt-20 max-w-2xl max-sm:px-2 shadow-lg pb-2'>
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
