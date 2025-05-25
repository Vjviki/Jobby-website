import {Component} from 'react'
import Cookies from 'js-cookie'
import {IoLocationSharp} from 'react-icons/io5'
import {MdLocalPostOffice} from 'react-icons/md'
import {FaRegStar, FaExternalLinkAlt} from 'react-icons/fa'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

const status = {
  isInitila: 'INITIAL',
  isLoading: 'LOADER',
  isSuccess: 'SUCCESS',
  isFailure: 'FAILURE',
}

class JobItemDetailsRoute extends Component {
  state = {
    jobDetail: {},
    skillDetails: [],
    lifeAtCompanyDetail: {},
    similarJobDetails: [],
    apiStatus: status.isInitila,
  }

  componentDidMount() {
    this.getSpecificDetails()
  }

  getSpecificDetails = async () => {
    this.setState({apiStatus: status.isLoading})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const job = data.job_details
      const updatedJob = {
        companyLogoUrl: job.company_logo_url,
        companyWebsiteUrl: job.company_website_url,
        id: job.id,
        jobDescription: job.job_description,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        location: job.location,
        employmentType: job.employment_type,
        title: job.title,
      }
      const {skills} = job
      const updatedSkills = skills.map(eachSkill => ({
        imageUrl: eachSkill.image_url,
        name: eachSkill.name,
      }))

      const lifeAtCompany = job.life_at_company
      const updatedLife = {
        description: lifeAtCompany.description,
        imageUrl: lifeAtCompany.image_url,
      }

      const similarJobs = data.similar_jobs
      const updatedSimilarJobs = similarJobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        rating: eachItem.rating,
        location: eachItem.location,
        employmentType: eachItem.employment_type,
        title: eachItem.title,
      }))
      console.log(data)

      this.setState({
        jobDetail: updatedJob,
        skillDetails: updatedSkills,
        lifeAtCompanyDetail: updatedLife,
        similarJobDetails: updatedSimilarJobs,
        apiStatus: status.isSuccess,
      })
    } else {
      this.setState({apiStatus: status.isFailure})
    }
  }

  loaderRendering = () => (
    <div data-testid="loader" className="loader-detailJob-contianer">
      <Loader type="ThreeDots" width={80} height={80} color="#ffffff" />
    </div>
  )

  fetchToDetailJobFailureItem = () => (
    <div className="fetch-data-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view-item"
      />
      <h1 className="failure-head">Oops! Something Went Wrong</h1>
      <p className="failure-text">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.getSpecificDetails}
      >
        Retry
      </button>
    </div>
  )

  detailJobItem = () => {
    const {
      jobDetail,
      skillDetails,
      lifeAtCompanyDetail,
      similarJobDetails,
    } = this.state
    return (
      <>
        <div className="spcific-company-detail-container">
          <div className="spcific-company-profile-container">
            <img
              src={jobDetail.companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div>
              <h1 className="job-role-title">{jobDetail.title}</h1>
              <div className="rating-section">
                <FaRegStar className="star" />
                <p className="rating">{jobDetail.rating}</p>
              </div>
            </div>
          </div>
          <div className="job-mode-lpa-details-container">
            <div className="job-details">
              <IoLocationSharp className="job-details-icons" />
              <p className="icon-text">{jobDetail.location}</p>
              <MdLocalPostOffice className="job-details-icons" />
              <p className="icon-text">{jobDetail.employmentType}</p>
            </div>
            <div>
              <p className="icon-text">{jobDetail.packagePerAnnum}</p>
            </div>
          </div>
          <hr />
          <div className="job-role-description-container">
            <div className="link-section">
              <h1 className="description-title">Description</h1>
              <a
                href={jobDetail.companyWebsiteUrl}
                className="company-web-site-link"
              >
                Visit <FaExternalLinkAlt />
              </a>
            </div>
            <p className="job-description">{jobDetail.jobDescription}</p>
          </div>
          <div className="skills-container">
            <h1 className="skills-heading">Skills</h1>
            <ul className="skill-list">
              {skillDetails.map(eachItem => (
                <li className="skill-list-item" key={eachItem.name}>
                  <div className="list-responsive">
                    <img
                      src={eachItem.imageUrl}
                      alt={eachItem.name}
                      className="skill-img"
                    />
                    <h1 className="skill-title">{eachItem.name}</h1>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="life-company-container">
            <h1 className="life-company-heading">Life at Company</h1>
            <div className="company-description-img">
              <p className="company-description">
                {lifeAtCompanyDetail.description}
              </p>
              <img
                src={lifeAtCompanyDetail.imageUrl}
                alt="life at company"
                className="company-img"
              />
            </div>
          </div>
        </div>
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-jobs-container">
          {similarJobDetails.map(eachJob => (
            <li className="similar-company-details-container" key={eachJob.id}>
              <div className="spcific-company-profile-container">
                <img
                  src={eachJob.companyLogoUrl}
                  alt="similar job company logo"
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
              <h1 className="description-title">Description</h1>
              <p className="job-description">{eachJob.jobDescription}</p>
              <div className="job-details">
                <IoLocationSharp className="job-details-icons" />
                <p className="icon-text">{eachJob.location}</p>
                <MdLocalPostOffice className="job-details-icons" />
                <p className="icon-text">{eachJob.employmentType}</p>
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  }

  renderDetailJobItem = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case status.isSuccess:
        return this.detailJobItem()
      case status.isLoading:
        return this.loaderRendering()
      case status.isFailure:
        return this.fetchToDetailJobFailureItem()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="spcific-company-container">
          <div className="responsive-company-detail-container">
            {this.renderDetailJobItem()}
          </div>
        </div>
      </>
    )
  }
}

export default JobItemDetailsRoute
