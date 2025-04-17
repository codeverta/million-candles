import React from "react";
import { Phone, ShoppingBag, CreditCard, Truck, Clock } from "lucide-react";

const CandleOrderPage = () => {
  return (
    <div className="min-h-screen bg-amber-50 text-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-800 mb-4">
            Sweet Candle
          </h1>
          <p className="text-lg md:text-xl text-amber-700">
            Lilin aromaterapi pilihan untuk momen spesial Anda
          </p>
        </header>

        {/* Main Content */}
        <main>
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-amber-800 mb-6 text-center">
              Cara Order Produk Lilin
            </h2>

            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <Phone className="w-8 h-8 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-amber-700 mb-2">
                    1. Hubungi Kami
                  </h3>
                  <p className="text-gray-600">
                    Silahkan hubungi kami melalui WhatsApp di nomor{" "}
                    <span className="font-medium text-green-600">
                      085123456789
                    </span>{" "}
                    untuk memulai pesanan Anda. Kami akan membantu dengan
                    informasi produk dan ketersediaan stok.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <ShoppingBag className="w-8 h-8 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-amber-700 mb-2">
                    2. Pilih Cara Pengambilan
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Ada dua opsi yang tersedia untuk mendapatkan produk kami:
                  </p>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>
                      <span className="font-medium">Ambil di lokasi:</span>{" "}
                      Kunjungi toko kami di Jalan Candle No. 123, Jakarta
                    </li>
                    <li>
                      <span className="font-medium">Pesan antar:</span> Kami
                      dapat mengirim melalui Gojek, Grab, atau jasa pengiriman
                      lainnya
                    </li>
                  </ul>
                  <p className="text-gray-600 mt-2 italic">
                    *Pesanan dalam jumlah besar memerlukan pemesanan terlebih
                    dahulu
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <CreditCard className="w-8 h-8 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-amber-700 mb-2">
                    3. Pembayaran DP
                  </h3>
                  <p className="text-gray-600">
                    Untuk pesanan dalam jumlah banyak, Anda perlu membayar Down
                    Payment (DP) minimal 30% dari total harga untuk konfirmasi
                    pesanan. Pembayaran dapat dilakukan melalui transfer bank
                    atau e-wallet.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <Truck className="w-8 h-8 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-amber-700 mb-2">
                    4. Pengiriman & Pelunasan
                  </h3>
                  <p className="text-gray-600">
                    Untuk pengiriman, pembayaran harus lunas sebelum produk
                    dikirim. Kami akan memberikan informasi ketika pesanan Anda
                    siap dikirim serta nomor resi pengiriman jika tersedia.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <Clock className="w-8 h-8 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-amber-700 mb-2">
                    5. Waktu Produksi
                  </h3>
                  <p className="text-gray-600">
                    Lama waktu pemesanan bergantung pada jumlah lilin yang Anda
                    pesan. Untuk pesanan kecil, biasanya siap dalam 1-3 hari.
                    Untuk pesanan besar, kami akan memberikan estimasi waktu
                    setelah konsultasi dengan Anda.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-amber-100 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-amber-800 mb-3">
              Siap Memesan?
            </h3>
            <p className="text-amber-700 mb-4">
              Hubungi kami sekarang untuk mendapatkan lilin aromaterapi
              berkualitas tinggi!
            </p>
            <button className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-full transition duration-300 flex items-center justify-center mx-auto">
              <Phone className="w-5 h-5 mr-2" />
              Hubungi via WhatsApp
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600">
          <p>© 2025 Sweet Candle. Semua hak dilindungi.</p>
        </footer>
      </div>
    </div>
  );
};

export default CandleOrderPage;
