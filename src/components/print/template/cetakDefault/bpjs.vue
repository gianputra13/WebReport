<template>
    <div class="page">
        <center>
            <table width="800" border="0" style="font-family: Arial; font-size:11px; padding: 0 0 0 0;">
                <tr align="center">
                    <td colspan="7" align="center">
                        <h2>Struk Pembayaran BPJS Kesehatan</h2>
                    </td>
                </tr>
                <tr>
                    <td width="200">Tanggal</td>
                    <td>:</td>
                    <td width="200">
                        {{ tanggal }}
                    </td>
                    <td width="200"></td>
                    <td width="200">Periode</td>
                    <td>:</td>
                    <td width="200">
                        {{ periode }} Bulan
                    </td>
                </tr>
                <tr>
                    <td width="200">Cabang</td>
                    <td>:</td>
                    <td width="200">
                        {{ cabang }}
                    </td>
                    <td></td>
                    <td width="200">Jumlah Peserta</td>
                    <td>:</td>
                    <td width="200">
                        {{ jumlahPeserta }} orang
                    </td>
                </tr>
                <tr>
                    <td width="200">ID Pelanggan</td>
                    <td>:</td>
                    <td width="200">
                        {{ idPelanggan }}
                    </td>
                    <td></td>
                    <td width="200">Tagihan</td>
                    <td>:</td>
                    <td width="200">Rp. <span style="float:right;">
                            {{ tagihan }}
                        </span></td>
                </tr>
                <tr>
                    <td width="200">Nama</td>
                    <td>:</td>
                    <td width="200">
                        {{ nama }}
                    </td>
                    <td></td>
                    <td width="200">Admin Bank</td>
                    <td>:</td>
                    <td width="200">Rp. <span style="float:right;">
                            {{ admin }}
                        </span></td>
                </tr>
                <tr>
                    <td width="200">SW Reff</td>
                    <td>:</td>
                    <td width="200">
                        {{ (reff + "").toUpperCase() }}
                    </td>
                    <td></td>
                    <td width="200">Total Bayar</td>
                    <td>:</td>
                    <td width="200">Rp. <span style="float:right;">
                           {{totalBayar}}
                        </span></td>
                </tr>
                <tr>
                    <td colspan="7" align="center"><br>Simpanlah Struk ini sebagai bukti pembayaran anda.<br>Struk ini
                        merupakan dokumen elektronik dan alat bukti hukum yang sah (PASAL 5 AYAT 1 UU ITE)</td>
                </tr>
                <tr>
                    <td colspan="7" align="center">
                        <hr>
                    </td>
                </tr>
            </table>
        </center>
    </div>
</template>
<script>
export default {
    props: ['tanggal', 'periode', 'cabang', 'jumlahPeserta', 'idPelanggan', 'tagihan', 'nama', 'admin', 'reff', 'totalBayar']
}
</script>