import axios from 'axios'

const config = {
    baseURL: 'https://coopers-dev-hiring.onrender.com/api/v1',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*'
    }
}

export const api = axios.create(config)