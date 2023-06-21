<template>
  <ul
    class="navbar-nav bg-gradient-danger sidebar sidebar-dark accordion"
    id="accordionSidebar"
  >
    <!-- Sidebar - Brand -->
    <a
      class="sidebar-brand d-flex align-items-center justify-content-center"
      href="#"
    >
      <div class="sidebar-brand-icon">
        <i class="fas fa-user-tie"></i>
      </div>
      <div class="sidebar-brand-text mx-3 d-flex-justify-content-center">
        <div class="row">
          <div class="col-12 text-truncate d-flex">Webreport</div>
          <div
            class="col-12 small d-flex align-items-center"
            @click="requestTiketTopup"
          >
            <i class="fa fa-plus-circle mr-1"></i>
            <span>{{ showSaldoUser }}</span>
          </div>
          <div class="col-12 small d-flex align-items-center">
            <i class="fa fa-ban mr-1" aria-hidden="true"></i>
            <span>{{ showSaldoMinimal }}</span>
          </div>
        </div>
      </div>
    </a>

    <!-- Divider -->
    <hr class="sidebar-divider my-0" />

    <!-- Nav Item - Dashboard -->
    <li class="nav-item">
      <router-link class="nav-link" exact to="/dashboard">
        <i class="fas fa-fw fa-home"></i>
        <span>Beranda</span>
      </router-link>
    </li>

    <!-- Divider -->
    <hr class="sidebar-divider" />

    <!-- Heading -->
    <div class="sidebar-heading">Navigasi</div>

    <li class="nav-item">
      <a
        class="nav-link collapsed"
        href="#"
        data-toggle="collapse"
        data-target="#collapseTransaksi"
        aria-expanded="true"
        aria-controls="collapseUtilities"
      >
        <i class="fas fa-fw fa-chart-line"></i>
        <span>Transaksi</span>
      </a>
      <div
        id="collapseTransaksi"
        class="collapse"
        aria-labelledby="headingUtilities"
        data-parent="#accordionSidebar"
      >
        <div class="bg-white py-2 collapse-inner rounded">
          <h6 class="collapse-header">Log transaction:</h6>
          <router-link class="collapse-item" to="/history-transaksi"
            >History Transaksi</router-link
          >
          <router-link
            class="collapse-item"
            v-if="isPajak"
            to="/history-transaksi-pajak"
            >Transaksi Pajak
          </router-link>
        </div>
      </div>
    </li>

    <li class="nav-item">
      <router-link class="nav-link" to="/deposit">
        <i class="fas fa-fw fa-wallet"></i>
        <span>Deposit</span>
      </router-link>
    </li>

    <li class="nav-item">
      <router-link class="nav-link" to="/print-struk">
        <i class="fas fa-fw fa-print"></i>
        <span>Cetak Struk</span>
      </router-link>
    </li>

    <li class="nav-item" v-if="isPajak">
      <router-link class="nav-link" to="/print-faktur">
        <i class="fas fa-fw fa-file-excel"></i>
        <span>Faktur Pajak</span>
      </router-link>
    </li>

    <!-- Divider -->
    <hr class="sidebar-divider" />

    <li class="nav-item">
      <a
        class="nav-link collapsed"
        href="#"
        data-toggle="collapse"
        data-target="#collapseInformasi"
        aria-expanded="true"
        aria-controls="collapseUtilities"
      >
        <i class="fas fa-fw fa-question-circle"></i>
        <span>Informasi</span>
      </a>
      <div
        id="collapseInformasi"
        class="collapse"
        aria-labelledby="headingUtilities"
        data-parent="#accordionSidebar"
      >
        <div class="bg-white py-2 collapse-inner rounded">
          <h6 class="collapse-header">Harga, panduan, kontak</h6>
          <router-link class="collapse-item" to="/post/bantuan"
            >Format transaksi</router-link
          >
          <router-link class="collapse-item" v-if="isPajak" to="/post/tutorial"
            >Tutorial Pajak</router-link
          >
          <router-link class="collapse-item" to="/harga">Harga</router-link>
          <router-link class="collapse-item" to="/post/promo"
            >Program</router-link
          >
          <router-link class="collapse-item" to="/post/kontak"
            >Hubungi Kami</router-link
          >
        </div>
      </div>
    </li>

    <!-- Divider -->
    <hr class="sidebar-divider d-none d-md-block" />

    <!-- Sidebar Toggler (Sidebar) -->
    <div class="text-center d-none d-md-inline">
      <button class="rounded-circle border-0" id="sidebarToggle"></button>
    </div>
  </ul>
</template>
<script>
import Swal from "sweetalert2";
import axios from "axios";
import wr from "../../assets/js/wr";
import grab from "../../helper/grab";
import moment from "moment";
export default {
  data() {
    return {
      saldo: "",
      kode: "",
      nominalTopUp: "",
      saldoMinimal: "",
    };
  },
  computed: {
    showSaldoUser() {
      const idr =
        this.saldo === null ||
        this.saldo === "" ||
        this.saldo === "0" ||
        this.saldo === undefined
          ? this.formatCurrency("0", "IDR", 0)
          : this.formatCurrency(this.saldo, "IDR", 0);
      return idr;
    },
    showSaldoMinimal() {
      // return this.formatCurrency(this.saldoMinimal, "IDR", 0);
      const idr =
        this.saldoMinimal === null ||
        this.saldoMinimal === "" ||
        this.saldoMinimal === "0" ||
        this.saldoMinimal === undefined
          ? this.formatCurrency("0", "IDR", 0)
          : this.formatCurrency(this.saldoMinimal, "IDR", 0);
      return idr;
    },
    isPajak: function () {
      return this.kode.substr(0, 3) == "UPS" ? true : false;
    },
  },
  // computed: {
  mixins: [wr, grab],
  methods: {
    formatCurrency(value, currency, digit = 2) {
      var formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: digit,
      });
      return formatter.format(value);
    },
    showResult(state, result) {
      switch (state.toLowerCase()) {
        case "sukses":
          let tempSplit = result.split("&");
          const nama = tempSplit[0].split("=").pop();
          const tiket = tempSplit[1].split("=").pop();
          const pesan = tempSplit[2].split("=").pop();
          Swal.fire({
            icon: "success",
            title: "Tiket Deposit " + this.formatNumber(tiket),
            text: pesan,
          });
          break;
      }
    },
    requestTiketTopup() {
      Swal.fire({
        text: "Masukkan nominal deposit",
        title: `Request Topup Saldo ${this.kode}`,
        input: "number",
        inputPlaceholder: "Masukkan jumlah deposit",
        inputAttributes: {
          autocapitalize: "off",
        },
        showCancelButton: true,
        confirmButtonText: "Ambil tiket",
        showLoaderOnConfirm: true,
        preConfirm: (nominal) => {
          this.nominalTopUp = nominal;
          let tiket = JSON.parse(localStorage.getItem("tiket"));
          if (tiket === null || tiket.nominal !== nominal) {
            return this.getTiketDeposit(this.kode, nominal);
          } else {
          }
          return true;
        },
      }).then((result) => {
        if (result.isConfirmed) {
          if (result.value.status === 200) {
            let split = result.value.data.split("&");
            const nama = split[0].split("=").pop();
            const tiket = split[1].split("=").pop();
            const pesan = split[2].split("=").pop();
            const expired = moment()
              .add(6, "hours")
              .format("YYYY-MM-DD HH:mm:ss");
            let itemsArray = {
              nama: nama,
              tiket: tiket,
              pesan: pesan,
              nominal: this.nominalTopUp,
              expired: expired,
            };
            localStorage.setItem("tiket", JSON.stringify(itemsArray));
            Swal.fire({
              icon: "success",
              title: "Tiket Deposit " + this.formatNumber(tiket),
              text: pesan,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Tiket Deposit " + this.formatNumber(this.nominalTopUp),
              text: "Gagal Ambil Tiket Deposit",
            });
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Tiket Deposit " + this.formatNumber(this.nominalTopUp),
            text: "Gagal Ambil Tiket Deposit",
          });
        }
      });
    },
  },
  mounted() {
    const reseller =
      JSON.parse(localStorage.getItem("resellerData")).reseller || [];
    this.kode = reseller.kode;
    this.saldo = reseller.saldo;
    this.saldoMinimal = reseller.saldo_minimal;
  },
};
</script>

<style scoped>
.router-link-active {
  color: #f5f5f5;
}
</style>