<template>
    <div class="container-fluid">
        <div class="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 class="h3 mb-2 text-gray-800">Faktur Pajak</h1>
        </div>
        <div class="card shadow mb-4">
            <div class="card-header py-3">
                <div class="row">
                    <div class="col-12 col-md-6">
                        <div class="text-left h5 mb-n1">Rp {{ total }}</div>
                        <span class="small py-0 my-0">periode: {{ periode }}</span>
                    </div>
                    <div class="col-12 col-md-6 text-right">
                        <button class="btn btn-success" @click="approvalFaktur(true)"><i
                                class="fas fa-check fa-fw"></i></button>
                        <button class="btn btn-danger" @click="approvalFaktur(false)"><i
                                class="fas fa-times fa-fw"></i></button>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <vue-good-table styleClass="vgt-table striped condensed bordered" :columns="columns" :rows="rows"
                    :line-numbers="true" :isLoading="isLoading" :pagination-options="{
                        enabled: true,
                    }">
                    <template slot="table-row" slot-scope="props">
                        <span v-if="props.column.field == 'link'">
                            <span v-if="props.row.link == null">
                                <i class="fas fa-cloud-download-alt"></i> Link download belum tersedia
                            </span>
                            <a :href="props.row.link" v-else target="_blank" class="text-decoration-none"><i
                                    class="fas fa-print"></i> Download PDF</a>
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
import moment from "moment"
import Swal from 'sweetalert2'
import grab from '../../helper/grab';
import wr from '../../assets/js/wr';
export default {
    components: {
        VueGoodTable
    },
    props: {
        numberFormat: { type: Function },
    },
    data() {
        return {
            agen: '',
            total: 0,
            periode: '-',
            rows: [],
            isLoading: true,
            columns: [
                {
                    label: 'Periode',
                    field: 'periode',
                    tdClass: 'text-left',
                    thClass: 'text-left',
                    type: 'date',
                    dateInputFormat: 'yyyy-MM-dd',
                    dateOutputFormat: 'MMM yyyy',
                },
                {
                    label: 'Cetak',
                    field: 'link',
                },
            ]
        }
    },
    mounted() {
        const reseller = JSON.parse(localStorage.getItem("resellerData")).reseller || []
        this.agen = reseller.kode
        this.getFaktur()
    },
    mixins: [grab, wr],
    methods: {
        setupResponFaktur(respon) {
            this.total = this.formatNumber(respon.total)
            this.periode = moment(respon.periode, 'MM-YYYY').format('MMM YYYY')
            this.rows = respon.data
            this.isLoading = false
        },
        async getFaktur() {
            this.isLoading = true
            let response = await this.getResponFaktur(this.agen)
            if (response.status == 200) {
                this.total = this.formatNumber(response.data.total)
                this.periode = moment(response.data.periode, 'MM-YYYY').format('MMM YYYY')
                this.rows = response.data.data
                this.isLoading = false
            } else {
                this.logoutGrab()
            }
        },
        approvalFaktur(acc) {
            let approve = 0
            let swaltitle = 'Jumlah Tidak sesuai?'
            let swalicon = 'warning'
            let swalconfirm = 'Faktur pajak akan direvisi oleh admin kami.'
            if (acc) {
                approve = 1
                swaltitle = 'Apakah sudah sesuai?'
                swalicon = 'question'
                swalconfirm = 'Faktur pajak akan diproses oleh admin kami.'
            }
            let periodeDate = moment(this.periode, 'MMM YYYY').format('YYYY-MM-[01]')
            Swal.fire(
                {
                    icon: swalicon,
                    title: swaltitle,
                    confirmButtonText: 'Ya',
                    text: this.total + ' periode ' + this.periode,
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    showLoaderOnConfirm: true,
                    preConfirm: () => {
                        return this.accFaktur(this.agen, approve, this.periode)
                    }
                }
            )
                .then((response) => {
                    if (response.isConfirmed) {
                        if (response.value.status === 200) {
                            Swal.fire({
                                title: 'Berhasil!',
                                text: swalconfirm,
                                icon: 'success'
                            })
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Terjadi masalah jaringan, silahkan ulangi lagi'
                            })
                        }
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Terjadi masalah jaringan, silahkan ulangi lagi'
                        })
                    }
                }).catch(() => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Terjadi masalah jaringan, silahkan ulangi lagi'
                    })
                })
        }
    }
}
</script>