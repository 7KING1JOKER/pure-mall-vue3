import { defineStore } from 'pinia';
import { ElNotification } from 'element-plus';

// 定义商品接口
export interface Product {
  id: number;
  name: string;
  price: number;
  sales: number;
  image: string;
}

// 定义分类节点接口
export interface CategoryNode {
  id: string;
  label: string;
  icon: string;
  children?: CategoryNode[];
}

// 排序选项类型
type SortType = 'default' | 'priceAsc' | 'priceDesc' | 'salesDesc' | 'newest';

// 分类数据结构 - 服装部位分类
const categoryData: CategoryNode[] = [
  {
    id: '1',
    label: '上衣',
    icon: 'Tshirt',
    children: [
      { id: '11', label: 'T恤', icon: 'Tshirt' },
      { id: '12', label: '衬衫', icon: 'Document' },
      { id: '13', label: '卫衣', icon: 'Shirt' },
      { id: '14', label: '毛衣', icon: 'Cloud' },
      { id: '15', label: '夹克', icon: 'FolderOpened' },
      { id: '16', label: '外套', icon: 'Umbrella' },
    ]
  },
  {
    id: '2',
    label: '下装',
    icon: 'Briefcase',
    children: [
      { id: '21', label: '牛仔裤', icon: 'Star' },
      { id: '22', label: '休闲裤', icon: 'Goods' },
      { id: '25', label: '裙子', icon: 'Bell' },
    ]
  },
  {
    id: '3',
    label: '鞋子',
    icon: 'Soccer'
  },
  {
    id: '4',
    label: '配饰',
    icon: 'Glasses'
  },
  {
    id: '5',
    label: '内衣',
    icon: 'User'
  },
  {
    id: '6',
    label: '箱包',
    icon: 'ShoppingBag'
  },
];

// 商品列表 - 服装相关商品
export const productData: Product[] = [
  // 上衣类 - T恤
  { id: 1001, name: '纯棉宽松短袖T恤', price: 99, sales: 1250, image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 1002, name: '男士印花短袖T恤', price: 89, sales: 2100, image: 'https://images.unsplash.com/photo-1688990982651-a5d751773eff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fHNob3J0JTIwc2xlZXZlJTIwdCUyMHNoaXJ0JTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwwfHwwfHx8MA%3D%3D' },
  { id: 1003, name: '女士修身短袖T恤', price: 109, sales: 1850, image: 'https://images.unsplash.com/photo-1688404970273-4d83251d3686?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fFdvbWVuJ3MlMjBULXNoaXJ0JTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600' },
  { id: 1004, name: '情侣装短袖T恤', price: 119, sales: 980, image: 'https://images.unsplash.com/photo-1739809006763-49663591bdcd?q=80&w=1049&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  
  // 上衣类 - 衬衫
  { id: 1005, name: '商务休闲长袖衬衫', price: 199, sales: 890, image: 'https://images.unsplash.com/photo-1745270029066-8c1dfb37c03c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fEJ1c2luZXNzJTIwY2FzdWFsJTIwbG9uZyUyMHNsZWV2ZSUyMHNoaXJ0JTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwwfHwwfHx8MA%3D%3D' },
  { id: 1006, name: '男士牛津纺长袖衬衫', price: 219, sales: 1250, image: 'https://images.unsplash.com/photo-1614495039153-e9cd13240469?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 1007, name: '女士真丝长袖衬衫', price: 299, sales: 750, image: 'https://images.unsplash.com/photo-1590588503704-9aaf7d2946d3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8TGFkaWVzJyUyMFNpbGslMjBMb25nJTIwU2xlZXZlJTIwU2hpcnQlMjBibGFjayUyMGFuZCUyMHdoaXRlfGVufDB8fDB8fHww' },
  { id: 1008, name: '薄款防晒长袖衬衫', price: 159, sales: 1980, image: 'https://images.unsplash.com/photo-1744963129109-3f3fdf8d0b8d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8VGhpbiUyMGxvbmclMjBzbGVldmUlMjBzaGlydCUyMGJsYWNrJTIwYW5kJTIwd2hpdGV8ZW58MHx8MHx8fDA%3D' },
  
  // 上衣类 - 卫衣
  { id: 1009, name: '加绒连帽卫衣', price: 259, sales: 1870, image: 'https://images.unsplash.com/photo-1622866654030-fb0958200023?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG9vZGllJTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwwfHwwfHx8MA%3D%3D' },
  { id: 1010, name: '宽松圆领卫衣', price: 199, sales: 2350, image: 'https://images.unsplash.com/photo-1716004109499-95f01ec73e30?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fExvb3NlJTIwcm91bmQlMjBuZWNrJTIwc3dlYXRzaGlydCUyMGJsYWNrJTIwYW5kJTIwd2hpdGV8ZW58MHx8MHx8fDA%3D' },
  { id: 1011, name: '情侣款连帽卫衣', price: 229, sales: 1450, image: 'https://images.unsplash.com/photo-1576018357765-f04766b34b6b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fENvdXBsZSdzJTIwaG9vZGVkJTIwc3dlYXRzaGlydCUyMGJsYWNrJTIwYW5kJTIwd2hpdGV8ZW58MHx8MHx8fDA%3D' },
  { id: 1012, name: 'oversize卫衣', price: 249, sales: 1780, image: 'https://images.unsplash.com/photo-1580159851546-833dd8f26318?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8b3ZlcnNpemVkJTIwaG9vZGllJTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwwfHwwfHx8MA%3D%3D' },
  
  // 上衣类 - 毛衣
  { id: 1013, name: '高领针织毛衣', price: 299, sales: 670, image: 'https://images.unsplash.com/photo-1647736878001-e96794c5877a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8SGlnaCUyMG5lY2slMjBrbml0dGVkJTIwc3dlYXRlciUyMGJsYWNrJTIwYW5kJTIwd2hpdGV8ZW58MHx8MHx8fDA%3D' },
  { id: 1014, name: '圆领宽松毛衣', price: 279, sales: 1120, image: 'https://images.unsplash.com/photo-1734003066406-33aa5fba6821?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8TG9vc2UlMjBmaXR0aW5nJTIwcm91bmQlMjBuZWNrJTIwc3dlYXRlciUyMGJsYWNrJTIwYW5kJTIwd2hpdGV8ZW58MHx8MHx8fDA%3D' },
  { id: 1015, name: 'V领针织开衫', price: 329, sales: 890, image: 'https://images.unsplash.com/photo-1739047832043-287c97d7312a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTJ8fFYlMjBuZWNrJTIwa25pdHRlZCUyMGNhcmRpZ2FuJTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwwfHwwfHx8MA%3D%3D' },
  { id: 1016, name: '麻花编织毛衣', price: 359, sales: 580, image: 'https://plus.unsplash.com/premium_photo-1671135590215-ded219822a44?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fFR3aXN0ZWQlMjBrbml0JTIwc3dlYXRlciUyMGJsYWNrJTIwYW5kJTIwd2hpdGV8ZW58MHx8MHx8fDA%3D' },
  
  // 上衣类 - 夹克/外套
  { id: 1017, name: '修身牛仔夹克', price: 359, sales: 4320, image: 'https://images.unsplash.com/photo-1727516299214-c4d54704b045?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8U3VlZGUlMjBkZW5pbSUyMGphY2tldCUyMGJsYWNrJTIwYW5kJTIwd2hpdGV8ZW58MHx8MHx8fDA%3D' },
  { id: 1018, name: '时尚西装外套', price: 499, sales: 3250, image: 'https://plus.unsplash.com/premium_photo-1661328047229-aea8cde84a31?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGZhc2hpb25hYmxlJTIwc3VpdCUyMGphY2tldCUyMGJsYWNrJTIwYW5kJTIwd2hpdGV8ZW58MHx8MHx8fDA%3D' },
  { id: 1019, name: '休闲工装夹克', price: 329, sales: 2180, image: 'https://images.unsplash.com/photo-1632958978877-69406b688b11?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fENhc3VhbCUyMHdvcmslMjBqYWNrZXQlMjBibGFjayUyMGFuZCUyMHdoaXRlfGVufDB8fDB8fHww' },
  { id: 1020, name: '轻薄羽绒外套', price: 599, sales: 1590, image: 'https://images.unsplash.com/photo-1699431763539-a83758780d6f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8TGlnaHR3ZWlnaHQlMjBkb3duJTIwamFja2V0JTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwwfHwwfHx8MA%3D%3D' },
  
  // 下装类 - 牛仔裤
  { id: 1021, name: '经典直筒牛仔裤', price: 249, sales: 1560, image: 'https://images.unsplash.com/photo-1601747465107-1beb1c562334?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amVhbnMlMjBibGFjayUyMGFuZCUyMHdoaXRlfGVufDB8fDB8fHww' },
  { id: 1022, name: '修身小脚牛仔裤', price: 269, sales: 2350, image: 'https://images.unsplash.com/photo-1626295077144-61f9eb15d25e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGplYW5zJTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwwfHwwfHx8MA%3D%3D' },
  { id: 1023, name: '高腰阔腿牛仔裤', price: 289, sales: 1890, image: 'https://images.unsplash.com/photo-1633833293795-6a0da546e91f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGplYW5zJTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwwfHwwfHx8MA%3D%3D' },
  { id: 1024, name: '破洞牛仔裤', price: 299, sales: 1650, image: 'https://images.unsplash.com/photo-1647309330899-3195579594b8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHJpcHBlZCUyMGplYW5zJTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwwfHwwfHx8MA%3D%3D' },
  
  // 下装类 - 休闲裤
  { id: 1025, name: '休闲束脚运动裤', price: 179, sales: 4320, image: 'https://images.unsplash.com/photo-1715833002251-64a42ab16fdc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Q2FzdWFsJTIwY3VmZmVkJTIwc3dlYXRwYW50cyUyMGJsYWNrJTIwYW5kJTIwd2hpdGV8ZW58MHx8MHx8fDA%3D' },
  { id: 1026, name: '潮流工装短裤', price: 159, sales: 780, image: 'https://images.unsplash.com/photo-1516271099866-de31ba93ee4b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fFRyZW5keSUyMGNhcmdvJTIwc2hvcnRzJTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwwfHwwfHx8MA%3D%3D' },
  { id: 1027, name: '男士商务休闲裤', price: 219, sales: 1980, image: 'https://images.unsplash.com/photo-1590463043718-50200caa16d1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNhc3VhbCUyMHBhbnRzJTIwc2hvcnRzJTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwwfHwwfHx8MA%3D%3D' },
  { id: 1028, name: '女士阔腿休闲裤', price: 229, sales: 1750, image: 'https://images.unsplash.com/photo-1671394199549-fa5715c1e40c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fFdvbWVuJ3MlMjB3aWRlJTIwbGVnJTIwY2FzdWFsJTIwcGFudHMlMjBibGFjayUyMGFuZCUyMHdoaXRlfGVufDB8fDB8fHww' },
  
  // 下装类 - 裙子
  { id: 1029, name: '优雅碎花连衣裙', price: 329, sales: 2980, image: 'https://images.unsplash.com/photo-1594357937085-f17503c4e748?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmxvcmFsJTIwZHJlc3MlMjBibGFjayUyMGFuZCUyMHdoaXRlfGVufDB8fDB8fHww' },
  { id: 1030, name: '高腰A字半身裙', price: 199, sales: 2150, image: 'https://images.unsplash.com/photo-1591079823942-a86a154ccb05?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8SGlnaCUyMHdhaXN0ZWQlMjBBJTIwbGluZSUyMHNraXJ0JTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwwfHwwfHx8MA%3D%3D' },
  { id: 1031, name: '针织包臀裙', price: 259, sales: 1320, image: 'https://images.unsplash.com/photo-1622533082651-68c1d92bc15b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGRyZXNzJTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwwfHwwfHx8MA%3D%3D' },
  { id: 1032, name: '波西米亚长裙', price: 359, sales: 890, image: 'https://images.unsplash.com/photo-1632227899642-743d963c8bfc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGRyZXNzJTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwwfHwwfHx8MA%3D%3D' },
  
  // 鞋子类
  { id: 1033, name: '透气网面运动鞋', price: 399, sales: 2150, image: 'https://images.unsplash.com/photo-1578314921455-34dd4626b38d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNob2VzJTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwwfHwwfHx8MA%3D%3D' },
  { id: 1034, name: '经典小白鞋', price: 359, sales: 3250, image: 'https://images.unsplash.com/photo-1556812191-381c7e7d96d6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHNob2VzJTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwwfHwwfHx8MA%3D%3D' },
  { id: 1035, name: '马丁靴', price: 459, sales: 1850, image: 'https://images.unsplash.com/photo-1631482665514-567048726eb1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fHNob2VzJTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwwfHwwfHx8MA%3D%3D' },
  { id: 1036, name: '夏季凉鞋', price: 259, sales: 2750, image: 'https://images.unsplash.com/photo-1561304211-f88bafcc4e22?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fHNob2VzJTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwwfHwwfHx8MA%3D%3D' },
  
  // 配饰类
  { id: 1037, name: '时尚棒球帽', price: 89, sales: 980, image: 'https://images.unsplash.com/photo-1689501663816-4c5b7f6688f0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fEJhc2ViYWxsJTIwY2FwJTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwwfHwwfHx8MA%3D%3D' },
  { id: 1038, name: '羊毛针织围巾', price: 159, sales: 1320, image: 'https://images.unsplash.com/photo-1642888823903-dca882a78b69?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fFdvb2wlMjBrbml0dGVkJTIwc2NhcmYlMjBibGFjayUyMGFuZCUyMHdoaXRlfGVufDB8fDB8fHww' },
  { id: 1039, name: '潮流墨镜', price: 299, sales: 1750, image: 'https://images.unsplash.com/photo-1730167056729-22f2b34ee32c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fFRyZW5keSUyMHN1bmdsYXNzZXMlMjBibGFjayUyMGFuZCUyMHdoaXRlfGVufDB8fDB8fHww' },
  { id: 1040, name: '时尚手表', price: 599, sales: 890, image: 'https://images.unsplash.com/photo-1722445423163-f57f92ea9f78?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2F0Y2glMjBibGFjayUyMGFuZCUyMHdoaXRlfGVufDB8fDB8fHww' },
  
  // 内衣类
  { id: 1041, name: '棉质内裤', price: 129, sales: 3520, image: 'https://images.unsplash.com/photo-1640765937555-6f413ed1d936?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzl8fENvdHRvbiUyMHVuZGVyd2VhciUyMGJsYWNrJTIwYW5kJTIwd2hpdGV8ZW58MHx8MHx8fDA%3D' },
  { id: 1042, name: '莫代尔睡衣套装', price: 199, sales: 2450, image: 'https://images.unsplash.com/photo-1736697421338-c361795c7191?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFqYW1hJTIwc2V0JTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwwfHwwfHx8MA%3D%3D' },
  { id: 1043, name: '保暖内衣套装', price: 259, sales: 1890, image: 'https://images.unsplash.com/photo-1731267776886-90f90af75eb1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dGhlcm1hbCUyMHVuZGVyd2VhciUyMHNldCUyMGJsYWNrJTIwYW5kJTIwd2hpdGV8ZW58MHx8MHx8fDA%3D' },
  { id: 1044, name: '纯棉袜子', price: 69, sales: 4780, image: 'https://images.unsplash.com/photo-1640026199235-c24aa417b552?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fFB1cmUlMjBjb3R0b24lMjBzb2NrcyUyMGJsYWNrJTIwYW5kJTIwd2hpdGV8ZW58MHx8MHx8fDA%3D' },
  
  // 箱包类
  { id: 1045, name: '双肩背包', price: 299, sales: 2150, image: 'https://images.unsplash.com/photo-1541267732407-8f72c182cf11?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8QmFja3BhY2slMjBibGFjayUyMGFuZCUyMHdoaXRlfGVufDB8fDB8fHww' },
  { id: 1046, name: '时尚手提包', price: 399, sales: 1780, image: 'https://images.unsplash.com/photo-1614179689702-355944cd0918?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGZhc2hpb24lMjBoYW5kYmFnJTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwwfHwwfHx8MA%3D%3D' },
  { id: 1047, name: '斜挎包', price: 259, sales: 2350, image: 'https://images.unsplash.com/photo-1592480071809-f42c1dfd4939?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U2hvdWxkZXIlMjBiYWclMjBibGFjayUyMGFuZCUyMHdoaXRlfGVufDB8fDB8fHww' },
  { id: 1048, name: '旅行拉杆箱', price: 499, sales: 1580, image: 'https://plus.unsplash.com/premium_photo-1677838847809-9f0ed2fa2a86?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fFRyYXZlbCUyMHN1aXRjYXNlJTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwwfHwwfHx8MA%3D%3D' }
];

export const useCategoryStore = defineStore('category', {
  state: () => ({
    // 分类导航是否可见
    CategoryNavVisible: false,

    // 分类数据
    categories: categoryData,
    
    // 所有商品数据
    allProducts: productData,
    
    // 当前选中的分类
    currentCategory: {
      id: '',
      label: '全部商品'
    },
    
    // 排序相关
    currentSort: 'default' as SortType,
    sortOptions: {
      default: '综合排序',
      priceAsc: '价格从低到高',
      priceDesc: '价格从高到低',
      salesDesc: '销量优先',
      newest: '最新上架'
    },
    
    // 分页相关
    pageSize: 12,
    currentPage: 1,
    totalProducts: 48,
    
    // 用于页面显示的商品数据
    displayProducts: [] as Product[],
    
    // 树形控件配置
    defaultProps: {
      children: 'children',
      label: 'label'
    }
  }),

  actions: {
    // 加载商品数据
    loadProducts() {
      // 从原始数据中获取所有商品
      let sortedProducts = [...this.allProducts];
      
      // 根据当前选中的分类筛选商品
      if (this.currentCategory.id) {
        // 假设id格式为：大类(1-6)+子类(1-6)，如11代表T恤
        const categoryId = this.currentCategory.id;
        const categoryType = categoryId.charAt(0);
        const subCategoryId = categoryId.charAt(1);
        
        // 检查是否为一级分类（只有一个字符）
        if (categoryId.length === 1) {
          // 一级分类处理
          if (categoryId === '1') sortedProducts = sortedProducts.filter(p => p.id >= 1001 && p.id <= 1020); // 上衣类
          else if (categoryId === '2') sortedProducts = sortedProducts.filter(p => p.id >= 1021 && p.id <= 1032); // 下装类
          else if (categoryId === '3') sortedProducts = sortedProducts.filter(p => p.id >= 1033 && p.id <= 1036); // 鞋子类
          else if (categoryId === '4') sortedProducts = sortedProducts.filter(p => p.id >= 1037 && p.id <= 1040); // 配饰类
          else if (categoryId === '5') sortedProducts = sortedProducts.filter(p => p.id >= 1041 && p.id <= 1044); // 内衣类
          else if (categoryId === '6') sortedProducts = sortedProducts.filter(p => p.id >= 1045 && p.id <= 1048); // 箱包类
        } else {
          // 二级分类处理
          if (categoryType === '1') {
            // 上衣类
            if (subCategoryId === '1') sortedProducts = sortedProducts.filter(p => p.id >= 1001 && p.id <= 1004); // T恤
            else if (subCategoryId === '2') sortedProducts = sortedProducts.filter(p => p.id >= 1005 && p.id <= 1008); // 衬衫
            else if (subCategoryId === '3') sortedProducts = sortedProducts.filter(p => p.id >= 1009 && p.id <= 1012); // 卫衣
            else if (subCategoryId === '4') sortedProducts = sortedProducts.filter(p => p.id >= 1013 && p.id <= 1016); // 毛衣
            else if (subCategoryId === '5') sortedProducts = sortedProducts.filter(p => p.id >= 1017 && p.id <= 1018); // 夹克
            else if (subCategoryId === '6') sortedProducts = sortedProducts.filter(p => p.id >= 1019 && p.id <= 1020); // 外套
          } else if (categoryType === '2') {
            // 下装类
            if (subCategoryId === '1') sortedProducts = sortedProducts.filter(p => p.id >= 1021 && p.id <= 1024); // 牛仔裤
            else if (subCategoryId === '2') sortedProducts = sortedProducts.filter(p => p.id >= 1025 && p.id <= 1028); // 休闲裤
            else if (subCategoryId === '5') sortedProducts = sortedProducts.filter(p => p.id >= 1029 && p.id <= 1032); // 裙子
          }
        }
      }
      
      // 根据排序方式对商品进行排序
      switch(this.currentSort) {
        case 'priceAsc':
          sortedProducts.sort((a, b) => a.price - b.price);
          break;
        case 'priceDesc':
          sortedProducts.sort((a, b) => b.price - a.price);
          break;
        case 'salesDesc':
          sortedProducts.sort((a, b) => b.sales - a.sales);
          break;
        case 'newest':
          // 假设id越大表示越新
          sortedProducts.sort((a, b) => b.id - a.id);
          break;
        default:
          // 综合排序，不做特殊处理
          break;
      }
      
      // 更新总商品数量
      this.totalProducts = sortedProducts.length;
      
      // 实现分页逻辑
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.displayProducts = sortedProducts.slice(startIndex, endIndex);
    },
    
    // 分类点击事件
    handleNodeClick(data: CategoryNode) {
      this.currentCategory = data;
      // 重置分页和排序
      this.currentPage = 1;
      this.currentSort = 'default';
      // 加载该分类下的商品
      this.loadProducts();
    },
    
    // 分页大小变化
    handleSizeChange(val: number) {
      this.pageSize = val;
      this.currentPage = 1; // 重置到第一页
      this.loadProducts();
    },
    
    // 当前页码变化
    handleCurrentChange(val: number) {
      this.currentPage = val;
      this.loadProducts();
    },
    
    // 排序方式变化
    handleSortChange(command: SortType) {
      this.currentSort = command;
      this.loadProducts();
    },
    
    // 添加到购物车
    addToCart(product: Product) {
      ElNotification({
        title: '已添加到购物车',
        message: `已添加 "${product.name}" 到购物车`,
        type: 'success',
        duration: 2000
      });
    },
    
    // 添加到收藏夹
    addToWishlist(product: Product) {
      ElNotification({
        title: '已添加到收藏',
        message: `已将 "${product.name}" 添加到收藏夹`,
        type: 'info',
        duration: 2000
      });
    },
    
    // 初始化数据
    initializeData() {
      this.loadProducts();
    }
  }
});