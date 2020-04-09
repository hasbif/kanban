<template>
  <div class="card-top">
    <h5 class="card-header">{{databoard.id}}</h5>
    <Cardlist
      v-for="task in databoard.data"
      :key="task.id"
      :task="task"
      @taskedited="taskedited()"
      @taskdeleted="taskdeleted()"
    ></Cardlist>
    <b-button v-b-toggle="`collapse${databoard.id}`" variant="primary">Add Task</b-button>
    <b-collapse :id="`collapse${databoard.id}`" class="mt-2">
      <b-form inline>
        <b-input
          :id="`addInp${databoard.id}`"
          class="mb-2 mr-sm-2 mb-sm-0"
          placeholder="New Task"
          v-model="addVal"
        ></b-input>
        <b-button
          v-on:click="addtask(databoard.id)"
          v-b-toggle="`collapse${databoard.id}`"
          variant="primary"
        >Add</b-button>
      </b-form>
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
  created() {
    console.log("saasd");
    console.log(this.databoard);
  },
  methods: {
    addtask: function(category) {
      let title = this.addVal;
      category = category.toLowerCase();
      console.log(category, this.addVal);
      axios({
        url: `${url}task/`,
        method: "POST",
        data: { category, title },
        headers: { access_token: localStorage.access_token }
      })
        .then(res => {
          console.log("suc", res);
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