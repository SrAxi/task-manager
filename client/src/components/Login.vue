<template>
  <v-main>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="teal" dark flat>
              <v-toolbar-title>Login form</v-toolbar-title>
              <v-spacer></v-spacer>
              <!-- <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn href="source" icon large target="_blank" v-on="on">
                    <v-icon>mdi-code-tags</v-icon>
                  </v-btn>
                </template>
                <span>Source</span>
              </v-tooltip> -->
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="email"
                  label="Login"
                  name="login"
                  prepend-icon="mdi-account"
                  type="text"
                />

                <v-text-field
                  v-model="password"
                  id="password"
                  label="Password"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                />
              </v-form>
              <a @click="handleShowRegister">Don't have an account? Create one now!</a>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="submitLogin" color="primary">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import ApiMixin from '../mixins/ApiMixin'

export default {
  name: 'Login',
  mixins: [ApiMixin],
  props: {
    loginHandler: {
      type: Function,
    },
    handleShowRegister: {
      type: Function,
    },
  },
  data: () => ({
    email: '',
    password: '',
  }),

  mounted() {
    // console.log(this.isUserLoggedIn)
  },

  methods: {
    async submitLogin() {
      console.log('SUBMITTING FORM', this.email, this.password)

      try {
        const { data } = await this.apiLogin({
          email: this.email,
          password: this.password
        })
        console.log('login', data)
        this.saveUserData(data)
        this.loginHandler(true)
      } catch (error) {
        console.error(error)
      }
    },
  },
}
</script>
