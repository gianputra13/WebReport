<template>
    <div class="card shadow mb-4">
        <div class="card-body">
            <div class="transactionsviews">
                <pln-vue v-if="state.toUpperCase().includes('BYRPLN')" :tujuan="respon.tujuan" :periode="periode"
                    :nama="nama" :standMeter="standMeter" :tarifDaya="tarifDaya" :tagihan="tagihan" :reff="respon.sn"
                    :admin="admin" :total="total" :tanggal="respon.tgl_entri" :denda="denda"></pln-vue>
                <bpjs-vue v-else-if="state.toUpperCase() == 'BYRBPJS' && state.toUpperCase() != 'BYRBPJSTK'"
                    :tanggal="respon.tgl_entri" :periode="periode" :cabang="cabang" :jumlahPeserta="jumlahPeserta"
                    :idPelanggan="respon.tujuan" :tagihan="tagihan" :nama="nama" :admin="admin" :reff="respon.sn"
                    :totalBayar="totalTagihan" />
                <pln-token-modul-vue v-else-if="(state.toUpperCase().includes('PLN') || state.toUpperCase().includes('TKN')) && (respon.modul === 1136
                || respon.modul === 1028 || respon.modul === 1070)" :tanggal="respon.tgl_entri" :idMeter="idMeter"
                    :materai="materai" :idPelanggan="respon.tujuan" :ppn="ppn" :ppj="ppj" :tarifDaya="tarifDayaPlnToken"
                    :angsuran="angsuran" :reff="reffTokenPln" :token="tokenPln" :total="totalTokenPln"
                    :nama="namaPlnToken" :admin="admin" :kwh="kwh" :tagihan="tagihanTokenPln" :informasi="informasi"
                    :nominal="nominalTokenModul" />
                <pln-token-vue v-else-if="state.toUpperCase().includes('PLN')" :tanggal="respon.tgl_entri"
                    :idMeter="idMeter" :materai="materai" :idPelanggan="respon.tujuan" :ppn="ppn" :ppj="ppj"
                    :tarifDaya="tarifDayaPlnToken" :angsuran="angsuran" :reff="reffTokenPln" :token="tokenPln"
                    :total="totalTokenPln" :nama="namaPlnToken" :admin="admin" :kwh="kwh" :tagihan="tagihanTokenPln"
                    :informasi="informasi" :nominal="nominalTokenModul" />
                <tagihan v-else :judul="judulTagihan" :reff="(respon.sn + '').toUpperCase()" :tanggal="respon.tgl_entri"
                    :idPelanggan="respon.tujuan" :tagihan="tagihan" :nama="nama" :admin="admin" :periode="periode"
                    :total="totalTagihan" :sm="standMeter" />
            </div>
        </div>
    </div>
</template>
<script>
import plnVue from './cetakDefault/pln.vue'
import bpjsVue from './cetakDefault/bpjs.vue'
import plnTokenVue from './cetakDefault/plnToken.vue'
import plnTokenModulVue from './cetakDefault/plnTokenModul.vue'
import tagihan from './cetakDefault/tagihan.vue'
export default {
    components: {
        plnVue,
        bpjsVue,
        plnTokenVue,
        tagihan,
        plnTokenModulVue
    },
    props:
    {
        respon: {
            type: Object,
            default: () => ({}),
        },
        setAdmin: {
            type: String,
            default: '',
        },
        state: String
    },
    computed: {
        jumlahPeserta() {
            const keterangan = this.respon.keterangan
            if (keterangan === undefined) {
                return '-'
            }
            if (keterangan.toUpperCase().includes("PST:")) {
                return this.cariKata(keterangan, "/PST:", "/")
            } else {
                return '-'
            }
        },
        cabang() {
            const keterangan = this.respon.keterangan
            if (keterangan === undefined) {
                return '-'
            }
            if (keterangan.toUpperCase().includes("CBG:")) {
                return this.cariKata(keterangan, "/CBG:", "/")
            } else {
                return '-'
            }
        },
        periode() {
            const keterangan = this.respon.keterangan
            if (keterangan === undefined) {
                return '-'
            }
            if (keterangan.toUpperCase().includes("PTAG:")) {
                return this.cariKata(keterangan, "PTAG:", "/")
            } else {
                return '-'
            }
        },
        nama() {
            const keterangan = this.respon.keterangan
            if (keterangan === undefined) {
                return '-'
            }
            if (keterangan.toUpperCase().includes("NAMA:")) {
                return this.cariKata(keterangan, "NAMA:", "/")
            } else {
                return '-'
            }
        },
        standMeter() {
            const keterangan = this.respon.keterangan
            if (keterangan === undefined) {
                return '-'
            }
            if (keterangan.toUpperCase().includes("SM:")) {
                return this.cariKata(keterangan, "SM:", "/")
            } else {
                return '-'
            }
        },
        tarifDaya() {
            const keterangan = this.respon.keterangan
            if (keterangan === undefined) {
                return '-'
            }
            if (keterangan.toUpperCase().includes("TD:")) {
                return this.cariKata(keterangan, "TD:", "/SM")
            } else {
                return '-'
            }
        },
        tagihan() {
            const keterangan = this.respon.keterangan
            if (keterangan === undefined) {
                return '-'
            }
            const adm = this.getAdmin(keterangan)
            const ttag = this.cariKata(keterangan, "TTAG:", ".")
            if (keterangan.toUpperCase().includes("/TAG:")) {
                return this.formatNumber(this.cariKata(keterangan, "/TAG:", "/"))
            } else {
                return ttag - adm
            }
        },
        admin() {
            const keterangan = this.respon.keterangan
            if (keterangan === undefined) {
                return '-'
            }
            const adm = this.getAdmin(keterangan)
            return this.formatNumber(adm)
        },
        total() {
            const keterangan = this.respon.keterangan
            if (keterangan === undefined) {
                return '-'
            }
            const ttag = this.cariKata(keterangan, "TTAG:", ".")
            return this.formatNumber(ttag)
        },
        totalTagihan() {
            const keterangan = this.respon.keterangan
            const tag = this.getTagihan(keterangan)
            const adm = this.getAdmin(keterangan)
            const ttag = parseInt(tag) + parseInt(adm)
            return this.formatNumber(ttag)
        },
        idMeter() {
            const keterangan = this.respon.keterangan
            if (keterangan === undefined) {
                return '-'
            }
            const kata = this.cariKata(keterangan.toUpperCase(), "IDMETER:", "/")
            return kata
        },
        idMeterModul() {
            const keterangan = this.respon.keterangan
            if (keterangan === undefined) {
                return '-'
            }
            const kata = this.cariKata(keterangan.toUpperCase(), "IDMETER:", ";")
            return kata
        },
        materai() {
            const keterangan = this.respon.keterangan
            if (keterangan === undefined) {
                return '-'
            }
            return this.formatNumber(this.getMaterai(keterangan))
        },
        ppn() {
            const keterangan = this.respon.keterangan
            if (keterangan === undefined) {
                return '-'
            }
            return this.formatNumber(this.getPpn(keterangan))
        },
        ppj() {
            const keterangan = this.respon.keterangan
            if (keterangan === undefined) {
                return '0'
            }
            return this.formatNumber(this.getPpj(keterangan))
        },
        angsuran() {
            const keterangan = this.respon.keterangan
            if (keterangan === undefined) {
                return '0'
            }
            return this.formatNumber(this.getAngsuran(keterangan))
        },
        informasi() {
            const keterangan = this.respon.keterangan
            if (keterangan === undefined) {
                return '-'
            }
            const kata = this.cariKata(keterangan, "INFORMASI:", "/")
            return kata
        },
        kwh() {
            const sn = this.respon.sn
            if (sn === undefined) {
                return '-'
            } else {
                const getSplit = sn.split("/")
                return getSplit[4]
            }
            // note belum include explode jika ada ','
        },
        reffTokenPln() {
            const keterangan = this.respon.keterangan
            if (keterangan === undefined) {
                return '-'
            }
            const kata = this.cariKata(keterangan, "PLNREF:", ";")
            return kata
        },
        tagihanTokenPln() {
            const keterangan = this.respon.keterangan
            if (keterangan === undefined) {
                return '-'
            }
            return this.formatNumber(this.getTagihanPlnToken(keterangan))
        },
        namaPlnToken() {
            const sn = this.respon.sn
            if (sn === undefined) {
                return '-'
            } else {
                const getSplit = sn.split("/")
                return getSplit[1]
            }
        },
        tarifDayaPlnToken() {
            const sn = this.respon.sn
            if (sn === undefined) {
                return '-'
            } else {
                const getSplit = sn.split("/")
                return getSplit[2] + "/" + getSplit[3]
            }
        },
        totalTokenPln() {
            const keterangan = this.respon.keterangan
            if (keterangan === undefined) {
                return '0'
            }
            console.log([parseInt(this.getAdmin(keterangan)), parseInt(this.getMaterai(keterangan)),
            parseInt(this.getPpn(keterangan)), parseInt(this.getPpj(keterangan)),
            parseInt(this.getAngsuran(keterangan)), parseInt(this.getTagihan(keterangan))])
            const total = parseInt(this.getNominalTokenModul()) + parseInt(this.getAdmin(keterangan)) + parseInt(this.getMaterai(keterangan)) + parseInt(this.getPpn(keterangan)) + parseInt(this.getPpj(keterangan)) + parseInt(this.getAngsuran(keterangan)) + parseInt(this.getTagihanPlnToken(keterangan))
            return total
        },
        tokenPln() {
            const sn = this.respon.sn
            if (sn === undefined) {
                return '-'
            } else {
                const getSplit = sn.split("/")
                return getSplit[0]
            }
        },
        denda() {
            const keterangan = this.respon.keterangan
            if (keterangan === undefined) {
                return '0'
            }
            if (keterangan.toUpperCase().includes("/DENDA:")) {
                const kata = this.cariKata(keterangan, "/DENDA:", " ")
                return this.formatNumber(kata)
            } else {
                return '0'
            }
        },
        nominalTokenModul() {
            return this.formatNumber(this.getNominalTokenModul())
        },
        judulTagihan() {
            const kodeProduk = this.respon.kode_produk.toUpperCase()
            var judul = ""
            if (kodeProduk === "BYRTLP") {
                judul = "TELKOM"
            } else if (kodeProduk === "BYRSPDY") {
                judul = "TELKOM"
            } else if (kodeProduk === "BYRADIRA") {
                judul = "ADIRA"
            } else if (kodeProduk === "BYRAORA") {
                judul = "AORA"
            } else if (kodeProduk === "BYRBAF") {
                judul = "FINANCE BAF"
            } else if (kodeProduk === "BYRCLB") {
                judul = "COLUMBIA"
            } else if (kodeProduk === "BYRESIA") {
                judul = "ESIA"
            } else if (kodeProduk === "BYRHALO") {
                judul = "HALO"
            } else if (kodeProduk === "BYRINDV") {
                judul = "INDOVISION"
            } else if (kodeProduk === "BYRMAF") {
                judul = "FINANCE MAF"
            } else if (kodeProduk === "BYRMATRIX") {
                judul = "TELCO MATRIX"
            } else if (kodeProduk === "BYRORG") {
                judul = "TV ORANGE"
            } else if (kodeProduk === "BYRMCF") {
                judul = "FINANCE MCF"
            } else if (kodeProduk === "BYRTELKOMV") {
                judul = "TV TELKOMVISION"
            } else if (kodeProduk === "BYRWOM") {
                judul = "FINANCE WOM"
            } else if (kodeProduk === "BYRXL") {
                judul = "XL"
            } else if (kodeProduk.includes('BYRBPJSTK')) {
                judul = "BPJS KETENAGAKERJAAN"
            } else if (kodeProduk.includes('BYRPDAM')) {
                judul = "PDAM"
                // $sm = cariKata($data[1], "/SM:", "/");
            } else if (kodeProduk.includes('BYRFIF')) {
                judul = "FIF"
            }
            return judul
        }
    },
    methods: {
        getAdmin(keterangan) {
            if (keterangan === undefined) {
                return '0'
            }
            if (this.setAdmin === undefined || this.setAdmin === '') {
                if (keterangan.toUpperCase().includes('ADM:')) {
                    return this.cariKata(keterangan.toUpperCase(), "ADM:", "/");
                }
                else if (keterangan.toUpperCase().includes('ADMIN:')) {
                    return this.cariKata(keterangan.toUpperCase() + ".", "ADMIN:", ".");
                } else {
                    return "0"
                }
            } else {
                return this.setAdmin
            }
        },
        getMaterai(keterangan) {
            if (keterangan === undefined) {
                return '0'
            }
            const kata = this.cariKata(keterangan, "MATERAI:", "/")
            if (kata.length > 0) {
                return kata
            } else {
                return '0'
            }
        },
        getPpn(keterangan) {
            if (keterangan === undefined) {
                return '0'
            }
            const kata = this.cariKata(keterangan, "PPN:", "/")
            if (kata.length > 0) {
                return kata
            } else {
                return '0'
            }
        },
        getPpj(keterangan) {
            if (keterangan === undefined) {
                return '0'
            }
            const kata = this.cariKata(keterangan, "PPN:", "/")
            if (kata.length > 0) {
                return kata
            } else {
                return '0'
            }
        },
        getAngsuran(keterangan) {
            if (keterangan === undefined) {
                return '0'
            }
            if ((keterangan + "").toUpperCase().includes('ANGSURAN:')) {
                const kata = this.cariKata(keterangan, "ANGSURAN:", "/")
                if (kata.length > 0) {
                    return kata
                } else {
                    return '0'
                }
            } else {
                return '0'
            }
        },
        getTagihanPlnToken(keterangan) {
            if (keterangan === undefined) {
                return '0'
            }
            const kata = this.cariKata(keterangan, "RPTOKEN:", "/")
            if (kata.length > 0) {
                return kata
            } else {
                return '0'
            }
        },
        getTagihan(keterangan) {
            if (keterangan === undefined) {
                return '0'
            }
            const adm = this.getAdmin(keterangan)
            const ttag = this.getTotalTagihan(keterangan)
            if (keterangan.toUpperCase().includes("/TAG:")) {
                return this.cariKata(keterangan, "/TAG:", "/")
            } else {
                return ttag - adm
            }
        },
        getTotalTagihan(keterangan) {
            if (keterangan === undefined) {
                return '0'
            }
            if (keterangan.toUpperCase().includes("/TTAG:")) {
                return this.cariKata(keterangan, "/TTAG:", "/")
            } else {
                return '0'
            }
        },
        getNominalTokenModul(){
            const replacer1 = new RegExp("PLB", "g")
            const replacer2 = new RegExp("PLA", "g")
            const replacer3 = new RegExp("PLN", "g")
            const replacer4 = new RegExp("L", "g")
            const replacer5 = new RegExp("P", "g")
            let replacing = (this.state + "").toLocaleUpperCase().replace(replacer1, '')
            replacing = replacing.replace(replacer2, '')
            replacing = replacing.replace(replacer3, '')
            replacing = replacing.replace(replacer4, '')
            replacing = replacing.replace(replacer5, '')
            return replacing + "000"
        }
    }
}
</script>