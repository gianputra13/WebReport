<template>
  <!-- Login -->
  <div class="container">
    <!-- Outer Row -->
    <div class="row justify-content-center">
      <div class="col-xl-8 col-lg-10 col-md-8">
        <div class="card o-hidden border-0 shadow-lg my-5">
          <div class="card-header">
            <h3 class="text-center font-weight-light my-4 title-page">Login</h3>
          </div>
          <div class="card-body p-0">
            <div class="row card-login" v-if="!isReset">
              <div class="col-lg-8 offset-lg-2">
                <div class="p-5">
                  <div class="text-center">
                    <h1 class="h4 text-gray-900 mb-4 greeting-message">
                      Selamat datang kembali!
                    </h1>
                  </div>
                  <form class="user">
                    <div class="form-group">
                      <input
                        type="text"
                        class="form-control form-control-user"
                        id="kd_agen"
                        placeholder="Masukkan Kode Agen"
                        autocomplete="off"
                        v-model="kodeAgent"
                      />
                    </div>
                    <div class="form-group">
                      <input
                        type="password"
                        class="form-control form-control-user"
                        id="otp"
                        placeholder="Masukkan Password"
                        v-model="password"
                      />
                    </div>
                    <button
                      type="button"
                      class="btn btn-primary btn-user btn-block"
                      id="btn-login"
                      @click="login"
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      class="
                        btn btn-link
                        text-muted
                        font-italic
                        text-decoration-none
                      "
                      id="btn-reset"
                      @click="toResetPage"
                    >
                      <i class="fas fa-exclamation"></i> Reset Password
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <!-- Nested Row within Card Body -->
            <div class="row card-reset" v-else>
              <div class="col-lg-8 offset-lg-2">
                <div class="p-5">
                  <div class="text-center">
                    <h1 class="h4 text-gray-900 mb-4 greeting-message">
                      Dikirim melalui
                      <span class="text-success"
                        ><i class="fab fa-whatsapp"></i> whatsapp</span
                      >
                    </h1>
                  </div>
                  <form class="user">
                    <div class="form-group">
                      <input
                        type="text"
                        class="form-control form-control-user"
                        id="nohp"
                        placeholder="Masukkan no handphone terdaftar. cth: 085866690661"
                        autocomplete="off"
                        v-model="phone"
                      />
                    </div>
                    <button
                      type="button"
                      class="btn btn-primary btn-user btn-block"
                      id="btn-req"
                      @click="resetOtp"
                    >
                      Reset Password
                    </button>
                    <button
                      type="button"
                      class="
                        btn btn-link
                        text-muted
                        font-italic
                        text-decoration-none
                      "
                      id="btn-back"
                      @click="toLoginPage"
                    >
                      <i class="fas fa-chevron-left"></i> Login
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer text-center">
            <div class="small">Web Report Application System</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

export default {
  created() {
    document.body.classList.add("bg-gradient-danger");
    if (Cookies.get("authToken")) {
      this.$router.push("/dashboard");
    }
  },
  emits: ["login"],
  data() {
    return {
      kodeAgent: "",
      password: "",
      phone: "",
      isReset: false,
    };
  },
  methods: {
    async resetOtp() {
      let response = await axios
        .post("api/resetPassword", {
          phone: this.phone,
        })
        .catch((err) => {
          Swal.fire({
            title: "Error",
            text: err.response.data.message,
            icon: "error",
          });
        });
      if (response.status === 200) {
        Swal.fire({
          title: "Success",
          text: "Kode OTP telah dikirim ke nomor handphone Anda",
          icon: "success",
        }).then(() => {
          this.isReset = false;
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
    },
    login() {
      this.$emit("login", {
        kodeAgent: this.kodeAgent,
        password: this.password,
      });
    },
    toResetPage() {
      this.isReset = true;
    },
    toLoginPage() {
      this.isReset = false;
    },
  },
};
</script>