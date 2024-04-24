import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import tutorialRoot from './routes/tutorial/main.tsx'
import authRoot from './routes/auth/main'
import customLinkRoot from './routes/custom-link/main'

/**
 * createBrowserRouter 使用 HTML5 History API 来保持 UI 和 URL 的同步。
 * 它通过监听浏览器的 pushState 和 popState 事件来实现路由的变化，从而提供了一种更加自然的 URL 结构。
 * 服务器端需要进行一些配置，以确保对于任何 URL 的请求都返回同一个 HTML 页面，以便在客户端进行路由匹配。
 *
 * createRoutesFromElements：使用JSX配置路由
 */
const router = createBrowserRouter([
    {
        path: '/',
        children: [
            tutorialRoot,
            authRoot,
            customLinkRoot
        ]
    }
])
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
