import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'

const Navbar = ({ onSearch, searchTerm }) => {
	const location = useLocation()
	const navigate = useNavigate()
	const [userMode, setUserMode] = useState(() => {
		return localStorage.getItem('userMode') || 'guest'
	})
	const [username, setUsername] = useState(() => {
		return localStorage.getItem('username') || ''
	})

	useEffect(() => {
		localStorage.setItem('userMode', userMode)
		localStorage.setItem('username', username)
	}, [userMode, username])

	const generateRandomUsername = () => {
		const adjectives = ['Cool', 'Awesome', 'Epic', 'Super', 'Amazing', 'Fantastic', 'Incredible', 'Wonderful']
		const nouns = ['MovieFan', 'CinemaLover', 'FilmBuff', 'Viewer', 'Critic', 'Watcher', 'Explorer', 'Enthusiast']
		const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)]
		const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]
		const randomNum = Math.floor(Math.random() * 1000)
		return `${randomAdj}${randomNoun}${randomNum}`
	}

	const handleEnterAsUser = () => {
		const newUsername = generateRandomUsername()
		setUsername(newUsername)
		setUserMode('user')
	}

	const handleEnterAsGuest = () => {
		setUserMode('guest')
		setUsername('')
	}

	const handleBackClick = () => {
		navigate(-1)
	}

	const isHomePage = location.pathname === '/'
	const showBackButton = !isHomePage

	return (
		<nav className={styles.navbar}>
			<div className={styles.container}>
				<div className={styles.leftSection}>
					{showBackButton && (
						<button onClick={handleBackClick} className={styles.backButton}>
							← Back
						</button>
					)}
					<Link to="/" className={styles.logo}>
						Movie Store 🛒
					</Link>
				</div>

				<div className={styles.centerSection}>
					{isHomePage && (
						<div className={styles.searchContainer}>
							<input
								type="text"
								placeholder="Search movies..."
								value={searchTerm}
								onChange={(e) => onSearch(e.target.value)}
								className={styles.searchInput}
							/>
							<span className={styles.searchIcon}>🔍</span>
						</div>
					)}
				</div>

				<div className={styles.rightSection}>
					<div className={styles.userSection}>
						{userMode === 'guest' ? (
							<div className={styles.guestControls}>
								<span className={styles.guestLabel}>👤 Guest Mode</span>
								<button onClick={handleEnterAsUser} className={styles.enterUserButton}>
									Enter as User
								</button>
							</div>
						) : (
							<div className={styles.userControls}>
								<span className={styles.username}>👤 {username}</span>
								<button onClick={handleEnterAsGuest} className={styles.guestButton}>
									Switch to Guest
								</button>
							</div>
						)}
					</div>

					<Link to="/create" className={styles.createButton}>
						🎬 Create Movie
					</Link>
				</div>
			</div>
		</nav>
	)
}

export default Navbar