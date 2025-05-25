import Cookies from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-bar-container">
      <ul className="nav-content">
        <li className="list-item">
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="logo-img"
            />
          </Link>
        </li>
        <div className="nav-options">
          <li className="list-item">
            <Link to="/" className="option">
              Home
            </Link>
          </li>
          <li className="list-item">
            <Link to="/jobs" className="option">
              Jobs
            </Link>
          </li>
        </div>
        <li className="list-item">
          <button
            type="button"
            className="logout-button"
            onClick={onClickLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
