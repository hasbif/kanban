<template>
  <div class="full">
    <b-navbar toggleable type="dark" variant="dark">
      <b-navbar-brand style="font-weight:bold; ">kanban</b-navbar-brand>

      <b-navbar-nav class="ml-auto">
        <b-nav-form v-if="!loginStatus" @submit.prevent="login">
          <b-form-input
            size="sm"
            class="mr-sm-2"
            placeholder="Email"
            v-model="loginEmail"
            type="email"
          ></b-form-input>
          <b-form-input
            size="sm"
            class="mr-sm-2"
            placeholder="Password"
            v-model="loginPassword"
            type="password"
          ></b-form-input>
          <b-button size="sm" class="my-2 mr-2 my-sm-0" type="submit">Login</b-button>
          <b-button size="sm" class="my-2 my-sm-0" variant="warning" @click="loginGoogle">Google</b-button>
        </b-nav-form>
      </b-navbar-nav>

      <b-button
        v-if="loginStatus"
        size="sm"
        class="my-2 my-sm-0"
        variant="warning"
        @click="logout"
      >Logout</b-button>
    </b-navbar>

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
            <h2 style="color: whitesmoke;font-weight:bold;">Welcome</h2>
            <b-form-group label="Email" style="color: whitesmoke;">
              <b-input type="email" v-model="regEmail"></b-input>
            </b-form-group>
            <b-form-group label="Password" style="color: whitesmoke;">
              <b-input type="password" v-model="regPassword"></b-input>
            </b-form-group>
            <b-form-group label="Confirm Password" style="color: whitesmoke;">
              <b-input v-model="regRePassword" type="password"></b-input>
            </b-form-group>

            <b-button type="submit" variant="warning">Register</b-button>
          </b-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Card from "./components/Card";
import GglBtn from "./components/Google";
import Swal from "sweetalert2";
const url = "https://gentle-bastion-66131.herokuapp.com/";

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
      tasks: null,
      GSignIn: null
    };
  },
  created() {
    this.checkToken();
  },
  //   mounted() {
  //     gapi.signin2.render("google-signin-button", {
  //       onsuccess: this.onSignIn
  //     });
  //   },
  methods: {
    checkToken: function() {
      if (localStorage.access_token) {
        this.getTask();
        this.loginStatus = true;
      } else {
        this.loginStatus = null;
      }

      if (localStorage.gsign) {
        this.GSignIn = true;
      }
    },
    register: function() {
      if (this.regPassword === this.regRePassword) {
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
            this.checkToken();
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Successfully Registered",
              showConfirmButton: false,
              timer: 1500
            });
          })
          .catch(err => {
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
          this.checkToken();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Successfully Logged In",
            showConfirmButton: false,
            timer: 1500
          });
        })
        .catch(err => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.response.data.msg
          });
          this.loginPassword = null;
        });
    },
    logout: function() {
      let self = this;
      if (this.GSignIn) {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function() {
          localStorage.removeItem("access_token");
          localStorage.removeItem("gsign");
          self.loginStatus = null;
          self.checkToken();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Successfully Logout",
            showConfirmButton: false,
            timer: 1500
          });
        });
      } else {
        localStorage.removeItem("access_token");
        this.loginStatus = null;
        this.checkToken();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Successfully Logout",
          showConfirmButton: false,
          timer: 1500
        });
      }
    },
    getTask: function() {
      axios({
        url: `${url}task`,
        method: "GET",
        headers: { access_token: localStorage.access_token }
      })
        .then(res => {
          let alltasks = res.data.task;
          let Backlog = [];
          let Todo = [];
          let Done = [];
          let Completed = [];
          for (let i in alltasks) {
            //change date format
            let date = new Date(alltasks[i].updatedAt);
            date = date.toLocaleString("en-GB");
            alltasks[i].updatedAt = date;
            //filter by categories
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
        })
        .catch(err => {
          console.log(err);
          this.message = err;
        });
    },
    taskadded: function() {
      this.checkToken();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Task Added",
        showConfirmButton: false,
        timer: 1500
      });
    },
    taskedited: function() {
      this.checkToken();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Task Edited",
        showConfirmButton: false,
        timer: 1500
      });
    },
    taskdeleted: function() {
      this.checkToken();
      Swal.fire("Deleted!", "Your file has been deleted.", "success");
    },
    gsign: function() {
      this.GSignIn = true;
      this.loginStatus = true;
      this.loginEmail = null;
      this.loginPassword = null;
      this.checkToken();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Successfully Logged In",
        showConfirmButton: false,
        timer: 1500
      });
    },
    loginGoogle() {
      this.$gAuth
        .signIn()
        .then(googleUser => {
          console.log("user", googleUser);
          var id_token = googleUser.getAuthResponse().id_token;
          axios({
            method: "post",
            url: `${url}google-sign-in`,
            data: {
              idtoken: id_token
            }
          })
            .then(res => {
              localStorage.setItem("access_token", res.data.access_token);
              localStorage.setItem("gsign", "google");
              this.GSignIn = true;
              this.loginStatus = true;
              this.checkToken();
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Successfully Signed In",
                showConfirmButton: false,
                timer: 1500
              });
            })
            .catch(err => {
              console.log("error", err.response);
            });
          //this.isSignIn = this.$gAuth.isAuthorized;
        })
        .catch(error => {
          console.log(error, "error");
        });
    }
  }
};
</script>

