<template>
  <div class="container-fluid">
    <!-- Page Heading -->
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 class="h3 mb-0 text-gray-800">Beranda</h1>
    </div>

    <!-- Content Row -->
    <div class="row">
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-secondary shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div
                  class="text-xs font-weight-bold text-dark text-uppercase mb-1"
                >
                  Transaksi Hari ini
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">
                  {{ todaytransaction.total }}
                </div>
              </div>
              <div class="col-auto">
                <i class="fas fa-chart-bar fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-success shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div
                  class="
                    text-xs
                    font-weight-bold
                    text-success text-uppercase
                    mb-1
                  "
                >
                  Transaksi Sukses
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">
                  {{ todaytransaction.sukses }}
                </div>
              </div>
              <div class="col-auto">
                <i class="fas fa-check-circle fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-warning shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div
                  class="
                    text-xs
                    font-weight-bold
                    text-warning text-uppercase
                    mb-1
                  "
                >
                  Transaksi Pending
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">
                  {{ todaytransaction.pending }}
                </div>
              </div>
              <div class="col-auto">
                <i class="fas fa-exclamation-circle fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-danger shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div
                  class="
                    text-xs
                    font-weight-bold
                    text-danger text-uppercase
                    mb-1
                  "
                >
                  Transaksi Gagal
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">
                  {{ todaytransaction.gagal }}
                </div>
              </div>
              <div class="col-auto">
                <i class="fas fa-times-circle fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Content Row -->
    <div class="row">
      <div class="col-12">
        <div class="card shadow mb-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">
              Transaksi per jam pada {{ yesterday }}
              <!-- Transaksi per jam pada {{ yesterday | humanDate }} -->
            </h6>
          </div>
          <div class="card-body">
            <div class="chart-bar">
              <div class="data-table-loading" v-if="isloading.perJam">
                <div class="data-table-loading-spinner"></div>
                <div class="data-table-loading-text">Loading Data</div>
              </div>
              <canvas id="myBarChart"></canvas>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="card shadow mb-4">
          <div
            class="
              card-header
              py-3
              d-flex
              flex-row
              align-items-center
              justify-content-between
            "
          >
            <h6 class="m-0 font-weight-bold text-primary">
              Tren Transaksi 2 minggu terakhir
            </h6>
          </div>
          <div class="card-body">
            <div class="chart-area">
              <div class="data-table-loading" v-if="isloading.yesterday">
                <div class="data-table-loading-spinner"></div>
                <div class="data-table-loading-text">Loading Data</div>
              </div>
              <canvas id="myAreaChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import id from "moment/dist/locale/id";
import Chart from "chart.js/dist/chart";
import grab from "../helper/grab";

export default {
  created() {
    moment.defineLocale("id", id);
  },
  data() {
    return {
      agen: "",
      yesterday: moment().subtract(1, "days").format("dddd DD MMMM YYYY"),
      trenlabels: [],
      trendata: [],
      trafiklabels: [],
      trafikdata: [],
      todaytransaction: {
        total: 0,
        sukses: 0,
        gagal: 0,
        pending: 0,
      },
      isloading: {
        perJam: false,
        yesterday: false,
      },
      reseller: [],
    };
  },
  props: {
    numberFormat: {
      type: Function,
    },
  },
  filters: {
    humanDate(date) {
      return moment(date, "YYYY-MM-DD").format("LL");
    },
  },
  mixins: [grab],
  methods: {
    setupSuksesGetRekap(respon) {
      this.todaytransaction.total = respon.transaksi.total_trx;
      this.todaytransaction.sukses = respon.transaksi.sukses;
      this.todaytransaction.gagal = respon.transaksi.gagal;
      this.todaytransaction.pending = respon.transaksi.pending;
    },
    setupSuksesYesterday(respon) {
      respon.forEach((data) => {
        this.trafiklabels.push(data.jam);
        this.trafikdata.push(data.total);
      });
      this.renderChartBar(this.trafiklabels, this.trafikdata);
    },
    setupSuksesTren(respon) {
      respon.forEach((data) => {
        this.trenlabels.push(data.tanggal);
        this.trendata.push(data.total);
      });
      this.renderChartLine(this.trenlabels, this.trendata);
    },
    async getTodayTransaction() {
      const respon = await this.getTodayTransactionDashboard(
        this.reseller.kode
      );
      if (respon.status == "200") {
        this.setupSuksesGetRekap(respon.data);
      } else {
        this.logoutGrab();
      }
    },
    async getYesterdayTransaction() {
      this.isloading.perJam = true;
      const respon = await this.getYesterdayTransactionDashboard(
        this.reseller.kode,
        this.yesterday
      );
      if (respon.status == "200") {
        this.isloading.perJam = false;
        this.setupSuksesYesterday(respon.data);
      } else {
        this.logoutGrab();
      }
    },
    async getTrenTransaction() {
      this.isloading.yesterday = true;
      const startdate = moment().subtract(14, "days").format("YYYY-MM-DD");
      const enddate = moment(this.yesterday, "dddd DD MMMM YYYY").format(
        "YYYY-MM-DD"
      );
      const respon = await this.getTrenTransactionDashboard(
        this.reseller.kode,
        startdate,
        enddate
      );
      if (respon.status == "200") {
        this.isloading.yesterday = false;
        this.setupSuksesTren(respon.data);
      } else {
        this.logoutGrab();
      }
    },
    renderChartBar(labels, data) {
      const self = this;
      const ctx = document.getElementById("myBarChart");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Jumlah Transaksi",
              backgroundColor: "#4e73df",
              hoverBackgroundColor: "#2e59d9",
              borderColor: "#4e73df",
              data: data,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          layout: {
            padding: {
              left: 10,
              right: 25,
              top: 25,
              bottom: 0,
            },
          },
          scales: {
            xAxes: [
              {
                time: {
                  unit: "time",
                },
                gridLines: {
                  display: false,
                  drawBorder: false,
                },
                maxBarThickness: 25,
              },
            ],
            yAxes: [
              {
                ticks: {
                  min: 0,
                  maxTicksLimit: 5,
                  padding: 10,
                  callback: function (value, index, values) {
                    // console.log(value);
                    return self.numberFormat(value);
                  },
                },
                gridLines: {
                  color: "rgb(234, 236, 244)",
                  zeroLineColor: "rgb(234, 236, 244)",
                  drawBorder: false,
                  borderDash: [2],
                  zeroLineBorderDash: [2],
                },
              },
            ],
          },
          legend: {
            display: false,
          },
          tooltips: {
            titleMarginBottom: 10,
            titleFontColor: "#6e707e",
            titleFontSize: 14,
            backgroundColor: "rgb(255,255,255)",
            bodyFontColor: "#858796",
            borderColor: "#dddfeb",
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            displayColors: false,
            caretPadding: 10,
            callbacks: {
              label: function (tooltipItem, chart) {
                var datasetLabel =
                  chart.datasets[tooltipItem.datasetIndex].label || "";
                return (
                  datasetLabel + ": " + self.numberFormat(tooltipItem.yLabel)
                );
              },
            },
          },
        },
      });
    },
    renderChartLine(labels, datas) {
      let ctx = document.getElementById("myAreaChart");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Total transaksi",
              lineTension: 0.3,
              backgroundColor: "rgba(78, 115, 223, 0.05)",
              borderColor: "rgba(78, 115, 223, 1)",
              pointRadius: 3,
              pointBackgroundColor: "rgba(78, 115, 223, 1)",
              pointBorderColor: "rgba(78, 115, 223, 1)",
              pointHoverRadius: 3,
              pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
              pointHoverBorderColor: "rgba(78, 115, 223, 1)",
              pointHitRadius: 10,
              pointBorderWidth: 2,
              data: datas,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          layout: {
            padding: {
              left: 10,
              right: 25,
              top: 25,
              bottom: 0,
            },
          },
          scales: {
            xAxes: [
              {
                time: {
                  unit: "date",
                },
                gridLines: {
                  display: false,
                  drawBorder: false,
                },
                ticks: {
                  maxTicksLimit: 14,
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  maxTicksLimit: 5,
                  padding: 10,
                  // Include a dollar sign in the ticks
                  callback: function (value, index, values) {
                    return self.numberFormat(value);
                  },
                },
                gridLines: {
                  color: "rgb(234, 236, 244)",
                  zeroLineColor: "rgb(234, 236, 244)",
                  drawBorder: false,
                  borderDash: [2],
                  zeroLineBorderDash: [2],
                },
              },
            ],
          },
          legend: {
            display: false,
          },
          tooltips: {
            backgroundColor: "rgb(255,255,255)",
            bodyFontColor: "#858796",
            titleMarginBottom: 10,
            titleFontColor: "#6e707e",
            titleFontSize: 14,
            borderColor: "#dddfeb",
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            displayColors: false,
            intersect: false,
            mode: "index",
            caretPadding: 10,
            callbacks: {
              label: function (tooltipItem, chart) {
                var datasetLabel =
                  chart.datasets[tooltipItem.datasetIndex].label || "";
                return (
                  datasetLabel + ": " + self.numberFormat(tooltipItem.yLabel)
                );
              },
            },
          },
        },
      });
    },
  },
  mounted() {
    this.reseller =
      JSON.parse(localStorage.getItem("resellerData")).reseller || [];
    this.getTodayTransaction();
    this.getYesterdayTransaction();
    this.getTrenTransaction();
  },
};
</script>
<style>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
.data-table-loading {
  align-items: center;
  display: flex;
  height: 200px;
  flex-flow: column;
  justify-content: center;
  position: relative;
  width: 100%;
}
.data-table-loading-spinner {
  animation: spin 1s linear infinite;
  border-radius: 999px;
  border: 2px solid #007bff;
  border-top-color: transparent;
  content: "";
  height: 75px;
  margin-bottom: 15px;
  width: 75px;
}
.data-table-loading-text {
  font-weight: 300;
  text-transform: uppercase;
}
</style>
