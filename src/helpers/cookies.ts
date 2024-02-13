'use client'

import { destroyCookie, parseCookies, setCookie } from 'nookies'

const set = ({ key, value }: { key: string, value: string }) => setCookie(null, key, value)

const get = (key: string) => {
    let cookie = parseCookies()

    return cookie[key]
}

const remove = (key: string) => destroyCookie(null, key)

const cookie = {
    set,
    get,
    remove
}

export default cookie