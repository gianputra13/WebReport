

<template>
  <div id="wrapper">
    <div id="login" class="col-12" v-if="isLogin === false">
      <login @login="login"></login>
    </div>
    <sideNav v-if="isLogin === true"></sideNav>
    <!-- <div id="main" class="p-0"> -->
    <div
      id="content-wrapper"
      class="d-flex flex-column"
      v-if="isLogin === true"
    >
      <div id="content">
        <topNav @logout="logout"></topNav>
        <transition>
          <router-view @logout="logout"></router-view>
        </transition>
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
import sideNav from "./components/navigation/SideNavigationComponent.vue";
import topNav from "./components/navigation/TopNavigationComponent.vue";
import login from "./components/auth/Login.vue";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default {
  beforeMount() {
    this.isLogin = Cookies.get("authToken") !== undefined ? true : false;
    this.isLogin === false &&
      (localStorage.removeItem("authToken"),
      localStorage.removeItem("resellerData"));
  },
  data() {
    return {
      isLogin: false,
      agen: "",
    };
  },
  mounted() {
    this.isLogin === false
      ? document.body.classList.add("bg-gradient-danger")
      : document.body.classList.remove("bg-gradient-danger");
  },
  provide() {
    return {
      isLogin: this.isLogin,
      agen: this.agen,
    };
  },
  watch: {
    isLogin(newValue) {
      newValue === true
        ? document.body.classList.remove("bg-gradient-danger")
        : document.body.classList.add("bg-gradient-danger");
    },
  },
  components: {
    topNav,
    sideNav,
    login,
  },
  methods: {
    async login(data) {
      const { kodeAgent, password } = data;
      let response = await axios
        .post(
          "api/loginMitra",
          {
            kd_agen: kodeAgent,
            otp: password,
          },
          {
            dataType: "json",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods":
                "GET, POST, PATCH, PUT, DELETE, OPTIONS",
              "Access-Control-Allow-Headers":
                "Origin, Content-Type, X-Auth-Token",
            },
          }
        )
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.message,
          });
        });
      if (response.status == 200) {
        if (response.data.reseller !== null) {
          // set cookie
          Cookies.set("authToken", response.data.token, {
            expires: 1,
          });
          localStorage.setItem("authToken", response.data.token);
          localStorage.setItem("resellerData", JSON.stringify(response.data));
          // set isLogin to true
          this.isLogin = true;
          this.$router.push("/dashboard");
          this.agen = response.data.reseller.kode;
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Agen tidak ditemukan",
          });
        }
      }
    },
    async logout() {
      Swal.fire({
        icon: "question",
        title: "Ingin akan mengakhiri sesi?",
        confirmButtonText: "Akhiri",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return axios
            .post(
              `api/logoutMitra`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${Cookies.get("authToken")}`,
                },
              }
            )
            .then((response) => {
              if (response.status === 200) {
                localStorage.removeItem("authToken");
                localStorage.removeItem("resellerData");
                Cookies.remove("authToken");
                this.isLogin = false;
                this.$router.push("/");
              }
            })
            .catch(() => {
              Swal.fire({
                icon: "error",
                title: "Terjadi masalah jaringan, silahkan ulangi lagi",
              });
            });
        },
      });
    },
  },
};
</script>
