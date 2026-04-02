import { Prefecture } from "@/types/prefecture";

export const prefectures: Prefecture[] = [
  // ── 北海道 ──
  { id: "hokkaido", name: "北海道", nameEn: "Hokkaido", region: "北海道", regionId: "hokkaido", description: "広大な自然と海鮮の宝庫。", coverImage: "https://images.unsplash.com/photo-1598935888738-cd2622bcd437?w=800&q=80", areas: [] },
  // ── 東北 ──
  { id: "aomori", name: "青森県", nameEn: "Aomori", region: "東北", regionId: "tohoku", description: "", coverImage: "", areas: [] },
  { id: "iwate", name: "岩手県", nameEn: "Iwate", region: "東北", regionId: "tohoku", description: "", coverImage: "", areas: [] },
  { id: "miyagi", name: "宮城県", nameEn: "Miyagi", region: "東北", regionId: "tohoku", description: "", coverImage: "", areas: [] },
  { id: "akita", name: "秋田県", nameEn: "Akita", region: "東北", regionId: "tohoku", description: "", coverImage: "", areas: [] },
  { id: "yamagata", name: "山形県", nameEn: "Yamagata", region: "東北", regionId: "tohoku", description: "", coverImage: "", areas: [] },
  { id: "fukushima", name: "福島県", nameEn: "Fukushima", region: "東北", regionId: "tohoku", description: "", coverImage: "", areas: [] },
  // ── 関東 ──
  { id: "ibaraki", name: "茨城県", nameEn: "Ibaraki", region: "関東", regionId: "kanto", description: "", coverImage: "", areas: [] },
  { id: "tochigi", name: "栃木県", nameEn: "Tochigi", region: "関東", regionId: "kanto", description: "", coverImage: "", areas: [] },
  { id: "gunma", name: "群馬県", nameEn: "Gunma", region: "関東", regionId: "kanto", description: "", coverImage: "", areas: [] },
  { id: "saitama", name: "埼玉県", nameEn: "Saitama", region: "関東", regionId: "kanto", description: "", coverImage: "", areas: [] },
  { id: "chiba", name: "千葉県", nameEn: "Chiba", region: "関東", regionId: "kanto", description: "", coverImage: "", areas: [] },
  { id: "tokyo", name: "東京都", nameEn: "Tokyo", region: "関東", regionId: "kanto", description: "", coverImage: "", areas: [] },
  { id: "kanagawa", name: "神奈川県", nameEn: "Kanagawa", region: "関東", regionId: "kanto", description: "", coverImage: "", areas: [] },
  // ── 中部 ──
  { id: "niigata", name: "新潟県", nameEn: "Niigata", region: "中部", regionId: "chubu", description: "", coverImage: "", areas: [] },
  { id: "toyama", name: "富山県", nameEn: "Toyama", region: "中部", regionId: "chubu", description: "", coverImage: "", areas: [] },
  { id: "ishikawa", name: "石川県", nameEn: "Ishikawa", region: "中部", regionId: "chubu", description: "", coverImage: "", areas: [] },
  { id: "fukui", name: "福井県", nameEn: "Fukui", region: "中部", regionId: "chubu", description: "", coverImage: "", areas: [] },
  { id: "yamanashi", name: "山梨県", nameEn: "Yamanashi", region: "中部", regionId: "chubu", description: "", coverImage: "", areas: [] },
  { id: "nagano", name: "長野県", nameEn: "Nagano", region: "中部", regionId: "chubu", description: "", coverImage: "", areas: [] },
  { id: "gifu", name: "岐阜県", nameEn: "Gifu", region: "中部", regionId: "chubu", description: "", coverImage: "", areas: [] },
  { id: "shizuoka", name: "静岡県", nameEn: "Shizuoka", region: "中部", regionId: "chubu", description: "", coverImage: "", areas: [] },
  { id: "aichi", name: "愛知県", nameEn: "Aichi", region: "中部", regionId: "chubu", description: "", coverImage: "", areas: [] },
  // ── 近畿（フルデータ） ──
  {
    id: "mie", name: "三重県", nameEn: "Mie", region: "近畿", regionId: "kinki",
    description: "伊勢神宮と志摩の海。聖なる地と美食の県。",
    coverImage: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80",
    areas: [{ id: "ise", name: "伊勢・志摩", prefectureId: "mie" }],
  },
  {
    id: "shiga", name: "滋賀県", nameEn: "Shiga", region: "近畿", regionId: "kinki",
    description: "琵琶湖を中心に、自然と歴史が息づく。",
    coverImage: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80",
    areas: [{ id: "otsu", name: "大津・湖南", prefectureId: "shiga" }],
  },
  {
    id: "kyoto", name: "京都府", nameEn: "Kyoto", region: "近畿", regionId: "kinki",
    description: "千年の都。神社仏閣、茶屋街、竹林——何度来ても飽きない。",
    coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    areas: [
      { id: "kyoto-city", name: "京都市内", prefectureId: "kyoto" },
      { id: "arashiyama-area", name: "嵐山・嵯峨野", prefectureId: "kyoto" },
      { id: "uji", name: "宇治", prefectureId: "kyoto" },
    ],
  },
  {
    id: "osaka", name: "大阪府", nameEn: "Osaka", region: "近畿", regionId: "kinki",
    description: "食い倒れの街。ネオンと人情と串カツの匂い。",
    coverImage: "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800&q=80",
    areas: [
      { id: "minami", name: "ミナミ・難波", prefectureId: "osaka" },
      { id: "kita", name: "キタ・梅田", prefectureId: "osaka" },
      { id: "shinsekai-area", name: "新世界・天王寺", prefectureId: "osaka" },
    ],
  },
  {
    id: "hyogo", name: "兵庫県", nameEn: "Hyogo", region: "近畿", regionId: "kinki",
    description: "神戸の港町から城崎温泉まで。海と山と温泉の県。",
    coverImage: "https://images.unsplash.com/photo-1570459027562-4a916cc6113f?w=800&q=80",
    areas: [
      { id: "kobe", name: "神戸", prefectureId: "hyogo" },
      { id: "himeji-area", name: "姫路", prefectureId: "hyogo" },
      { id: "kinosaki-area", name: "城崎", prefectureId: "hyogo" },
    ],
  },
  {
    id: "nara", name: "奈良県", nameEn: "Nara", region: "近畿", regionId: "kinki",
    description: "鹿と大仏と桜。1300年の歴史がのんびり息づく。",
    coverImage: "https://images.unsplash.com/photo-1624601573012-efb68f3f150a?w=800&q=80",
    areas: [
      { id: "nara-city", name: "奈良市内", prefectureId: "nara" },
      { id: "yoshino-area", name: "吉野", prefectureId: "nara" },
    ],
  },
  {
    id: "wakayama", name: "和歌山県", nameEn: "Wakayama", region: "近畿", regionId: "kinki",
    description: "熊野古道と白浜。スピリチュアルとリゾートが共存する。",
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    areas: [
      { id: "shirahama-area", name: "白浜", prefectureId: "wakayama" },
      { id: "kumano-area", name: "熊野", prefectureId: "wakayama" },
    ],
  },
  // ── 中国 ──
  { id: "tottori", name: "鳥取県", nameEn: "Tottori", region: "中国", regionId: "chugoku", description: "", coverImage: "", areas: [] },
  { id: "shimane", name: "島根県", nameEn: "Shimane", region: "中国", regionId: "chugoku", description: "", coverImage: "", areas: [] },
  { id: "okayama", name: "岡山県", nameEn: "Okayama", region: "中国", regionId: "chugoku", description: "", coverImage: "", areas: [] },
  { id: "hiroshima", name: "広島県", nameEn: "Hiroshima", region: "中国", regionId: "chugoku", description: "", coverImage: "", areas: [] },
  { id: "yamaguchi", name: "山口県", nameEn: "Yamaguchi", region: "中国", regionId: "chugoku", description: "", coverImage: "", areas: [] },
  // ── 四国 ──
  { id: "tokushima", name: "徳島県", nameEn: "Tokushima", region: "四国", regionId: "shikoku", description: "", coverImage: "", areas: [] },
  { id: "kagawa", name: "香川県", nameEn: "Kagawa", region: "四国", regionId: "shikoku", description: "", coverImage: "", areas: [] },
  { id: "ehime", name: "愛媛県", nameEn: "Ehime", region: "四国", regionId: "shikoku", description: "", coverImage: "", areas: [] },
  { id: "kochi", name: "高知県", nameEn: "Kochi", region: "四国", regionId: "shikoku", description: "", coverImage: "", areas: [] },
  // ── 九州・沖縄 ──
  { id: "fukuoka", name: "福岡県", nameEn: "Fukuoka", region: "九州・沖縄", regionId: "kyushu", description: "", coverImage: "", areas: [] },
  { id: "saga", name: "佐賀県", nameEn: "Saga", region: "九州・沖縄", regionId: "kyushu", description: "", coverImage: "", areas: [] },
  { id: "nagasaki", name: "長崎県", nameEn: "Nagasaki", region: "九州・沖縄", regionId: "kyushu", description: "", coverImage: "", areas: [] },
  { id: "kumamoto", name: "熊本県", nameEn: "Kumamoto", region: "九州・沖縄", regionId: "kyushu", description: "", coverImage: "", areas: [] },
  { id: "oita", name: "大分県", nameEn: "Oita", region: "九州・沖縄", regionId: "kyushu", description: "", coverImage: "", areas: [] },
  { id: "miyazaki", name: "宮崎県", nameEn: "Miyazaki", region: "九州・沖縄", regionId: "kyushu", description: "", coverImage: "", areas: [] },
  { id: "kagoshima", name: "鹿児島県", nameEn: "Kagoshima", region: "九州・沖縄", regionId: "kyushu", description: "", coverImage: "", areas: [] },
  { id: "okinawa", name: "沖縄県", nameEn: "Okinawa", region: "九州・沖縄", regionId: "kyushu", description: "", coverImage: "", areas: [] },
];
