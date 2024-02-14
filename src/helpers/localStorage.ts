'use client'

const get = (key: string, err: any) => {
    const data =  typeof window != 'undefined' && window.localStorage.getItem(key)

    if (!data) {
        return err
    }

    return JSON.parse(String(data))
}

const set = ({ key, data }: { key: string, data: any }) =>   typeof window != 'undefined' && window.localStorage.setItem(key, JSON.stringify(data))

const remove = (key: string) =>  typeof window != 'undefined' && window.localStorage.removeItem(key)

const localStorage = {
    set,
    get,
    remove
}

export default localStorage