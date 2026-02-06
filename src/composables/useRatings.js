import { ref } from 'vue'
import { useApi } from './useApi.js'

const { get, post, put, delete: del } = useApi()

const ratings = ref([])
const loading = ref(false)
const error = ref(null)

export function useRatings() {
    const fetchRatings = async (page = 1, limit = 50) => {
        loading.value = true
        error.value = null
        try {
            const response = await get(`/api/ratings?page=${page}&limit=${limit}`)
            ratings.value = response.ratings || []
            return response
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    const createRating = async (ratingData) => {
        loading.value = true
        error.value = null
        try {
            const response = await post('/api/ratings', ratingData)
            ratings.value.unshift(response.rating) // Add to beginning of list
            return response.rating
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    const updateRating = async (id, ratingData) => {
        loading.value = true
        error.value = null
        try {
            const response = await put(`/api/ratings/${id}`, ratingData)
            const index = ratings.value.findIndex(r => r.id === id)
            if (index !== -1) {
                ratings.value[index] = response.rating
            }
            return response.rating
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    const deleteRating = async (id) => {
        loading.value = true
        error.value = null
        try {
            await del(`/api/ratings/${id}`)
            ratings.value = ratings.value.filter(r => r.id !== id)
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    const getRatingStats = async (itemId) => {
        try {
            const response = await get(`/api/ratings/stats/${itemId}`)
            return response
        } catch (err) {
            throw err
        }
    }

    return {
        ratings,
        loading,
        error,
        fetchRatings,
        createRating,
        updateRating,
        deleteRating,
        getRatingStats,
    }
}