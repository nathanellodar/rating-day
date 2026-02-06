import { ref } from 'vue'
import { useApi } from './useApi.js'

const { get } = useApi()

const users = ref([])
const loading = ref(false)
const error = ref(null)

export function useUserRatings() {
    const fetchAllUsersWithRatings = async () => {
        loading.value = true
        error.value = null
        try {
            const response = await get('/api/ratings/users')
            users.value = response.users || []
            return response
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    const fetchUserRatings = async (userId, page = 1, limit = 20) => {
        loading.value = true
        error.value = null
        try {
            const response = await get(`/api/ratings/users/${userId}?page=${page}&limit=${limit}`)
            return response
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        users,
        loading,
        error,
        fetchAllUsersWithRatings,
        fetchUserRatings,
    }
}
