import {BsSearch} from 'react-icons/bs'

import './index.css'

const FiltersGroup = props => {
  const renderRatingsFiltersList = () => {
    const {employmentTypesList} = props

    return employmentTypesList.map(rating => {
      const {changeemploy, activeemploymentId} = props
      const onClickemploymentItem = () => changeemploy(rating.employmentTypeId)
      const isActive = rating.employmentTypeId === activeemploymentId
      const categoryClassName = isActive
        ? `category-name active-category-name`
        : `category-name`
      return (
        <li
          className="rating-item"
          key={rating.employmentTypeId}
          onClick={onClickemploymentItem}
        >
          <p className={categoryClassName}>{rating.label}</p>
        </li>
      )
    })
  }

  const renderRatingsFilters = () => (
    <div>
      <h1 className="rating-heading">Type of Employment</h1>
      <ul className="ratings-list">{renderRatingsFiltersList()}</ul>
    </div>
  )

  const renderCategoriesList = () => {
    const {salaryRangesList} = props

    return salaryRangesList.map(category => {
      const {changesalary} = props
      const onClickCategoryItem = () => changesalary(category.salaryRangeId)

      return (
        <li
          className="category-item"
          key={category.label}
          onClick={onClickCategoryItem}
        >
          <p>{category.label}</p>
        </li>
      )
    })
  }

  const renderProductCategories = () => (
    <>
      <h1 className="category-heading">Salary Range</h1>
      <ul className="categories-list">{renderCategoriesList()}</ul>
    </>
  )

  const onEnterSearchInput = event => {
    const {enterSearchInput} = props
    if (event.key === 'Enter') {
      enterSearchInput()
    }
  }

  const onChangeSearchInput = event => {
    const {changeSearchInput} = props
    changeSearchInput(event.target.value)
  }

  const renderSearchInput = () => {
    const {searchInput} = props
    return (
      <div className="search-input-container">
        <input
          value={searchInput}
          type="search"
          className="search-input"
          placeholder="Search"
          onChange={onChangeSearchInput}
          onKeyDown={onEnterSearchInput}
        />
        <BsSearch className="search-icon" />
      </div>
    )
  }

  const {clearFilters} = props

  return (
    <div className="filters-group-container">
      {renderSearchInput()}
      {renderRatingsFilters()}
      {renderProductCategories()}

      <button
        type="button"
        className="clear-filters-btn"
        onClick={clearFilters}
      >
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
