import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    productData: {},
    similarJobs: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductData()
  }

  getFormattedData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    title: data.title,
    jobDescription: data.job_description,
    location: data.location,
    rating: data.rating,
    companyWebsiteUrl: data.company_website_url,
    skills: data.skills.map(skill => ({
      imageUrl: skill.image_url,
      name: skill.name,
    })),
    lifeAtCompany: {
      description: data.life_at_company.description,
      imageUrl: data.life_at_company.image_url,
    },
  })

  getProductData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    try {
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const {job_details: jobDetails, similar_jobs: similarJobs} =
          await response.json()
        const formattedData = this.getFormattedData(jobDetails)
        this.setState({
          productData: formattedData,
          similarJobs,
          apiStatus: apiStatusConstants.success,
        })
      } else if (response.status === 404) {
        this.setState({
          apiStatus: apiStatusConstants.failure,
        })
      }
    } catch (error) {
      console.error('Error fetching product data:', error)
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  handleRetry = () => {
    this.getProductData()
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" onClick={this.handleRetry}>
        Retry
      </button>
    </div>
  )

  renderProductDetailsView = () => {
    const {productData, similarJobs} = this.state
    const {
      companyLogoUrl,
      employmentType,
      title,
      jobDescription,
      location,
      rating,
      companyWebsiteUrl,
      skills,
      lifeAtCompany,
    } = productData

    return (
      <div className="product-details-success-view">
        <div className="product-details-container">
          <img
            src={companyLogoUrl}
            alt="job details company logo"
            className="product-image"
          />
          <div className="product">
            <h1 className="product-name">{title}</h1>
            <p className="price-details">Employment Type: {employmentType}</p>
            <p className="price-details">Location: {location}</p>
            <p className="price-details">Rating: {rating}</p>
            <p className="product-description">{jobDescription}</p>
            <a href={companyWebsiteUrl} target="_blank" rel="noreferrer">
              Visit
            </a>
          </div>
          <div className="skills-container">
            <h2>Skills:</h2>
            <ul>
              {skills.map(skill => (
                <li key={skill.name}>
                  <img src={skill.imageUrl} alt={skill.name} />
                  <span>{skill.name}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="life-at-company-container">
            <h2>Life at Company:</h2>
            <p>{lifeAtCompany.description}</p>
            <img src={lifeAtCompany.imageUrl} alt="life at company" />
          </div>
        </div>
        <h1 className="similar-products-heading">Similar Products</h1>
        <ul className="similar-products-list">
          {similarJobs.map(similarJob => (
            <li key={similarJob.id}>
              <img src={similarJob.company_logo_url} alt="similar job logo" />
              <h1>{similarJob.title}</h1>
              <p>{similarJob.employment_type}</p>
              <p>{similarJob.location}</p>
              <p>{similarJob.job_description}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderProductDetails()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
