import { defineStore } from "pinia";
import { ElMessage } from "element-plus";

// 地址类型定义
interface Address {
  id?: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  street: string;
  zip: string;
  isDefault: boolean;
}

export const useUserStore = defineStore("user", {
	state: () => ({
		vip: '会员',
		activeTab: 'profile',
		isLoggedIn: JSON.parse(localStorage.getItem('isLoggedIn') || 'false'), // 从localStorage恢复登录状态
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
				id: '1',
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
				id: '2',
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
        EditProfileDialogVisible: false,
        // 地址对话框相关状态
        AddressDialogVisible: false,
        currentAddress: null as Address | null,
        isEditingAddress: false
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
		},
		// 地址管理相关方法
		// 打开添加地址对话框
		openAddAddressDialog() {
			this.isEditingAddress = false
			this.currentAddress = {
				name: '',
				phone: '',
				province: '',
				city: '',
				district: '',
				street: '',
				zip: '',
				isDefault: false
			}
			this.AddressDialogVisible = true
		},
		// 打开编辑地址对话框
		openEditAddressDialog(addressId: string) {
			const address = this.addresses.find(addr => addr.id === addressId)
			if (address) {
				this.isEditingAddress = true
				this.currentAddress = { ...address }
				this.AddressDialogVisible = true
			}
		},
		// 保存地址（添加或更新）
		saveAddress(address: Address) {
			if (this.isEditingAddress && address.id) {
				// 更新现有地址
				const index = this.addresses.findIndex(addr => addr.id === address.id)
				if (index !== -1) {
					// 如果设置为默认地址，需要将其他地址设为非默认
					if (address.isDefault) {
						this.addresses.forEach(addr => {
							if (addr.id !== address.id) {
								addr.isDefault = false
							}
						})
					}
					this.addresses[index] = { ...address, id: address.id! }
					ElMessage.success('地址更新成功')
				}
			} else {
				// 添加新地址
				const newAddress = {
					...address,
					id: Date.now().toString() // 生成唯一ID
				}
				
				// 如果设置为默认地址，需要将其他地址设为非默认
				if (newAddress.isDefault) {
					this.addresses.forEach(addr => {
						addr.isDefault = false
					})
				}
				
				this.addresses.push(newAddress)
				ElMessage.success('地址添加成功')
			}
			
			this.AddressDialogVisible = false
			this.currentAddress = null
		},
		// 删除地址
		deleteAddress(addressId: string) {
			const index = this.addresses.findIndex(addr => addr.id === addressId)
			if (index !== -1) {
				// 如果删除的是默认地址，且还有其他地址，则将第一个地址设为默认
				if (this.addresses[index].isDefault && this.addresses.length > 1) {
					const newDefaultIndex = index === 0 ? 1 : 0
					this.addresses[newDefaultIndex].isDefault = true
				}
				
				this.addresses.splice(index, 1)
				ElMessage.success('地址删除成功')
			}
		},
		// 设置默认地址
		setDefaultAddress(addressId: string) {
			this.addresses.forEach(addr => {
				addr.isDefault = addr.id === addressId
			})
			ElMessage.success('默认地址设置成功')
		},
		
		// 登录相关方法
		login(username: string, password: string) {
			// 这里应该是实际的登录API调用
			// 模拟登录成功
			this.isLoggedIn = true
			localStorage.setItem('isLoggedIn', 'true') // 保存到localStorage
			ElMessage.success('登录成功')
		},
		
		logout() {
			// 模拟登出
			this.isLoggedIn = false
			localStorage.removeItem('isLoggedIn') // 从localStorage移除
			ElMessage.success('已退出登录')
		}
	}
})
