<template>
  <nav
    class="
      navbar navbar-expand navbar-light
      bg-white
      topbar
      mb-4
      static-top
      shadow
    "
  >
    <!-- Sidebar Toggle (Topbar) -->
    <button
      id="sidebarToggleTop"
      class="btn btn-link d-md-none rounded-circle mr-3"
    >
      <i class="fa fa-bars"></i>
    </button>

    <!-- Topbar Navbar -->
    <ul class="navbar-nav ml-auto">
      <!-- Nav Item - Alerts -->
      <li class="nav-item dropdown no-arrow mx-1">
        <a
          class="nav-link dropdown-toggle"
          href="#"
          id="alertsDropdown"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <i class="fas fa-bell fa-fw"></i>
          <!-- Counter - Alerts -->
          <span
            class="badge badge-danger badge-counter"
            v-if="Object.values(this.tiket).length != 0"
            >1</span
          >
        </a>
        <!-- Dropdown - Alerts -->
        <div
          class="
            dropdown-list dropdown-menu dropdown-menu-right
            shadow
            animated--grow-in
          "
          aria-labelledby="alertsDropdown"
        >
          <h6 class="dropdown-header">Informasi</h6>
          <a
            class="dropdown-item d-flex align-items-center"
            href="#"
            v-if="Object.values(this.tiket).length != 0"
          >
            <div class="mr-3">
              <div class="icon-circle bg-success">
                <i class="fas fa-donate text-white"></i>
              </div>
            </div>
            <div>
              <div class="small text-gray-500">Tiket Deposit</div>
              {{ tiket.pesan }}
            </div>
          </a>
          <a class="dropdown-item d-flex align-items-center" href="#" v-else>
            <div class="mr-3">
              <div class="icon-circle bg-warning">
                <i class="fas fa-exclamation-triangle text-white"></i>
              </div>
            </div>
            <div>
              <div class="small text-gray-500">Hari ini</div>
              <span class="font-weight-bold">Tidak ada informasi</span>
            </div>
          </a>
          <a
            class="dropdown-item text-center small text-gray-500"
            href="#"
            @click="clearNotif"
            >Hapus notifikasi</a
          >
        </div>
      </li>

      <div class="topbar-divider d-none d-sm-block"></div>

      <!-- Nav Item - User Information -->
      <li class="nav-item dropdown no-arrow">
        <a
          class="nav-link dropdown-toggle"
          href="#"
          id="userDropdown"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <span class="mr-2 d-none d-lg-inline text-gray-600 small">{{
            nama
          }}</span>
          <img
            class="img-profile rounded-circle"
            src="https://source.unsplash.com/random/60x60"
          />
        </a>
        <!-- Dropdown - User Information -->
        <div
          class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
          aria-labelledby="userDropdown"
        >
          <router-link class="dropdown-item" to="/profile">
            <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
            Profile
          </router-link>
          <router-link class="dropdown-item" to="/password">
            <i class="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
            Ganti password
          </router-link>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="#" @click="logout">
            <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
            Logout
          </a>
        </div>
      </li>
    </ul>
  </nav>
</template>
<script>
export default {
  created() {
    const data = localStorage.getItem("resellerData");
    this.nama = JSON.parse(data).reseller.nama;
  },
  data() {
    return {
      tiket: {},
      nama: "",
    };
  },
  emits: ["logout"],
  mounted() {
    // console.log(Object.values(this.tiket).length)
    this.checkTiket();
  },
  methods: {
    checkTiket() {
      if (localStorage.getItem("tiket")) {
        let tiket = JSON.parse(localStorage.getItem("tiket"));
        if (moment().isAfter(tiket.expired, "YYYY-MM-DD HH:mm:ss")) {
          this.tiket = {};
          localStorage.removeItem("tiket");
        } else {
          this.tiket = tiket;
        }
      }
    },
    logout() {
      this.$emit("logout");
    },
    clearNotif() {
      localStorage.removeItem("tiket");
      this.tiket = {};
    },
  },
};
</script>