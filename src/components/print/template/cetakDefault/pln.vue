<template>

    <table class="page-break" style="font-family: Arial; font-size:11px; padding: 0 0 0 0;">
        <tr>
            <td width="25%" valign="top">
                <b>STRUK PEMBAYARAN PLN</b><br /><br />
                <table cellspacing='1' cellpadding='0' style='font-family: Arial; font-size:10px;'>
                    <tr>
                        <td>TGL BELI</td>
                        <td>:</td>
                        <td>&nbsp;&nbsp;{{ tanggal }}</td>
                    </tr>
                    <tr>
                        <td>IDPEL</td>
                        <td>:</td>
                        <td>&nbsp;&nbsp;{{ tujuan }}</td>
                    </tr>
                    <tr>
                        <td>NAMA</td>
                        <td>:</td>
                        <td>&nbsp;&nbsp;{{ nama }}</td>
                    </tr>
                    <tr>
                        <td>TRF/DAYA</td>
                        <td>:</td>
                        <td>&nbsp;
                            {{ tarifDaya }}
                        </td>
                    </tr>
                    <tr>
                        <td>PERIODE</td>
                        <td>:</td>
                        <td>&nbsp;
                            {{ periode }}
                        </td>
                    </tr>
                    <tr>
                        <td>ST METER</td>
                        <td>:</td>
                        <td>&nbsp;
                            {{ standMeter }}
                        </td>
                    </tr>
                    <tr>
                        <td>ADMIN</td>
                        <td>:</td>
                        <td>&nbsp;&nbsp;Rp.
                            {{ admin }}
                        </td>
                    </tr>
                    <tr v-if="stateDenda">
                        <td>DENDA</td>
                        <td>:</td>
                        <td>&nbsp;&nbsp;Rp {{denda}}
                        </td>
                    </tr>
                    <tr>
                        <td>TAGIHAN</td>
                        <td>:</td>
                        <td>&nbsp;&nbsp;Rp.
                            {{tagihan}}
                        </td>
                    </tr>
                    <tr>
                        <td>TOTAL</td>
                        <td>:</td>
                        <td>&nbsp;&nbsp;Rp.
                            {{total}}
                        </td>
                    </tr>
                </table>
            </td>
            <td width="5%"></td>
            <td>
                <table width="450" border="0" cellspacing="1" cellpadding='0'
                    style='font-family: Arial; font-size:11px;'>
                    <tr>
                        <td colspan="5" align="center" style='font-size:12px;'><b>STRUK PEMBAYARAN PLN PASKA
                                BAYAR</b><br /><br /></td>
                    </tr>
                    <tr>
                        <td width="20%">ID PELANGGAN </td>
                        <td>:&nbsp;&nbsp;
                            {{tujuan}}
                        </td>
                        <td width="15%">TANGGAL</td>
                        <td width="2%">:&nbsp;&nbsp;</td>
                        <td align="right">
                            {{tanggal}}
                        </td>
                    </tr>
                    <tr>
                        <td>NAMA </td>
                        <td>:&nbsp;&nbsp;
                            {{nama}}
                        </td>
                        <td>ADMIN </td>
                        <td>:&nbsp;&nbsp;Rp.</td>
                        <td align="right">
                           {{admin}}
                        </td>
                    </tr>
                    <tr>
                        <td>TARIF/DAYA </td>
                        <td>:&nbsp;
                           {{tarifDaya}}

                        </td>
                        <td>DENDA </td>
                        <td>:&nbsp;&nbsp;Rp.</td>
                        <td align="right">
                            {{denda}}
                        </td>
                    </tr>
                    <tr>
                        <td>STAND METER </td>
                        <td>:&nbsp;
                           {{standMeter}}
                        </td>
                        <td>TAGIHAN </td>
                        <td>:&nbsp;&nbsp;Rp.</td>
                        <td align="right">
                            {{tagihan}}
                        </td>
                    </tr>
                    <tr>
                        <td>PERIODE </td>
                        <td>:&nbsp;
                            {{periode}}
                        </td>
                        <td>TOTAL </td>
                        <td>:&nbsp;&nbsp;Rp.</td>
                        <td align="right">
                            {{total}}
                        </td>
                    </tr>
                    <tr>
                        <td>REFF </td>
                        <td colspan="4">:&nbsp;
                            {{reff}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="5" align="center" style='font-size:11px;'><br />
                            Informasi Hubungi Call Center 123 Atau hubungi PLN Terdekat <br />http://www.pln.co.id/
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</template>
<script>
export default {
    props: ['tanggal', 'tujuan', 'periode', 'nama', 'standMeter', 'tarifDaya', 'tagihan', 'reff', 'admin', 'total', 'denda'],
    computed: {
        stateDenda() {
            const replacer1 = new RegExp('.', 'g')
            const replacer2 = new RegExp(',', 'g')
            const replacing = this.denda.replace(replacer1, '').replace(replacer2, '')
            if (parseInt(replacing) > 0) {
                return true
            } else {
                return false
            }
        }
    }
}
</script>