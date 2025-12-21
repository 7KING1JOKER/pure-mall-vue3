import { defineStore } from "pinia";
import { ElMessage, ElNotification } from "element-plus";
import type { Address, Product, Order } from "../api/interfaces";
import request from "@/api/request";
import { useOrderStore } from './order';

export const useUserStore = defineStore("user", {
	state: () => ({
		// 用户名
		username: localStorage.getItem('username') || '默认用户',
		// 用户ID
		userId: parseInt(localStorage.getItem('userId') || '0'),
		// 邮箱
		email: 'default@example.com',
		// 会员等级
		vip: '会员',
		// 当前激活的标签页
		activeTab: 'profile',
		// 登录状态
		isLoggedIn: JSON.parse(localStorage.getItem('isLoggedIn') || 'false'), // 从localStorage恢复登录状态
			
		// 标签页图标
		tabIcons: {
			profile: 'User',
			orders: 'ShoppingCart',
			address: 'Location',
			wishlist: 'Star'
		},
		// 标签页标题
		tabTitles: {
			profile: '个人资料',
			orders: '我的订单',
			address: '地址管理',
			wishlist: '我的收藏'
		},

		// 个人资料
		basicInfo: [
			{ label: '用户名', value: '张明' },
			{ label: '邮箱', value: 'zhangsan@example.com' },
			{ label: '手机号', value: '13800138000' },
			{ label: '性别', value: '男' },
			{ label: '出生日期', value: '1999-01-01' }
		],

		// 会员信息
		memberInfo: [
			{ label: '会员等级', value: '黄金会员' },
			{ label: '积分', value: '3,000 分' },
			{ label: '优惠券', value: '5 张可用' }
		],

		// 我的订单
		orders: [] as Order[],

		// 地址管理
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

		// 用户收藏夹商品
		wishlistItems: [] as Product[],


		// 编辑个人资料对话框相关状态
		EditProfileDialogVisible: false,
		// 地址对话框相关状态
		AddressDialogVisible: false,
		// 当前编辑的地址
		currentAddress: null as Address | null,
		// 是否正在编辑地址
		isEditingAddress: false
		}),
		actions: {
		/**
		 * 根据订单状态返回对应的 Element Plus 颜色类名
		 * @param status 订单状态
		 * @returns 颜色类名
		 */
		statusType(status: string) {
			const map: Record<string, string> = {
				'已完成': 'success',
				'待发货': 'warning',
				'已发货': '',
				'已取消': 'danger'
			}
			return map[status] || 'info'
		},

		/**
		 * 处理菜单选择事件，切换当前激活的标签页
		 * @param index 选中的标签页索引
		 */
			handleMenuSelect(index:string) {
				this.activeTab = index
			},

		/**
		 * 打开添加地址对话框
		 */
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

		/**
		 * 打开编辑地址对话框
		 * @param addressId 要编辑的地址ID
		 */
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
				// console.log('删除地址请求参数:', { username, addressId });
				// console.log('删除地址响应信息:', response.message);
				
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
				// console.log("loadBasicInfo:", this.basicInfo);
				// 更新用户状态
				this.username = data.username || '';
				this.email = data.email || '';
			} catch (error) {
				ElMessage.error('获取用户信息失败');
			}
		},

		async updateUserInfo(username: string, user: any) {
			try {
				// console.log("updateUserInfo:", user);
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
				// console.log("loadUserAddress:", this.addresses);


			} catch (error) {
				ElMessage.error('获取地址失败');
			}
		},

		async loadUserOrders(username: string) {
			try {
				const response = await request.get('/order/userOrders', { username });
				// 更新订单状态
				this.orders = response.data.orders || [];
				// 将订单数据同步到orderStore的OrderList数组中
				const orderStore = useOrderStore();
				orderStore.OrderList = this.orders;
				console.log("loadUserOrders: 成功加载订单并同步到orderStore", this.orders);
			} catch (error) {
				ElMessage.error('获取订单失败');
				console.error('加载用户订单失败:', error);
			}
		},
		
		async loadWishlistItems(username: string) {
			try {
				const response = await request.get('/wishlist/getWishlistItems', { username });
				this.wishlistItems = response.data || [];
			} catch (error) {
				console.error('加载收藏夹数据失败:', error);
			}
		},

		async loadUserId(username: string) {
			try {

				const response = await request.get('/user/getUserId', {}, { params: { username: username } });
				// 确保userId是数字类型
				this.userId = Number(response.data.userId) || 0;
				// console.log("loadUserId:", this.userId);
			} catch (error) {
				ElMessage.error('获取用户ID失败');
				console.error('获取用户ID失败:', error);
			}
		},

		async loadUserData(username: string) {
			try{
				await Promise.all([
					this.loadUserId(username),
					this.loadUserInfo(username),
					this.loadUserAddress(username),
					this.loadUserOrders(username),
					this.loadWishlistItems(username)
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

				console.log("response:", response);
				// 处理JWT令牌
				if (response.data.token) {
					// 将JWT令牌存储到localStorage
					localStorage.setItem('token', response.data.token);
					// 登录成功，更新状态
					this.isLoggedIn = true;
					localStorage.setItem('isLoggedIn', 'true'); // 保存到localStorage
				}

				// 处理成功后加载用户数据
				await this.loadUserData(username);

				// 加载完用户数据后，再存储用户信息到localStorage
				if (this.userId && this.username) {
					localStorage.setItem('userId', String(this.userId));
					localStorage.setItem('username', this.username);
				}

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
		
		/**
		 * 用户退出登录
		 */
		logout() {
			// 清除JWT令牌
			localStorage.removeItem('token');
			localStorage.removeItem('userId');
			localStorage.removeItem('username');
			// 清除登录状态
			localStorage.removeItem('isLoggedIn');
			// 重置用户信息
			this.username = '默认用户';
			this.userId = 0;
			this.email = 'default@example.com';
			this.isLoggedIn = false;
			// 清空订单和地址等敏感信息
			this.orders = [];
			this.addresses = [];
			this.wishlistItems = [];
			// 清空购物车
			// 购物车相关状态未定义，暂不做处理
			// this.cartItems = [];
			// this.totalPrice = 0;
			// this.totalQuantity = 0;
			ElMessage.success('退出登录成功');
		},

		/* 收藏夹商品接口 */
		// 添加到收藏夹
		addToWishlist(item: any) {
			
			// 检查商品是否已在收藏夹中
			const existingItem = this.wishlistItems.find(wishItem => wishItem.id === item.id);
			
			if (existingItem) {
				ElNotification({
				title: '已在收藏夹中',
				message: `"${item.name}" 已在收藏夹中`,
				type: 'warning',
				duration: 2000
				});
			} else {

				// 添加到收藏夹
				this.wishlistItems.push({
				id: item.productId,
				name: item.name,
				price: item.price,
				image: item.image || item.images?.[0] || '',
				sales: item.sales || 0
				});
				ElMessage.success({
					message: `已添加 "${item.name}" 到收藏夹`,
					duration: 2000
				});
			}
		},

		// 从收藏夹移除商品
		removeFromWishlist(itemId: number) {
			const index = this.wishlistItems.findIndex(item => item.id === itemId);
			if (index !== -1) {
				const removedItem = this.wishlistItems.splice(index, 1)[0];
				
				ElNotification({
				title: '已移除收藏',
				message: `已将 "${removedItem.name}" 从收藏夹移除`,
				type: 'info',
				duration: 2000
				});
			}
		},
		/**
		 * 向服务器添加商品到收藏夹
		 * @param username - 用户名
		 * @param productId - 商品ID
		 */
		async addToWishlistItem(username: string, productId: number) {
			try {
				// 后端接口使用@RequestParam注解，需要将参数作为查询参数传递
				await request.post('/wishlist/addWishlistItem', {}, {
				params: { username, productId }
				});
			} catch (error) {
				
				console.error('添加到收藏夹失败:', error);
				// 将错误向上抛出，让调用者知道添加失败
				throw error;
			}
		},

		/**
		 * 检查商品是否在收藏夹中
		 * @param username - 用户名
		 * @param productId - 商品ID
		 */
		async checkInWishlistItem(username: string, productId: number) {
			try {
				const response = await request.get('/wishlist/checkInWishlist', {
				params: { username, productId }
				});
				return response.data || false;
			} catch (error) {
				console.error('检查收藏夹商品失败:', error);
				return false;
			}
		},

		/**
		 * 从服务器移除商品从收藏夹
		 * @param username - 用户名
		 * @param productId - 商品ID
		 */
		async removeWishlistItem(username: string, productId: number) {
			try {
				await request.del('/wishlist/removeWishlistItem', {}, {
					params: { username, productId }
				});
			} catch (error) {
				console.error('移除收藏夹商品失败:', error);
			}
		},
	}
})






