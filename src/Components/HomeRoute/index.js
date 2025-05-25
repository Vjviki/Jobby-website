import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const HomeRoute = () => (
  <>
    <Header />
    <div className="home-app-container">
      <div className="home-app-description-container">
        <h1 className="home-heading">
          Find The Job That <br /> Fits Your Life
        </h1>
        <p className="home-description">
          Millions of people are searching for jobs, salary information company
          reviews. find the job that fits your abilites and potential
        </p>
        <Link to="/jobs">
          <button type="button" className="job-button">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  </>
)

export default HomeRoute
