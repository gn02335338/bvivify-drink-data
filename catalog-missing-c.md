# 缺漏品牌補齊：C 組

查核日期：2026-11-18。此批新增 7 品牌、41 杯；來源是品牌在台灣使用的官方網站與菜單，沒有複製 mustdrink 的資料或飲品文案。`src/catalog-missing-c.js` 匯出 `missingShopsC`，飲品 `description` 為依來源另寫的簡短介紹。

`base` 與 `tags` 供既有風味推薦分組，不是完整配方、過敏原或飲食保證。未核對糖度一律維持 `unknown`；官網提供不另加糖，也不代表所有配料或原料完全無糖。不把品牌自行宣稱的醫療、健康效益或得獎行銷文字帶入飲品介紹。所有品牌的 `menuWatch` 先維持 `false`，代表本次完成獨立菜單查核，並未宣稱已接上既有官方菜單自動監控器；論壇每日輪替名單由主整合流程加入。

## 官方來源與範圍

| 品牌 | 杯數 | 本次實讀的官方來源 | 適用範圍與限制 |
| --- | ---: | --- | --- |
| 老賴茶棧 `likeatea` | 6 | [飲品列表](https://www.liketeashop.com/tw/drink)、[豆香紅茶的品牌說明](https://www.liketeashop.com/tw/story) | 現行官網招牌品項。北部、中南部與離島分區菜單；尚未核對各區糖冰，全部 `unknown`。豆香紅茶依官網是豆漿加紅茶，沒有標成鮮奶。 |
| 一芳水果茶 `yifang` | 5 | [台灣官網飲品](https://www.yifangteaglobal.com/tw/menu/)、[一般門市菜單公告](https://www.yifangteaglobal.com/tw/news-detail/75__2/) | 官網台灣品項，一般門市菜單公告為 2026-05-30；百貨、三井 Outlet 另有版本。只收官方文字可核對的 5 款，沒有拿海外菜單填補。糖冰全部 `unknown`。 |
| Mr.Wish `mrwish` | 6 | [官方菜單入口](https://www.mr-wish.com/load_page/get_menu_page/1/all/)、[實際北部菜單圖](https://www.mr-wish.com/uploads/1794535291_e80da0e2aadb5cf0f64a.jpg) | 已讀取菜單原圖（1080×1920），使用現行名稱，例如「黃枝香烏龍」「小焙烏龍」「波霸珍珠奶茶」。菜單底部列無糖，兩款純茶可標 `adjustable`；其他含水果、奶或配料飲品保留 `unknown`。沒有把北部版本當成全台統一菜單。 |
| 先喝道 `hsiehho` | 6 | [官方 TOP7 與飲品介紹](https://www.taotaotea.com.tw/pages/drinks) | 實讀品項與官方建議點法。四季春茶王、英式蜜桃風味茶、輕焙穀麥茶有無糖點法，標 `adjustable`；青梅四季春明列固定糖／固定冰，標 `fixed`。其餘 `unknown`。沒有收錄 11/18 之後才推出的新品。 |
| 一手私藏世界紅茶 `itsotea` | 6 | [官方推薦飲品](https://itsotea.com/product_promote.php)、[官方區域菜單入口](https://itsotea.com/product_menu.php) | 官網可核對 6 款現行推薦品及冷熱說明。私藏仲夏夜紅茶明列無糖或微糖，標 `adjustable`；其餘保留 `unknown`。區域供應仍依門市。 |
| 八曜和茶 `hachiyo` | 6 | [官方菜單入口](https://8yotea.com/menu/)、[2026-10-12 菜單原圖](https://8yotea.com/wp-content/uploads/20261012_menu.jpg)、[官方 QA](https://8yotea.com/qa/) | 已讀取菜單原圖（1920×1264）。極上307依純茶糖度選項標 `adjustable`；究極308明列固定無糖且不可加料，標 `unsweetened`。308炙燒濃乳依官方 QA 提醒奶精含黑糖，不當成無糖可喝品項；其餘保留 `unknown`。 |
| 再睡5分鐘 `naptea` | 6 | [官方 MENU 入口](https://www.napteazzz.com/recommendations/%E8%8F%9C%E5%96%AEmenu)、[台灣二代店 2026 菜單原圖](https://static.wixstatic.com/media/14ee62_5e8a2dbada5840e9ad2a12b10a51cc5c~mv2.png) | 已讀取二代店原圖（1184×2771）。台中一中、新莊幸福一代店與香港版本不混用。日安紅、午茉綠、四季金萱列可不另加糖，標 `adjustable`；黑糖珍珠厚奶系列列固定甜度、冷飲固定冰量，標 `fixed`。奶蓋與歐蕾保留 `unknown`。 |

此批沒有待補品牌。每家僅選 4–6 杯可核對品項，並非完整菜單。價格未加入，避免把區域價差或舊價誤當全台價格。

## 論壇樣本

`data/forum-missing-c.json` 共 10 筆飲品口碑，來自 9 個已讀取正文或具體留言的原始討論串；3 個 PTT Drink 串、6 個 Dcard 串。資料只代表可查證的樣本，不是全台人氣統計。正面、負面、加料版本與個人口味差異均保留在 note。日期無法由原文可靠確認的 Dcard 留 `null`，不以搜尋引擎的日期推估，不把本次查核日當發文日。

| 品牌／飲品 | 原文 | 收錄依據 |
| --- | --- | --- |
| 老賴／豆香紅茶 | [PTT，2021-01-16](https://www.ptt.cc/bbs/Drink/M.1610780452.A.645.html) | 作者實喝與同串相反心得，收成 `mixed`。 |
| 先喝道／四季春茶王 | [PTT，2023-10-30](https://www.ptt.cc/bbs/Drink/M.1698647001.A.058.html) | 實喝含珍珠、玫瑰雪露的版本，note 明確註記與純茶不同。 |
| 再睡／棉被午茉綠 | [Dcard 正面心得](https://www.dcard.tw/f/food/p/234065045) | 實喝半糖微冰，喜歡整體搭配但有提奶蓋粉感。 |
| 再睡／棉被午茉綠 | [Dcard 負面心得](https://www.dcard.tw/f/food/p/257295441) | 單次回購體驗，描述與先前記憶的落差，未推論品牌全面改配方。 |
| 一手／私藏仲夏夜紅茶 | [PTT，2023-11-05](https://www.ptt.cc/bbs/Drink/M.1699119295.A.438.html) | 作者自己喝過的紅茶清單，明確寫出無糖去冰點法。 |
| Mr.Wish／紅心芭樂梅 | [Dcard 原串留言](https://www.dcard.tw/f/boba/p/259932893) | 留言者以自己到店固定點的經驗推薦；糖冰、門市未交代。 |
| 一芳／一芳水果茶 | [Dcard 個人飲品清單](https://www.dcard.tw/f/food/p/239490311) | 作者分享常點品項及不另加糖少冰點法；未當作官方糖分證據。 |
| 八曜／柚香覺醒307、308炙燒濃乳 | [Dcard 同次實喝心得](https://www.dcard.tw/f/boba/p/236621489) | 同串兩杯各對應一筆，正面果茶與含白玉的奶茶心得分開；不是兩個獨立討論串。 |
| 八曜／柚香覺醒307 | [Dcard 負面心得](https://www.dcard.tw/f/boba/p/256361452) | 實喝微糖微冰，認為過甜、冰多及茶感不足；僅描述該次體驗。 |

搜尋期間另有八曜相關 PTT 結果，但原頁取回受限，沒有只靠摘要納入。第三方菜單網站只作發現線索，未作為品名、配方或糖度證據。未取得任何 Threads 第一手原文，本批不宣稱已涵蓋 Threads。

## 可供主程式登錄的官方標誌

未改 `src/brand-assets.js`。以下檔案已由官方站下載，主整合者可自行登錄；商標歸各品牌所有。

| slug | 本機檔案 | 尺寸 | 官方來源與顯示注意 |
| --- | --- | --- | --- |
| likeatea | `public/assets/brands/new-likeatea.png` | 30×30 | [官網 favicon](https://www.liketeashop.com/resources/_img/favicon.png)，適合小圖示；尺寸較小，不宜放大。 |
| yifang | `public/assets/brands/new-yifang.png` | 230×50 | [官網 Logo](https://www.yifangteaglobal.com/tw/images/logo.png)，橫式。 |
| mrwish | `public/assets/brands/new-mrwish.png` | 2739×1254 | [官網 Logo](https://www.mr-wish.com/images/logo_white.png)，已目視確認為白底、綠色區塊與淺色商標的完整圖；宜 contain，勿裁切文字。 |
| itsotea | `public/assets/brands/new-itsotea.png` | 146×146 | [官網 Apple touch icon](https://itsotea.com/apple-touch-icon.png)。 |
| hachiyo | `public/assets/brands/new-hachiyo.jpg` | 192×192 | [官網圖示](https://8yotea.com/wp-content/uploads/2023/05/cropped-QWQW-192x192.jpg)。 |
| naptea | `public/assets/brands/new-naptea.png` | 3000×3000 | [官網圖示原圖](https://static.wixstatic.com/media/2ad4ac_43415d34e40a49d984f5868249359a1f~mv2.png)，已目視確認為品牌樹懶商標；可由既有資產流程另製小尺寸。 |

先喝道本批未取得可直接使用的官方標誌檔，使用既有文字標誌回退即可；這不影響品牌與飲品收錄。
