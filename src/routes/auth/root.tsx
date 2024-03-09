import {Link, Outlet, useFetcher, useLoaderData} from "react-router-dom";
import {fakeAuthProvider} from "./auth";

export const loader = () => ({ user: fakeAuthProvider.username })
const Root = () => {
    return (
        <div>
            <h1>Auth Example using RouterProvider</h1>

            <AuthStatus />
            <ul>
                <li>
                    <Link to="">Public Page</Link>
                </li>
                <li>
                    <Link to="protected">Protected Page</Link>
                </li>
            </ul>

            <Outlet/>
        </div>
    )
}

const AuthStatus = () => {
    // example 中使用的是useRouteLoaderData('auth')
    const { user } = useLoaderData() as { user: string | null }
    const fetcher = useFetcher();

    if (!user) {
        return <p>You are not logged in.</p>;
    }

    /**
     * fetcher.formData与navigation.formData相似
     * 都是用于"optimistic UI"
     */
    const isLoggingOut = fetcher.formData != null;

    return (
        <div>
            <p>Welcome {user}!</p>
            {/* 与<Form />不同，这里的action不会导致导航 */}
            <fetcher.Form method="post" action="logout">
                <button type="submit" disabled={isLoggingOut}>
                    {isLoggingOut ? 'Signing out...' : 'Sign out'}
                </button>
            </fetcher.Form>
        </div>
    );
}

export default Root