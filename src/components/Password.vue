<template>
  <div class="container-fluid">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 class="h3 mb-2 text-gray-800">Ganti password</h1>
    </div>
    <div class="card shadow mb-4">
      <div class="card-body">
        <form>
          <div class="form-group row">
            <label class="col-12 col-md-3 col-form-label">Password lama</label>
            <div class="col-12 col-md-9">
              <input
                type="password"
                class="form-control"
                v-model="password.old"
                placeholder="Masukkan password lama anda"
              />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-12 col-md-3 col-form-label">Password Baru</label>
            <div class="col-12 col-md-9">
              <input
                type="password"
                class="form-control"
                v-model="password.new"
                minlength="4"
                placeholder="Buat password baru minimal 4 karakter"
              />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-12 col-md-3 col-form-label"
              >Ulangi Password Baru</label
            >
            <div class="col-12 col-md-9">
              <input
                type="password"
                class="form-control"
                v-model="password.renew"
                minlength="4"
                placeholder="Ketik ulang password baru"
              />
            </div>
          </div>
          <div class="form-group row">
            <div class="col-12 col-lg-2 col-md-3 offset-md-3">
              <button
                type="button"
                class="btn btn-primary btn-block"
                @click="changePassword()"
              >
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";

export default {
  //   props: ["agen"],
  beforeMount() {
    const reseller = JSON.parse(localStorage.getItem("resellerData"));
    this.agen = reseller.reseller.kode;
  },
  data() {
    return {
      password: {
        old: "",
        new: "",
        renew: "",
      },
    };
  },
  methods: {
    async changePassword() {
      if (this.password.old == "") {
        return Swal.fire({
          icon: "error",
          title: "Password lama kosong",
          text: "Ketikkan password lama Anda",
        });
      }
      if (this.password.new == "" || this.password.new < 4) {
        return Swal.fire({
          icon: "error",
          title: "Masukkan password baru",
          text: "Password baru tidak boleh kurang dari 4 karakter",
        });
      }
      if (this.password.new != this.password.renew) {
        return Swal.fire({
          icon: "error",
          title: "Ulangi password baru",
          html: "Ulangi ketik password baru dengan benar<br/>(harus sama)",
        });
      }
      const params = {
        kd_agen: this.agen,
        password: this.password.new,
        password_confirmation: this.password.renew,
        old_password: this.password.old,
      };
      let response = await axios.post(
        "api/gantiPassword",
        params,
        { headers: { Authorization: `Bearer ${Cookies.get("authToken")}` } }
      );
      if (response.status == 200) {
        this.password.old = "";
        this.password.new = "";
        this.password.renew = "";
        Swal.fire({
          icon: "success",
          title: "Password berhasil dirubah!",
          text: "Anda sudah dapat melakukan login dengan password baru",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Password gagal diganti!",
          text: response.data.message,
        });
      }
    },
  },
};
</script>