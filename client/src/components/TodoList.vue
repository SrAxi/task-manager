<template>
  <v-main>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="5">
          <v-card class="mx-auto">
            <v-toolbar color="teal" dark>
              <v-icon>mdi-format-list-checks</v-icon>

              <v-toolbar-title class="ml-2">Task Manager</v-toolbar-title>
            </v-toolbar>

            <v-list subheader two-line flat>
              <v-subheader>
                <v-spacer></v-spacer>
                <v-btn
                  color="green"
                  class="mt-2 white"
                  title="Create new task"
                  @click="openNewTaskModal"
                >
                  <v-icon left dark>mdi-plus</v-icon>New
                </v-btn>
              </v-subheader>
              <v-divider class="mt-4"></v-divider>

              <v-list-item-group v-model="settings" multiple>
                <v-list-item v-for="task in tasks" :key="task._id">
                  <v-list-item-action>
                    <v-checkbox
                      v-model="task.completed"
                      color="primary"
                      @click="toggleTask(task._id, $event)"
                    />
                  </v-list-item-action>

                  <v-list-item-content>
                    <v-list-item-title
                      :class="task.completed ? 'deleted' : ''"
                    >{{ task.description }}</v-list-item-title>
                    <v-list-item-subtitle>{{ formatDate(task.createdAt) }}</v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-btn @click="deleteTask(task._id)" icon color="red" title="Remove Task">
                      <v-icon>mdi-trash-can-outline</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
      <v-dialog v-model="newTaskModal" width="500">
        <v-card>
          <v-card-title class="headline teal lighten-2">Create new task</v-card-title>

          <v-card-text>
            <v-form ref="form">
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      v-model="newTask"
                      label="New Task"
                      :rules="[rules.minLength, rules.maxLength]"
                      outlined
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" @click="closeNewTaskModal">Close</v-btn>
            <v-btn
              color="primary"
              :disabled="shouldSaveBeDisabled"
              @click="createNewTask"
            >Create new task</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-main>
</template>

<script>
import ApiMixin from '../mixins/ApiMixin'

export default {
  name: 'TodoList',

  mixins: [ApiMixin],

  props: {
    updateUserStatus: {
      type: Function,
    }
  },

  data: () => ({
    settings: [],
    tasks: [],
    newTaskModal: false,
    newTask: '',
    rules: {
      minLength: value => !!value && value.length >= 4 || 'Min 4 characters',
      maxLength: value => !!value && value.length <= 30 || 'Max 30 characters',
    },
  }),

  computed: {
    shouldSaveBeDisabled() {
      return !this.newTask || (!this.minValidation(this.newTask) || !this.maxValidation(this.newTask))
    },
  },

  watch: {
    newTaskModal() {
      if (!this.newTaskModal) {
        this.resetValidation()
      }
    }
  },

  mounted() {
    this.getData()
  },

  methods: {
    minValidation(value) {
      return value.length >= 4
    },
    maxValidation(value) {
      return value.length <= 30
    },
    async getData() {
      try {
        const { data } = await this.apiGetTasks()
        this.tasks = data
      } catch (error) {
        this.handleError(error)
      }
    },
    async toggleTask(taskId, e) {
      e.stopPropagation()

      const taskList = [...this.tasks]
      const taskIdx = taskList.findIndex(({ _id }) => _id === taskId)
      taskList[taskIdx].completed = !taskList[taskIdx].completed
      this.tasks = taskList

      try {
        await this.apiUpdateTasks(taskId, { completed: taskList[taskIdx].completed })
      } catch (error) {
        this.handleError(error)
      }
    },
    formatDate(timestamp) {
      return timestamp.slice(0, 10)
    },
    openNewTaskModal() {
      this.newTaskModal = true
    },
    closeNewTaskModal() {
      this.newTaskModal = false
      this.newTask = ''
    },
    async createNewTask() {
      try {
        await this.apiCreateTasks({ description: this.newTask })
        this.getData()
      } catch (error) {
        this.handleError(error)
      } finally {
        this.closeNewTaskModal()
      }
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },
    async deleteTask(id) {
      try {
        await this.apiDeleteTasks(id)
        this.getData()
      } catch (error) {
        this.handleError(error)
      } finally {
        this.closeNewTaskModal()
      }
    },
  },

}
</script>

<style>
.deleted {
  text-decoration: line-through;
}
</style>