<template>
  <div class="app d-flex justify-center">
    <v-card elevation="12" class="mt-16 my-auto overflow-hidden" width="800px">
      <v-app-bar
        color="primary"
        dark
      >
      <v-toolbar-title>Register</v-toolbar-title>
      <v-spacer></v-spacer>
      </v-app-bar>
      <div class="inputs mt-8 px-12">
          <v-text-field
            label="Email"
            solo
            v-model="email"
          ></v-text-field>
          <v-text-field
            :type="show ? 'text' : 'password'"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="show = !show"
            v-on:keyup.enter="register()"
            label="Password"
            solo
            v-model="password"
            :rules="[rules.required, rules.min]"
            hint="At least 6 characters"
            counter
          ></v-text-field>

          <div class="buttons d-flex mb-6">
          <v-btn class="ml-n6" plain color="primary" v-on:click="() => { $router.push('/') }">
          <v-icon
            class="mr-2"
            right
          >
          mdi-arrow-left
        </v-icon>Go Back</v-btn>
          <v-spacer></v-spacer>
          <v-btn dark color="primary" v-on:click="register(email, password)">Create User</v-btn>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: 'Register',
  data() {
    return {
      show: false,
      email: '',
      password: '',
      database: '',
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 6 || 'Min 6 characters',
      },
    }
  },
  methods: {
    register(email, password) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          alert('Success! Please login to acess the application.');
          this.$router.push('/');
        })
        .catch(error => {
          alert(error.message);
        });
    }
  },
  mounted() {
    this.database = firebase.firestore();
  }
}
</script>
