import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
      <Link to="/" className="text-xl font-bold text-blue-400 hover:text-blue-300">
        🚗 VehicleReg
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="hover:text-blue-400 transition">Home</Link>

        {isAuthenticated && (
          <>
            <Link to="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>
            <Link to="/vehicle/new" className="hover:text-blue-400 transition">Register Vehicle</Link>
          </>
        )}

        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar