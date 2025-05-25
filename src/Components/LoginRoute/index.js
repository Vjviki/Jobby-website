import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class LoginRoute extends Component {
  state = {
    username: '',
    password: '',
    errorMessage: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetail = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetail),
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.successStatus(data.jwt_token)
    } else {
      this.failureStatus(data.error_msg)
    }
  }

  successStatus = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  failureStatus = errorMsg => {
    this.setState({errorMessage: errorMsg})
  }

  usernameDetails = () => {
    const {username} = this.state
    return (
      <>
        <label htmlFor="username" className="input-label">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          placeholder="Username"
          className="input"
          value={username}
          onChange={this.onChangeUsername}
        />
      </>
    )
  }

  passwordDetails = () => {
    const {password} = this.state
    return (
      <>
        <label htmlFor="password" className="input-label">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="input"
          value={password}
          onChange={this.onChangePassword}
        />
      </>
    )
  }

  render() {
    const {errorMessage} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="job-login-container">
        <form className="login-form-container" onSubmit={this.onSubmitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="web-site-logo"
          />
          <div className="input-container">{this.usernameDetails()}</div>
          <div className="input-container">{this.passwordDetails()}</div>
          <button type="submit" className="submit-button">
            Login
          </button>
          <p className="error-message">{errorMessage}</p>
        </form>
      </div>
    )
  }
}

export default LoginRoute
