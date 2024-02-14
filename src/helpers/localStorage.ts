'use client'

const get = (key: string, err: any) => {
    const data = window.localStorage.getItem(key)

    if (!data) {
        return err
    }

    return JSON.parse(String(data))
}

const set = ({ key, data }: { key: string, data: any }) => window.localStorage.setItem(key, JSON.stringify(data))

const remove = (key: string) => window.localStorage.removeItem(key)

const localStorage = {
    set,
    get,
    remove
}

export default localStorage