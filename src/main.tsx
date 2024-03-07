import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ErrorPage from './error-page.tsx'
import Root, {
    loader as rootLoader,
    action as rootAction
} from './routes/root.tsx'
import Contact, {
    loader as contactLoader,
    action as contactAction,
} from "./routes/contact";
import EditContact, { action as editAction } from "./routes/edit";
import { action as destroyAction } from "./routes/destroy";
import Index from "./routes/index";

/**
 * createBrowserRouter 使用 HTML5 History API 来保持 UI 和 URL 的同步。
 * 它通过监听浏览器的 pushState 和 popState 事件来实现路由的变化，从而提供了一种更加自然的 URL 结构。
 * 服务器端需要进行一些配置，以确保对于任何 URL 的请求都返回同一个 HTML 页面，以便在客户端进行路由匹配。
 *
 * createRoutesFromElements：使用JSX配置路由
 */
const router = createBrowserRouter([
    {
        path: '/', // 根路由
        element: <Root />,
        // loader、action，或组件渲染异常时被渲染。
        errorElement: <ErrorPage />,
        children: [
            {
                /**
                 * Layout Route: 布局路由，没有path的路由，用于将子路由放入到特定布局中。
                 * 当子路由出现任何错误时，布局路由会捕捉并呈现错误，同时保留根路由的用户界面。
                 */
                errorElement: <ErrorPage />,
                children: [
                    // 索引路由：处于父路由的精确路径时，将匹配此路由
                    { index: true, element: <Index /> },
                    {
                        // URL Params
                        path: "contacts/:contactId",
                        element: <Contact />,
                        loader: contactLoader,
                        action: contactAction,
                    },
                    {
                        path: "contacts/:contactId/edit",
                        element: <EditContact />,
                        loader: contactLoader,
                        action: editAction,
                    },
                    {
                        path: "contacts/:contactId/destroy",
                        action: destroyAction,
                        errorElement: <div>Oops! There was an error.</div>,
                    }
                ]
            }
        ],
        // 路由组件渲染前调用（为其提供数据），使用useLoaderData获取loader返回的数据。
        loader: rootLoader,
        // 向路由发送非get提交（post、put、patch、delete）时调用，使用useActionData获取action返回的数据。
        action: rootAction
    },
])
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
