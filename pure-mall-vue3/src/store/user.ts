import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import type { Address } from "../api/interfaces";
import request from "@/api/request";

export const useUserStore = defineStore("user", {
	state: () => ({
		username: '默认用户',
		email: 'default@example.com',
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
			{ label: '邮箱', value: 'zhangsan@example.com' },
			{ label: '手机号', value: '13800138000' },
			{ label: '性别', value: '男' },
			{ label: '出生日期', value: '1999-01-01' }
		],
		memberInfo: [
			{ label: '会员等级', value: '黄金会员' },
			{ label: '积分', value: '3,000 分' },
			{ label: '优惠券', value: '5 张可用' }
		],
		orders: [
			{ orderNumber: '20230528001', createTime: '2023-05-28 10:00:00', product: 'Apple iPhone 14 Pro Max', orderAmount: '¥8,999', status: '已完成' },
			{ orderNumber: '20230527002', createTime: '2023-05-27 15:30:00', product: 'Samsung Galaxy S23 Ultra', orderAmount: '¥7,899', status: '待发货' },
			{ orderNumber: '20230525003', createTime: '2023-05-25 09:15:00', product: 'Sony WH-1000XM5 耳机', orderAmount: '¥2,599', status: '已发货' },
			{ orderNumber: '20230520004', createTime: '2023-05-20 12:45:00', product: 'MacBook Pro 14英寸', orderAmount: '¥14,999', status: '已完成' },
			{ orderNumber: '20230515005', createTime: '2023-05-15 18:30:00', product: 'Nike Air Jordan 1', orderAmount: '¥1,299', status: '已取消' }
		],
		addresses: [
			{
				id: 1,
				name: '张明 (家)',
				phone: '13800138000',
				province: '北京市',
				city: '北京市',
				district: '朝阳区',
				street: '建国路88号现代城A座1508室',
				detail: '北京市北京市朝阳区建国路88号现代城A座1508室',
				postcode: '100022',
				isDefault: true
			},
			{
				id: 2,
				name: '张明 (公司)',
				phone: '13800138111',
				province: '北京市',
				city: '北京市',
				district: '海淀区',
				street: '中关村大街1号海龙大厦12层',
				detail: '北京市北京市海淀区中关村大街1号海龙大厦12层',
				postcode: '100080',
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
				id: 0,
				name: '',
				phone: '',
				province: '',
				city: '',
				district: '',
				street: '',
				detail: '',
				postcode: '',
				isDefault: false
			}
			this.AddressDialogVisible = true
		},
		// 打开编辑地址对话框
		openEditAddressDialog(addressId: number) {
			const address = this.addresses.find(addr => addr.id === addressId)
			if (address) {
				this.isEditingAddress = true
				this.currentAddress = address
				this.AddressDialogVisible = true
			}
		},
		/**
		 * 添加地址
		 * @param username 用户名
		 * @param address 地址信息
		 * @returns Promise<any>
		 */
		async saveAddress(username: string, address: Address): Promise<any> {
			try {
				// 添加新地址
				const response = await request.post('/address/addAddress', address, {
					params: { username: username }
				});
				// 添加到本地地址列表
				this.addresses.push(response.data)
				ElMessage.success('地址添加成功')
				
				this.AddressDialogVisible = false
				this.currentAddress = null
				return response;
			} catch (error: any) {
				// 处理请求错误
				let errorMessage = '保存地址失败';
				
				if (error.response) {
					if (error.response.data?.message) {
						errorMessage = error.response.data.message;
					} else if (error.response.data) {
						errorMessage = typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data);
					} else {
						errorMessage = `请求失败：${error.response.status}`;
					}
				} else if (error.message) {
					errorMessage = error.message;
				}
				ElMessage.error(errorMessage);
				throw error;
			}
		},
		
		/**
		 * 更新地址
		 * @param username 用户名
		 * @param address 地址信息
		 * @returns Promise<any>
		 */
		async updateAddress(username: string, address: Address): Promise<any> {
			try {
				if (!address.id) {
					ElMessage.error('地址ID不能为空');
					throw new Error('地址ID不能为空');
				}
				
				// 更新现有地址
				const response = await request.put(`/address/updateAddress/${address.id}`, address, {
					params: { username: username, addressId: address.id }
				});
				
				// 更新本地地址列表
				const index = this.addresses.findIndex(addr => addr.id === address.id)
				if (index !== -1) {
					this.addresses[index] = response.data
				}
				
				// 如果设置为默认地址，更新其他地址的默认状态
				if (address.isDefault) {
					this.addresses.forEach(addr => {
						if (addr.id !== address.id) {
							addr.isDefault = false
						}
					})
				}
				
				ElMessage.success('地址更新成功')
				this.AddressDialogVisible = false
				this.currentAddress = null
				return response;
			} catch (error: any) {
				// 处理请求错误
				let errorMessage = '更新地址失败';
				
				if (error.response) {
					if (error.response.data?.message) {
						errorMessage = error.response.data.message;
					} else if (error.response.data) {
						errorMessage = typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data);
					} else {
						errorMessage = `请求失败：${error.response.status}`;
					}
				} else if (error.message) {
					errorMessage = error.message;
				}
				ElMessage.error(errorMessage);
				throw error;
			}
		},
		/**
		 * 删除地址
		 * @param username 用户名
		 * @param addressId 地址ID
		 * @returns Promise<any>
		 */
		async deleteAddress(username: string, addressId: number): Promise<any> {
			try {
				// 只传递username作为查询参数，addressId已经作为路径变量传递
				const response = await request.del(`/address/deleteAddress/${addressId}`,
					{ username, addressId }
				);
				console.log('删除地址请求参数:', { username, addressId });
				console.log('删除地址响应信息:', response.message);
				
				// 从本地地址列表中删除
				const index = this.addresses.findIndex(addr => addr.id === addressId)
				if (index !== -1) {
					this.addresses.splice(index, 1)
				}
				
				ElMessage.success('地址删除成功')
				return response;
			} catch (error: any) {
				
				// 处理请求错误
				let errorMessage = '删除地址失败';
				
				if (error.response) {
					if (error.response.data?.message) {
						errorMessage = error.response.data.message;
					} else if (error.response.data) {
						errorMessage = typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data);
					} else {
						errorMessage = `请求失败：${error.response.status}`;
					}
				} else if (error.message) {
					errorMessage = error.message;
				}
				ElMessage.error(errorMessage);
				throw error;
			}
		},

		/**
		 * 设置默认地址
		 * @param addressId 地址ID
		 * @returns Promise<any>
		 */
		async setDefaultAddress(username: string, addressId: number): Promise<any> {
			try {
				const response = await request.put(`/address/${addressId}/default`, username, {
					params: { addressId: addressId }
				});
				
				// 更新本地地址列表中的默认地址状态
				this.addresses.forEach(addr => {
					addr.isDefault = addr.id === addressId
				})
				
				ElMessage.success('默认地址设置成功')
				return response;
			} catch (error: any) {
				// 处理请求错误
				let errorMessage = '设置默认地址失败';
				
				if (error.response) {
					if (error.response.data?.message) {
						errorMessage = error.response.data.message;
					} else if (error.response.data) {
						errorMessage = typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data);
					} else {
						errorMessage = `请求失败：${error.response.status}`;
					}
				} else if (error.message) {
					errorMessage = error.message;
				}
				ElMessage.error(errorMessage);
				throw error;
			}
		},
		
		async loadUserInfo(username: string) {
			try {
				const response = await request.get('/user/getInfo', { username });
				// 更新用户信息状态
				const data = response.data || {};
				this.basicInfo = [
					{ label: '用户名', value: data.username },
					{ label: '邮箱', value: data.email },
					{ label: '手机号', value: data.phone },
					{ label: '性别', value: data.sex },
					{ label: '出生日期', value: data.birthday }
				];
				console.log("loadBasicInfo:", this.basicInfo);
				// 更新用户状态
				this.username = data.username || '';
				this.email = data.email || '';
			} catch (error) {
				ElMessage.error('获取用户信息失败');
			}
		},

		async updateUserInfo(username: string, user: any) {
			try {
				console.log("updateUserInfo:", user);
				// 将username作为查询参数，user作为请求体发送
				const response = await request.put('/user/updateInfo', user, {
					params: { username: username }
				});
				if (response.data) {
					ElMessage.success('用户信息更新成功');
					// 更新本地状态
					await this.loadUserInfo(username);
				}
			} catch (error: any) {
				// 处理请求错误
				let errorMessage = '更新用户信息失败';
				if (error.response) {
					if (error.response.data?.message) {
						errorMessage = error.response.data.message;
					} else if (error.response.data) {
						errorMessage = typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data);
					} else {
						errorMessage = `请求失败：${error.response.status}`;
					}
				} else if (error.message) {
					errorMessage = error.message;
				}
				ElMessage.error(errorMessage);
				console.error(error);
			}
		},

		async loadUserAddress(username: string) {
			try {
				const response = await request.get('/address/userAddressList', { username });
				// 更新地址状态
				this.addresses = response.data || [];
				console.log("loadUserAddress:", this.addresses);
			} catch (error) {
				ElMessage.error('获取地址失败');
			}
		},

		async loadUserOrders(username: string) {
			try {
				const response = await request.get('order/userOrders', { username });
				// 更新订单状态
				this.orders = response.data.orders || [];
				console.log("loadUserOrders:", this.orders);
			} catch (error) {
				ElMessage.error('获取订单失败');
			}
		},

		async loadUserData(username: string) {
			try{
				await Promise.all([
					this.loadUserInfo(username),
					this.loadUserAddress(username),
					this.loadUserOrders(username)
				]);
			} catch (error) {
				ElMessage.error('获取用户数据失败');
			}
		},

		
		/**
		 * 用户登录
		 * @param username 用户名
		 * @param password 密码
		 * @returns Promise<any>
		 */
		async login(username: string, password: string): Promise<any> {
			try {
				const response = await request.post('/user/login', { username, password });
				// 响应成功后加载用户数据
				await this.loadUserData(username);

				// 加载数据完毕，登录成功，更新状态
				this.isLoggedIn = true;
				localStorage.setItem('isLoggedIn', 'true'); // 保存到localStorage

				ElMessage.success(response.message || '登录成功');
				return response;
			} catch (error: any) {
				// 处理请求错误
				let errorMessage = '登录请求失败';
				
				// 从不同的错误结构中提取消息
				if (error.response) {
					// 有响应，但状态码非2xx
					if (error.response.data?.message) {
						// Spring Boot的异常响应结构
						errorMessage = error.response.data.message;
					} else if (error.response.data) {
						// 其他响应结构
						errorMessage = typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data);
					} else {
						errorMessage = `请求失败：${error.response.status}`;
					}
				} else if (error.message) {
					// 没有响应，使用axios的错误消息
					errorMessage = error.message;
				}
				ElMessage.error(errorMessage);
				throw error;
			}
		},
		
		/**
		 * 用户注册
		 * @param username 用户名
		 * @param email 邮箱
		 * @param password 密码
		 * @param confirmPassword 确认密码
		 * @returns Promise<any>
		 */
		async register(username: string, email: string, password: string, confirmPassword: string): Promise<any> {
			try {
				// 密码一致性检查
				if (password !== confirmPassword) {
					ElMessage.error('两次输入的密码不一致');
					return Promise.reject(new Error('密码不一致'));
				}
				
				const response = await request.post('/user/register', { username, email, password });
				// 注册成功
				ElMessage.success(response.message || '注册成功');
				return response;
			} catch (error: any) {
				// 处理请求错误
				let errorMessage = '注册请求失败';
				
				// 从不同的错误结构中提取消息
				if (error.response) {
					// 有响应，但状态码非2xx
					if (error.response.data?.message) {
						// Spring Boot的异常响应结构
						errorMessage = error.response.data.message;
					} else if (error.response.data) {
						// 其他响应结构
						errorMessage = typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data);
					} else {
						errorMessage = `请求失败：${error.response.status}`;
					}
				} else if (error.message) {
					// 没有响应，使用axios的错误消息
					errorMessage = error.message;
				}
				
				ElMessage.error(errorMessage);
				throw error;
			}
		},
		
		logout() {
			// 模拟登出
			this.isLoggedIn = false
			localStorage.removeItem('isLoggedIn') // 从localStorage移除
			ElMessage.success('已退出登录')
		}
	}
})
