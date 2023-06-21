<template>
  <div class="container-fluid">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 class="h3 mb-2 text-gray-800">
        History Transaksi yang dikenakan Pajak
      </h1>
    </div>
    <!-- DataTales Example -->
    <div class="card shadow mb-4">
      <div class="card-header py-3 d-flex justify-content-between">
        <form action="" class="form-inline">
          <div class="form-group">
            <date-picker v-model:value="rangeDate" type="date" valueType="format" range
              placeholder="Pilih rentang tanggal"></date-picker>
          </div>
          <button type="button" class="btn btn-primary btn-sm ml-md-3 w-xs-100 shadow-sm"
            @click="getHistoryTransaction()">
            <i class="fas fa-filter"></i> Filter
          </button>
        </form>
        <a href="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
          @click="requestEmailTrasaction()"><i class="fas fa-file-excel fa-sm text-white-50"></i> Generate
          Excel</a>
      </div>
      <div class="card-body">
        <vue-good-table styleClass="vgt-table striped condensed" max-height="70vh" :fixed-header="true" mode="remote"
          :columns="columns" :rows="rows" :search-options="{
            enabled: true,
            trigger: 'enter',
            placeholder: 'Masukkan nomor tujuan, SN atau status',
          }" :pagination-options="{
  enabled: true,
  perPage: this.serverParams.perPage,
  mode: 'records',
  perPageDropdown: [25, 50, 100],
  dropdownAllowAll: false,
}" :totalRows="totalRecords" :isLoading="isLoading" v-on:page-change="onPageChange"
          v-on:per-page-change="onPerPageChange" v-on:search="onSearch" compactMode>
        </vue-good-table>
      </div>
    </div>
  </div>
</template>

<script>
import "vue-good-table-next/dist/vue-good-table-next.css";
import { VueGoodTable } from "vue-good-table-next";
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import 'vue-datepicker-next/locale/id';
import moment from "moment";
import Grab from "../../helper/grab"
import Swal from 'sweetalert2';
import axios from "axios";

export default {
  components: {
    DatePicker,
    VueGoodTable,
  },
  props: {
    numberFormat: { type: Function },
  },
  mounted() {
    const reseller = JSON.parse(localStorage.getItem("resellerData")).reseller || []
    this.agen = reseller.kode
    this.getHistoryTransaction();
  },
  data() {
    return {
      lang: {
        formatLocale: {
          firstDayOfWeek: 1,
        },
        monthBeforeYear: false,
      },
      rangeDate: [moment().utc(0).format('YYYY-MM-DD'), moment().utc(0).format('YYYY-MM-DD')],
      isLoading: false,
      columns: [
        {
          label: "Tgl transaksi",
          field: "tgl_entri",
          type: "date",
          dateInputFormat: "yyyy-MM-dd HH:mm:ss",
          dateOutputFormat: "yyyy-MM-dd HH:mm",
          sortable: false,
          tdClass: "small text-left",
          thClass: "small font-weight-bold text-left",
        },
        {
          label: "Kode",
          field: "kode_produk",
          sortable: false,
          tdClass: "small",
          thClass: "small font-weight-bold",
        },
        {
          label: "Harga",
          field: "harga",
          type: "number",
          sortable: false,
          formatFn: this.numberFormat,
          tdClass: "small",
          thClass: "small font-weight-bold",
        },
        {
          label: "Tujuan",
          field: "tujuan",
          sortable: false,
          tdClass: "small",
          thClass: "small font-weight-bold",
        },
        {
          label: "SN",
          field: "sn",
          sortable: false,
          tdClass: "small",
          thClass: "small font-weight-bold",
        },
      ],
      rows: [],
      totalRecords: 0,
      serverParams: {
        // a map of column filters example: {name: 'john', age: '20'}
        columnFilters: {},
        sort: [
          {
            field: "", // example: 'name'
            type: "", // 'asc' or 'desc'
          },
        ],

        page: 1, // what page I want to show
        perPage: 25, // how many items I'm showing per page
      },
    };
  },
  mixins:[Grab],
  methods: {
    requestEmailTrasaction() {
      const b = moment(this.rangeDate[0], 'YYYY-MM-DD');
      const a = moment(this.rangeDate[1], 'YYYY-MM-DD');
      if (a.diff(b, 'days') >= 7) {
        Swal.fire({
          icon: 'error',
          title: 'Oops... Maaf!',
          text: 'Rentang tanggal maksimal 7 hari',
        })
      } else {
        const params = {
          kd_agen: this.agen,
          tgl_a: this.rangeDate[0],
          tgl_b: this.rangeDate[1]
        }
        Swal.fire({
          icon: 'warning',
          title: 'Generate report',
          text: 'File excel akan dikirim ke email',
          confirmButtonText: 'Kirim permintaan',
          showLoaderOnConfirm: true,
          preConfirm: () => {
            return this.postEmailUser(params)
          }
        })
          .then((response) => {
            if (response.isConfirmed) {
              if (response.value.status === 200) {
                Swal.fire({
                  icon: 'success',
                  title: 'Sukses',
                  text: 'Email telah dikirim ke '+ response.value.data.message +' (cek inbox & spam)'
                })
              } else {
                Swal.fire({
                  icon: 'error',
                  title: response.value.data.message,
                  text: 'Silahkan update di halaman profile'
                })
              }
            } else {
              Swal.fire({
                icon: 'error',
                title: response.value.data.message,
                text: `Silahkan update di halaman profile`
              })
            }
          }).catch((response) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops... Error!',
              text: response
            })
          })
      }
    },
    setupResponGetHistory(respon) {
      this.totalRecords = respon.total
      this.rows = respon.data
    },
    async getHistoryTransaction() {
      const b = moment(this.rangeDate[0], 'YYYY-MM-DD');
      const a = moment(this.rangeDate[1], 'YYYY-MM-DD');
      if (a.diff(b, 'days') >= 7) {
        Swal.fire({
          icon: 'error',
          title: 'Oops... Maaf!',
          text: 'Rentang tanggal maksimal 7 hari',
        })
      } else {
        let params = {
          kd_agen: this.agen,
          tgl_awal: this.rangeDate[0],
          tgl_akhir: this.rangeDate[0],
          page: this.serverParams.page
        }
        if (this.serverParams.searchTerm !== undefined) {
          params.search = this.serverParams.searchTerm
        }
        if (this.serverParams.currentPerPage === undefined) {
          params.perPage = this.serverParams.perPage
        } else {
          params.perPage = this.serverParams.currentPerPage
        }
        this.isLoading = true
        let respon = await this.getTransaksiHistoryPajak(this.serverParams, params)  
        if (respon.status == 200) {
          this.isLoading = false
          this.setupResponGetHistory(respon.data)
        } else {
          this.logoutGrab()
        }
      }
    },
    updateParams(newProps) {
      this.serverParams = Object.assign({}, this.serverParams, newProps);
    },
    onPageChange(params) {
      this.updateParams({ page: params.currentPage });
      this.getHistoryTransaction();
    },
    onPerPageChange(params) {
      this.updateParams({ perPage: params.currentPerPage });
      this.getHistoryTransaction();
    },
    onSearch(params) {
      this.updateParams(params);
      this.getHistoryTransaction();
    }
  },
};
</script>