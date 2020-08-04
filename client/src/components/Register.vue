<template>
  <v-main>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="teal" dark flat>
              <v-toolbar-title>Register form</v-toolbar-title>
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
                  v-model="name"
                  label="Name"
                  name="name"
                  prepend-icon="mdi-account"
                  type="text"
                />

                <v-text-field
                  v-model="email"
                  label="Email"
                  name="login"
                  prepend-icon="mdi-email"
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

                <v-text-field
                  v-model="age"
                  label="Age"
                  name="age"
                  prepend-icon="mdi-baby-carriage"
                  type="text"
                  min="18"
                />
              </v-form>
              <a @click="handleShowLogin">Already have an account? Login now!</a>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="submitLogin" color="primary">Register</v-btn>
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
  name: 'Register',
  mixins: [ApiMixin],
  props: {
    loginHandler: {
      type: Function,
    },
    handleShowLogin: {
      type: Function,
    },
  },
  data: () => ({
    email: '',
    name: '',
    password: '',
    age: null,
  }),

  mounted() {
    // console.log(this.isUserLoggedIn)
  },

  methods: {
    async submitLogin() {
      try {
        const { data } = await this.apiRegister({
          email: this.email,
          name: this.name,
          age: this.age,
          password: this.password
        })
        this.saveUserData(data)
        this.loginHandler(true)
        this.handleShowLogin()
      } catch (error) {
        console.error(error)
      }
    },
  },
}
</script>
