import {Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/login'
import Home from './components/Home'
import Jobs from './components/Jobs'
// import Cart from './components/Cart'
import ProductItemDetails from './components/ProductItemDetails'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/login" component={LoginForm} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/Jobs" component={Jobs} />
    <ProtectedRoute exact path="/jobs/:id" component={ProductItemDetails} />
    <Route path="/not-found" component={NotFound} />
    <Redirect to="not-found" />
  </Switch>
)

export default App
