import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {IoLocationSharp} from 'react-icons/io5'
import {MdLocalPostOffice} from 'react-icons/md'
import {FaSearch, FaRegStar} from 'react-icons/fa'
import Loader from 'react-loader-spinner'

import Header from '../Header'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const jobLocation = [
  {location: 'Hyderabad', locationId: 'hyderabad'},
  {location: 'Bangalore', locationId: 'bangalore'},
  {location: 'Chennai', locationId: 'chennai'},
  {location: 'Delhi', locationId: 'delhi'},
  {location: 'Mumbai', locationId: 'mumbai'},
]

const status = {
  isInitial: 'INITIAL',
  isLoadingJob: 'LOADER_JOB',
  isLoadingProfile: 'LOADER_PROFILE',
  isSuccessJob: 'SUCCESS_JOB',
  isSuccessProfile: 'SUCCESS_PROFILE',
  isFailure: 'FAILURE',
  isFailureFetchJob: 'FAILURE_FETCH_JOB',
  isFailureFetchProfile: 'FAILURE_FETCH_PROFILE',
}

class JobsRoute extends Component {
  state = {
    profileDetails: {},
    jobDetails: [],
    searchInput: '',
    searchResult: '',
    salaryRangeId: '',
    employmentTypeId: [],
    selectedLocations: [],
    apiStatusJob: status.isInitial,
    apiStatusProfile: status.isInitial,
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsDetails()
  }

  getProfileDetails = async () => {
    this.setState({apiStatusProfile: status.isLoadingProfile})
    const apiUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const profile = data.profile_details
      const updatedProfile = {
        profileImageUrl: profile.profile_image_url,
        name: profile.name,
        shortBio: profile.short_bio,
      }
      this.setState({
        profileDetails: updatedProfile,
        apiStatusProfile: status.isSuccessProfile,
      })
    } else {
      this.setState({apiStatusProfile: status.isFailureFetchProfile})
    }
  }

  getJobsDetails = async () => {
    this.setState({apiStatusJob: status.isLoadingJob})
    const {
      employmentTypeId,
      salaryRangeId,
      searchResult,
      selectedLocations,
    } = this.state
    const employmentTypeIdQuery = employmentTypeId.join(',')
    const locationQuery = selectedLocations.join(',')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeIdQuery}&minimum_package=${salaryRangeId}&search=${searchResult}&location=${locationQuery}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const {jobs} = data
      const updatedJobs = jobs.map(eachJobItem => ({
        companyLogoUrl: eachJobItem.company_logo_url,
        employmentType: eachJobItem.employment_type,
        id: eachJobItem.id,
        jobDescription: eachJobItem.job_description,
        location: eachJobItem.location,
        packagePerAnnum: eachJobItem.package_per_annum,
        rating: eachJobItem.rating,
        title: eachJobItem.title,
      }))
      this.setState({
        jobDetails: updatedJobs,
        apiStatusJob: status.isSuccessJob,
      })
      console.log(data)
    } else {
      this.setState({apiStatusJob: status.isFailureFetchJob})
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSeacrhIcon = () => {
    const {searchInput} = this.state
    this.setState({searchResult: searchInput}, this.getJobsDetails)
  }

  onClicEmployment = id => {
    this.setState(prevState => {
      const {employmentTypeId} = prevState
      if (employmentTypeId.includes(id)) {
        return {employmentTypeId: employmentTypeId.filter(type => type !== id)}
      }
      return {employmentTypeId: [...employmentTypeId, id]}
    }, this.getJobsDetails)
  }

  onClickSalaryRange = id => {
    this.setState({salaryRangeId: id}, this.getJobsDetails)
  }

  onClickLocationFilter = location => {
    this.setState(prevState => {
      const {selectedLocations} = prevState
      if (selectedLocations.includes(location)) {
        return {
          selectedLocations: selectedLocations.filter(
            item => item !== location,
          ),
        }
      }
      return {selectedLocations: [...selectedLocations, location]}
    }, this.getJobsDetails)
  }

  fetchingJobDetailsFailureItem = () => (
    <div className="fetch-data-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view-item"
      />
      <h1 className="job-failure-head">Oops! Something Went Wrong</h1>
      <p className="job-failure-text">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.getJobsDetails}
      >
        Retry
      </button>
    </div>
  )

  fetchingProfileDetailsFailureItem = () => (
    <div className="profile-retry-container">
      <button
        type="button"
        className="retry-button"
        onClick={this.getProfileDetails}
      >
        Retry
      </button>
    </div>
  )

  SearchResultNotFoundItem = () => (
    <div className="seacrh-result-not-found-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="job-not-found-img"
      />
      <h1 className="job-not-found-head">No Jobs Found</h1>
      <p className="job-not-found-text">
        We could not find any jobs, try other filters
      </p>
    </div>
  )

  loaderRenderJobItem = () => (
    <div data-testid="loader" className="loader-job-container">
      <Loader type="ThreeDots" color="#ffffff" width={80} height={80} />
    </div>
  )

  loaderRenderProfileItem = () => (
    <div data-testid="loader" className="loader-profile-container">
      <Loader type="ThreeDots" color="#ffffff" width={80} height={80} />
    </div>
  )

  jobDetailsRenderItem = () => {
    const {jobDetails, apiStatusJob} = this.state
    switch (apiStatusJob) {
      case status.isSuccessJob:
        return jobDetails.length > 0 ? (
          <ul className="job-details-list">
            {jobDetails.map(eachJob => (
              <li className="job-role-list" key={eachJob.id}>
                <Link to={`/jobs/${eachJob.id}`} className="link-item">
                  <div className="company-profile-container">
                    <img
                      src={eachJob.companyLogoUrl}
                      alt="company logo"
                      className="company-logo"
                    />
                    <div>
                      <h1 className="job-role-title">{eachJob.title}</h1>
                      <div className="rating-section">
                        <FaRegStar className="star" />
                        <p className="rating">{eachJob.rating}</p>
                      </div>
                    </div>
                  </div>
                  <div className="job-mode-lpa-details-container">
                    <div className="job-details">
                      <IoLocationSharp className="job-details-icons" />
                      <p className="icon-text">{eachJob.location}</p>
                      <MdLocalPostOffice className="job-details-icons" />
                      <p className="icon-text">{eachJob.employmentType}</p>
                    </div>
                    <div>
                      <p className="icon-text">{eachJob.packagePerAnnum}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="job-role-description-container">
                    <h1 className="description-title">Description</h1>
                    <p className="job-description">{eachJob.jobDescription}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          this.SearchResultNotFoundItem()
        )
      case status.isLoadingJob:
        return this.loaderRenderJobItem()
      case status.isFailureFetchJob:
        return this.fetchingJobDetailsFailureItem()
      default:
        return null
    }
  }

  profileDetailsItemRender = () => {
    const {profileDetails, apiStatusProfile} = this.state
    const {profileImageUrl, name, shortBio} = profileDetails
    switch (apiStatusProfile) {
      case status.isSuccessProfile:
        return (
          <div className="profile-container">
            <img
              src={profileImageUrl}
              alt="profile"
              className="profile-image"
            />
            <h1 className="profile-name">{name}</h1>
            <p className="profile-description">{shortBio}</p>
          </div>
        )
      case status.isLoadingProfile:
        return this.loaderRenderProfileItem()
      case status.isFailureFetchProfile:
        return this.fetchingProfileDetailsFailureItem()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="responseive-container">
            <div className="profile-details-container">
              {this.profileDetailsItemRender()}
              <hr className="horizontal-line" />
              <h1 className="sort-heading">Type of Employment</h1>
              <ul className="filter-options">
                {employmentTypesList.map(item => (
                  <li className="list-item" key={item.employmentTypeId}>
                    <input
                      type="checkbox"
                      id={item.employmentTypeId}
                      onChange={() =>
                        this.onClicEmployment(item.employmentTypeId)
                      }
                    />
                    <label
                      htmlFor={item.employmentTypeId}
                      className="label-text"
                    >
                      {item.label}
                    </label>
                  </li>
                ))}
              </ul>
              <hr className="horizontal-line" />
              <h1 className="sort-heading">Salary Range</h1>
              <ul className="filter-options">
                {salaryRangesList.map(range => (
                  <li className="list-item" key={range.salaryRangeId}>
                    <input
                      type="radio"
                      id={range.salaryRangeId}
                      onChange={() =>
                        this.onClickSalaryRange(range.salaryRangeId)
                      }
                    />
                    <label htmlFor={range.salaryRangeId} className="label-text">
                      {range.label}
                    </label>
                  </li>
                ))}
              </ul>
              <hr className="horizontal-line" />
              <h1 className="sort-heading">Location</h1>
              <ul className="filter-options">
                {jobLocation.map(eachLocation => (
                  <li className="list-item" key={eachLocation.locationId}>
                    <input
                      type="checkbox"
                      id={eachLocation.location}
                      onChange={() =>
                        this.onClickLocationFilter(eachLocation.location)
                      }
                    />
                    <label
                      htmlFor={eachLocation.location}
                      className="label-text"
                    >
                      {eachLocation.location}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div className="job-details-container">
              <div className="search-bar-container">
                <input
                  type="search"
                  className="search-bar"
                  placeholder="Search"
                  onChange={this.onChangeSearchInput}
                />
                <button
                  type="button"
                  data-testid="searchButton"
                  className="search-button"
                  onClick={this.onClickSeacrhIcon}
                >
                  <FaSearch className="seacrh-icon" />
                </button>
              </div>
              {this.jobDetailsRenderItem()}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default JobsRoute
