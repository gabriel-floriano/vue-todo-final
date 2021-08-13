<template>
  <div class="app d-flex justify-center">
    <v-card elevation="12" outlined class="my-4" width="800px">
      <v-container v-show="!loading">
        <v-card-title class="headline"> Adicione Tarefas a Sua lista </v-card-title>
        <ol class="px-12">
          <li class="d-block" v-for="todo in todos" v-bind:key="todo.id">
            <v-card elevation="0" outlined class="mt-2">
              <v-app-bar
                :color=" todo.done ? 'blue' : 'grey'"
                dense
                flat
                dark
              >
                {{ todo.title }} 
                
                <v-spacer></v-spacer>
                
                <v-btn plain dark v-on:click="enterUpdateState(todo)"> Update </v-btn>
                <v-btn plain color="red" v-on:click="removeOneTodo(todo.id)"> Delete </v-btn>
              </v-app-bar>
              <v-card-text> {{ todo.text }}</v-card-text>
              <div class="text-right">
                <v-btn dark class="mr-6 mb-2" :color=" todo.done ? 'grey' : 'blue'" v-on:click="doneTodo(todo.id)"> {{ !todo.done ? 'Done' : 'Undone'}} </v-btn>
              </div>
            </v-card>
          </li>
        </ol>
        <div class="inputs mt-8 px-12">
          <v-text-field
            label="Task Title"
            outlined
            v-model="newTodo.title"
          ></v-text-field>

          <v-textarea
            v-model="newTodo.text"
            color="blue mt-4"
          >
            <template v-slot:label>
              <div>
                Task text <small>(optional)</small>
              </div>
            </template>
          </v-textarea>

          <div class="buttons d-flex mb-6">
            <v-btn v-show="update" outlined v-on:click="() => {
                update = false
                this.newTodo = {
                  title: '',
                  text: ''
                }
                this.getTodos()
              }">Cancelar</v-btn>
            <v-spacer></v-spacer>
            <v-btn dark color="green" v-on:click="() => {
              if (!update) {
                addTodo(newTodo.title, newTodo.text)
              } else {
                updateTodo()
              }
            }">{{ update ? 'Salvar Tarefa' : 'Adicionar Tarefa' }}</v-btn>
          </div>
        </div>
      </v-container>
      <v-skeleton-loader
        v-show="loading"
        type="article, actions"
      />
    </v-card>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: 'TodoList',
  props: {
    msg: String
  },
  data() {
    return {
      todos: [],
      newTodo: {
        title: '',
        text: ''
      },
      database:'',
      update: false,
      loading: false
    }
  },
  methods: {
    async getTodos() {
      this.loading = true
      this.todos = []

      const content = await this.database.collection("tasks").where('user_id', '==', firebase.auth().currentUser.uid).get()
      for (let doc of content.docs) {
        this.todos.push({
          id: doc.id,
          title: doc.data().title,
          text: doc.data().text,
          done: doc.data().done
        })
      }

      this.loading = false
    },
    async addTodo(title, text) {
      this.newTodo = {
        title: '',
        text: ''
      }

      this.database.collection("tasks")
        .add({ title: title, text: text, done: false, user_id: firebase.auth().currentUser.uid })
        .catch((error) => {
          console.error("Erro: ", error)
        })

      this.getTodos()
    },
    async removeOneTodo(id) {
      await this.database.collection("tasks")
        .doc(id)
        .delete()
        .catch((error) => {
          console.error("Erro: ", error)
        })

      this.getTodos()
    },
    async doneTodo(id) {
      await this.database.collection("tasks")
        .doc(id)
        .update({
          done: !this.todos.filter(obj => {
            return obj.id === id
          })[0].done,
        })
        .catch((error) => {
          console.error("Erro: ", error)
        })

      this.getTodos()
    },
    enterUpdateState(todo) {
      this.newTodo = {
        id: todo.id,
        title: todo.title,
        text: todo.text
      }
      this.update = true
      this.todos = this.todos.filter(function( obj ) {
        return obj.id !== todo.id;
      })
    },
    async updateTodo() {
      await this.database.collection("tasks")
        .doc(this.newTodo.id)
        .update({
          title: this.newTodo.title,
          text: this.newTodo.text,
        })
        .catch((error) => {
          console.error("Erro: ", error)
        })
        
      this.newTodo = {
        title: '',
        text: ''
      }

      this.getTodos()
      this.update = false
    }
  },
  mounted() {
    this.database = firebase.firestore()

    this.getTodos()
  }
}
</script>
