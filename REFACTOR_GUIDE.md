# 项目重构说明文档

## 📋 项目概述

**项目名称**: MyWork2
**重构目标**: 将基于 Create React App + React 16 的旧项目升级为现代化技术栈
**预期收益**: 提升开发效率50%，构建速度提升5-10倍，代码可维护性显著增强

## 🏗️ 技术架构对比

### 当前架构 (Legacy)
```
React 16.12.0
├── Create React App (脚手架)
├── Material-UI v4 (UI框架)
├── Redux + Redux-Saga (状态管理)
├── React Router v5 (路由)
├── Axios (HTTP客户端)
└── 传统CSS + makeStyles
```

### 目标架构 (Modern)
```
React 18.3+
├── Vite (构建工具)
├── MUI v5 (UI框架)
├── Redux Toolkit + RTK Query (状态管理)
├── React Router v6 (路由)
├── 内置Fetch + RTK Query (HTTP客户端)
└── MUI sx prop + styled-components
```

## 🎯 架构设计原则

### 1. 模块化设计
```
src/
├── components/        # 可复用UI组件
│   ├── common/       # 通用组件
│   └── business/     # 业务组件
├── pages/            # 页面级组件
├── layouts/          # 布局组件
├── hooks/            # 自定义Hooks
├── services/         # API服务层
├── store/            # 状态管理
│   ├── slices/       # RTK Slices
│   └── api/          # RTK Query APIs
├── utils/            # 工具函数
├── constants/        # 常量定义
└── types/            # TypeScript类型定义
```

### 2. 状态管理架构
```
Global State (Redux Toolkit)
├── User State (用户信息)
├── UI State (界面状态)
└── Cache State (RTK Query自动管理)

Local State (useState/useReducer)
├── Form State (表单状态)
├── Modal State (弹窗状态)
└── Component State (组件内部状态)
```

## 🚀 开发步骤

### 阶段一: 基础环境搭建 (1-2天)

#### Step 1: 创建新项目结构
```bash
# 1. 备份当前项目
cp -r mywork mywork-backup

# 2. 创建新的Vite项目
npm create vite@latest mywork-new -- --template react
cd mywork-new

# 3. 安装核心依赖
npm install @reduxjs/toolkit react-redux
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material @mui/lab
npm install react-router-dom@6
```

#### Step 2: 配置开发环境
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  define: {
    global: 'globalThis',
  },
})
```

#### Step 3: 环境变量配置
```bash
# .env.development
VITE_API_BASE_URL=http://localhost:4000/api
VITE_GOOGLE_MAPS_KEY=your_google_key
VITE_GAODE_KEY=your_gaode_key

# .env.production
VITE_API_BASE_URL=https://your-api.com/api
VITE_GOOGLE_MAPS_KEY=your_prod_google_key
VITE_GAODE_KEY=your_prod_gaode_key
```

### 阶段二: 状态管理重构 (3-4天)

#### Step 4: Redux Toolkit配置
```javascript
// src/store/index.js
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { api } from './api/apiSlice'
import userSlice from './slices/userSlice'
import uiSlice from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    user: userSlice,
    ui: uiSlice,
    api: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})

setupListeners(store.dispatch)
```

#### Step 5: RTK Query API定义
```javascript
// src/store/api/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().user.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User', 'Trip', 'Work'],
  endpoints: (builder) => ({
    // 用户相关
    login: builder.mutation({
      query: (credentials) => ({
        url: '/users/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    // 行程相关
    getTrips: builder.query({
      query: () => '/trips',
      providesTags: ['Trip'],
    }),

    createTrip: builder.mutation({
      query: (tripData) => ({
        url: '/trips',
        method: 'POST',
        body: tripData,
      }),
      invalidatesTags: ['Trip'],
    }),
  }),
})

export const {
  useLoginMutation,
  useGetTripsQuery,
  useCreateTripMutation,
} = api
```

#### Step 6: Slice定义
```javascript
// src/store/slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload
      state.isAuthenticated = !!action.payload
    },
    setToken: (state, action) => {
      state.token = action.payload
      localStorage.setItem('token', action.payload)
    },
    logout: (state) => {
      state.currentUser = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
    },
  },
})

export const { setUser, setToken, logout } = userSlice.actions
export default userSlice.reducer
```

### 阶段三: UI组件迁移 (5-7天)

#### Step 7: MUI主题配置
```javascript
// src/theme/index.js
import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
})
```

#### Step 8: 组件迁移策略
```javascript
// 迁移前 (MUI v4)
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles({
  button: {
    backgroundColor: 'blue',
    padding: '10px 20px',
  },
})

// 迁移后 (MUI v5)
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(1.25, 2.5),
}))

// 或使用sx prop
<Button sx={{
  backgroundColor: 'primary.main',
  padding: '10px 20px'
}} />
```

### 阶段四: 路由升级 (2-3天)

#### Step 9: React Router v6迁移
```javascript
// src/router/index.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import MainLayout from '@/layouts/MainLayout'
import ProtectedRoute from '@/components/ProtectedRoute'

// 懒加载页面组件
const HomePage = lazy(() => import('@/pages/HomePage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const TripsPage = lazy(() => import('@/pages/TripsPage'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'trips',
        element: (
          <ProtectedRoute>
            <TripsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
    ],
  },
])

export default function AppRouter() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
```

### 阶段五: 业务逻辑迁移 (4-5天)

#### Step 10: 自定义Hooks抽取
```javascript
// src/hooks/useAuth.js
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useLoginMutation } from '@/store/api/apiSlice'
import { setUser, setToken } from '@/store/slices/userSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentUser, isAuthenticated } = useSelector(state => state.user)
  const [loginMutation, { isLoading }] = useLoginMutation()

  const login = async (credentials) => {
    try {
      const result = await loginMutation(credentials).unwrap()
      dispatch(setUser(result.user))
      dispatch(setToken(result.token))
      navigate('/')
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  return {
    currentUser,
    isAuthenticated,
    login,
    isLoading,
  }
}
```

#### Step 11: 工具函数重构
```javascript
// src/utils/storage.js
const STORAGE_KEYS = {
  USER: 'USER',
  TOKEN: 'TOKEN',
  ARRANGE_DATA: 'ARRANGE_DATA',
}

export const storage = {
  set: (key, value, expireTime = 3000) => {
    const data = {
      value,
      expires: Date.now() + expireTime * 1000,
    }
    localStorage.setItem(key, JSON.stringify(data))
  },

  get: (key) => {
    try {
      const item = localStorage.getItem(key)
      if (!item) return null

      const data = JSON.parse(item)
      if (Date.now() > data.expires) {
        localStorage.removeItem(key)
        return null
      }
      return data.value
    } catch {
      return null
    }
  },

  remove: (key) => {
    localStorage.removeItem(key)
  },

  clear: () => {
    localStorage.clear()
  },
}
```

### 阶段六: 测试与优化 (2-3天)

#### Step 12: 添加错误边界
```javascript
// src/components/ErrorBoundary.jsx
import React from 'react'
import { Alert, AlertTitle, Box } from '@mui/material'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box p={3}>
          <Alert severity="error">
            <AlertTitle>应用程序出错</AlertTitle>
            页面加载失败，请刷新重试
          </Alert>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
```

#### Step 13: 性能优化配置
```javascript
// src/utils/lazyImport.js
import { lazy } from 'react'

export const lazyImport = (factory, name) => {
  return lazy(() =>
    factory().then(module => ({
      default: module[name] || module.default || module,
    }))
  )
}

// 使用示例
const LazyComponent = lazyImport(
  () => import('@/components/HeavyComponent'),
  'HeavyComponent'
)
```

## ⚠️ 风险评估与回滚方案

### 高风险点
1. **状态管理迁移** - Redux Saga → RTK Query
2. **路由升级** - React Router v5 → v6
3. **UI组件样式** - makeStyles → styled/sx

### 回滚策略
```bash
# 1. 版本控制分支策略
git checkout -b refactor/main
git checkout -b refactor/backup

# 2. 数据库备份
# 确保后端API兼容性

# 3. 分步部署
# Stage 1: 基础环境 → 测试环境
# Stage 2: 状态管理 → 测试环境
# Stage 3: UI组件 → 测试环境
# Stage 4: 完整功能 → 生产环境
```

### 监控指标
- **构建时间**: 目标减少80%
- **页面加载时间**: 目标减少50%
- **代码体积**: 目标减少30%
- **开发热更新**: 目标<200ms

## 📝 开发规范

### 代码规范
```javascript
// 1. 组件命名: PascalCase
const UserProfile = () => {}

// 2. 文件命名: camelCase
// userProfile.jsx, authService.js

// 3. 常量命名: UPPER_SNAKE_CASE
const API_ENDPOINTS = {}

// 4. 函数命名: camelCase
const handleUserLogin = () => {}
```

### 目录规范
```
每个功能模块包含:
├── components/   # 组件
├── hooks/       # 自定义hooks
├── services/    # API服务
├── types/       # 类型定义
└── index.js     # 导出文件
```

## 🎯 成功指标

### 技术指标
- [ ] 构建时间从2分钟减少到15秒
- [ ] 热更新时间从3秒减少到200ms
- [ ] 代码行数减少30%
- [ ] 包体积减少25%

### 开发体验
- [ ] TypeScript支持
- [ ] 组件懒加载
- [ ] 自动代码分割
- [ ] 现代化调试工具

### 维护性
- [ ] 模块化架构
- [ ] 统一状态管理
- [ ] 规范化代码风格
- [ ] 完善的错误处理

---

**预计总工期**: 15-20天
**团队建议**: 2-3人
**风险等级**: 中等

> 💡 **重要提醒**: 建议按阶段进行，每个阶段完成后进行充分测试，确保功能完整性后再进入下一阶段。