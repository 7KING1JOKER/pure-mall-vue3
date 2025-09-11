import { defineStore } from "pinia";


export const useUserStore = defineStore("user", {
	state: () => ({
		vip: '会员',
		activeTab: 'profile',
		tabIcons: {
			profile: 'User',
			orders: 'ShoppingCart',
			address: 'Location',
			wishlist: 'Star'
		},
		tabTitles: {
			profile: '个人资料',
			orders: '我的订单',
			address: '地址管理',
			wishlist: '我的收藏'
		},
		basicInfo: [
			{ label: '用户名', value: '张明' },
			{ label: '邮箱', value: 'zhangming@example.com' },
			{ label: '手机', value: '13800138000' },
			{ label: '性别', value: '男' },
			{ label: '生日', value: '1990-05-15' }
		],
		memberInfo: [
			{ label: '会员等级', value: '黄金会员' },
			{ label: '积分', value: '3,850 分' },
			{ label: '优惠券', value: '5 张可用' }
		],
		orders: [
			{ id: '20230528001', date: '2023-05-28', product: 'Apple iPhone 14 Pro Max', amount: '¥8,999', status: '已完成' },
			{ id: '20230527002', date: '2023-05-27', product: 'Samsung Galaxy S23 Ultra', amount: '¥7,899', status: '待发货' },
			{ id: '20230525003', date: '2023-05-25', product: 'Sony WH-1000XM5 耳机', amount: '¥2,599', status: '已发货' },
			{ id: '20230520004', date: '2023-05-20', product: 'MacBook Pro 14英寸', amount: '¥14,999', status: '已完成' },
			{ id: '20230515005', date: '2023-05-15', product: 'Nike Air Jordan 1', amount: '¥1,299', status: '已取消' }
		],
		addresses: [
			{
				name: '张明 (家)',
				phone: '13800138000',
				province: '北京市',
				city: '北京市',
				district: '朝阳区',
				street: '建国路88号现代城A座1508室',
				zip: '100022',
				isDefault: true
			},
			{
				name: '张明 (公司)',
				phone: '13800138111',
				province: '北京市',
				city: '北京市',
				district: '海淀区',
				street: '中关村大街1号海龙大厦12层',
				zip: '100080',
				isDefault: false
			}
		],
        EditProfileDialogVisible: false
	}),
	actions: {
		statusType(status: string) {
			const map: Record<string, string> = {
				'已完成': 'success',
				'待发货': 'warning',
				'已发货': '',
				'已取消': 'danger'
			}
			return map[status] || 'info'
		},
		handleMenuSelect(index:string) {
			this.activeTab = index
		}
	}
})
