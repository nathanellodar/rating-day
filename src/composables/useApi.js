import { useAuth } from './useAuth.js'

const { token } = useAuth()

export function useApi() {
    const apiCall = async (url, options = {}) => {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(token.value && { 'Authorization': `Bearer ${token.value}` }),
                ...options.headers,
            },
        }

        const response = await fetch(url, { ...defaultOptions, ...options })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            const err = new Error(errorData.message || `HTTP ${response.status}`)
            err.status = response.status

            // If unauthorized, clear token and redirect to login
            if (response.status === 401) {
                try {
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')
                } catch (e) {}
                // redirect to login page
                if (typeof window !== 'undefined') window.location.href = '/login'
            }

            throw err
        }

        return response.json()
    }

    const get = (url, options = {}) => apiCall(url, { ...options, method: 'GET' })
    const post = (url, data, options = {}) => apiCall(url, { ...options, method: 'POST', body: JSON.stringify(data) })
    const put = (url, data, options = {}) => apiCall(url, { ...options, method: 'PUT', body: JSON.stringify(data) })
    const del = (url, options = {}) => apiCall(url, { ...options, method: 'DELETE' })

    return {
        get,
        post,
        put,
        delete: del,
        apiCall,
    }
}