import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class Profile extends Component {
  state = {
    profile: {},
  }

  componentDidMount() {
    this.getProfile()
  }

  getProfile = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/profile`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    try {
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const {profile_details: profileDetails} = await response.json()
        const updatedProfile = {
          name: profileDetails.name,
          imageUrl: profileDetails.profile_image_url,
          shortBio: profileDetails.short_bio,
        }
        this.setState({
          profile: updatedProfile,
        })
      } else {
        console.error('Failed to fetch profile')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  render() {
    const {profile} = this.state
    return (
      <div>
        <h1>{profile.name}</h1>
        <img src={profile.imageUrl} alt="Profile" />
        <p>{profile.shortBio}</p>
      </div>
    )
  }
}

export default Profile
