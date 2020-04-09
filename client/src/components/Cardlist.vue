<template>
  <div>
    <!-- {{task}} -->
    <b-card :title="task.title">
      <b-card-text>
        {{task.User.email}}
        <br />
        {{task.updatedAt}}
      </b-card-text>

      <b-button
        v-b-toggle="`collapse${task.id}`"
        variant="primary"
        @click="populateData(task.title,task.category)"
      >Edit</b-button>
      <b-button variant="primary" @click="deleteTask(task.id)">Delete</b-button>
      <b-collapse :id="`collapse${task.id}`" class="mt-2">
        <b-form>
          <b-input :id="`editInp${task.id}`" class="mb-2 mr-sm-2 mb-sm-0" v-model="editTitle"></b-input>
          <b-form-select :id="`editCatInp${task.id}`" v-model="editCat" :options="categories"></b-form-select>
          <b-button
            v-on:click="editTask(task.id)"
            v-b-toggle="`collapse${task.id}`"
            variant="primary"
          >Edit</b-button>
        </b-form>
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
const url = "http://localhost:3000/";

export default {
  name: "Cardlist",
  props: ["task"],
  data() {
    return {
      editTitle: null,
      editCat: null,
      categories: ["Backlog", "Todo", "Done", "Completed"]
    };
  },
  created() {
    this.dateFormat();
  },
  methods: {
    dateFormat: function() {
      let date = new Date(this.task.updatedAt);
      date = date.toLocaleString("en-GB");
      this.task.updatedAt = date;
    },
    editTask: function(id) {
      let title = this.editTitle;
      let category = this.editCat;
      category = category.charAt(0).toLowerCase() + category.slice(1);

      console.log(id, title, category);
      axios({
        url: `${url}task/${id}`,
        method: "PUT",
        data: { category, title },
        headers: { access_token: localStorage.access_token }
      })
        .then(res => {
          console.log("suc", res);
          this.$emit("taskedited");
        })
        .catch(err => {
          console.log("err", err);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.response.data.msg
          });
        });
    },
    populateData: function(title, category) {
      this.editTitle = title;
      this.editCat = category.charAt(0).toUpperCase() + category.slice(1);
    },
    deleteTask: function(id) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(result => {
        if (result.value) {
          console.log(id, "deleted");
          axios({
            url: `${url}task/${id}`,
            method: "DELETE",
            headers: { access_token: localStorage.access_token }
          })
            .then(res => {
              console.log("suc", res);
              this.$emit("taskdeleted");
            })
            .catch(err => {
              console.log("err", err);
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: err.response.data.msg
              });
            });
        } else {
          console.log(id, "nahhbarh");
        }
      });
    }
  }
};
</script>