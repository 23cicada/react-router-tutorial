import { RouteObject } from "react-router-dom";
import ErrorPage from './error-page.tsx'
import Root, {
    loader as rootLoader,
    action as rootAction
} from './root.tsx'
import Contact, {
    loader as contactLoader,
    action as contactAction,
} from "./contact.tsx";
import EditContact, { action as editAction } from "./edit.tsx";
import { action as destroyAction } from "./destroy.tsx";
import Index from "./index";

const router: RouteObject = {
    path: '/tutorial',
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
                    // <Form method="post" action="destroy"> 匹配 contacts/:contactId/destroy
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
}

export default router
