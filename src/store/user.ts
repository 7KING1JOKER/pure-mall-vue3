import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import type { Address, User } from '../api/interfaces';
import {
  login as loginApi,
  register as registerApi,
  getUserInfo,
  updateUserInfo,
  changePassword,
  uploadAvatar,
  logout as logoutApi
} from '../api/user';
import {
  getAddressList,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress as setDefaultAddressApi
} from '../api/address';

export const useUserStore = defineStore("user", {
  state: () => ({
    vip: '会员',
    activeTab: 'profile',
    isLoggedIn: false,
    token: localStorage.getItem('token') || '',
    userInfo: null as User | null,
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
    addresses: [] as Address[],
    EditProfileDialogVisible: false,
    AddressDialogVisible: false,
    currentAddress: null as Address | null,
    isEditingAddress: false,
    loading: false,
    error: null as string | null
  }),

  getters: {
    // 获取默认地址
    defaultAddress(): Address | null {
      return this.addresses.find(addr => addr.isDefault) || null;
    },
    
    // 获取用户基本信息
    basicInfo(): Array<{label: string, value: string}> {
      if (!this.userInfo) {
        return [];
      }
      return [
        { label: '用户名', value: this.userInfo.username || '' },
        { label: '邮箱', value: this.userInfo.email || '' },
        { label: '手机', value: this.userInfo.phone || '' },
        { label: '注册时间', value: this.userInfo.createTime ? new Date(this.userInfo.createTime).toLocaleDateString() : '' },
        { label: '最后登录', value: this.userInfo.lastLogin ? new Date(this.userInfo.lastLogin).toLocaleDateString() : '' }
      ];
    },
    
    // 获取会员信息
    memberInfo(): Array<{label: string, value: string}> {
      // 会员信息将从其他API获取，这里提供默认值
      return [
        { label: '会员等级', value: '普通会员' },
        { label: '积分', value: '0 分' },
        { label: '优惠券', value: '0 张可用' }
      ];
    }
  },

  actions: {
    // 初始化用户状态
    async initializeUser() {
      if (this.token) {
        await this.fetchUserInfo();
        await this.fetchAddressList();
      }
    },
    
    // 登录
    async login(username: string, password: string) {
      try {
        this.loading = true;
        this.error = null;
        
        const response = await loginApi({ username, password });
        
        if (response && response.code === 200 && response.data) {
          this.isLoggedIn = true;
          this.token = response.data.token;
          localStorage.setItem('token', this.token);
          
          // 登录成功后获取用户信息
          await this.fetchUserInfo();
          await this.fetchAddressList();
          
          ElMessage.success('登录成功');
          return true;
        } else {
          this.error = (response as any && response.message) || '登录失败';
          ElMessage.error(this.error || '操作失败');
          return false;
        }
      } catch (err) {
        this.error = '网络错误，请稍后重试';
        ElMessage.error(this.error || '操作失败');
        console.error('登录失败:', err);
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    // 注册
    async register(userData: {username: string, password: string, email: string, phone: string}) {
      try {
        this.loading = true;
        this.error = null;
        
        const response = await registerApi(userData);
        const resp = response as any;
        
        if (resp && resp.code === 200) {
          ElMessage.success('注册成功，请登录');
          return true;
        } else {
          this.error = (resp && resp.message) || '注册失败';
          ElMessage.error(this.error || '操作失败');
          return false;
        }
      } catch (err) {
        this.error = '网络错误，请稍后重试';
        ElMessage.error(this.error || '操作失败');
        console.error('注册失败:', err);
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    // 登出
    async logout() {
      try {
        // 调用登出API
        await logoutApi();
      } catch (error) {
        console.error('登出API调用失败:', error);
      } finally {
        // 清除本地状态
        this.isLoggedIn = false;
        this.token = '';
        this.userInfo = null;
        this.addresses = [];
        localStorage.removeItem('token');
        ElMessage.success('已退出登录');
      }
    },
    
    // 获取用户信息
    async fetchUserInfo() {
      try {
        const response = await getUserInfo();
        const resp = response as any;
        if (resp && resp.code === 200 && resp.data) {
          this.userInfo = resp.data;
        } else {
          // 失败时清除token，强制登出
          this.logout();
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
        // 失败时清除token，强制登出
        this.logout();
      }
    },
    
    // 更新用户信息
    async updateUserInfoAction(userData: Partial<User>) {
      try {
        this.loading = true;
        const response = await updateUserInfo(userData);
        const resp = response as any;
        
        if (resp && resp.code === 200) {
          await this.fetchUserInfo(); // 重新获取最新信息
          ElMessage.success('个人信息更新成功');
          return true;
        } else {
          ElMessage.error((resp && resp.message) || '更新失败');
          return false;
        }
      } catch (error) {
        console.error('更新用户信息失败:', error);
        ElMessage.error('网络错误，请稍后重试');
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    // 修改密码
    async changePasswordAction(oldPassword: string, newPassword: string, confirmPassword: string) {
      try {
        this.loading = true;
        const response = await changePassword({ oldPassword, newPassword, confirmPassword });
        const resp = response as any;
        
        if (resp && resp.code === 200) {
          ElMessage.success('密码修改成功');
          return true;
        } else {
          ElMessage.error((resp && resp.message) || '密码修改失败');
          return false;
        }
      } catch (error) {
        console.error('修改密码失败:', error);
        ElMessage.error('网络错误，请稍后重试');
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    // 上传头像
    async uploadAvatarAction(formData: FormData) {
      try {
        this.loading = true;
        const response = await uploadAvatar(formData);
        const resp = response as any;
        
        if (resp && resp.code === 200 && resp.data) {
          if (this.userInfo) {
            this.userInfo.avatar = resp.data.avatarUrl;
          }
          ElMessage.success('头像上传成功');
          return resp.data.avatarUrl;
        } else {
          ElMessage.error((resp && resp.message) || '头像上传失败');
          return null;
        }
      } catch (error) {
        console.error('上传头像失败:', error);
        ElMessage.error('网络错误，请稍后重试');
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    // 获取地址列表
    async fetchAddressList() {
      try {
        const response = await getAddressList();
        const resp = response as any;
        if (resp && resp.code === 200 && resp.data) {
          this.addresses = Array.isArray(resp.data) ? resp.data : [];
        }
      } catch (error) {
        console.error('获取地址列表失败:', error);
      }
    },
    
    // 打开添加地址对话框
    openAddAddressDialog() {
      this.isEditingAddress = false;
      this.currentAddress = {
        id: 0,
        userId: 0,
        name: '',
        phone: '',
        province: '',
        city: '',
        district: '',
        street: '',
        postcode: '',
        detail: '',
        isDefault: false,
        createTime: '',
        updateTime: ''
      };
      this.AddressDialogVisible = true;
    },
    
    // 打开编辑地址对话框
    openEditAddressDialog(addressId: number) {
      const address = this.addresses.find(addr => addr.id === addressId);
      if (address) {
        this.isEditingAddress = true;
        this.currentAddress = { ...address };
        this.AddressDialogVisible = true;
      }
    },
    
    // 保存地址（添加或更新）
    async saveAddress(address: Address) {
      try {
        this.loading = true;
        
        let response;
        if (this.isEditingAddress && address.id) {
          // 更新现有地址
          response = await updateAddress(address.id, address);
        } else {
          // 添加新地址
          // 从响应中获取新地址的ID和时间戳
          response = await addAddress(address);
        }
        
        const resp = response as any;
        if (resp && resp.code === 200) {
          // 重新获取地址列表
          await this.fetchAddressList();
          ElMessage.success(this.isEditingAddress ? '地址更新成功' : '地址添加成功');
          
          this.AddressDialogVisible = false;
          this.currentAddress = null;
          return true;
        } else {
          ElMessage.error((resp && resp.message) || '操作失败');
          return false;
        }
      } catch (error) {
        console.error('保存地址失败:', error);
        ElMessage.error('网络错误，请稍后重试');
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    // 删除地址
    async deleteAddress(addressId: number) {
      try {
        this.loading = true;
        const response = await deleteAddress(addressId);
        const resp = response as any;
        
        if (resp && resp.code === 200) {
          // 重新获取地址列表
          await this.fetchAddressList();
          ElMessage.success('地址删除成功');
          return true;
        } else {
          ElMessage.error((resp && resp.message) || '删除失败');
          return false;
        }
      } catch (error) {
        console.error('删除地址失败:', error);
        ElMessage.error('网络错误，请稍后重试');
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    // 设置默认地址
    async setDefaultAddress(addressId: number) {
      try {
        this.loading = true;
        const response = await setDefaultAddressApi(addressId);
        const resp = response as any;
        
        if (resp && resp.code === 200) {
          // 重新获取地址列表
          await this.fetchAddressList();
          ElMessage.success('默认地址设置成功');
          return true;
        } else {
          ElMessage.error((resp && resp.message) || '设置失败');
          return false;
        }
      } catch (error) {
        console.error('设置默认地址失败:', error);
        ElMessage.error('网络错误，请稍后重试');
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    // 处理菜单选择
    handleMenuSelect(index: string) {
      this.activeTab = index;
    },
    
    // 获取订单状态样式类型
    statusType(status: string): string {
      const map: Record<string, string> = {
        '已完成': 'success',
        '待发货': 'warning',
        '已发货': '',
        '已取消': 'danger'
      };
      return map[status] || 'info';
    }
  }
});