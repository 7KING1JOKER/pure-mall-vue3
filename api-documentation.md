# Pure Mall Vue3 接口文档

本文档详细记录了 Pure Mall Vue3 项目中所有前后端交互接口的请求方式、参数和响应格式。

## 1. 基础配置

### 1.1 接口基础URL
```
http://localhost:8080
```

### 1.2 响应格式
所有接口响应均采用统一格式：

```json
{
  "code": 200,      // 状态码，200表示成功，其他表示失败
  "message": "",   // 响应消息
  "data": {}       // 响应数据
}
```

### 1.3 请求头
```
Content-Type: application/json
```

## 2. 用户相关接口

### 2.1 用户登录
- **请求方式**: POST
- **请求路径**: `/user/login`
- **请求参数**:
  ```json
  {
    "username": "string",  // 用户名
    "password": "string"   // 密码
  }
  ```
- **响应数据**:
  ```json
  {
    "userName": "string",  // 用户名
    "userId": "number",    // 用户ID
    "token": "string"      // 认证令牌
  }
  ```

### 2.2 用户注册
- **请求方式**: POST
- **请求路径**: `/user/register`
- **请求参数**:
  ```json
  {
    "username": "string",  // 用户名
    "password": "string",  // 密码
    "confirmPassword": "string"  // 确认密码
  }
  ```
- **响应数据**:
  ```json
  {
    "userName": "string",  // 用户名
    "userId": "number",    // 用户ID
    "token": "string"      // 认证令牌
  }
  ```

### 2.3 获取用户ID
- **请求方式**: GET
- **请求路径**: `/user/getUserId`
- **请求参数**: 无
- **响应数据**:
  ```json
  {
    "userId": "number"    // 用户ID
  }
  ```

### 2.4 获取用户信息
- **请求方式**: GET
- **请求路径**: `/user/getInfo`
- **请求参数**: 无
- **响应数据**:
  ```json
  {
    "userId": "number",     // 用户ID
    "userName": "string",   // 用户名
    "realName": "string",   // 真实姓名
    "phone": "string",      // 手机号
    "email": "string",      // 邮箱
    "address": "string"     // 地址
  }
  ```

### 2.5 更新用户信息
- **请求方式**: PUT
- **请求路径**: `/user/updateInfo`
- **请求参数**:
  ```json
  {
    "userName": "string",   // 用户名
    "realName": "string",   // 真实姓名
    "phone": "string",      // 手机号
    "email": "string",      // 邮箱
    "address": "string"     // 地址
  }
  ```
- **响应数据**: 无

## 3. 地址相关接口

### 3.1 获取用户地址列表
- **请求方式**: GET
- **请求路径**: `/address/userAddressList`
- **请求参数**: 无
- **响应数据**:
  ```json
  [
    {
      "addressId": "number",   // 地址ID
      "name": "string",        // 收货人姓名
      "phone": "string",       // 收货人手机号
      "province": "string",    // 省份
      "city": "string",        // 城市
      "district": "string",    // 区县
      "detail": "string",      // 详细地址
      "isDefault": "boolean"   // 是否默认地址
    }
  ]
  ```

### 3.2 保存用户地址
- **请求方式**: POST
- **请求路径**: `/address/addressSave`
- **请求参数**:
  ```json
  {
    "name": "string",        // 收货人姓名
    "phone": "string",       // 收货人手机号
    "province": "string",    // 省份
    "city": "string",        // 城市
    "district": "string",    // 区县
    "detail": "string",      // 详细地址
    "isDefault": "boolean"   // 是否默认地址
  }
  ```
- **响应数据**: 无

### 3.3 更新用户地址
- **请求方式**: PUT
- **请求路径**: `/address/updateAddress`
- **请求参数**:
  ```json
  {
    "addressId": "number",   // 地址ID
    "name": "string",        // 收货人姓名
    "phone": "string",       // 收货人手机号
    "province": "string",    // 省份
    "city": "string",        // 城市
    "district": "string",    // 区县
    "detail": "string",      // 详细地址
    "isDefault": "boolean"   // 是否默认地址
  }
  ```
- **响应数据**: 无

### 3.4 删除用户地址
- **请求方式**: DELETE
- **请求路径**: `/address/deleteAddress/{addressId}`
- **请求参数**:
  - `addressId`: 地址ID (路径参数)
- **响应数据**: 无

### 3.5 设置默认地址
- **请求方式**: PUT
- **请求路径**: `/address/{addressId}/default`
- **请求参数**:
  - `addressId`: 地址ID (路径参数)
- **响应数据**: 无

## 4. 收藏夹相关接口

### 4.1 获取收藏夹商品
- **请求方式**: GET
- **请求路径**: `/wishlist/getWishlistItems`
- **请求参数**: 无
- **响应数据**:
  ```json
  [
    {
      "id": "number",         // 收藏夹ID
      "productId": "number",  // 商品ID
      "userId": "number",     // 用户ID
      "product": {
        "id": "number",       // 商品ID
        "name": "string",     // 商品名称
        "price": "number",    // 商品价格
        "image": "string"     // 商品图片
      }
    }
  ]
  ```

### 4.2 添加商品到收藏夹
- **请求方式**: POST
- **请求路径**: `/wishlist/addWishlistItem`
- **请求参数**:
  ```json
  {
    "userId": "number",     // 用户ID
    "productId": "number"   // 商品ID
  }
  ```
- **响应数据**: 无

### 4.3 从收藏夹移除商品
- **请求方式**: DELETE
- **请求路径**: `/wishlist/removeWishlistItem`
- **请求参数**:
  ```json
  {
    "userId": "number",     // 用户ID
    "productId": "number"   // 商品ID
  }
  ```
- **响应数据**: 无

### 4.4 检查商品是否在收藏夹中
- **请求方式**: GET
- **请求路径**: `/wishlist/checkInWishlist`
- **请求参数**:
  - `userId`: 用户ID (查询参数)
  - `productId`: 商品ID (查询参数)
- **响应数据**:
  ```json
  {
    "isInWishlist": "boolean"   // 是否在收藏夹中
  }
  ```

## 5. 产品相关接口

### 5.1 获取商品详情
- **请求方式**: GET
- **请求路径**: `/product/{productId}`
- **请求参数**:
  - `productId`: 商品ID (路径参数)
- **响应数据**:
  ```json
  {
    "id": "number",             // 商品ID
    "name": "string",           // 商品名称
    "brief": "string",          // 商品简介
    "price": "number",          // 商品价格
    "sales": "number",          // 商品销量
    "image": "string",          // 商品主图
    "images": ["string"],       // 商品图片列表
    "specs": [
      {
        "id": "number",         // 规格ID
        "name": "string",       // 规格名称
        "price": "number",      // 规格价格
        "stock": "number"       // 规格库存
      }
    ],
    "detail": "string",         // 商品详情
    "params": [
      {
        "name": "string",       // 参数名称
        "value": "string"       // 参数值
      }
    ],
    "reviews": [
      {
        "id": "number",         // 评价ID
        "user": "string",       // 评价用户
        "avatar": "string",     // 用户头像
        "rating": "number",     // 评分
        "content": "string",    // 评价内容
        "date": "string"        // 评价日期
      }
    ]
  }
  ```

## 6. 购物车相关接口

### 6.1 获取购物车商品列表
- **请求方式**: GET
- **请求路径**: `/cart/getCartItems`
- **请求参数**: 无
- **响应数据**:
  ```json
  [
    {
      "cartId": "number",      // 购物车ID
      "productId": "number",   // 商品ID
      "userId": "number",      // 用户ID
      "quantity": "number",    // 商品数量
      "selected": "boolean",   // 是否选中
      "product": {
        "id": "number",        // 商品ID
        "name": "string",      // 商品名称
        "price": "number",     // 商品价格
        "image": "string"      // 商品图片
      }
    }
  ]
  ```

### 6.2 添加商品到购物车
- **请求方式**: POST
- **请求路径**: `/cart/addCartItems`
- **请求参数**:
  ```json
  [
    {
      "userId": "number",      // 用户ID
      "productId": "number",   // 商品ID
      "quantity": "number"     // 商品数量
    }
  ]
  ```
- **响应数据**: 无

### 6.3 切换购物车商品选中状态
- **请求方式**: PUT
- **请求路径**: `/cart/selectedCartItem`
- **请求参数**:
  ```json
  {
    "cartId": "number",       // 购物车ID
    "selected": "boolean"     // 是否选中
  }
  ```
- **响应数据**: 无

### 6.4 更新购物车商品数量
- **请求方式**: PUT
- **请求路径**: `/cart/updateCartItemQuantity`
- **请求参数**:
  ```json
  {
    "cartId": "number",       // 购物车ID
    "quantity": "number"      // 商品数量
  }
  ```
- **响应数据**: 无

### 6.5 删除购物车商品
- **请求方式**: DELETE
- **请求路径**: `/cart/deleteCartItem`
- **请求参数**:
  ```json
  {
    "cartId": "number"        // 购物车ID
  }
  ```
- **响应数据**: 无

### 6.6 删除选中的购物车商品
- **请求方式**: DELETE
- **请求路径**: `/cart/deleteSelectedCartItems`
- **请求参数**: 无
- **响应数据**: 无

### 6.7 清空购物车
- **请求方式**: DELETE
- **请求路径**: `/cart/clearCartItems`
- **请求参数**: 无
- **响应数据**: 无

### 6.8 全选/取消全选购物车商品
- **请求方式**: PUT
- **请求路径**: `/cart/selectedAll`
- **请求参数**:
  ```json
  {
    "selected": "boolean"     // 是否全选
  }
  ```
- **响应数据**: 无

## 7. 订单相关接口

### 7.1 添加订单
- **请求方式**: POST
- **请求路径**: `/order/addOrder`
- **请求参数**:
  ```json
  {
    "userId": "number",         // 用户ID
    "order": {
      "orderNumber": "string",  // 订单号
      "orderAmount": "number",  // 订单金额
      "address": "string",      // 收货地址
      "status": "string"        // 订单状态
    }
  }
  ```
- **响应数据**: 无

### 7.2 保存订单项
- **请求方式**: POST
- **请求路径**: `/order/saveOrderItem`
- **请求参数**:
  ```json
  {
    "orderNumber": "string",  // 订单号
    "orderItems": [
      {
        "productId": "number",  // 商品ID
        "quantity": "number",   // 商品数量
        "price": "number"       // 商品价格
      }
    ]
  }
  ```
- **响应数据**: 无

### 7.3 获取用户订单
- **请求方式**: POST
- **请求路径**: `/order/getOrdersByUserId`
- **请求参数**:
  ```json
  {
    "userId": "number"         // 用户ID
  }
  ```
- **响应数据**:
  ```json
  [
    {
      "orderNumber": "string",  // 订单号
      "createTime": "string",   // 创建时间
      "product": "string",      // 商品名称（多个商品用逗号分隔）
      "orderAmount": "string",  // 订单金额
      "status": "string"        // 订单状态
    }
  ]
  ```

### 7.4 获取订单详情
- **请求方式**: GET
- **请求路径**: `/order/{orderNumber}`
- **请求参数**:
  - `orderNumber`: 订单号 (路径参数)
- **响应数据**:
  ```json
  {
    "orderNumber": "string",   // 订单号
    "createTime": "string",    // 创建时间
    "orderAmount": "number",   // 订单金额
    "address": "string",       // 收货地址
    "status": "string",        // 订单状态
    "orderItems": [
      {
        "id": "number",         // 订单项ID
        "name": "string",       // 商品名称
        "price": "number",      // 商品价格
        "quantity": "number",   // 商品数量
        "total": "number"       // 商品总价
      }
    ]
  }
  ```
