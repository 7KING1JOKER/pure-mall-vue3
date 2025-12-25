/**
 * 商品数据库
 * 包含所有商品的详细信息，符合Product接口规范
 */
import { productData } from "../store/category";

// 商品数据库 - 所有商品的完整信息
export const productDatabase = (() => {
  const remainingProducts = [];
  const baseProducts = productData;

  // 为每个基础商品创建完整的商品对象
  baseProducts.forEach((baseProduct, index) => {
    // 根据ID推断商品类型
    const categoryType = Math.floor(baseProduct.id / 1000);
    let productType = '服装';
    let briefText = '';
    let detailText = '';
    let paramValues = {};

    // 设置不同类型商品的描述和参数
    if (baseProduct.id >= 1001 && baseProduct.id <= 1020) {
      productType = '上衣';
      briefText = '优质面料，舒适透气，时尚百搭';
      detailText = `本款${productType}采用优质面料制作，舒适透气，版型设计贴合人体曲线，适合各种场合穿着。`;
      paramValues = {
        材质: '优质面料',
        版型: '时尚版型',
        颜色: '多色可选',
        尺码: 'S/M/L/XL/XXL',
        '适用季节': '四季通用'
      };
    } else if (baseProduct.id >= 1021 && baseProduct.id <= 1032) {
      productType = '下装';
      briefText = '舒适面料，修身版型，活动自如';
      detailText = `本款${productType}采用舒适面料制作，版型修身不紧绷，穿着活动自如，适合日常休闲穿着。`;
      paramValues = {
        材质: '优质面料',
        版型: '修身版型',
        颜色: '多色可选',
        尺码: 'S/M/L/XL/XXL',
        '适用场景': '日常休闲'
      };
    } else if (baseProduct.id >= 1033 && baseProduct.id <= 1036) {
      productType = '鞋子';
      briefText = '舒适鞋底，透气鞋面，走路轻盈';
      detailText = `本款${productType}采用舒适鞋底设计，透气鞋面材质，穿着走路轻盈，长时间穿着也不累脚。`;
      paramValues = {
        材质: '优质鞋面材质',
        鞋底: '舒适防滑鞋底',
        颜色: '多色可选',
        尺码: '35-44',
        '适用场景': '日常出行'
      };
    } else if (baseProduct.id >= 1037 && baseProduct.id <= 1040) {
      productType = '配饰';
      briefText = '时尚设计，优质材质，精致做工';
      detailText = `本款${productType}采用时尚设计风格，优质材质制作，精致做工，是提升整体造型的点睛之笔。`;
      paramValues = {
        材质: '优质材质',
        风格: '时尚风格',
        颜色: '多色可选',
        尺寸: '均码/多尺寸可选',
        '适用场景': '日常搭配'
      };
    } else if (baseProduct.id >= 1041 && baseProduct.id <= 1044) {
      productType = '内衣';
      briefText = '亲肤面料，舒适透气，贴身不紧绷';
      detailText = `本款${productType}采用亲肤面料制作，舒适透气，贴身不紧绷，给您全天候的舒适体验。`;
      paramValues = {
        材质: '亲肤面料',
        版型: '舒适版型',
        颜色: '多色可选',
        尺码: 'S/M/L/XL',
        '洗涤说明': '建议手洗或机洗轻柔模式'
      };
    } else if (baseProduct.id >= 1045 && baseProduct.id <= 1048) {
      productType = '箱包';
      briefText = '优质材质，大容量设计，耐磨耐用';
      detailText = `本款${productType}采用优质材质制作，大容量设计，内部结构合理，耐磨耐用，适合日常使用或旅行。`;
      paramValues = {
        材质: '优质材质',
        容量: '大容量',
        颜色: '多色可选',
        '内部结构': '多层设计',
        '适用场景': '日常/旅行'
      };
    }
    briefText = `PURE致力于革新衣橱中的经典单品，而这款T恤便是品牌设计思路的体现。这款T恤在宽松的剪裁比例中，延续休闲的圆领设计，并注入细腻的针织肌理，构筑不凡的简约质感。\n\n- 休闲版型\n- 圆领设计\n- 短袖款式\n- 罗纹收边\n\n100%棉。不含配饰/可机洗\n\n尺码M码的后衣长为64厘米`;

    // 创建商品详情对象
    const productDetail = {
      id: baseProduct.id,
      name: baseProduct.name,
      brief: briefText,
      price: baseProduct.price,
      originalPrice: Math.round(baseProduct.price * 1.3),
      sales: baseProduct.sales,
      images: [baseProduct.image, baseProduct.image, baseProduct.image],
      specs: [
        { id: 1, name: '白色', price: baseProduct.price, stock: 100 },
        { id: 2, name: '黑色', price: baseProduct.price, stock: 80 },
        { id: 3, name: '灰色', price: baseProduct.price, stock: 60 }
      ],
      detail: `100% 棉 / 中温熨烫,不可干洗,需要时只可用非氯性漂白剂,平放晾干,温和机洗（最高温度30℃） 款号: 1263697001`,
      params: Object.entries(paramValues).map(([key, value]) => ({ name: key, value })),
      reviews: [
        {
          id: index * 2 + 1,
          user: '顾客' + String.fromCharCode(65 + index % 26),
          avatar: `https://api.dicebear.com/7.x/personas/svg?seed=user${baseProduct.id}`,
          rating: 5,
          content: '质量很好，穿着舒适，非常满意！',
          date: `2023-10-${Math.floor(Math.random() * 25) + 1}`
        },
        {
          id: index * 2 + 2,
          user: '顾客' + String.fromCharCode(75 + index % 26),
          avatar: `https://api.dicebear.com/7.x/personas/svg?seed=user${baseProduct.id + 1}`,
          rating: 4,
          content: '整体不错，性价比高，推荐购买。',
          date: `2023-10-${Math.floor(Math.random() * 25) + 1}`
        }
      ]
    };

    remainingProducts.push(productDetail);
  });

  return remainingProducts;
})();

// 导出默认数据库
export default productDatabase;

// 根据ID获取商品详情
export const getProductById = (productId) => {
  return productDatabase.find(product => product.id === productId) || null;
};

// 获取所有商品
export const getAllProducts = () => {
  return [...productDatabase];
};

// 根据分类ID获取商品
export const getProductsByCategory = (categoryId) => {
  if (!categoryId) return getAllProducts();
  
  // 根据分类ID筛选商品
  // 这里假设ID格式为：大类(1-6)+子类(1-6)，如11代表T恤
  const categoryType = categoryId.charAt(0);
  const subCategoryId = categoryId.charAt(1);
  
  let filteredProducts = [];
  
  if (categoryType === '1') {
    // 上衣类
    if (subCategoryId === '1') filteredProducts = productDatabase.filter(p => p.id >= 1001 && p.id <= 1004); // T恤
    else if (subCategoryId === '2') filteredProducts = productDatabase.filter(p => p.id >= 1005 && p.id <= 1008); // 衬衫
    else if (subCategoryId === '3') filteredProducts = productDatabase.filter(p => p.id >= 1009 && p.id <= 1012); // 卫衣
    else if (subCategoryId === '4') filteredProducts = productDatabase.filter(p => p.id >= 1013 && p.id <= 1016); // 毛衣
    else if (subCategoryId === '5') filteredProducts = productDatabase.filter(p => p.id >= 1017 && p.id <= 1018); // 夹克
    else if (subCategoryId === '6') filteredProducts = productDatabase.filter(p => p.id >= 1019 && p.id <= 1020); // 外套
  } else if (categoryType === '2') {
    // 下装类
    if (subCategoryId === '1') filteredProducts = productDatabase.filter(p => p.id >= 1021 && p.id <= 1024); // 牛仔裤
    else if (subCategoryId === '2') filteredProducts = productDatabase.filter(p => p.id >= 1025 && p.id <= 1028); // 休闲裤
    else if (subCategoryId === '3') filteredProducts = productDatabase.filter(p => p.id >= 1029 && p.id <= 1032); // 裙子
  } else if (categoryType === '3') {
    // 鞋子类
    filteredProducts = productDatabase.filter(p => p.id >= 1033 && p.id <= 1036);
  } else if (categoryType === '4') {
    // 配饰类
    filteredProducts = productDatabase.filter(p => p.id >= 1037 && p.id <= 1040);
  } else if (categoryType === '5') {
    // 内衣类
    filteredProducts = productDatabase.filter(p => p.id >= 1041 && p.id <= 1044);
  } else if (categoryType === '6') {
    // 箱包类
    filteredProducts = productDatabase.filter(p => p.id >= 1045 && p.id <= 1048);
  }
  
  return filteredProducts;
};