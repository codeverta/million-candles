<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\ProductTranslation;

class ProductTranslationSeeder extends Seeder
{
    public function run(): void
    {
        ProductTranslation::truncate();
        $productId = 1; // Ganti sesuai product ID kamu

        $translations = [
            [
                'locale' => 'id',
                'name' => 'Lilin Putih Mati Lampu Stearin',
                'description' => "Isi 10 batang dalam setiap kemasan\n- Terbuat dari stearin berkualitas\n- Ramah lingkungan dan bebas polusi\n- Tahan lama, menyala hingga 15 menit per batang\n- Harga terjangkau\n- Cocok digunakan ketika mati lampu/mati listrik\n\nBahan:\n- Stearin berkualitas tinggi\n\nUkuran:\n- Tinggi: 15 cm\n- Diameter: 1 cm\n\nLilin putih dari Souvenirlilin.id ini adalah pilihan sempurna untuk berbagai keperluan, baik itu dekorasi, acara khusus, atau penggunaan sehari-hari. Dibuat dari stearin berkualitas yang ramah lingkungan dan bebas polusi, lilin ini tidak hanya tahan lama namun juga aman untuk digunakan. Setiap kemasan berisi 10 batang lilin dengan tinggi 15 cm dan diameter 1 cm, yang dapat menyala hingga 45 menit per batang. Dengan harga yang terjangkau, lilin ini adalah pilihan hemat dan berkualitas untuk Anda. Segera tambahkan ke keranjang belanja Anda dan nikmati manfaatnya.",
            ],
            [
                'locale' => 'en',
                'name' => 'White Candle Power Outage Stearin',
                'description' => "Contains 10 sticks per package\n- Made from high-quality stearin\n- Eco-friendly and pollution-free\n- Long-lasting, burns up to 15 minutes per stick\n- Affordable price\n- Ideal for use during power outages\n\nMaterial:\n- High-quality stearin\n\nSize:\n- Height: 15 cm\n- Diameter: 1 cm\n\nThis white candle from Souvenirlilin.id is the perfect choice for various needs, whether for decoration, special events, or daily use. Made from eco-friendly and pollution-free high-quality stearin, this candle is not only durable but also safe to use. Each package contains 10 sticks, each measuring 15 cm in height and 1 cm in diameter, and can burn for up to 45 minutes per stick. With an affordable price, this candle is a cost-effective and high-quality choice for you. Add it to your shopping cart today and enjoy its benefits.",
            ],
            [
                'locale' => 'ja',
                'name' => '停電用ホワイトキャンドル ステアリン',
                'description' => "1パッケージに10本入り\n- 高品質なステアリン製\n- 環境に優しく、汚染なし\n- 長時間燃焼、1本あたり最大15分間点灯\n- 手頃な価格\n- 停電時に最適\n\n素材:\n- 高品質ステアリン\n\nサイズ:\n- 高さ: 15 cm\n- 直径: 1 cm\n\nSouvenirlilin.idのホワイトキャンドルは、装飾、特別なイベント、または日常使用に最適な選択肢です。環境に優しく汚染のない高品質なステアリンから作られており、耐久性があり安全に使用できます。各パッケージには、高さ15 cm、直径1 cmのキャンドルが10本入っており、1本あたり最大45分間燃焼します。手頃な価格で、高品質なコストパフォーマンスに優れたキャンドルです。今すぐショッピングカートに追加して、その恩恵をお楽しみください。",
            ],
            [
                'locale' => 'kr',
                'name' => '정전용 흰색 스테아린 양초',
                'description' => "포장당 10개 포함\n- 고급 스테아린 사용\n- 친환경적이며 무공해\n- 오래 지속되며, 개당 최대 15분 연소\n- 합리적인 가격\n- 정전 시 사용에 적합\n\n재질:\n- 고급 스테아린\n\n크기:\n- 높이: 15 cm\n- 지름: 1 cm\n\nSouvenirlilin.id의 이 흰색 양초는 장식, 특별한 행사 또는 일상적인 사용에 완벽한 선택입니다. 친환경적이고 무공해인 고급 스테아린으로 만들어져, 오래 사용 가능하며 안전합니다. 각 포장에는 높이 15 cm, 지름 1 cm의 양초가 10개 들어 있으며, 하나당 최대 45분 동안 연소할 수 있습니다. 합리적인 가격으로, 경제적이면서도 고품질인 양초입니다. 지금 바로 장바구니에 추가하고 그 혜택을 누리세요.",
            ],
            [
                'locale' => 'zh',
                'name' => '停电用白色硬脂蜡烛',
                'description' => "每包包含10支\n- 采用高品质硬脂制成\n- 环保无污染\n- 持久耐用，每支燃烧可达15分钟\n- 价格实惠\n- 适合停电时使用\n\n材质:\n- 高品质硬脂\n\n尺寸:\n- 高度: 15 cm\n- 直径: 1 cm\n\nSouvenirlilin.id 的这款白色蜡烛是装饰、特殊活动或日常使用的完美选择。采用环保无污染的高品质硬脂制成，这款蜡烛不仅耐用，而且使用安全。每包包含10支蜡烛，每支蜡烛高度15厘米，直径1厘米，每支燃烧时间最长可达45分钟。价格实惠，是您节省又优质的理想选择。立即加入购物车，享受它带来的便利吧！",
            ],
        ];

        foreach ($translations as $translation) {
            DB::table('product_translations')->insert([
                'product_id' => $productId,
                'locale' => $translation['locale'],
                'name' => $translation['name'],
                'description' => $translation['description'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $translations = [
            [
                'product_id' => 2,
                'locale' => 'id',
                'name' => 'Lilin Putih Mati Lampu Stearin',
                'description' => "- Isi 8 batang dalam setiap kemasan\n- Terbuat dari stearin berkualitas\n- Ramah lingkungan dan bebas polusi\n- Tahan lama, menyala hingga 45 menit per batang\n- Harga terjangkau\n- Cocok digunakan ketika mati lampu/mati listrik\n\nBahan:\n- Stearin berkualitas tinggi\n\nUkuran:\n- Tinggi: 15 cm\n- Diameter: 1 cm\n\nLilin putih ini adalah pilihan sempurna untuk berbagai keperluan, baik itu dekorasi, acara khusus, atau penggunaan sehari-hari. Dibuat dari stearin berkualitas yang ramah lingkungan dan bebas polusi, lilin ini tidak hanya tahan lama namun juga aman untuk digunakan. Setiap kemasan berisi 8 batang lilin dengan tinggi 15 cm dan diameter 1 cm, yang dapat menyala hingga 45 menit per batang. Dengan harga yang terjangkau, lilin ini adalah pilihan hemat dan berkualitas untuk Anda. Segera tambahkan ke keranjang belanja Anda dan nikmati manfaatnya!",
            ],
            [
                'product_id' => 2,
                'locale' => 'en',
                'name' => 'White Candle Power Outage Stearin',
                'description' => "- Contains 8 sticks per package\n- Made from high-quality stearin\n- Eco-friendly and pollution-free\n- Long-lasting, burns up to 45 minutes per stick\n- Affordable price\n- Ideal for use during power outages\n\nMaterial:\n- High-quality stearin\n\nSize:\n- Height: 15 cm\n- Diameter: 1 cm\n\nThis white candle is the perfect choice for various needs, whether for decoration, special events, or daily use. Made from eco-friendly and pollution-free high-quality stearin, this candle is not only durable but also safe to use. Each package contains 8 sticks, each measuring 15 cm in height and 1 cm in diameter, and can burn for up to 45 minutes per stick. With an affordable price, this candle is a cost-effective and high-quality choice for you. Add it to your shopping cart now and enjoy the benefits!",
            ],
            [
                'product_id' => 2,
                'locale' => 'ja',
                'name' => '停電用白いステアリンキャンドル',
                'description' => "- 1パックに8本入り\n- 高品質なステアリン製\n- 環境に優しく、汚染なし\n- 1本あたり最大45分間燃焼\n- 手頃な価格\n- 停電時の使用に最適\n\n素材：\n- 高品質ステアリン\n\nサイズ：\n- 高さ：15cm\n- 直径：1cm\n\nこの白いキャンドルは、装飾、特別なイベント、または日常使用など、さまざまな用途に最適な選択肢です。高品質な環境に優しいステアリンで作られたこのキャンドルは、耐久性があり、安全に使用できます。各パッケージには、高さ15cm、直径1cmのキャンドルが8本含まれており、1本あたり最大45分間燃焼します。手頃な価格で、コストパフォーマンスに優れた高品質なキャンドルです。今すぐカートに追加して、その利点を体験してください！",
            ],
            [
                'product_id' => 2,
                'locale' => 'kr',
                'name' => '정전용 흰색 스테아린 양초',
                'description' => "- 패키지당 8개입\n- 고품질 스테아린으로 제작\n- 친환경적이고 오염이 없음\n- 하나당 최대 45분 연소\n- 합리적인 가격\n- 정전 시 사용에 적합\n\n재질:\n- 고품질 스테아린\n\n크기:\n- 높이: 15cm\n- 지름: 1cm\n\n이 흰색 양초는 장식, 특별 행사 또는 일상적인 사용 등 다양한 용도에 완벽한 선택입니다. 친환경적이고 오염이 없는 고품질 스테아린으로 제작되어 내구성이 뛰어나고 안전하게 사용할 수 있습니다. 각 패키지에는 높이 15cm, 지름 1cm의 양초가 8개 들어 있으며, 하나당 최대 45분 동안 연소할 수 있습니다. 합리적인 가격으로 경제적이면서도 품질 좋은 선택입니다. 지금 바로 장바구니에 추가하고 혜택을 누려보세요!",
            ],
            [
                'product_id' => 2,
                'locale' => 'zh',
                'name' => '停电用白色硬脂蜡烛',
                'description' => "- 每包含8根蜡烛\n- 采用高质量硬脂制成\n- 环保无污染\n- 每根可燃烧长达45分钟\n- 价格实惠\n- 停电时使用理想\n\n材料：\n- 高质量硬脂\n\n尺寸：\n- 高度：15厘米\n- 直径：1厘米\n\n这款白色蜡烛是各种需求的完美选择，无论是用于装饰、特殊活动还是日常使用。采用环保无污染的高质量硬脂制成，这款蜡烛不仅耐用而且使用安全。每包包含8根蜡烛，每根高度15厘米，直径1厘米，每根可燃烧长达45分钟。价格实惠，是您经济实用又高质量的最佳选择。立即添加到购物车，享受它带来的好处吧！",
            ],
        ];

        DB::table('product_translations')->insert($translations);

        $translations = [
            [
                'product_id' => 3,
                'locale' => 'id',
                'name' => 'Lilin Kristal Warna Warni Tinggi 11cm Diameter 6cm',
                'description' => "- Tahan lama hingga 12 jam\n- Desain elegan dengan tekstur marble\n- Ramah lingkungan, terbuat dari stearin\n- Tersedia dalam berbagai macam warna\n\nBahan:\n- Stearin berkualitas tinggi\n\nUkuran:\n- Tinggi: 11 cm\n- Diameter: 6 cm\n- Berat: 256 gram\n\nLilin kristal dari Million Candles hadir dengan desain yang elegan dan daya tahan hingga 12 jam. Cocok untuk mempercantik dekorasi ruangan atau memberikan suasana yang tenang dan nyaman. Terbuat dari bahan stearin yang ramah lingkungan, lilin ini tersedia dalam berbagai macam warna yang bisa disesuaikan dengan kebutuhan Anda. Tambahkan ke keranjang sekarang dan rasakan perbedaannya!",
            ],
            [
                'product_id' => 3,
                'locale' => 'en',
                'name' => 'Colorful Crystal Candle Height 11cm Diameter 6cm',
                'description' => "- Lasts up to 12 hours\n- Elegant design with marble texture\n- Eco-friendly, made from stearin\n- Available in various colors\n\nMaterial:\n- High-quality stearin\n\nSize:\n- Height: 11 cm\n- Diameter: 6 cm\n- Weight: 256 grams\n\nMillion Candles' crystal candle features an elegant design and durability lasting up to 12 hours. Perfect for enhancing room decor or creating a calm and cozy atmosphere. Made from eco-friendly stearin material, this candle comes in various colors to suit your needs. Add it to your cart now and feel the difference!",
            ],
            [
                'product_id' => 3,
                'locale' => 'ja',
                'name' => 'カラフルなクリスタルキャンドル 高さ11cm 直径6cm',
                'description' => "- 最大12時間持続\n- 大理石の質感を持つエレガントなデザイン\n- ステアリン製で環境に優しい\n- 様々な色をご用意\n\n素材：\n- 高品質ステアリン\n\nサイズ：\n- 高さ：11cm\n- 直径：6cm\n- 重量：256グラム\n\nMillion Candlesのクリスタルキャンドルは、エレガントなデザインと最大12時間持続する耐久性を兼ね備えています。部屋の装飾を華やかにしたり、落ち着いた心地よい雰囲気を作り出すのに最適です。環境に優しいステアリン素材で作られ、様々な色からお選びいただけます。今すぐカートに追加して、その違いを実感してください！",
            ],
            [
                'product_id' => 3,
                'locale' => 'kr',
                'name' => '다채로운 크리스탈 양초 높이 11cm 지름 6cm',
                'description' => "- 최대 12시간 지속\n- 대리석 텍스처의 우아한 디자인\n- 친환경적인 스테아린 재질 사용\n- 다양한 색상 제공\n\n재질:\n- 고품질 스테아린\n\n크기:\n- 높이: 11cm\n- 지름: 6cm\n- 무게: 256그램\n\nMillion Candles의 크리스탈 양초는 우아한 디자인과 최대 12시간 지속되는 내구성을 자랑합니다. 인테리어를 아름답게 꾸미거나 차분하고 아늑한 분위기를 연출하는 데 이상적입니다. 친환경적인 스테아린 소재로 제작되어 다양한 색상으로 제공됩니다. 지금 바로 장바구니에 추가하고 그 차이를 경험해보세요!",
            ],
            [
                'product_id' => 3,
                'locale' => 'zh',
                'name' => '多彩水晶蜡烛 高11厘米 直径6厘米',
                'description' => "- 持续燃烧可达12小时\n- 优雅的大理石质感设计\n- 采用环保硬脂材料制成\n- 提供多种颜色选择\n\n材料：\n- 高质量硬脂\n\n尺寸：\n- 高度：11厘米\n- 直径：6厘米\n- 重量：256克\n\nMillion Candles的水晶蜡烛设计优雅，耐用性强，燃烧时间可达12小时。非常适合美化居家装饰或营造安静舒适的氛围。采用环保硬脂材料制成，提供多种颜色以满足您的需求。立即加入购物车，感受不一样的体验！",
            ],
        ];

        DB::table('product_translations')->insert($translations);
$translations = [
    [
        'product_id' => 4,
        'locale' => 'id',
        'name' => 'Lilin Kristal Warna Warni Tinggi 30cm Diameter 5cm',
        'description' => "- Tinggi 30cm Diameter 5cm\n- Dapat menyala hingga 10 jam\n- Murah dan ekonomis\n- Terbuat dari stearin yang ramah lingkungan\n- Bebas polusi, tidak menghasilkan asap hitam\n\nBahan:\n- Stearin berkualitas tinggi\n\nLilin ini adalah pilihan sempurna untuk berbagai kebutuhan penerangan Anda. Dibuat dari stearin berkualitas tinggi yang ramah lingkungan, lilin ini tidak hanya efisien tetapi juga aman digunakan. Setiap batang lilin dapat menyala hingga 10 jam, memberikan pencahayaan yang stabil dan terang tanpa asap hitam yang mengganggu. Lilin ini sangat ekonomis dan cocok untuk digunakan sehari-hari atau acara khusus.\n\n*Label sticker/plastik dapat dilepas jika tidak diperlukan",
    ],
    [
        'product_id' => 4,
        'locale' => 'en',
        'name' => 'Colorful Crystal Candle Height 30cm Diameter 5cm',
        'description' => "- Height 30cm Diameter 5cm\n- Burns up to 10 hours\n- Affordable and economical\n- Made from eco-friendly stearin\n- Pollution-free, no black smoke\n\nMaterial:\n- High-quality stearin\n\nThis candle is the perfect choice for all your lighting needs. Made from high-quality, eco-friendly stearin, it is not only efficient but also safe to use. Each candle burns up to 10 hours, providing steady and bright light without producing black smoke. Highly economical, it is ideal for everyday use or special occasions.\n\n*Sticker/plastic label can be removed if not needed",
    ],
    [
        'product_id' => 4,
        'locale' => 'ja',
        'name' => 'カラフルなクリスタルキャンドル 高さ30cm 直径5cm',
        'description' => "- 高さ30cm 直径5cm\n- 最大10時間燃焼\n- 手頃で経済的\n- 環境に優しいステアリン製\n- 黒煙を出さずクリーン\n\n素材：\n- 高品質ステアリン\n\nこのキャンドルは、あらゆる照明ニーズに最適な選択肢です。高品質で環境に優しいステアリンから作られており、効率的で安全に使用できます。一本で最大10時間燃焼し、安定した明るい光を提供します。非常に経済的で、日常使用や特別なイベントにも最適です。\n\n*不要な場合はラベルステッカー/プラスチックを取り外せます",
    ],
    [
        'product_id' => 4,
        'locale' => 'kr',
        'name' => '다채로운 크리스탈 양초 높이 30cm 지름 5cm',
        'description' => "- 높이 30cm 지름 5cm\n- 최대 10시간 연소\n- 저렴하고 경제적\n- 친환경 스테아린 재질\n- 검은 연기 없이 깨끗함\n\n재질:\n- 고품질 스테아린\n\n이 양초는 모든 조명 요구에 완벽한 선택입니다. 고품질 친환경 스테아린으로 제작되어 효율적이고 안전하게 사용할 수 있습니다. 각 양초는 최대 10시간 동안 안정적이고 밝은 빛을 제공합니다. 매우 경제적이며 일상 사용이나 특별한 행사에 적합합니다.\n\n*필요하지 않은 경우 라벨 스티커/플라스틱을 제거할 수 있습니다",
    ],
    [
        'product_id' => 4,
        'locale' => 'zh',
        'name' => '多彩水晶蜡烛 高30厘米 直径5厘米',
        'description' => "- 高30厘米 直径5厘米\n- 可燃烧长达10小时\n- 价格实惠且经济\n- 采用环保硬脂制成\n- 无黑烟污染\n\n材料：\n- 高质量硬脂\n\n这款蜡烛是您各种照明需求的理想选择。采用高质量环保硬脂制成，不仅高效且使用安全。每支蜡烛可燃烧长达10小时，提供稳定明亮的光线而无黑烟污染。非常经济实惠，适合日常使用或特别场合使用。\n\n*如不需要，可移除标签贴纸/塑料",
    ],
];

DB::table('product_translations')->insert($translations);
$translations = [
    [
        'product_id' => 5,
        'locale' => 'id',
        'name' => 'Lilin Kristal Marbel Warna Oranye Tinggi 20 cm Diameter 2.3 cm',
        'description' => "- Tahan lama hingga 8 jam\n- Desain elegan dengan tekstur marble\n- Ramah lingkungan, terbuat dari stearin\n- Tersedia dalam berbagai macam warna\n\nContoh penggunaan:\n- Digunakan untuk berbagai acara spesial seperti pernikahan, ibadah, dll\n\nBahan:\n- Stearin berkualitas tinggi\n\nUkuran:\n- Tinggi: 20 cm\n- Diameter: 2.3 cm\n- Berat: 190 gram\n\nLilin kristal dari Million Candles hadir dengan desain yang elegan dan daya tahan hingga 8 jam. Cocok untuk mempercantik dekorasi ruangan atau memberikan suasana yang tenang dan nyaman. Terbuat dari bahan stearin yang ramah lingkungan, lilin ini tersedia dalam berbagai macam warna yang bisa disesuaikan dengan kebutuhan Anda. Tambahkan ke keranjang sekarang dan rasakan perbedaannya!\n\n*Sticker label dapat dilepas",
    ],
    [
        'product_id' => 5,
        'locale' => 'en',
        'name' => 'Orange Marble Crystal Candle Height 20 cm Diameter 2.3 cm',
        'description' => "- Lasts up to 8 hours\n- Elegant design with marble texture\n- Eco-friendly, made from stearin\n- Available in various colors\n\nExample usage:\n- Used for various special occasions such as weddings, worship, etc.\n\nMaterial:\n- High-quality stearin\n\nSize:\n- Height: 20 cm\n- Diameter: 2.3 cm\n- Weight: 190 grams\n\nThe crystal candle from Million Candles features an elegant design and lasts up to 8 hours. Perfect for enhancing room decor or creating a calm and cozy atmosphere. Made from eco-friendly stearin, this candle comes in a variety of colors to suit your needs. Add it to your cart now and feel the difference!\n\n*Sticker label can be removed",
    ],
    [
        'product_id' => 5,
        'locale' => 'ja',
        'name' => 'オレンジ大理石模様のクリスタルキャンドル 高さ20cm 直径2.3cm',
        'description' => "- 最長4時間燃焼\n- 大理石模様のエレガントなデザイン\n- 環境に優しいステアリン製\n- 多彩なカラー展開\n\n使用例：\n- 結婚式、礼拝などの特別なイベントに使用\n\n素材：\n- 高品質ステアリン\n\nサイズ：\n- 高さ：20cm\n- 直径：2.3cm\n- 重さ：190g\n\nMillion Candlesのクリスタルキャンドルは、エレガントなデザインと最大4時間の燃焼時間を誇ります。部屋の装飾を引き立てたり、落ち着いた快適な雰囲気を作るのに最適です。環境にやさしいステアリン素材で、さまざまな色から選べます。今すぐカートに追加して、その違いを実感してください！\n\n*ラベルステッカーは取り外し可能です",
    ],
    [
        'product_id' => 5,
        'locale' => 'kr',
        'name' => '오렌지 마블 크리스탈 양초 높이 20cm 지름 2.3cm',
        'description' => "- 최대 4시간 지속\n- 대리석 텍스처의 우아한 디자인\n- 친환경 스테아린 소재\n- 다양한 색상으로 제공\n\n사용 예시:\n- 결혼식, 예배 등 다양한 특별한 행사에 사용\n\n재질:\n- 고품질 스테아린\n\n크기:\n- 높이: 20cm\n- 지름: 2.3cm\n- 무게: 190g\n\nMillion Candles의 크리스탈 양초는 우아한 디자인과 최대 4시간 지속되는 성능을 자랑합니다. 실내 장식을 아름답게 하거나 평온하고 아늑한 분위기를 연출하는 데 적합합니다. 친환경적인 스테아린 소재로 제작되었으며 다양한 색상으로 제공됩니다. 지금 장바구니에 추가하고 그 차이를 느껴보세요!\n\n*라벨 스티커는 제거 가능합니다",
    ],
    [
        'product_id' => 5,
        'locale' => 'zh',
        'name' => '橙色大理石水晶蜡烛 高20厘米 直径2.3厘米',
        'description' => "- 持续燃烧时间可达4小时\n- 大理石纹理的优雅设计\n- 环保硬脂材质制成\n- 提供多种颜色选择\n\n使用示例：\n- 用于婚礼、礼拜等各种特殊场合\n\n材料：\n- 高品质硬脂\n\n尺寸：\n- 高：20厘米\n- 直径：2.3厘米\n- 重量：190克\n\nMillion Candles的水晶蜡烛拥有优雅的外观和最长4小时的燃烧时间，非常适合美化室内装饰或营造宁静舒适的氛围。采用环保硬脂制成，提供多种颜色可选。立即添加到购物车，体验不一样的感觉！\n\n*可拆卸标签贴纸",
    ],
];

DB::table('product_translations')->insert($translations);


$translations = [
    [
        'product_id' => 7,
        'locale' => 'id',
        'name' => 'Lilin Kristal Gelas Warna Warni Tinggi 6 cm Diameter 5 cm',
        'description' => "- Tahan lama hingga 1.5 jam\n- Desain elegan dengan tekstur marble\n- Ramah lingkungan, terbuat dari stearin\n- Tersedia dalam berbagai macam warna\n\nBahan:\n- Stearin berkualitas tinggi\n\nUkuran:\n- Tinggi: 6 cm\n- Diameter: 5 cm\n- Berat: 180 gram\n\nLilin kristal dari Million Candles hadir dengan desain yang elegan dan daya tahan hingga 1.5 jam. Cocok untuk mempercantik dekorasi ruangan atau memberikan suasana yang tenang dan nyaman. Terbuat dari bahan stearin yang ramah lingkungan, lilin ini tersedia dalam berbagai macam warna yang bisa disesuaikan dengan kebutuhan Anda. Tambahkan ke keranjang sekarang dan rasakan perbedaannya!\n\n*Sticker label dapat dilepas",
    ],
    [
        'product_id' => 7,
        'locale' => 'en',
        'name' => 'Colorful Glass Crystal Candle Height 6 cm Diameter 5 cm',
        'description' => "- Burns up to 1.5 hours\n- Elegant design with marble texture\n- Eco-friendly, made from stearin\n- Available in various colors\n\nMaterial:\n- High-quality stearin\n\nSize:\n- Height: 6 cm\n- Diameter: 5 cm\n- Weight: 180 grams\n\nCrystal candles from Million Candles come with an elegant design and a burn time of up to 1.5 hours. Perfect for enhancing room décor or creating a calm and cozy atmosphere. Made from eco-friendly stearin, this candle is available in a variety of colors to suit your needs. Add to cart now and feel the difference!\n\n*Sticker label can be removed",
    ],
    [
        'product_id' => 7,
        'locale' => 'ja',
        'name' => 'カラフルなガラスクリスタルキャンドル 高さ6cm 直径5cm',
        'description' => "- 最大1.5時間燃焼\n- マーブル模様のエレガントなデザイン\n- 環境に優しいステアリン製\n- さまざまな色でご用意\n\n素材：\n- 高品質ステアリン\n\nサイズ：\n- 高さ：6cm\n- 直径：5cm\n- 重さ：180g\n\nMillion Candlesのクリスタルキャンドルは、エレガントなデザインと最大1.5時間の燃焼時間を備えています。部屋の装飾を引き立てたり、落ち着いた心地よい雰囲気を演出するのに最適です。環境に優しいステアリン素材で作られており、さまざまな色をご用意しています。今すぐカートに追加して、その違いを体感してください！\n\n*ステッカーラベルは取り外し可能",
    ],
    [
        'product_id' => 7,
        'locale' => 'kr',
        'name' => '다채로운 유리 크리스탈 양초 높이 6cm 지름 5cm',
        'description' => "- 최대 1.5시간 연소\n- 대리석 질감의 우아한 디자인\n- 친환경 스테아린 재질\n- 다양한 색상으로 제공\n\n재질:\n- 고품질 스테아린\n\n크기:\n- 높이: 6cm\n- 지름: 5cm\n- 무게: 180g\n\nMillion Candles의 크리스탈 양초는 우아한 디자인과 최대 1.5시간의 연소 시간을 자랑합니다. 실내 장식을 아름답게 하거나 차분하고 편안한 분위기를 조성하는 데 적합합니다. 친환경적인 스테아린 재질로 제작되었으며 다양한 색상으로 제공됩니다. 지금 장바구니에 담고 차이를 느껴보세요!\n\n*스티커 라벨은 제거할 수 있습니다",
    ],
    [
        'product_id' => 7,
        'locale' => 'zh',
        'name' => '彩色玻璃水晶蜡烛 高6厘米 直径5厘米',
        'description' => "- 可燃烧长达1.5小时\n- 大理石纹理的优雅设计\n- 环保硬脂制成\n- 提供多种颜色\n\n材料：\n- 高质量硬脂\n\n尺寸：\n- 高度：6厘米\n- 直径：5厘米\n- 重量：180克\n\nMillion Candles的水晶蜡烛具有优雅的设计和最长1.5小时的燃烧时间。非常适合装饰房间或营造安静舒适的氛围。由环保的硬脂制成，提供多种颜色可选。立即加入购物车，体验不同之处！\n\n*标签贴纸可拆卸",
    ],
];

DB::table('product_translations')->insert($translations);


$translations = [
    [
        'product_id' => 9,
        'locale' => 'id',
        'name' => 'Lilin Marbel Kristal Memories Tinggi 8.5 cm Diameter 3.5 cm',
        'description' => "- Tahan lama hingga 3 jam\n- Desain elegan dengan tekstur marble\n- Ramah lingkungan, terbuat dari stearin\n- Tersedia dalam berbagai macam warna\n- Digunakan untuk berbagai acara spesial seperti pernikahan, ibadah, dll\n\nBahan:\n- Stearin berkualitas tinggi\n\nUkuran:\n- Tinggi: 8.5 cm\n- Diameter: 3.5 cm\n- Berat: 354 gram\n\nLilin marble kristal dari Million Candles hadir dengan desain yang elegan dan daya tahan hingga 4 jam. Cocok untuk mempercantik dekorasi ruangan atau memberikan suasana yang tenang dan nyaman. Terbuat dari bahan stearin yang ramah lingkungan, lilin ini tersedia dalam berbagai macam warna yang bisa disesuaikan dengan kebutuhan Anda. Tambahkan ke keranjang sekarang dan rasakan perbedaannya!\n\n*Sticker label dapat dilepas",
    ],
    [
        'product_id' => 9,
        'locale' => 'en',
        'name' => 'Memories Marble Crystal Candle Height 8.5 cm Diameter 3.5 cm',
        'description' => "- Burns up to 3 hours\n- Elegant marble-textured design\n- Eco-friendly, made from stearin\n- Available in various colors\n- Suitable for special occasions like weddings, religious ceremonies, etc.\n\nMaterial:\n- High-quality stearin\n\nSize:\n- Height: 8.5 cm\n- Diameter: 3.5 cm\n- Weight: 354 grams\n\nMarble crystal candles from Million Candles feature an elegant design and burn time of up to 4 hours. Perfect for beautifying your space or creating a calm and cozy atmosphere. Made from eco-friendly stearin and available in a variety of colors to suit your needs. Add to cart now and feel the difference!\n\n*Sticker label can be removed",
    ],
    [
        'product_id' => 9,
        'locale' => 'ja',
        'name' => 'メモリーズ マーブルクリスタルキャンドル 高さ8.5cm 直径3.5cm',
        'description' => "- 最大3時間燃焼\n- マーブル模様のエレガントなデザイン\n- 環境に優しいステアリン製\n- さまざまな色でご用意\n- 結婚式、宗教行事など特別なイベントに最適\n\n素材：\n- 高品質ステアリン\n\nサイズ：\n- 高さ：8.5cm\n- 直径：3.5cm\n- 重さ：354g\n\nMillion Candlesのマーブルクリスタルキャンドルは、エレガントなデザインと最大4時間の燃焼時間を提供します。空間を美しく演出し、落ち着いた心地よい雰囲気を作るのに最適です。環境に配慮したステアリン素材で作られ、さまざまな色からお選びいただけます。今すぐカートに追加して、その違いを実感してください！\n\n*ステッカーラベルは取り外し可能",
    ],
    [
        'product_id' => 9,
        'locale' => 'kr',
        'name' => '메모리즈 마블 크리스탈 양초 높이 8.5cm 지름 3.5cm',
        'description' => "- 최대 3시간 연소\n- 대리석 텍스처의 우아한 디자인\n- 친환경 스테아린 소재\n- 다양한 색상 제공\n- 결혼식, 종교 행사 등 특별한 날에 적합\n\n재질:\n- 고품질 스테아린\n\n크기:\n- 높이: 8.5cm\n- 지름: 3.5cm\n- 무게: 354g\n\nMillion Candles의 마블 크리스탈 양초는 우아한 디자인과 최대 4시간의 연소 시간을 자랑합니다. 실내를 아름답게 장식하거나 차분하고 포근한 분위기를 연출하기에 적합합니다. 친환경적인 스테아린으로 제작되었으며 다양한 색상으로 제공됩니다. 지금 장바구니에 담고 그 차이를 느껴보세요!\n\n*스티커 라벨은 제거할 수 있습니다",
    ],
    [
        'product_id' => 9,
        'locale' => 'zh',
        'name' => '回忆大理石水晶蜡烛 高8.5厘米 直径3.5厘米',
        'description' => "- 可燃烧长达3小时\n- 大理石质感的优雅设计\n- 环保硬脂制成\n- 提供多种颜色\n- 适用于婚礼、宗教仪式等各种特别场合\n\n材料：\n- 高品质硬脂\n\n尺寸：\n- 高度：8.5厘米\n- 直径：3.5厘米\n- 重量：354克\n\nMillion Candles 的大理石水晶蜡烛具有优雅的设计和最长 4 小时的燃烧时间。非常适合美化空间或营造安静温馨的氛围。采用环保硬脂制成，提供多种颜色以满足您的需求。立即加入购物车，体验不同之处！\n\n*标签贴纸可拆卸",
    ],
];

DB::table('product_translations')->insert($translations);



    }
}
