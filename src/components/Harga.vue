<template>
  <div class="container-fluid">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 class="h3 mb-2 text-gray-800">Harga</h1>
      <a
        href="#"
        class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
        @click="downloadHarga"
        ><i class="fas fa-file-excel fa-sm text-white-50"></i> Generate Excel</a
      >
    </div>
    <div class="card shadow mb-4">
      <div class="card-header py-3 d-flex justify-content-between">
        <div class="input-group mb-3">
          <select class="custom-select" v-model="selected">
            <option
              v-for="operator in provider"
              :value="operator.kode"
              :key="operator.kode"
            >
              {{ operator.nama }}
            </option>
          </select>
          <select
            class="custom-select"
            v-model="group"
            v-if="selected != 'ppob'"
          >
            <option value="umum">Umum</option>
            <option value="group">Group</option>
          </select>
          <div class="input-group-append">
            <button
              class="btn btn-outline-secondary"
              type="button"
              @click="getProduct"
            >
              Cari
            </button>
          </div>
        </div>
      </div>
      <div class="card-body">
        <vue-good-table
          styleClass="vgt-table striped condensed bordered"
          :columns="columns"
          :rows="rows"
          :line-numbers="true"
          :search-options="{
            enabled: true,
            placeholder: 'Ketikkan kode atau nama produk kemudian tekan ENTER',
            trigger: 'enter',
          }"
          :isLoading="isLoading"
          :pagination-options="{
            enabled: true,
            mode: 'pages',
            perPage: 25,
            perPageDropdown: [10, 25, 50, 100],
          }"
        >
          <template slot="table-row" slot-scope="props">
            <span v-if="props.column.field == 'gangguan'">
              <span v-if="rows[props.row.originalIndex].gangguan == 0">
                <i class="fas fa-check-circle text-info"></i> Lancar
              </span>
              <span v-else>
                <i class="fas fa-exclamation-circle text-warning"></i> Gangguan
              </span>
            </span>
          </template>
        </vue-good-table>
      </div>
    </div>
  </div>
</template>

<script>
import "vue-good-table-next/dist/vue-good-table-next.css";
import { VueGoodTable } from "vue-good-table-next";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
import base64 from 'base-64'
import grab from "../helper/grab";

export default {
  mixins:[grab],
  components: {
    VueGoodTable,
  },
  beforeMount() {
    const reseller = JSON.parse(localStorage.getItem("resellerData"));
    this.agen = reseller.reseller.kode;
  },
  props: {
    numberFormat: { type: Function },
  },
  data() {
    return {
      agen: "",
      group: "umum",
      provider: [{ kode: "", nama: "loading..." }],
      selected: "",
      isLoading: true,
      rows: [],
      columns: [
        {
          label: "Kode",
          field: "kode",
        },
        {
          label: "Produk",
          field: "nama",
        },
        {
          label: "Harga",
          field: this.fealdFn,
          type: "number",
          formatFn: this.numberFormat,
        },
        {
          label: "Status",
          field: "gangguan",
        },
        {
          label: "Aktif",
          field: "aktif",
          hidden: true,
        },
      ],
    };
  },
  mounted() {
    this.getProvider();
    this.getProduct();
  },
  methods: {

    fealdFn(rowObj) {
      if (rowObj.harga_jual === undefined) {
        return rowObj.fee;
      }
      return rowObj.harga_jual;
    },
    async getProvider() {
      let response = await axios
        .post(
          "api/operator",
          {
            kd_agen: this.agen,
          },
          {
            headers: {
              Authorization: "Bearer " + Cookies.get("authToken"),
            },
          }
        )
        .catch((error) => {
          if (error.response.status === 401) {
            Swal.fire({
              title: "Unauthorized",
              text: "Silahkan login kembali",
              icon: "error",
              confirmButtonText: "Login",
            }).then((result) => {
              if (result.value) {
                localStorage.removeItem("authToken");
                localStorage.removeItem("resellerData");
                Cookies.remove("authToken", { path: "/" });
                window.location.reload();
              }
            });
          }
        });
      if (response.status == 200) {
        this.provider = response.data;
        this.provider.unshift({ kode: "", nama: "-- All Provider --" });
        this.provider.push({ kode: "ppob", nama: "All PPOB" });
      }
    },
    async getProduct(e) {
      this.isLoading = true;
      if (this.selected == "ppob") {
        this.columns[2].label = "Fee";
        var response = await axios
          .post(
            "api/hargaPPOB",
            { validateStatus: false },
            {
              headers: {
                Authorization: "Bearer " + Cookies.get("authToken"),
              },
            }
          )
          .catch((error) => {
            if (error.response.status === 401) {
              Swal.fire({
                title: "Unauthorized",
                text: "Silahkan login kembali",
                icon: "error",
                confirmButtonText: "Login",
              }).then((result) => {
                if (result.value) {
                  localStorage.removeItem("authToken");
                  localStorage.removeItem("resellerData");
                  Cookies.remove("authToken", { path: "/" });
                  window.location.reload();
                }
              });
            }
          });
      } else {
        this.columns[2].label = "Harga";
        var response = await axios
          .post(
            "api/harga",
            { kd_agen: this.agen, provider: this.selected, group: this.group },
            {
              headers: {
                Authorization: "Bearer " + Cookies.get("authToken"),
              },
            }
          )
          .catch((error) => {
            if (error.response.status === 401) {
              Swal.fire({
                title: "Unauthorized",
                text: "Silahkan login kembali",
                icon: "error",
                confirmButtonText: "Login",
              }).then((result) => {
                if (result.value) {
                  localStorage.removeItem("authToken");
                  localStorage.removeItem("resellerData");
                  Cookies.remove("authToken", { path: "/" });
                  window.location.reload();
                }
              });
            }
          });
      }
      if (response.status == 200) {
        if (response.data.length == 0) {
          Swal.fire(
            "Tidak ada harga group",
            "Harga berdasarkan level tidak ditemukan",
            "error"
          );
        } else {
          this.rows = response.data;
        }
        this.isLoading = false;
      }
      //   else {
      //     localStorage.removeItem("authToken");
      //     localStorage.removeItem("resellerData");
      //     // window.location = '/login'
      //   }
    },
    downloadHarga() {
      Swal.fire({
        title: "Pilih kategori produk",
        input: "select",
        inputOptions: {
          non: "Non PPOB",
          ppob: "All PPOB",
        },
        inputPlaceholder: "-- kategori --",
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: (value) => {
          if (value == "ppob") {
            return axios
              .post(
                "api/cetakHargaPPOB",
                {},
                {
                  headers: {
                    Authorization: "Bearer " + Cookies.get("authToken"),
                  },
                }
              )
              .then((response) => {
                Swal.fire({
                  icon: "success",
                  title: "Success",
                  footer: `<a href="api/${response.data.url}" ><strong>Klik untuk Download</strong></a>`,
                });
              })
              .catch((error) => {
                console.log(error);
                if (error.response.status === 401) {
                  Swal.fire({
                    title: "Unauthorized",
                    text: "Silahkan login kembali",
                    icon: "error",
                    confirmButtonText: "Login",
                  }).then((result) => {
                    if (result.value) {
                      localStorage.removeItem("authToken");
                      localStorage.removeItem("resellerData");
                      Cookies.remove("authToken", { path: "/" });
                      window.location.reload();
                    }
                  });
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Gagal mengambil data",
                  });
                }
              });
          } else if (value == "non") {
            return axios
              .post(
                "api/cetakHarga",
                {
                  kd_agen: this.agen,
                },
                {
                  headers: {
                    Authorization: "Bearer " + Cookies.get("authToken"),
                  },
                }
              )
              .then((response) => {
                Swal.fire({
                  icon: "success",
                  title: "Success",
                  footer: `<a href="api${response.data.url+'/'+this.valueToEnc(this.agen)}"><strong>Klik untuk Download</strong></a>`,
                });
              })
              .catch((error) => {
                if (error.response.status === 401) {
                  Swal.fire({
                    title: "Unauthorized",
                    text: "Silahkan login kembali",
                    icon: "error",
                    confirmButtonText: "Login",
                  }).then((result) => {
                    if (result.value) {
                      localStorage.removeItem("authToken");
                      localStorage.removeItem("resellerData");
                      Cookies.remove("authToken", { path: "/" });
                      window.location.reload();
                    }
                  });
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Gagal mengambil data",
                  });
                }
              });
          } else {
            Swal.fire(`Pilih kategori terlebih dahulu`);
          }
        },
        allowOutsideClick: () => !Swal.isLoading(),
      });
    },
  },
};
</script>