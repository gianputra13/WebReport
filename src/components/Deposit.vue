<template>
  <div class="container-fluid">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 class="h3 mb-2 text-gray-800">Deposit</h1>
    </div>
    <div class="card shadow mb-4">
      <div
        class="
          card-header
          py-3
          d-sm-flex
          align-items-center
          justify-content-between
        "
      >
        <date-picker
          v-model="rangeDate"
          locale="id"
          type="date"
          range
          multiCalendars
          placeholder="Pilih rentang tanggal"
        ></date-picker>
        <form class="form-inline">
          <div class="form-group">
            <select
              class="custom-select custom-select-sm shadow-sm"
              v-model="selected"
            >
              <option value="all">-- All --</option>
              <option value="transaksi">Transaksi</option>
              <option value="deposit">Deposit</option>
            </select>
          </div>
          <button
            type="button"
            class="btn btn-primary btn-sm shadow-sm w-xs-100 ml-md-3"
            @click="getHistoryTopup()"
          >
            <i class="fas fa-filter"></i> Filter
          </button>
        </form>
      </div>
      <div class="card-body">
        <vue-good-table
          styleClass="vgt-table striped condensed"
          max-height="70vh"
          :fixed-header="true"
          mode="remote"
          :columns="columns"
          :rows="rows"
          :search-options="{
            enabled: true,
            trigger: 'enter',
            placeholder: 'Masukkan keyword kolom keterangan dan tekan ENTER',
          }"
          :pagination-options="{
            enabled: true,
            perPage: this.serverParams.perPage,
            mode: 'records',
            perPageDropdown: [100, 500, 1000, 2000, 5000],
            dropdownAllowAll: false,
          }"
          :totalRows="totalRecords"
          v-model="isLoading"
          v-on:page-change="onPageChange"
          v-on:per-page-change="onPerPageChange"
          v-on:search="onSearch"
          compactMode
        >
          <template slot="table-row" slot-scope="props">
            <span v-if="props.column.field == 'status'">
              <span v-if="rows[props.row.originalIndex].status == 'B'">
                <i class="fas fa-check-circle text-warning"></i> Waiting
              </span>
              <span v-else-if="rows[props.row.originalIndex].status == 'S'">
                <i class="fas fa-check-circle text-info"></i> Diproses
              </span>
              <span v-else-if="rows[props.row.originalIndex].status == 'P'">
                <i class="fas fa-check-circle text-info"></i> Pending
              </span>
              <span v-else-if="rows[props.row.originalIndex].status == 'G'">
                <i class="fas fa-check-circle text-danger"></i> Gagal
              </span>
              <span v-else>
                <i class="fas fa-check-circle text-success"></i> Sukses
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
import DatePicker from "@vuepic/vue-datepicker";
import moment from "moment";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import "@vuepic/vue-datepicker/dist/main.css";

export default {
  components: {
    VueGoodTable,
    DatePicker,
  },
  mounted() {
    this.getHistoryTopup();
  },
  props: {
    agen: {
      type: String,
      required: true,
    },
    numberFormat: { type: Function },
  },
  data() {
    return {
      isLoading: false,
      selected: "all",
      rangeDate: [],
      columns: [
        {
          label: "Tanggal",
          field: "tanggal",
          type: "date",
          dateInputFormat: "yyyy-MM-dd HH:mm:ss",
          dateOutputFormat: "yyyy-MM-dd HH:mm",
          sortable: false,
          tdClass: "small text-left",
          thClass: "small font-weight-bold text-left",
        },
        {
          label: "Bank",
          field: "keterangan",
          sortable: false,
          tdClass: "small",
          thClass: "small font-weight-bold",
        },
        {
          label: "Jumlah Deposit",
          field: "jumlah",
          type: "number",
          sortable: false,
          formatFn: this.numberFormat,
          tdClass: "small",
          thClass: "small font-weight-bold",
        },
        {
          label: "Saldo setelah Deposit",
          field: "saldo_akhir",
          sortable: false,
          type: "number",
          formatFn: this.numberFormat,
          tdClass: "small",
          thClass: "small font-weight-bold",
        },
      ],
      rows: [],
      serverParams: {
        columnFilters: {},
        sort: [
          {
            field: "", // example: 'name'
            type: "", // 'asc' or 'desc'
          },
        ],
        page: 1, // what page I want to show
        perPage: 100, // how many items I'm showing per page
      },
    };
  },
  methods: {
    async getHistoryTopup() {
      const params = {
        kd_agen: JSON.parse(localStorage.getItem("resellerData")).reseller.kode,
        tgl_a:
          this.rangeDate.length === null
            ? moment().startOf("month").format("YYYY-MM-DD")
            : moment(this.rangeDate[0]).format("YYYY-MM-DD"),
        tgl_b:
          this.rangeDate.length === null
            ? moment().endOf("month").format("YYYY-MM-DD")
            : moment(this.rangeDate[1]).format("YYYY-MM-DD"),
        jenis: this.selected,
        page: this.serverParams.page,
      };
      if (this.serverParams.searchTerm !== undefined) {
        params.search = this.serverParams.searchTerm;
      }
      if (this.serverParams.currentPerPage === undefined) {
        params.perPage = this.serverParams.perPage;
      } else {
        params.perPage = this.serverParams.currentPerPage;
      }
      this.isLoading = true;
      // console.log(params)
      let response = await axios
        .post("api/depositBank", params, {
          headers: {
            Authorization: "Bearer " + Cookies.get("authToken"),
          },
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
          }
        });
      if (response.status == 200) {
        this.totalRecords = response.data.total;
        this.rows = response.data.data;
      }
      this.isLoading = false;
    },
    updateParams(newProps) {
      this.serverParams = Object.assign({}, this.serverParams, newProps);
    },
    onPageChange(params) {
      this.updateParams({ page: params.currentPage });
      this.getHistoryTopup();
    },
    onPerPageChange(params) {
      this.updateParams({ perPage: params.currentPerPage });
      this.getHistoryTopup();
    },
    onSearch(params) {
      this.updateParams(params);
      this.getHistoryTopup();
    },
  },
};
</script>