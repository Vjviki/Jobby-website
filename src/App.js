import {Route, Switch, Redirect} from 'react-router-dom'
import LoginRoute from './Components/LoginRoute'
import HomeRoute from './Components/HomeRoute'
import JobsRoute from './Components/JobsRoute'
import JobItemDetailsRoute from './Components/JobItemDetailsRoute'
import ProtectedRoute from './Components/ProtectedRoute'
import NotFoundRoute from './Components/NotFoundRoute'
import './App.css'

// Replace your code here
const App = () => (
  <Switch>
    <Route exact path="/login" component={LoginRoute} />
    <ProtectedRoute exact path="/" component={HomeRoute} />
    <ProtectedRoute exact path="/jobs" component={JobsRoute} />
    <ProtectedRoute exact path="/jobs/:id" component={JobItemDetailsRoute} />
    <Route exact path="/not-found" component={NotFoundRoute} />
    <Redirect to="/not-found" />
  </Switch>
)

export default App
