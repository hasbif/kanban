<template>
  <div>
    <!-- {{task}} -->
    <b-card :title="task.title" class="task-card">
      <b-card-text>
        {{task.User.email}}
        <br />
        {{task.updatedAt}}
      </b-card-text>

      <b-button
        v-b-toggle="`collapse${task.id}`"
        variant="warning"
        @click="populateData(task.title,task.category)"
      >Edit</b-button>
      <b-button variant="warning" @click="deleteTask(task.id)">Delete</b-button>
      <b-collapse :id="`collapse${task.id}`" class="mt-2">
        <b-form>
          <b-input
            :id="`editInp${task.id}`"
            class="mb-2 mr-sm-2 mb-sm-2 inputTask"
            v-model="editTitle"
          ></b-input>
          <b-form-select
            :id="`editCatInp${task.id}`"
            v-model="editCat"
            :options="categories"
            class="mb-2 mr-sm-2 mb-sm-2 inputTask"
          ></b-form-select>
          <b-button
            v-on:click="editTask(task.id)"
            v-b-toggle="`collapse${task.id}`"
            variant="warning"
          >Edit</b-button>
        </b-form>
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
const url = "https://gentle-bastion-66131.herokuapp.com/";

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
  methods: {
    editTask: function(id) {
      let title = this.editTitle;
      let category = this.editCat;
      category = category.charAt(0).toLowerCase() + category.slice(1);
      axios({
        url: `${url}task/${id}`,
        method: "PUT",
        data: { category, title },
        headers: { access_token: localStorage.access_token }
      })
        .then(res => {
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
          axios({
            url: `${url}task/${id}`,
            method: "DELETE",
            headers: { access_token: localStorage.access_token }
          })
            .then(res => {
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
        }
      });
    }
  }
};
</script>