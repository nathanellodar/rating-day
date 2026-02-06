import { ref, computed } from 'vue'

const token = ref(localStorage.getItem('token'))
const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

export function useAuth() {
    const isAuthenticated = computed(() => !!token.value)

    const login = async (email, password) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            if (!response.ok) {
                throw new Error('Login failed')
            }

            const data = await response.json()
            token.value = data.token
            user.value = data.user
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))
            return data
        } catch (error) {
            throw error
        }
    }

    const register = async (username, email, password) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            })

            if (!response.ok) {
                throw new Error('Registration failed')
            }

            const data = await response.json()
            token.value = data.token
            user.value = data.user
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))
            return data
        } catch (error) {
            throw error
        }
    }

    const logout = () => {
        token.value = null
        user.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    const getMe = async () => {
        if (!token.value) return null

        try {
            const response = await fetch('/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token.value}`,
                },
            })

            if (!response.ok) {
                throw new Error('Failed to get user info')
            }

            const data = await response.json()
            user.value = data.user
            return data.user
        } catch (error) {
            logout() // Clear invalid token
            throw error
        }
    }

    return {
        token: computed(() => token.value),
        user: computed(() => user.value),
        isAuthenticated,
        login,
        register,
        logout,
        getMe,
    }
}