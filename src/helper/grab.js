import axios from "axios";
import moment from "moment";
import Cookies from "js-cookie";
import base64 from 'base-64'
const host = "/api/";
const hostCetak = "/apiCetak/";
 function enc(value){
    const arr = ['b','k','g','s','t','-','(',')']
    let temp = value
    let build = ""
    const replacer0 = new RegExp('0', 'g')
    const replacer1 = new RegExp('1', 'g')
    const replacer2 = new RegExp('2', 'g')
    const replacer3 = new RegExp('3', 'g')
    const replacer4 = new RegExp('4', 'g')
    const replacer5 = new RegExp('5', 'g')
    const replacer6 = new RegExp('6', 'g')
    const replacer7 = new RegExp('7', 'g')
    const replacer8 = new RegExp('8', 'g')
    const replacer9 = new RegExp('9', 'g')
    temp = temp.replace(replacer0,'c')
    temp = temp.replace(replacer1,'x')
    temp = temp.replace(replacer2,'m')
    temp = temp.replace(replacer3,'i')
    temp = temp.replace(replacer4,'d')
    temp = temp.replace(replacer5,'o')
    temp = temp.replace(replacer6,'p')
    temp = temp.replace(replacer7,'a')
    temp = temp.replace(replacer8,'v')
    temp = temp.replace(replacer9,'q')
    for (let i = 0; i < temp.length; i++){
        if (arr[Math.floor(Math.random()*['0','1'].length)] == '0'){
            build = build + temp.substring(i,i+1)
        }else{
            build = build + temp.substring(i,i+1) + arr[Math.floor(Math.random()*arr.length)]
        }
    }
    return base64.encode(build)
}
function encCetak(value){
   const arr = ['b','k','g','s','t','-','(',')']
   let temp = '13657' + value.match(/(\d+)/)[0]
   let build = ""
   const replacer0 = new RegExp('0', 'g')
   const replacer1 = new RegExp('1', 'g')
   const replacer2 = new RegExp('2', 'g')
   const replacer3 = new RegExp('3', 'g')
   const replacer4 = new RegExp('4', 'g')
   const replacer5 = new RegExp('5', 'g')
   const replacer6 = new RegExp('6', 'g')
   const replacer7 = new RegExp('7', 'g')
   const replacer8 = new RegExp('8', 'g')
   const replacer9 = new RegExp('9', 'g')
   temp = temp.replace(replacer0,'c')
   temp = temp.replace(replacer1,'x')
   temp = temp.replace(replacer2,'m')
   temp = temp.replace(replacer3,'i')
   temp = temp.replace(replacer4,'d')
   temp = temp.replace(replacer5,'o')
   temp = temp.replace(replacer6,'p')
   temp = temp.replace(replacer7,'a')
   temp = temp.replace(replacer8,'v')
   temp = temp.replace(replacer9,'q')
   for (let i = 0; i < temp.length; i++){
       if (arr[Math.floor(Math.random()*['0','1'].length)] == '0'){
           build = build + temp.substring(i,i+1)
       }else{
           build = build + temp.substring(i,i+1) + arr[Math.floor(Math.random()*arr.length)]
       }
   }
   let reValue = value + "|" + temp
   return base64.encode(reValue)
}

const grab = {
  methods: {
    valueToEnc(value){
      return encCetak(value)
    },
    async ambilDataCetak(kodetrx) {
        const param = {
            kodetrx:  enc(""+kodetrx),
        };
        const respon = await axios
            .post(hostCetak + "cetak", param)
        return respon;
    },
    logoutGrab() {
      localStorage.removeItem("authToken");
      localStorage.removeItem("resellerData");
      Cookies.remove("authToken");
      window.location.reload();
    },
    async getTodayTransactionDashboard(agen) {
      const param = {
        kd_agen: agen,
      };
      const response = await axios
        .post(host + "rekapTrxToday", param, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("authToken"),
          },
        })
        .catch(function (error) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("resellerData");
          Cookies.remove("authToken", { path: "/" });
          window.location.reload();
        });
      return response;
    },
    async getYesterdayTransactionDashboard(agen, date) {
      const startdate = moment(date, "dddd DD MMMM YYYY").format("YYYY-MM-DD");
      const response = await axios
        .post(
          host + "transaksiJam",
          {
            tgl_a: startdate,
            tgl_b: startdate,
            kd_agen: agen,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("authToken"),
            },
          }
        )
        .catch(function (error) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("resellerData");
          Cookies.remove("authToken", { path: "/" });
          window.location.reload();
        });
      return response;
    },
    async getTrenTransactionDashboard(agen, startdate, endDate) {
      const response = await axios
        .post(
          host + "rekapTrx",
          {
            tgl_a: startdate,
            tgl_b: endDate,
            kd_agen: agen,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("authToken"),
            },
          }
        )
        .catch(function (error) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("resellerData");
          Cookies.remove("authToken", { path: "/" });
          window.location.reload();
        });
      return response;
    },
    async getTransaksiHistoryNonPajak( params) {
      let response = await axios
        .post(host + "trx", params, {
          headers: {
            "Content-Type": "application/json",
            //"Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + localStorage.getItem("authToken"),
          },
        })
        .catch(function (error) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("resellerData");
          Cookies.remove("authToken", { path: "/" });
          window.location.reload();
        });
      return response;
    },
    async getTransaksiHistoryPajak(serverParams, params) {
      let response = await axios
        .post(host + "trxpjk", params, {
          headers: {
            "Content-Type": "application/json",
            //"Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + localStorage.getItem("authToken"),
          },
        })
        .catch(function (error) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("resellerData");
          Cookies.remove("authToken", { path: "/" });
          window.location.reload();
        });
      return response;
    },
    async getResponFaktur(agen) {
      const params = {
        kd_agen: agen,
      };
      let response = await axios
        .post(host + "faktur", params, {
          headers: {
            "Content-Type": "application/json",
            // "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + localStorage.getItem("authToken"),
          },
        })
        .catch(function (error) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("resellerData");
          Cookies.remove("authToken", { path: "/" });
          window.location.reload();
        });
      return response;
    },
    async getResponStruk(agen, startdate, endDate) {
      const params = {
        kd_agen: agen,
        tgl_a: startdate,
        tgl_b: endDate,
      };
      const response = await axios
        .post(host + "cetakStruk", params, {
          headers: {
            "Content-Type": "application/json",
            // "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + localStorage.getItem("authToken"),
          },
        })
        .catch(function (error) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("resellerData");
          Cookies.remove("authToken", { path: "/" });
          window.location.reload();
        });
      return response;
    },
    async accFaktur(agen, approve, periode) {
      const params = {
        kd_agen: agen,
        approve: approve,
        periode: periode,
      };
      const response = await axios
        .post(host + "accfaktur", params, {
          headers: {
            "Content-Type": "application/json",
            // "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + localStorage.getItem("authToken"),
          },
        })
        .catch(function (error) {
          // localStorage.removeItem("authToken");
          // localStorage.removeItem("resellerData");
          // Cookies.remove("authToken", { path: '/' })
          // window.location.reload()
        });
      return response;
    },
    async postEmailUser(params) {
      const response = await axios
        .post(host + "emailUser", params, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("authToken"),
          },
        })
        .catch(function (error) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("resellerData");
          Cookies.remove("authToken", { path: "/" });
          window.location.reload();
        });
      return response;
    },
    async getTiketDeposit(agen, nominal) {
      const params = {
        server: "api/tiket",
        memberid: agen,
        nominal: nominal,
      };
      const response = await axios
        .post(hostDeposit + "/host", params, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .catch(function (error) {
          return error;
        });
      return response;
    },
  },
};
export default grab;
