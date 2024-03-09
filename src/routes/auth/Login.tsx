import {useActionData, useLocation, useNavigation, Form, redirect, ActionFunctionArgs} from "react-router-dom";
import {fakeAuthProvider} from "./auth";

export const loader = () => {
    if (fakeAuthProvider.isAuthenticated) {
        return redirect('/auth')
    }
    return null
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const username = formData.get('username') as string | null;

    if (!username) {
        return {
            error: 'You must provide a username to log in',
        };
    }

    try {
        await fakeAuthProvider.signin(username);
    } catch (error) {
        return {
            error: 'Invalid login attempt',
        };
    }

    const redirectTo = formData.get('redirectTo') as string | null;
    return redirect(redirectTo || '/auth');
}


const Login = () => {
    // 当前 location 对象
    const location = useLocation();
    // 当前 url 查询字符串
    const params = new URLSearchParams(location.search);
    const from = params.get('from') || undefined;

    const navigation = useNavigation();
    // 非get提交
    const isLoggingIn = navigation.formData?.get('username') != null;

    // action 返回的结果值
    const actionData = useActionData() as { error: string } | undefined;

    return (
        <div>
            {from && <p>You must log in to view the page at {from}</p>}

            <Form method="post" replace>
                <input type="hidden" name="redirectTo" value={from} />
                <label>
                    Username: <input name="username" />
                </label>{' '}
                <button type="submit" disabled={isLoggingIn}>
                    {isLoggingIn ? 'Logging in...' : 'Login'}
                </button>
                {actionData && actionData.error ? (
                    <p style={{ color: 'red' }}>{actionData.error}</p>
                ) : null}
            </Form>
        </div>
    );
}

export default Login