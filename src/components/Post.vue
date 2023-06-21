<template>
  <div class="container-fluid">
    <div class="text-center" v-if="errors">
      <div class="error mx-auto" data-text="404">404</div>
      <p class="lead text-gray-800 mb-5">Page Not Found</p>
      <p class="text-gray-500 mb-0">
        It looks like you found a glitch in the matrix...
      </p>
      <router-link to="/">&larr; Back to Dashboard</router-link>
    </div>
    <div
      class="d-sm-flex align-items-center justify-content-between mb-4"
      v-else
    >
      <!-- <h1 class="h3 mb-2 text-gray-800">{{ title | ucwords }}</h1> -->
    </div>
    <div class="card mb-4" v-if="blogs.length == 0 && errors == false">
      <div class="card-body">
        <div class="data-table-loading">
          <div class="data-table-loading-spinner"></div>
          <div class="data-table-loading-text">Loading Data</div>
        </div>
      </div>
    </div>
    <div class="card shadow mb-4" v-for="(blog, index) in blogs" :key="index">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">{{ blog.judul }}</h6>
      </div>
      <div class="card-body">
        <div v-html="blog.content_isi"></div>
        <div class="data-table-loading" v-if="blogs.length == 0">
          <div class="data-table-loading-spinner"></div>
          <div class="data-table-loading-text">Loading Data</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";

export default {
  data() {
    return {
      errors: false,
      blogs: [],
    };
  },
  methods: {
    async getPost() {
      this.blogs = [];
      this.errors = false;
      let response = await axios.post(
        `api/bantuan`,
        { 
          validateStatus: false,
        tipe: this.$route.params.slug
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.status == 200) {
        if (response.data.message === "success") {
          response.data.data.forEach((bantuan) => {
            this.blogs.push(bantuan);
          });
        } else {
          this.errors = true;
        }
      } else {
        localStorage.removeItem("authToken");
        localStorage.removeItem("resellerData");
        Cookies.remove("authToken");
        // window.location = "/login";
      }
    },
  },
  watch: {
    "$route.params.slug": function (slug) {
      this.getPost();
    },
  },
  created() {
    this.getPost();
  },
  computed: {
    title() {
      let slug = this.$route.params.slug;
      slug = slug.replace("-", " ");
      return slug;
    },
  },
  filters: {
    ucwords(str) {
      str = str.toLowerCase();
      return str.replace(
        /(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
        function (s) {
          return s.toUpperCase();
        }
      );
    },
  },
};
</script>