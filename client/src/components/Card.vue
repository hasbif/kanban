<template>
  <div class="card-top category-all">
    <h5 class="card-header category-head">{{databoard.id}}</h5>
    <Cardlist
      v-for="task in databoard.data"
      :key="task.id"
      :task="task"
      @taskedited="taskedited()"
      @taskdeleted="taskdeleted()"
    ></Cardlist>
    <b-button v-b-toggle="`collapse${databoard.id}`" class="add-btn">Add Task</b-button>
    <b-collapse :id="`collapse${databoard.id}`" class="mt-2">
      <div class="dropdownAdd">
        <div class="insideAdd">
          <b-form inline>
            <b-input
              :id="`addInp${databoard.id}`"
              class="mb-2 mr-sm-2 mb-sm-0"
              placeholder="New Task"
              v-model="addVal"
              style="width:70%"
            ></b-input>
            <b-button
              v-on:click="addtask(databoard.id)"
              v-b-toggle="`collapse${databoard.id}`"
              variant="warning"
              class="mb-2 mr-sm-2 mb-sm-0"
            >Add</b-button>
          </b-form>
        </div>
      </div>
    </b-collapse>
  </div>
</template>

<script>
import axios from "axios";
import Cardlist from "./Cardlist";
import Swal from "sweetalert2";
const url = "http://localhost:3000/";

export default {
  name: "Card",
  props: ["databoard"],
  components: { Cardlist },
  data() {
    return { addVal: null };
  },
  methods: {
    addtask: function(category) {
      let title = this.addVal;
      category = category.toLowerCase();
      axios({
        url: `${url}task/`,
        method: "POST",
        data: { category, title },
        headers: { access_token: localStorage.access_token }
      })
        .then(res => {
          this.$emit("taskadded");
        })
        .catch(err => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.response.data.msg
          });
        });
      this.addVal = null;
    },
    taskedited: function() {
      this.$emit("taskedited");
    },
    taskdeleted: function() {
      this.$emit("taskdeleted");
    }
  }
};
</script>