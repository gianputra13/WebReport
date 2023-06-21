<template>
  <div class="container-fluid">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 class="h3 mb-2 text-gray-800">Profile</h1>
    </div>
    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Data Reseller</h6>
      </div>
      <div class="card-body">
        <table class="table table-striped table-borderless">
          <tbody>
            <tr>
              <td>Kode Agen</td>
              <td>: {{ profile.kode }}</td>
            </tr>
            <tr>
              <td>Nama</td>
              <td>: {{ profile.nama }}</td>
            </tr>
            <tr>
              <td>Nama Pemilik</td>
              <td>: {{ profile.pemilik }}</td>
            </tr>
            <tr>
              <td>Alamat</td>
              <td>: {{ profile.alamat }}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td v-if="profile.email != ''">: {{ profile.email }}</td>
              <td v-else>
                <div class="input-group input-group-sm">
                  <div class="input-group-prepend">
                    <span class="input-group-text">@</span>
                  </div>
                  <input
                    type="email"
                    class="form-control form-control-sm"
                    v-model="inputemail"
                  />
                  <div class="input-group-append">
                    <button class="btn btn-primary" @click="addEmail">
                      <span v-html="text_update_email"></span>
                    </button>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>Saldo</td>
              <td>: {{ profile.saldo }}</td>
            </tr>
            <tr>
              <td>Tanggal bergabung</td>
              <td>: {{ profile.tgl_daftar }}</td>
            </tr>
            <tr>
              <td>Aktivitas terakhir</td>
              <td>: {{ profile.tgl_aktivitas }}</td>
            </tr>
            <tr>
              <td>Deposit bulan ini</td>
              <td><span v-html="profile.deposit_now"></span></td>
            </tr>
            <tr>
              <td>Deposit bulan lalu</td>
              <td><span v-html="profile.deposit_last"></span></td>
            </tr>
            <tr>
              <td>Transaksi bulan ini</td>
              <td><span v-html="profile.transaksi_now"></span></td>
            </tr>
            <tr>
              <td>Transaksi bulan lalu</td>
              <td><span v-html="profile.transaksi_last"></span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";

export default {
  props: ["numberFormatFn"],
  beforeMount() {
    const reseller = JSON.parse(localStorage.getItem("resellerData"));
    this.agen = reseller.reseller.kode
    this.profile.kode = reseller.reseller.kode;
    this.profile.nama = reseller.reseller.nama;
    this.profile.pemilik = reseller.reseller.nama_pemilik;
    this.profile.alamat = reseller.reseller.alamat;
    this.profile.email = reseller.reseller.email;
    this.profile.tgl_daftar = moment(reseller.reseller.tgl_daftar).format("LL");
    this.profile.tgl_aktivitas = moment(reseller.reseller.tgl_aktivitas).format(
      "LL"
    );
  },
  data() {
    return {
      loading: true,
      profile: {
        kode: "",
        nama: "",
        saldo: "",
        tgl_daftar: "",
        tgl_aktivitas: "",
        pemilik: "",
        alamat: "",
        deposit_now:
          ': <div class="spinner-border text-info"><span class="sr-only">Loading...</span></div>',
        deposit_last:
          ': <div class="spinner-border text-info"><span class="sr-only">Loading...</span></div>',
        transaksi_now:
          ': <div class="spinner-border text-info"><span class="sr-only">Loading...</span></div>',
        transaksi_last:
          ': <div class="spinner-border text-info"><span class="sr-only">Loading...</span></div>',
        email: "",
      },
      inputemail: "",
      text_update_email: "Update",
    };
  },
  mounted() {
    if (
      this.last_activity == "" ||
      this.last_activity == null ||
      this.last_activity == undefined
    ) {
      this.profile.tgl_aktivitas = "";
    }
    if (this.email !== "" && this.email !== null && this.email !== undefined) {
      this.profile.email = this.email;
    }
    this.getProfile();
  },
  methods: {
    async getProfile() {
      let response = await axios.post(
        'api/profileUser',
        {
          kd_agen: this.agen,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("authToken"),
          },
        }
      );
      if (response.status == 200) {
        this.profile.nama = response.data.nama
        this.profile.pemilik = response.data.nama_pemilik
        this.profile.saldo = "Rp " + this.numberFormatFn(response.data.saldo)
        this.profile.alamat = response.data.alamat
        this.profile.deposit_now =
          ": Rp " + this.numberFormatFn(response.data.deposit_now);
        this.profile.deposit_last =
          ": Rp " + this.numberFormatFn(response.data.deposit_last);
        this.profile.transaksi_now =
          ": " + this.numberFormatFn(response.data.transaksi) + " kali";
        this.profile.transaksi_last =
          ": " + this.numberFormatFn(response.data.transaksikemaren) + " kali";
        if (
          response.data.tgl_aktivitas == null ||
          response.data.tgl_aktivitas == "" ||
          response.data.tgl_aktivitas == undefined
        ) {
          this.profile.tgl_aktivitas = "";
        } else {
          this.profile.tgl_aktivitas = moment(
            response.data.tgl_aktivitas
          ).format("LL");
        }
        if (
          response.data.email !== "" &&
          response.data.email !== null &&
          response.data.email !== undefined
        ) {
          this.profile.email = response.data.email;
        } else {
          this.profile.email = "";
        }
      } else {
        localStorage.removeItem("authToken");
        localStorage.removeItem("resellerData");
        Cookies.remove("authToken");
        // window.location = '/login'
      }
    },
    async addEmail() {
      this.text_update_email =
        'Processing <div class="spinner-border spinner-border-sm text-white"><span class="sr-only">Loading...</span></div>';
      let response = await axios.post(
        `api/editEmail`,
        { email: this.inputemail },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("authToken"),
          },
        }
      );
      if (response.data.message == "sukses") {
        this.profile.email = this.inputemail;
        let reseller = JSON.parse(localStorage.getItem("resellerData"));
        reseller.email = this.inputemail;
        // console.log(reseller);
        localStorage.setItem("resellerData", JSON.stringify(reseller));
        Swal.fire({
          icon: "success",
          title: "Sukses",
          text: "Email berhasil ditambahkan ke akun",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Terjadi kesalahan, Laporkan ke CS",
        });
        // console.log(response.data);
      }
    },
  },
};
</script>