<template>
    <table class="page-break" style="font-family: Arial; font-size:11px; padding: 0 0 0 0;">
        <tr>
            <td width="30%" valign="top">
                <b>STRUK PEMBELIAN TOKEN PLN</b><br /><br />
                <table cellspacing='1' cellpadding='0' style='font-family: Arial; font-size:10px;'>
                    <tr>
                        <td>TGL BELI</td>
                        <td>:</td>
                        <td>&nbsp;
                            {{tanggal}}
                        </td>
                    </tr>
                    <tr>
                        <td>NO METER</td>
                        <td>:</td>
                        <td>&nbsp;
                            {{idMeter}}
                        </td>
                    </tr>
                    <tr>
                        <td>IDPEL</td>
                        <td>:</td>
                        <td>&nbsp;
                            {{idPelanggan}}
                        </td>
                    </tr>
                    <tr>
                        <td>NAMA</td>
                        <td>:</td>
                        <td>&nbsp;
                            {{nama}}
                        </td>
                    </tr>
                    <tr>
                        <td>TRF/DAYA</td>
                        <td>:</td>
                        <td>&nbsp;
                            {{tarifDaya}}
                        </td>
                    </tr>
                    <tr>
                        <td>JML KWH </td>
                        <td>:</td>
                        <td>&nbsp;
                            {{kwh}}
                        </td>
                    </tr>
                    <tr>
                        <td>RP TOKEN</td>
                        <td>:</td>
                        <td>&nbsp;Rp
                            {{tagihan}}
                        </td>
                    </tr>
                    <tr>
                        <td>RP NOMINAL</td>
                        <td>:</td>
                        <td>&nbsp;Rp.
                            {{nominal}}
                        </td>
                    </tr>
                    <tr>
                        <td>ADMIN</td>
                        <td>:</td>
                        <td>&nbsp;Rp
                            {{admin}}
                        </td>
                    </tr>
                    <tr>
                        <td>TOTAL</td>
                        <td>:</td>
                        <td>&nbsp;Rp.
                            {{total}}
                        </td>
                    </tr>
                    <tr>
                        <td><b>TOKEN</b></td>
                        <td>:</td>
                        <td>&nbsp;
                            {{token}}
                        </td>
                    </tr>
                </table>
            </td>
            <td width="5%">
            </td>
            <td>
                <table width="450" border="0" cellspacing="1" cellpadding='0'
                    style='font-family: Arial; font-size:11px;'>
                    <tr>
                        <td colspan="5" style='font-size:8px;'>TGL PEMBELIAN :
                            {{tanggal}}<br /><br />
                        </td>
                    </tr>
                    <tr>
                        <td colspan="5" align="center" style='font-size:12px;'><b>STRUK PEMBELIAN LISTRIK
                                PRABAYAR</b><br /><br /></td>
                    </tr>
                    <tr>
                        <td width="20%">NO METER </td>
                        <td>:&nbsp;&nbsp;
                            {{idMeter}}
                        </td>
                        <td width="15%">ADMIN</td>
                        <td width="2%">:&nbsp;&nbsp;Rp</td>
                        <td width="15%" align="right">
                            {{admin}}
                        </td>
                    </tr>
                    <tr>
                        <td>IDPEL </td>
                        <td>:&nbsp;&nbsp;
                            {{idPelanggan}}
                        </td>
                        <td>METERAI </td>
                        <td>:&nbsp;&nbsp;Rp</td>
                        <td align="right">
                            {{materai}}
                        </td>
                    </tr>
                    <tr>
                        <td>NAMA </td>
                        <td>:&nbsp;&nbsp;
                            {{nama}}
                        </td>
                        <td>PPN </td>
                        <td>:&nbsp;&nbsp;Rp</td>
                        <td align="right">
                            {{ppn}}
                        </td>
                    </tr>
                    <tr>
                        <td>TARIF/DAYA </td>
                        <td>:&nbsp;&nbsp;
                            {{tarifDaya}}
                        </td>
                        <td>PPJ</td>
                        <td>:&nbsp;&nbsp;Rp</td>
                        <td align="right">
                            {{ppj}}
                        </td>
                    </tr>
                    <tr>
                        <td>JML KWH </td>
                        <td>:&nbsp;&nbsp;
                            {{kwh}}
                        </td>
                        <td>RP TOKEN </td>
                        <td>:&nbsp;&nbsp;Rp</td>
                        <td align="right">
                            {{tagihan}}
                        </td>
                    </tr>
                    <tr>
                        <td>RP NOMINAL </td>
                        <td>:&nbsp;&nbsp;Rp
                            {{nominal}}
                        </td>
                        <td>RP BAYAR </td>
                        <td>:&nbsp;&nbsp;Rp</td>
                        <td align="right">
                            {{total}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="5" class="token" align="left" style='font-size:12px;'><b>STROOM / TOKEN :
                                {{token}}
                            </b></td>
                    </tr>
                    <tr>
                        <td colspan="5" align="center" style='font-size:11px;'><br />
                            {{informasi}}
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</template>
<script>
export default {
    props: ['tanggal', 'idMeter', 'materai', 'idPelanggan', 'ppn', 'ppj', 'tarifDaya',
        'angsuran', 'reff', 'token', 'total', 'admin', 'kwh', 'tagihan', 'informasi', 'nama', 'nominal']
}
</script>