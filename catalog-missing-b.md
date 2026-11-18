# 缺漏品牌補錄 B 組

查證日期：2026-11-18。獨立閱讀品牌官網、品牌自行登錄的政府平台資料與論壇原文；未擷取 mustdrink.tw 的目錄、敘述或口碑統計。本檔對應 `src/catalog-missing-b.js` 的 `missingShopsB`，共 7 品牌、40 杯。每杯敘述均為依來源重寫的一句簡介，風味標籤為編輯分類，不作配料、過敏原或健康保證。

## 已納入的第一手資料

| 品牌 | 杯數 | 實讀來源 | 有效範圍與注意事項 |
| --- | ---: | --- | --- |
| 大苑子 | 5 | [官方飲品頁](https://www.dayungs.com/home/product/)、[官方價目表頁](https://www.dayungs.com/item_list-html/)、[2026/11/13–11/22北部菜單圖片](https://www.dayungs.com/wp-content/uploads/2026/11/%E5%AE%98%E7%B6%B2%E6%89%8B%E6%A9%9F%E7%89%88%E5%83%B9%E7%9B%AE%E8%A1%A8_261113-261122_%E5%8C%97.jpg) | 官網目前掛北部有效期2026/11/13–11/22。下載原始1080×6900圖片後實讀，不從搜尋摘要補品名。果物依產季與門市；下次有效期需重新查證。 |
| 春水堂 | 6 | [官方茶品介紹](https://www.chunshuitang.com.tw/drink/) | 當下官網品項，不當成每家門市價目表。黑糖琥珀珍珠拿鐵明列冰量固定；珍珠奶茶說明使用奶精。 |
| 天仁釀茶所 | 5 | [臺北市食材登錄平台品牌自行登錄頁](https://foodtracer.health.gov.taipei/UniPages/CustPageView?company_id=18559415TB&fid=ace98b92-fefb-4976-88a1-c9cb90b4612a&mid=68dbebcd-8dee-47c5-a6de-fef66b0d51db) | 頁面顯示「天仁釀茶所」「自主登錄」，公司名稱為「天仁茶業股份有限公司」，公司地址臺北市大安區忠孝東路四段107號6樓。屬業者發布第一手登錄記錄，不是政府保證全台供應的菜單；來源按鈕標為「業者登錄品項」。 |
| 翰林茶館 | 6 | [官方百貨外帶菜單頁](https://www.hanlin-tea.com.tw/3d-flip-book/%E5%A4%96%E5%B8%B6%E8%8F%9C%E5%96%AE-%E7%99%BE%E8%B2%A8/)、[官方菜單原圖](https://www.hanlin-tea.com.tw/wp-content/uploads/%E8%8C%B6%E9%A4%A8_%E7%99%BE%E8%B2%A8%E7%89%88_%E7%87%88%E7%89%87-1.jpg) | 官網當下連結的百貨版圖片本身印2025.06版，保留版本，不改稱2026年新菜單。解析官方flipbook內圖片網址後以2560×1851原圖實讀。僅用百貨外帶範圍，其他店型另計。 |
| UG樂己 | 6 | [臺北市食材登錄平台品牌自行登錄純茶頁](https://foodtracer.health.gov.taipei/UniPages/CustPageView?company_id=80676602&fid=c5e8fab7-daed-4ae3-98f6-4919b1487c00&mid=E85A79C7-CD54-4AA5-9719-C8A9D0E575CE&sel_product_type=%E7%A0%94%E9%81%B8%E7%B4%94%E8%8C%B6) | 頁面顯示「UG樂己」「自主登錄」，公司名稱「聯發國際餐飲事業股份有限公司」，公司地址新北市汐止區新台五路1段95號18樓之7。取研選純茶系列6杯。屬臺北平台業者登錄範圍，不宣稱全台當期價目表；來源按鈕標為「業者登錄品項」。 |
| 茶之魔手 | 6 | [官方價目表](https://www.teamagichand.com.tw/price/) | 頁面明列僅中南部門市；新竹以北、東部及PLUS店需依現場或其他下載菜單。不得把該範圍擴成全台。 |
| 鮮茶道 | 6 | [官方飲品頁](https://www.presotea.com/drinks) | 當下台灣官網6大類茶品中的現行品項，門市供應與糖冰限制另核。未把歷史論壇提到、現行官網無列的紅玉拿鐵補進目錄。 |

### 天仁登錄明細交叉核對

以下品項的列表與明細名稱一致，明細原料可支持簡介，但登錄標準配方含蔗糖液不能證明「不可調糖」，因此全部保留 `sweetness: 'unknown'`。

- [鮮綠茶（itemno=2）](https://foodtracer.health.gov.taipei/UniPages/CustPageView?company_id=18559415TB&fid=b2919c99-5b27-4997-b05d-3890140427a1a&itemno=2&mid=68dbebcd-8dee-47c5-a6de-fef66b0d51db)：列綠茶。
- [洛神冰茶（itemno=3）](https://foodtracer.health.gov.taipei/UniPages/CustPageView?company_id=18559415TB&fid=b2919c99-5b27-4997-b05d-3890140427a1a&itemno=3&mid=68dbebcd-8dee-47c5-a6de-fef66b0d51db)：列綠茶、鮮煮洛神汁，不誤標成無茶葉的花草飲。
- [四季烏龍（itemno=4）](https://foodtracer.health.gov.taipei/UniPages/CustPageView?company_id=18559415TB&fid=b2919c99-5b27-4997-b05d-3890140427a1a&itemno=4&mid=68dbebcd-8dee-47c5-a6de-fef66b0d51db)：列四季烏龍。
- [913茶王（itemno=5）](https://foodtracer.health.gov.taipei/UniPages/CustPageView?company_id=18559415TB&fid=b2919c99-5b27-4997-b05d-3890140427a1a&itemno=5&mid=68dbebcd-8dee-47c5-a6de-fef66b0d51db)：原料只稱913茶王，不臆造配方；以blended-tea保守分類。
- [菊花普洱茶（itemno=7）](https://foodtracer.health.gov.taipei/UniPages/CustPageView?company_id=18559415TB&fid=b2919c99-5b27-4997-b05d-3890140427a1a&itemno=7&mid=68dbebcd-8dee-47c5-a6de-fef66b0d51db)：列普洱茶、菊花。

排除：列表稱「莊園紅茶」的itemno=1明細卻稱「經典紅茶」，名稱不一致先不收；www.tenren.com.tw在本次多次讀取逾時／重設連線，不使用2024、2025舊ToGo菜單假充現行品項，也不把新釀茶所菜單套到全部舊店型。

### 糖度與風味分類

翰林百貨版底部列正常糖、少糖、半糖、微糖、無糖，並註明黃金比例糖度恕不調整。因此所選國宴珍奶設`fixed`，其他5杯設`adjustable`並提醒配料仍可能含糖。其他品牌本次未核對到完整糖度表，均保留`unknown`。未因論壇有人點無糖、或原料表列糖，即推定官網現行所有門市的調糖規則。

UG明細可確認[三窨十五茉](https://foodtracer.health.gov.taipei/UniPages/CustPageView?company_id=80676602&fid=98e445de-1314-4f3c-99bb-0abd8d7c5296&itemno=1&mid=e85a79c7-cd54-4aa5-9719-c8a9d0e575ce)使用茉香綠茶、[米香玉露菁](https://foodtracer.health.gov.taipei/UniPages/CustPageView?company_id=80676602&fid=98e445de-1314-4f3c-99bb-0abd8d7c5296&itemno=5&mid=e85a79c7-cd54-4aa5-9719-c8a9d0e575ce)使用糯米香綠並說明輕烘焙。白桃只寫風味，不宣稱含鮮桃果肉；未把奶茶評論混入純茶。

## 實讀論壇樣本

`data/forum-missing-b.json`收4篇原帖各1筆，並非人氣統計。舊文保留實際日期與配方、門市差異限制；不因新補品牌而編造現代口碑或同意票數。

| 對應飲品 | 原文 | 日期 | 記錄依據 |
| --- | --- | --- | --- |
| 大苑子鮮搾葡萄柚綠 | [PTT：大苑子的葡萄柚綠茶](https://www.ptt.cc/bbs/Drink/M.1439004306.A.D09.html) | 2015-08-08 | 作者不滿果肉量與價格；負評僅代表當年喝到的杯子，留言另有製法說明。歷史文稱葡萄柚綠，現行以官方同類果茶名稱對應；不等於驗證現行配方。 |
| 春水堂珍珠奶茶 | [PTT：春水堂珍珠奶茶](https://www.ptt.cc/bbs/Drink/M.1421588883.A.844.html) | 2015-01-18 | 作者天母店實喝對茶味、珍珠及價格不滿，留言也有肯定奶茶者，記mixed。 |
| 鮮茶道伯爵拿鐵 | [PTT：各種「半」新品牌的鮮奶茶推薦](https://www.ptt.cc/bbs/Drink/M.1641925797.A.5F0.html) | 2022-01-12 | 作者在鮮奶茶心得中推薦鮮茶道伯爵，另提醒其主觀認為微糖偏甜；現行官網名稱伯爵拿鐵。未收已消失的紅玉拿鐵。 |
| UG三窨十五茉 | [Dcard：#UG 不修照了直接速寫心得](https://www.dcard.tw/f/food/p/257092081) | 未核實，保留null | 作者南陽街店實買無糖少冰，肯定茉莉花香及茶感，同時嫌價格高。未讀到可靠發文日期；不從留言日期猜主帖日期。排隊、包裝及乳源推測不當成產品事實。 |

論壇不為本次其餘品牌硬湊記錄。搜尋有找到WomenTalk／Food看板及只談奶茶的UG文章，但本專案來源白名單或品項對應不符，未納入。

## 尚待後續查證

- 糖冰與即時價錢以實際門市為準，本次不新增價格欄位。
- 翰林仍需留意官方是否換上比2025.06更新的百貨版；大苑子11/22到期後需換當期菜單再核對供應。
- 天仁名目衝突的紅茶、完整門市分布與舊店型轉換先保留未確認，不以別人的彙整站填空。
- 已另補7個真實品牌識別圖，來源URL與尺寸記於`src/brand-assets-missing-b.js`，圖檔在`public/assets/brands/new-{slug}.*`。均從官方頁面HTML實際觀察到的圖片或touch-icon連結下載，逐張檢視確認，未臆造圖案。大苑子、春水堂、翰林、茶之魔手及鮮茶道來自各自官網首頁；天仁取[天仁熟客圈官方商城](https://teabrew.tenren.com.tw/)的512px天仁商標；UG取[品牌官方LINE](https://page.line.me/370ivune)的帳號頭像，非LINE平台favicon。品牌識別圖僅協助找店，不表示合作關係。
