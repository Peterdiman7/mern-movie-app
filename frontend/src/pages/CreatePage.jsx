import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './CreatePage.module.css'

const CreatePage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    image: '',
    description: ''
  })

  const categories = [
    'Action',
    'Adventure',
    'Animation',
    'Comedy',
    'Drama',
    'Fantasy',
    'Horror',
    'Romance',
    'Sci-Fi',
    'Thriller'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Movie title is required')
      return false
    }
    if (!formData.category) {
      setError('Please select a category')
      return false
    }
    if (!formData.image.trim()) {
      setError('Image URL is required')
      return false
    }
    if (!formData.description.trim()) {
      setError('Movie description is required')
      return false
    }

    // Basic URL validation
    try {
      new URL(formData.image)
    } catch {
      setError('Please enter a valid image URL')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Movie created successfully! ✨')
        // Reset form
        setFormData({
          title: '',
          category: '',
          image: '',
          description: ''
        })
        // Redirect to home page after a short delay
        setTimeout(() => {
          navigate('/')
        }, 1500)
      } else {
        setError(data.messages || 'Failed to create movie')
      }
    } catch (err) {
      console.error('Error creating movie:', err)
      setError('Failed to create movie. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/')
  }

  const isValidImageUrl = (url) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create New Movie</h1>
          <p className={styles.subtitle}>Add a new movie to your collection</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="title" className={styles.label}>
              Movie Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Enter movie title..."
              disabled={loading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="category" className={styles.label}>
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={styles.select}
              disabled={loading}
            >
              <option value="">Select a category...</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="image" className={styles.label}>
              Image URL
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="https://example.com/movie-poster.jpg"
              disabled={loading}
            />
            {formData.image && isValidImageUrl(formData.image) && (
              <div className={styles.imagePreview}>
                <img
                  src={formData.image}
                  alt="Preview"
                  className={styles.previewImage}
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={styles.textarea}
              placeholder="Enter movie description..."
              disabled={loading}
            />
          </div>

          <div className={styles.buttons}>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelButton}
              disabled={loading}
            >
              ← Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <div className={styles.loading}>
                  <div className={styles.spinner}></div>
                  Creating...
                </div>
              ) : (
                <>🎬 Create Movie</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePage