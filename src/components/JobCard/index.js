import {Link} from 'react-router-dom'
import './index.css'

const JobCard = props => {
  const {jobdata} = props
  const {
    title,
    location,
    employmenttype,
    jobdescription,
    imageUrl,
    rating,
    packageperannum,
    id,
  } = jobdata

  return (
    <Link to={`/jobs/${id}`} className='link-item'>
      <li className='product-item'>
        <img src={imageUrl} alt='website logo' className='thumbnail' />
        <h1 className='title'>{title}</h1>
        <p className='brand'> {location}</p>

        <div className='product-details'>
          <p>{employmenttype}</p>
          <h1>{packageperannum}</h1>
          <br />
          <h1>Description</h1>
          <p>{jobdescription}</p>
          <div className='rating-container'>
            <p className='rating'>{rating}</p>
            <img
              src='https://assets.ccbp.in/frontend/react-js/star-img.png'
              alt='star'
              className='star'
            />
          </div>
        </div>
      </li>
    </Link>
  )
}
export default JobCard
