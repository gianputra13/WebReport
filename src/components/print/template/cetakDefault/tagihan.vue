<template>
    <center>
        <table width="800" style = "font-family: Arial; font-size:11px; padding: 0 0 0 0;">
            <tr align="center">
                <td colspan="7">
                <h4>STRUK PEMBAYARAN TAGIHAN
                    {{ judul }}
                </h4>
                </td>
            </tr>
            <tr>
                <td width="15%">Tanggal</td>
                <td>:</td>
                <td width="35%">
                    {{ tanggal }}
                </td>
                <td>&nbsp;&nbsp;&nbsp;</td>
                <td width="15%">No. Reff</td>
                <td>:</td>
                <td width="35%">
                    {{ reff }}
                </td>
            </tr>
            <tr>
                <td width="15%">ID Pelanggan</td>
                <td>:</td>
                <td width="35%">
                    {{ idPelanggan }}
                </td>
                <td>&nbsp;&nbsp;&nbsp;</td>
                <td width="15%">Tagihan</td>
                <td>:</td>
                <td width="35%">Rp.
                    {{ tagihan }}
                </td>
            </tr>
            <tr>
                <td width="15%">Atas Nama</td>
                <td>:</td>
                <td width="35%">
                    {{ nama }}
                </td>
                <td>&nbsp;&nbsp;&nbsp;</td>
                <td width="15%">Biaya Admin</td>
                <td>:</td>
                <td width="35%">Rp.
                    {{ admin }}
                </td>
            </tr>
            <tr>
                <td width="15%">Periode</td>
                <td>:</td>
                <td width="35%">
                    {{ periode }}
                </td>
                <td>&nbsp;&nbsp;&nbsp;</td>
                <td width="15%">Total Bayar</td>
                <td>:</td>
                <td width="35%">Rp.
                    {{ total }}
                </td>
            </tr>
            <tr v-if="judul === 'PDAM'">
                <td width="15%">Stand Meter</td>
                <td>:</td>
                <td colspan="5">{{sm}}</td>
            </tr>
            <tr>
                <td colspan="7" align="center">
                    <br />
                    Simpanlah Struk ini sebagai bukti pembayaran anda.<br>Struk ini merupakan dokumen elektronik dan
                    alat bukti hukum yang sah (PASAL 5 AYAT 1 UU ITE)
                </td>
            </tr>
            <tr>
                <td colspan="7" align="center">
                </td>
            </tr>
        </table>
    </center>
</template>
<script>
export default {
    props: ['judul', 'tanggal', 'reff', 'idPelanggan', 'tagihan', 'nama', 'admin', 'periode', 'total', 'sm']
}
</script>