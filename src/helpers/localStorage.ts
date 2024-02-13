'use client'

const get = (key: string) => {
    const data = window.localStorage.getItem(key)

    if (!data) {
        return
    }

    return JSON.parse(String(data))
}

const set = ({ key, data }: { key: string, data: string }) => window.localStorage.setItem(key, JSON.stringify(data))

const localStorage = {
    set,
    get
}

export default localStorage