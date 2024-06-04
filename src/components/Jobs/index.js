import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import JobCard from '../JobCard'
import FiltersGroup from '../FiltersGroup'
import Profile from '../Profile'
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

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    productsList: [],
    apiStatus: apiStatusConstants.initial,
    activeemploymentId: '',
    searchInput: '',
    activesalaryrange: '',
  }

  componentDidMount() {
    this.getjobs()
  }

  getjobs = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {activeemploymentId, activesalaryrange, searchInput} = this.state
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${activeemploymentId}&minimum_package=${activesalaryrange}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(product => ({
        employmenttype: product.employment_type,
        jobdescription: product.job_description,
        location: product.location,
        packageperannum: product.package_per_annum,
        id: product.id,
        imageUrl: product.company_logo_url,
        rating: product.rating,
        title: product.title,
      }))
      this.setState({
        productsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  clearFilters = () => {
    this.setState(
      {
        activeemploymentId: '',
        searchInput: '',
        activesalaryrange: '',
      },
      this.getjobs,
    )
  }

  changeemploy = activeemploymentId => {
    this.setState({activeemploymentId}, this.getjobs)
  }

  changesalary = activesalaryrange => {
    this.setState({activesalaryrange}, this.getjobs)
  }

  enterSearchInput = () => {
    this.getjobs()
  }

  changeSearchInput = searchInput => {
    this.setState({searchInput})
  }

  renderFailureView = () => (
    <div className='products-error-view-container'>
      <img
        src='https://assets.ccbp.in/frontend/react-js/failure-img.png '
        alt='failure view'
        className='products-failure-img'
      />
      <h1 className='product-failure-heading-text'>
        Oops! Something Went Wrong
      </h1>
      <p className='products-failure-description'>
        We cannot seem to find the page you are looking for
      </p>
      <button type='button' onClick={this.getjobs}>
        Retry
      </button>
    </div>
  )

  renderProductsListView = () => {
    const {productsList} = this.state
    const shouldShowProductsList = productsList.length > 0
    return shouldShowProductsList ? (
      <div className='all-products-container'>
        <ul className='products-list'>
          {productsList.map(product => (
            <JobCard jobdata={product} key={product.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className='no-products-view'>
        <img
          src='https://assets.ccbp.in/frontend/react-js/no-jobs-img.png'
          className='no-products-img'
          alt='no jobs'
        />
        <h1 className='no-products-heading'>No Jobs Found</h1>
        <p className='no-products-description'>We could not find any jobs</p>
        <button type='button' onClick={this.getjobs}>
          Retry
        </button>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className='loader-container' data-testid='loader'>
      <Loader type='ThreeDots' color='#ffffff' height='50' width='50' />
    </div>
  )

  renderAllProducts = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {activeemploymentId, activesalaryrange, searchInput} = this.state
    return (
      <div>
        <Header />
        <div className='box'>
          <div className='box2'>
            <Profile />
            <FiltersGroup
              searchInput={searchInput}
              changeSearchInput={this.changeSearchInput}
              enterSearchInput={this.enterSearchInput}
              salaryRangesList={salaryRangesList}
              employmentTypesList={employmentTypesList}
              activesalaryrange={activesalaryrange}
              activeemploymentId={activeemploymentId}
              changesalary={this.changesalary}
              changeemploy={this.changeemploy}
              clearFilters={this.clearFilters}
            />
          </div>
          <div className='jobs-list-container'>{this.renderAllProducts()}</div>
        </div>
      </div>
    )
  }
}

export default Jobs
