import Home from "../../components/Dashboard.vue";
import historyNonPajak from "../../components/transaksi/NonPajak.vue";
import historyPajak from "../../components/transaksi/Pajak.vue";
import deposit from "../../components/Deposit.vue";
import printStruk from "../../components/print/Struk.vue";
import printFaktur from "../../components/print/Faktur.vue";
import postView from "../../components/Post.vue";
import harga from "../../components/Harga.vue";
import profile from "../../components/Profile.vue";
import Password from "../../components/Password.vue";
import notFound from "../../components/navigation/NotFoundComponent.vue";
import Login from "../../components/auth/Login.vue";
import Cookies from "js-cookie";
import { createRouter, createWebHistory } from "vue-router";

function numberFormatFn(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + "").replace(",", "").replace(" ", "");
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = typeof thousands_sep === "undefined" ? "," : thousands_sep,
    dec = typeof dec_point === "undefined" ? "." : dec_point,
    s = "",
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return "" + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || "").length < prec) {
    s[1] = s[1] || "";
    s[1] += new Array(prec - s[1].length + 1).join("0");
  }
  return s.join(dec);
}

// let resellerData;
// if (Cookies.get("authToken") !== undefined) {
//   resellerData = JSON.parse(localStorage.getItem("resellerData"));
// } else {
//   localStorage.removeItem("resellerData");
//   localStorage.removeItem("authToken");
//   Cookies.remove("authToken");
//   // window.location.reload();
// }

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      alias: "/login",
      name: "Login",
      component: Login,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: "/dashboard",
      name: "Home",
      component: Home,
      props: {
        numberFormatFn,
      },
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/history-transaksi",
      name: "historyNonPajak",
      component: historyNonPajak,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/history-transaksi-pajak",
      name: "historyPajak",
      component: historyPajak,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/deposit",
      name: "deposit",
      component: deposit,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/print-struk",
      name: "printStruk",
      component: printStruk,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/print-faktur",
      name: "printFaktur",
      component: printFaktur,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/post/:state",
      path: "/post/:slug",
      name: "postView",
      component: postView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/harga",
      name: "harga",
      component: harga,
      props: {
        numberFormatFn,
      },
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/profile",
      name: "profile",
      component: profile,
      props: {
        numberFormatFn,
      },
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/password",
      name: "password",
      component: Password,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/:catchAll(.*)",
      name: "notFound",
      component: notFound,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (Cookies.get("authToken") === undefined || Cookies.get("authToken") === null) {
      next({
        path: "/",
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
