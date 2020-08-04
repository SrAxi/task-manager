<script>
import axios from 'axios'

const userLocalStorageKey = 'userData'

export default {
  data() {
    return {
      URL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '',
    }
  },

  methods: {
    // Handling LocalStorage
    saveInLocal(key, val) {
      localStorage.setItem(key, JSON.stringify(val))
    },
    readFromLocal(key) {
      const localData = localStorage.getItem(key)
      return localData !== 'null' ? JSON.parse(localData) : null
    },
    saveUserData(user) {
      this.saveInLocal(userLocalStorageKey, user)
    },
    readUserData() {
      return this.readFromLocal(userLocalStorageKey)
    },
    isUserLoggedInInStorage() {
      return !!this.readUserData()
    },
    userToken() {
      return this.isUserLoggedInInStorage() ? this.readUserData().token : null
    },
    handleError(error) {
      const statusCode = error.response.status

      if (statusCode === 401) {
        localStorage.removeItem(userLocalStorageKey)
        if (this.updateUserStatus) {
          this.updateUserStatus(false)
        }
      }

      console.error(error)
    },

    // Users
    apiLogin(credentials) {
      return axios.post(`${this.URL}/users/login`, credentials)
    },
    apiRegister(credentials) {
      return axios.post(`${this.URL}/users`, credentials)
    },
    apiLogout() {
      console.log('logging out', this.userToken())

      return axios.post(`${this.URL}/users/logoutAll`, null, {
        headers: {
          Authorization: 'Bearer ' + this.userToken()
        }
      })
    },
    apiGetProfile() {
      return axios.get(`${this.URL}/users/me`, {
        headers: {
          Authorization: 'Bearer ' + this.userToken()
        }
      })
    },

    // Tasks
    apiGetTasks() {
      return axios.get(`${this.URL}/tasks`, {
        headers: {
          Authorization: 'Bearer ' + this.userToken()
        }
      })
    },
    apiUpdateTasks(id, body) {
      return axios.patch(`${this.URL}/tasks/${id}`, body, {
        headers: {
          Authorization: 'Bearer ' + this.userToken()
        }
      })
    },
    apiCreateTasks(body) {
      return axios.post(`${this.URL}/tasks/`, body, {
        headers: {
          Authorization: 'Bearer ' + this.userToken()
        }
      })
    },
     apiDeleteTasks(id) {
      return axios.delete(`${this.URL}/tasks/${id}`, {
        headers: {
          Authorization: 'Bearer ' + this.userToken()
        }
      })
    },
  }
}

</script>