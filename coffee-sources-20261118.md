# 咖啡擴充查證：2026-11-18

新增 4 家、24 個品項，11 篇原始論壇討論對應 11 筆口碑，四家皆至少有一篇可回查的一手試喝。所有標籤均由飲料簿整理，不把官方宣傳文當成消費者評價，也不把乳品天然糖量等同於點餐加糖。甜度調整未證實的品項維持 `unknown`。

## 官方品項來源

| 品牌 | 官方來源 | 本次品項 | 查證與限制 |
| --- | --- | --- | --- |
| 85度C | [官方飲料名錄](https://www.85cafe.com/Product.php?datasid=18&datatid=9) | 美式、拿鐵、招牌、特濃招牌、就是海岩咖啡、荔枝冰美式 | 已開啟官方正文逐項核對；原配方有糖、奶精或奶酪的說明保留在點餐備註，沒有把它推成可調無糖。海岩舊帖使用簡稱，列為較早期經驗。 |
| CITY CAFE | [官方價目表](https://www.citycafe.com.tw/price.aspx) | 美式、拿鐵、濃萃美式、濃萃拿鐵、厚乳拿鐵、燕麥拿鐵 | web 抓取會逾時；以 curl 正常取得官網 HTML，直接讀取現行 `<table>` 的品名與冰熱欄，不以過期 `coffee.aspx` 註解內容推論。燕麥拿鐵熱飲限店。沒有納入 CITY PRIMA 或特選系列混算。 |
| Let’s Café | [官方價目表](https://nevent.family.com.tw/2018_letscafe/product/index.html) | 經典美式、經典拿鐵、特濃美式、特濃拿鐵、燕麥奶拿鐵、經典冰磚拿鐵 | 已開啟完整官方正文。特濃特大杯限店，燕麥奶品牌可為 OATLY 或愛之味，非專用產線。 |
| McCafé | [官方完整菜單](https://www.mcdonalds.com/tw/zh-tw/full-menu.html)、[經典那堤](https://www.mcdonalds.com/tw/zh-tw/product/iced-latte.html)、[卡布奇諾](https://www.mcdonalds.com/tw/zh-tw/product/cappuccino.html)、[金選那堤](https://www.mcdonalds.com/tw/zh-tw/product/select-brew-latte.html)、[金選系列與營養表](https://www.mcdonalds.com/tw/zh-tw/whats-hot/0430SelectBrewCoffee.html)、[蜂蜜紅茶](https://www.mcdonalds.com/tw/zh-tw/product/honey-black-tea-iced.html) | 經典美式、經典那堤、經典卡布奇諾、金選美式、金選那堤、蜂蜜紅茶 | 品項與系列分開。經典美式的 0 糖原配方依[官方現場調製飲料標示表](https://www.mcdonalds.com/content/dam/sites/tw/files/2025/現場調製飲料標示20250304.pdf)，金選美式另由目前官方活動頁的營養表確認；不適用自行加糖。其餘甜度調整未證實。 |

本次不採價格作模型因子，避免不同區域、檔期與門市造成誤導。全部 `menuWatch=false`，並不宣稱新增品牌已納入原先五家的自動官網變動檢查。

## 論壇收錄

原始資料位於 `data/forum-coffee-20261118.json`。每頁已實際開啟閱讀正文，非只讀搜尋摘要。同一原帖每杯只計一次；品牌排名、票數及按讚數未寫入模型。日期欄採原頁能確認的發文日期；本次可讀頁面正文多不顯示發文時間，統一保留 `null`，不由留言、文章ID或搜尋索引日期猜測。

| 原帖 | 對應飲品與收錄方向 |
| --- | --- |
| [奶蓋求推薦](https://www.dcard.tw/f/boba/p/237289456) | 85度C 海岩咖啡：好喝但奶蓋量少，褒貶都有；不拿作者的無糖點法當現行菜單證據。 |
| [85度C最好喝的咖啡是什麼](https://www.dcard.tw/f/food/p/250115215) | 85度C 海岩咖啡：作者實喝且喜歡鹹奶酪。 |
| [我覺得7-11的咖啡超難喝](https://www.dcard.tw/f/cvs/p/255240813) | CITY CAFE 一般美式負評。 |
| [小七最近的拿鐵](https://www.dcard.tw/f/cvs/p/238054489) | CITY CAFE 一般拿鐵較苦的負評，未宣稱品牌已改配方。 |
| [濃萃美式不好喝](https://www.dcard.tw/f/cvs/p/257223777) | CITY CAFE 濃萃美式負評，保留可能門市差異。 |
| [小七的厚乳拿鐵](https://www.dcard.tw/f/cvs/p/253894169) | CITY CAFE 厚乳拿鐵冰熱實喝，奶泡喜歡、奶香未達期待，褒貶都有。 |
| [全家熱經典拿鐵](https://www.dcard.tw/f/coffee/p/253862937) | Let’s Café 經典拿鐵好評。 |
| [全家經典拿鐵的咖啡豆](https://www.dcard.tw/f/cvs/p/241862348) | Let’s Café 經典拿鐵變淡的負評，原作者未確認換豆。 |
| [全家特濃拿鐵](https://www.dcard.tw/f/cvs/p/260429340) | Let’s Café 特濃拿鐵的一手常喝心得，排除布丁與優惠部分。 |
| [全家冰磚拿鐵口感](https://www.dcard.tw/f/cvs/p/255813399) | Let’s Café 經典冰磚拿鐵好評，標明甜味與年代。 |
| [社畜連鎖咖啡評比筆記](https://www.dcard.tw/f/food/p/259011250) | McCafé 金選冰那堤好評，僅收該杯奶咖平衡心得，不採整體品牌排名。 |

已排除：伯朗罐裝咖啡、Dcard 贊助板體驗、各品牌員工推介、只問未喝的頁面、政治與品牌黑名單、純優惠與轉售文。怡客與伯朗咖啡館的官方菜單雖可確認，這輪未找到可精確對應現行品項且符合收錄規則的論壇樣本，因此未為了數量硬加入。

## 品牌識別素材

直接下載官方已公布識別圖，未生成、重畫或改色：

- `public/assets/brands/85cafe.png`：[官方 og:image](https://www.85cafe.com/img/85weblogo.png)，800×800 PNG。
- `public/assets/brands/citycafe.svg`：[官方導覽字標](https://www.citycafe.com.tw/images/logo-white.svg)，白字 SVG；需放於深色品牌底才清晰。
- `public/assets/brands/citycafe-mark.png`：[官方頁面明列的 favicon](https://www.citycafe.com.tw/images/favicon.png)，僅16×16；已另存供小尺寸識別，不建議放大取代清晰的字標。
- `public/assets/brands/letscafe.png`：[官方導覽識別](https://nevent.family.com.tw/2018_letscafe/images/header/logo.png)，192×132 透明 PNG。
- McCafé 未找到足夠直接且可正常下載的台灣官方獨立 logo，保留文字識別，不用麥當勞金拱門假裝 McCafé logo。

## 驗證

以目前 `forumRecords` 和 `shops` 加入這兩個新檔後，`analyzeForum` 驗證 11 筆皆為已確認品項、合法原帖、有效評價，未和基準資料重複。24 個新 ID 與現有 71 個 ID 無衝突，摘要均小於等於160字元。這是資料擴充，不修改推薦模型或排程；每日雲端工作要由主代理同步公開目錄及基準資料後納入。
