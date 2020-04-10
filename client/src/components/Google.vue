// NO LONGER IN USE, DISREGARD
<template>
  <div id="google-signin-button" class="g-signin2"></div>
</template>


<script>
import axios from "axios";
const url = "http://localhost:3000/";

export default {
  name: "GglBtn",
  mounted() {
    gapi.signin2.render("google-signin-button", {
      onsuccess: this.onSignIn
    });
  },
  methods: {
    onSignIn(googleUser) {
      var id_token = googleUser.getAuthResponse().id_token;
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("gsign");
      });
      // axios({
      //   method: "post",
      //   url: `${url}google-sign-in`,
      //   data: {
      //     idtoken: id_token
      //   }
      // })
      //   .then(res => {
      //     localStorage.setItem("access_token", res.data.access_token);
      //     localStorage.setItem("gsign", "google");
      //     this.$emit("gsign");
      //   })
      //   .catch(err => {
      //     console.log("error", err.response);
      //   });
    }
  }
};
</script>