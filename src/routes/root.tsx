import {
    Outlet, useLoaderData, Form, redirect, NavLink,
    useNavigation, LoaderFunctionArgs, useSubmit,
} from "react-router-dom";
import { getContacts, createContact, Contacts } from "../contacts.ts";
import { useEffect } from "react";

export async function loader({ request }: LoaderFunctionArgs) {
    /**
     * request：发送的 fetch 请求实例（Request 对象）。
     * 正常情况浏览器会向服务器发送请求，但React Router将请求发送给loader。
     *
     * 最常见的用例是创建一个 URL 并从中读取 URLSearchParams
     */
    const url = new URL(request.url);
    const q = url.searchParams.get("q")!;
    const contacts = await getContacts(q);
    return { contacts, q };
}

export async function action() {
    const contact = await createContact()

    /**
     * 重定向：可以在 loader 和 action 中使用
     *
     * redirect 是对以下的一个快捷方式：
     * return new Response('', {
     *   status: 302,
     *   headers: {
     *     Location: `/contacts/${contact.id}/edit`
     *   }
     * })
     *
     * const loader = async () => {
     *   const user = await getUser();
     *   if (!user) {
     *     return redirect("/login");
     *   }
     *   return null;
     * };
     */
    return redirect(`/contacts/${contact.id}/edit`)
}

export default function Root() {
    /**
     * 调用action后，将自动重新验证，并返回loader的最新数据。
     * 可使用shouldRevalidate选择不重新验证来优化路由。
     * 可使用useRouteLoaderData获取页面上其他路由loader返回的数据。
     */
    const { contacts, q } = useLoaderData() as { contacts: Contacts[], q: string }
    /*
    * 页面导航信息 navigation.state
    * idle: 空闲
    * submitting: 路由 action 被调用
    * loading: 下一个路由 loader 被调用
    * */
    const navigation = useNavigation();

    /* <Form> 的命令式版本，代替表单提交*/
    const submit = useSubmit();

    /* navigation.location: 正在导航到下一个路由才有值 */
    const searching =
        navigation.location &&
        new URLSearchParams(navigation.location.search).has(
            "q"
        );

    useEffect(() => {
        // 解决返回后列表不再过滤，但输入框任保留值
        (document.getElementById('q') as HTMLInputElement).value = q
    }, [q])

    return (
        <>
            <div id="sidebar">
                <h1>React Router Contacts</h1>
                <div>
                    {/* 默认get，不会调用 action，只有 url 会发生改变并调用 loader。*/}
                    <Form id="search-form" role="search">
                        <input
                            id="q"
                            className={searching ? "loading" : ""}
                            aria-label="Search contacts"
                            placeholder="Search"
                            type="search"
                            name="q"
                            // 解决页面刷新后，输入框不再有值
                            defaultValue={q}
                            onChange={(event) => {
                                const isFirstSearch = q == null;
                                // currentTarget.form: input的表单节点
                                submit(event.currentTarget.form, {
                                    // 指示表格替换历史堆栈中的当前条目，而不是推送新条目。第一次搜索依旧是推送
                                    replace: !isFirstSearch
                                });
                            }}
                        />
                        <div
                            id="search-spinner"
                            aria-hidden
                            hidden={!searching}
                        />
                        <div
                            className="sr-only"
                            aria-live="polite"
                        ></div>
                    </Form>
                    {/*
                        突变提交：提交表单时，React Router 将 action 与路由匹配，并使序列化的FormData调用 <Route action>
                        操作完成后，页面的所有 loader 都会自动重新验证，以保持页面与数据同步
                        method的值在 action 方法的request.method中
                    */}
                    <Form method="post">
                        <button type="submit">New</button>
                    </Form>
                </div>
                <nav>
                    {contacts.length ? (
                        <ul>
                            {contacts.map((contact) => (
                                <li key={contact.id}>
                                    {/* NavLink 知道是否处于 active、pending 或 transitioning 状态*/}
                                    <NavLink
                                        to={`contacts/${contact.id}`}
                                        className={({ isActive, isPending }) =>
                                            isActive
                                                ? "active"
                                                : isPending
                                                    ? "pending"
                                                    : ""
                                        }
                                    >
                                        {contact.first || contact.last ? (
                                            <>
                                                {contact.first} {contact.last}
                                            </>
                                        ) : (
                                            <i>No Name</i>
                                        )}{" "}
                                        {contact.favorite && <span>★</span>}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>
                            <i>No contacts</i>
                        </p>
                    )}
                </nav>
            </div>
            <div
                id="detail"
                className={navigation.state === "loading" ? "loading" : ""}
            >
                <Outlet />
            </div>
        </>
    );
}