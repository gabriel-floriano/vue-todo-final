<template>
  <v-app>
    <v-main>
      <v-app-bar
        app
        color="green"
        dark
      >
      <v-toolbar-title>{{ $route.name }}</v-toolbar-title>
      <v-spacer/>
      <v-btn v-if="($route.name == 'TodoList')" plain v-on:click="logout()"> Logout
        <v-icon
          right
          dark
        >
          mdi-arrow-right
        </v-icon>
      </v-btn>
      </v-app-bar>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import firebase from "firebase";

export default {
  name: 'App',

  data: () => ({
  }),
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          alert('Logged out')
          this.$router.push('/')
        })
        .catch(error => {
          alert(error.message)
          this.$router.push('/')
        })
    },
  }
};
</script>
