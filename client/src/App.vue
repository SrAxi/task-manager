<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn v-if="isUserLoggedIn" @click="logout" text>
        <span class="mr-2">Logout</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main v-if="isUserLoggedIn">
      <TodoList :updateUserStatus="updateUserStatus" />
    </v-main>

    <v-main v-else>
      <Login
        v-if="shouldShowLogin"
        :loginHandler="loginHandler"
        :handleShowRegister="handleShowRegister"
      />
      <Register
        v-if="shouldShowRegister"
        :loginHandler="loginHandler"
        :handleShowLogin="handleShowLogin"
      />
    </v-main>
  </v-app>
</template>

<script>
import Login from './components/Login'
import Register from './components/Register'
import TodoList from './components/TodoList'
import ApiMixin from './mixins/ApiMixin'

export default {
  name: 'App',
  components: {
    Login,
    Register,
    TodoList,
  },
  mixins: [ApiMixin],

  data: () => ({
    isUserLoggedIn: false,
    showRegister: false,
  }),
  computed: {
    shouldShowLogin() {
      return !this.isUserLoggedIn && !this.showRegister
    },
    shouldShowRegister() {
      return !this.isUserLoggedIn && this.showRegister
    },
  },
  mounted() {
    this.isUserLoggedIn = this.isUserLoggedInInStorage()
  },
  methods: {
    async logout() {
      try {
        await this.apiLogout()
        this.isUserLoggedIn = false
        this.saveUserData(null)
      } catch (error) {
        this.handleError(error)
      }
    },
    loginHandler(isLoggedIn) {
      this.isUserLoggedIn = isLoggedIn
    },
    handleShowRegister() {
      this.showRegister = true
    },
    handleShowLogin() {
      this.showRegister = false
    },
    updateUserStatus(isLoggedIn) {
      this.isUserLoggedIn = isLoggedIn
    }
  },
}
</script>
