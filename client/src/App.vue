<template>
  <div class="full">
    <nav class="navbar navbar-light" style="background-color: #48adf5;">
      <span class="navbar-brand mb-0 h1">KANBAN2</span>
      <b-form inline v-if="!loginStatus" @submit.prevent="login">
        <b-input class="mb-2 mr-sm-2 mb-sm-0" placeholder="Email" type="email" v-model="loginEmail"></b-input>
        <b-input
          class="mb-2 mr-sm-2 mb-sm-0"
          type="password"
          placeholder="Password"
          v-model="loginPassword"
        ></b-input>
        <b-button class="mb-2 mr-sm-2 mb-sm-0" type="submit" variant="primary">Login</b-button>
        <div id="google-signin-button" class="g-signin2"></div>
      </b-form>
      <!-- <div
        id="buttonloggedoutgoogle"
        class="g-signin2"
        data-onsuccess="onSignIn"
        @done="onSignIn()"
      ></div>-->

      <button v-if="loginStatus" v-on:click="logout" type="button" class="btn btn-primary">Logout</button>
    </nav>

    <div id="content" v-if="loginStatus">
      <Card
        v-for="databoard in tasks"
        :key="databoard.id"
        :databoard="databoard"
        @taskadded="taskadded()"
        @taskedited="taskedited()"
        @taskdeleted="taskdeleted()"
      ></Card>
    </div>

    <div class="full center-xy-container" v-if="!loginStatus">
      <div id="regdiv" class="center-xy-container center">
        <div id="regbody" class="center">
          <b-form id="regform" @submit.prevent="register">
            <h2>Welcome</h2>
            <b-form-group label="Email">
              <b-input type="email" v-model="regEmail"></b-input>
            </b-form-group>
            <b-form-group label="Password">
              <b-input type="password" v-model="regPassword"></b-input>
            </b-form-group>
            <b-form-group label="Confirm Password">
              <b-input v-model="regRePassword" type="password"></b-input>
            </b-form-group>

            <b-button type="submit" variant="primary">Register</b-button>
          </b-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Card from "./components/Card";
import Swal from "sweetalert2";
const url = "http://localhost:3000/";

export default {
  name: "App",
  components: { Card },
  data() {
    return {
      loginStatus: false,
      loginEmail: null,
      loginPassword: null,
      regEmail: null,
      regPassword: null,
      regRePassword: null,
      tasks: null
    };
  },
  created() {
    if (localStorage.access_token) {
      //this.getTask();
      this.loginStatus = true;
    } else {
      this.loginStatus = null;
    }
  },
  mounted() {
    gapi.signin2.render("google-signin-button", {
      onsuccess: this.onSignIn
    });
  },
  methods: {
    register: function() {
      console.log(this.regEmail, this.regPassword, this.regRePassword);
      if (this.regPassword === this.regRePassword) {
        console.log("same");
        axios({
          url: `${url}register`,
          method: "POST",
          data: { email: this.regEmail, password: this.regPassword }
        })
          .then(res => {
            localStorage.setItem("access_token", res.data.access_token);
            this.loginStatus = true;
            this.regEmail = null;
            this.regPassword = null;
            this.regRePassword = null;
            this.getTask();
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Successfully Registered",
              showConfirmButton: false,
              timer: 1500
            });
          })
          .catch(err => {
            console.log(err.response.data.msg);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: err.response.data.msg
            });
            this.regPassword = null;
            this.regRePassword = null;
          });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Password does not match"
        });
        this.regPassword = null;
        this.regRePassword = null;
      }
    },
    login: function() {
      console.log(this.loginEmail, this.loginPassword);
      axios({
        url: `${url}login`,
        method: "POST",
        data: {
          email: this.loginEmail,
          password: this.loginPassword
        }
      })
        .then(res => {
          localStorage.setItem("access_token", res.data.access_token);
          this.loginStatus = true;
          this.loginEmail = null;
          this.loginPassword = null;
          this.getTask();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Successfully Logged In",
            showConfirmButton: false,
            timer: 1500
          });
        })
        .catch(err => {
          console.log(err.response.data.msg);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.response.data.msg
          });
          this.loginPassword = null;
        });
    },
    logout: function() {
      localStorage.removeItem("access_token");
      this.loginStatus = null;
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Successfully Logout",
        showConfirmButton: false,
        timer: 1500
      });

      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function() {
        console.log("User signed out.");
      });
    },
    getTask: function() {
      axios({
        url: "http://localhost:3000/task",
        method: "GET",
        headers: { access_token: localStorage.access_token }
      })
        .then(res => {
          console.log(res.data);
          let alltasks = res.data.task;
          let Backlog = [];
          let Todo = [];
          let Done = [];
          let Completed = [];
          for (let i in alltasks) {
            if (alltasks[i].category == "backlog") {
              Backlog.push(alltasks[i]);
            }
            if (alltasks[i].category == "todo") {
              Todo.push(alltasks[i]);
            }
            if (alltasks[i].category == "done") {
              Done.push(alltasks[i]);
            }
            if (alltasks[i].category == "completed") {
              Completed.push(alltasks[i]);
            }
          }
          this.tasks = [
            { id: "Backlog", data: Backlog },
            { id: "Todo", data: Todo },
            { id: "Done", data: Done },
            { id: "Completed", data: Completed }
          ];
          console.log("test", this.tasks);
        })
        .catch(err => {
          console.log(err);
          this.message = err;
        });
    },
    taskadded: function() {
      this.getTask();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Task Added",
        showConfirmButton: false,
        timer: 1500
      });
    },
    taskedited: function() {
      this.getTask();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Task Edited",
        showConfirmButton: false,
        timer: 1500
      });
    },
    taskdeleted: function() {
      this.getTask();
      Swal.fire("Deleted!", "Your file has been deleted.", "success");
    },
    onSignIn: function(googleUser) {
      var id_token = googleUser.getAuthResponse().id_token;
      console.log("user", googleUser);
      console.log(id_token, "test");
      axios({
        method: "post",
        url: `${url}google-sign-in`,
        data: {
          idtoken: id_token
        }
      })
        .then(res => {
          //console.log("success", res.data, res.access_token);
          localStorage.setItem("access_token", res.data.access_token);
          this.loginStatus = true;
          this.loginEmail = null;
          this.loginPassword = null;
          this.getTask();
          console.log("add");
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Successfully Logged In",
            showConfirmButton: false,
            timer: 1500
          });
        })
        .catch(err => {
          console.log("error", err.response);
        });

      console.log("success di bawah");
    }
  }
};
</script>

