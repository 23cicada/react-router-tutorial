import {redirect, RouteObject} from "react-router-dom";
import Root, { loader as rootLoader } from './root.tsx'
import Protected, { loader as protectedLoader } from './Protected'
import Login, { loader as loginLoader, action as loginAction } from './Login'
import {fakeAuthProvider} from "./auth";


const router: RouteObject = {
    path: 'auth',
    element: <Root />,
    loader: rootLoader,
    children: [
        {
            index: true,
            element: <div>Public</div>
        },
        {
            path: 'protected',
            element: <Protected />,
            loader: protectedLoader
        },
        {
            path: 'login',
            element: <Login />,
            loader: loginLoader,
            action: loginAction
        },
        {
            path: 'logout',
            async action() { // 通过 fetcher.Form 调用
                await fakeAuthProvider.signout();
                return redirect('/auth');
            }
        },
    ]
}

export default  router