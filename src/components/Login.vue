<template>
  <div class="app d-flex justify-center">
    <v-card elevation="12" class="mt-16 my-auto overflow-hidden" width="800px">
        <v-app-bar
          color="primary"
          dark
        >
        <v-toolbar-title>Authentication</v-toolbar-title>
        <v-spacer></v-spacer>
        </v-app-bar>
        <div class="inputs mt-8 px-12">
          <v-text-field
            v-on:keyup.enter="login()"
            label="Email"
            solo
            v-model="email"
          ></v-text-field>
          <v-text-field
            :type="show ? 'text' : 'password'"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            v-on:keyup.enter="login()"
            label="Password"
            solo
            v-model="password"
            @click:append="show = !show"
          ></v-text-field>

          <div class="buttons d-flex mb-6">
            <v-btn plain color="primary" v-on:click="() => { $router.push('/register') }">Register</v-btn>
            <v-spacer></v-spacer>
            <v-btn dark color="primary" v-on:click="login()">Login</v-btn>
          </div>
        </div>
    </v-card>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: 'Login',
  data() {
    return {
      show: false,
      email: '',
      password: '',
      database:'',
    }
  },
  methods: {
    login() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          alert('Successfully logged in');
          this.$router.push('/todo-list');
        })
        .catch(error => {
          alert(error.message);
        });
    },
  },
  mounted() {
    this.database = firebase.firestore();
  }
}
</script>
