<template>
    <div class="container-fluid">
        <div class="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 class="h3 mb-2 text-gray-800">Cetak Struk PPOB</h1>
        </div>
        <div class="card shadow mb-4">
            <div class="card-header py-3">
                <form action="" class="form-inline">
                    <div class="form-group">
                        <date-picker v-model:value="rangeDate" type="date" valueType="format" range placeholder="Pilih rentang tanggal"></date-picker>
                    </div>
                    <button type="button" class="btn btn-primary btn-sm ml-md-3 w-xs-100 shadow-sm" @click="getPPOB()"><i class="fas fa-search"></i> Cari</button>
                </form>
            </div>
            <div class="card-body">
                <vue-good-table
                    styleClass="vgt-table striped condensed bordered"
                    :columns="columns"
                    :rows="rows"
                    :line-numbers="true"
                    :isLoading="isLoading"
                    :search-options="{
                        enabled: true,
                        trigger: 'enter',
                        placeholder: 'Masukkan nomor tujuan dan tekan ENTER'
                    }" 
                    :pagination-options="{
                        enabled: true,
                    }">
                    <template #table-row="props">
                        <span v-if="props.column.field == 'url'">
                                <button type="button" class="btn btn-outline-secondary btn-sm btn-cetak-landscape"
                                    data-toggle="tooltip" data-placement="top"
                                    title="Cetak A4 untuk printer Dot Matrix & InkJet"
                                    v-on:click="CetakLandscape(props.row.kode)"><i class="fa fa-print"
                                        aria-hidden="true"></i> Landscape</button>
                        </span>
                        <span v-else>
                            {{ props.formattedRow[props.column.field] }}
                        </span>
                    </template>
                </vue-good-table>
            </div>
        </div>
    </div>
    <div id="print">
        <cetak-default-view-vue v-if="Object.keys(responCetakDefault).length > 0" :respon="responCetakDefault"
            :setAdmin="adminInput" :state="stateCetak">
        </cetak-default-view-vue>
    </div>
</template>

<script>
import cetakDefaultViewVue from "./template/cetakDefaultView.vue";
import 'vue-good-table-next/dist/vue-good-table-next.css'
import { VueGoodTable } from 'vue-good-table-next'
import grab from '../../helper/grab'
import Swal from 'sweetalert2'
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import 'vue-datepicker-next/locale/id';
import moment from "moment";
export default {
    components: { 
        DatePicker,
        VueGoodTable,
        cetakDefaultViewVue
    },
    props: { 
        numberFormat: { type: Function },
    },
    data(){
        return {
            rangeDate: [moment().utc(0).format('YYYY-MM-DD'), moment().utc(0).format('YYYY-MM-DD')],
            agen:'',
            isLoading: true,
            rows: [],
            responCetakDefault: [],
            stateCetak: '',
            adminInput: '',
            columns: [
                {
                    label: 'Tanggal',
                    field: 'tanggal',
                    tdClass: 'text-left small',
                    thClass: 'text-left small font-weight-bold',
                    type: 'date',
                    dateInputFormat: 'yyyy-MM-dd HH:mm:ss.SSS',
                    dateOutputFormat: 'yyyy-MM-dd HH:mm',
                },
                {
                    label: 'ID Trx',
                    field: 'kode',
                    tdClass: 'small',
                    thClass: 'small font-weight-bold',
                },
                {
                    label: 'Tujuan',
                    field: 'tujuan',
                    tdClass: 'small',
                    thClass: 'small font-weight-bold',
                },
                {
                    label: 'Keterangan',
                    field: 'keterangan',
                    tdClass: 'small',
                    thClass: 'small font-weight-bold',
                    formatFn: this.removeSlash,
                },
                {
                    label: 'Cetak',
                    field: 'url',
                    thClass: 'small font-weight-bold',
                },
            ]
        }
    },
    mounted(){
        const reseller = JSON.parse(localStorage.getItem("resellerData")).reseller || []
        this.agen = reseller.kode
        this.getPPOB()
    },
    mixins:[grab],
    methods: {
        async CetakLandscape(kode){
            await this.setupDefaultCetak()
            const respon = await this.ambilDataCetak(kode)
            await this.setupResponCetakDefault(respon.data)
            this.popupCetak()
        },
        popupCetak() {
            var printContents = document.getElementById('print').innerHTML;
            var myWindow = window.open();
            var doc = myWindow.document;
            doc.open();
            doc.write(printContents);
            doc.close();
            myWindow.focus();
            myWindow.print();
            myWindow.close();
            this.setupDefaultCetak()
        },
        setupDefaultCetak(){
            this.responCetakDefault = []
            this.stateCetak = ""
        },
        async setupResponCetakDefault(respon) {
            this.responCetakDefault = respon
            this.stateCetak = respon.kode_produk
        },
        setupResponStruk(response){
            this.rows = response   
        },
        async getPPOB(){
            console.log('getppob')
            this.isLoading = true
            let respon = await this.getResponStruk(this.agen, this.rangeDate[0], this.rangeDate[1])
            if (respon.status == 200) {    
                this.isLoading=false
                if(respon.data.length>0){
                    this.setupResponStruk(respon.data)             
                } else {
                    Swal.fire(
                        'Data PPOB Tidak ditemukan',
                        'Silahkan coba ganti rentang tanggal',
                        'error'
                    )
                }
            } else {
                this.logoutGrab()
            }
        },
        removeSlash(keterangan){
            return keterangan.replace(',', '-').replace(/\//g, ', ')
        },
    },
}
</script>
