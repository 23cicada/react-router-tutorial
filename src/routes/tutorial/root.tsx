import {
    Outlet, useLoaderData, Form, redirect, NavLink,
    useNavigation, LoaderFunctionArgs, useSubmit, useNavigate,
} from "react-router-dom";
import { getContacts, createContact, Contacts } from "./contacts.ts";
import { useEffect } from "react";
import './index.css'

export async function loader({ request }: LoaderFunctionArgs) {

    // await fetch('http://localhost:3000/')
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
    return redirect(`contacts/${contact.id}/edit`)
}

export default function Root() {
    /**
     * 调用action后，将自动重新验证，并返回loader的最新数据。
     * 可使用shouldRevalidate选择不重新验证来优化路由。
     * 可使用useRouteLoaderData获取页面上其他路由loader返回的数据。
     */
    const { contacts, q } = useLoaderData() as { contacts: Contacts[], q: string }

    /**
    * 页面导航信息
    * navigation.state
    * idle: 空闲
    * submitting: 路由 action 被调用（idle -> submitting -> loading -> idle）
    * loading: 下一个路由 loader 被调用（idle => loading => idle）
    */
    const navigation = useNavigation();

    // 命令式导航
    const navigate = useNavigate()

    // 命令式 <Form>，代替表单提交
    const submit = useSubmit();

    /**
     * navigation.location: 下一个路由地址
     * get提交：当正在导航到一个新的URL并执行loader时才有值
     * 非get提交：navigation.formData
     */
    const searching =
        navigation.location &&
        new URLSearchParams(navigation.location.search).has(
            "q"
        );

    useEffect(() => {
        (document.getElementById('q') as HTMLInputElement).value = q
    }, [q])

    return (
        <>
            <div
                id="sidebar"
                // className="
                //     w-[22rem] bg-[#f7f7f7] border border-solid border-[#e3e3e3] flex-col
                //     *:pl-8 *:pr-8
                //     [&_h1]:text-base [&_h1]:font-medium [&_h1]:flex [&_h1]:items-center
                //     [&_h1]:m-0 [&_h1]:py-4 px-8
                // "
            >
                <h1>React Router Contacts</h1>
                <div>
                    {/* 提供搜索参数，从表单进入url */}
                    <Form id="search-form" role="search">
                        <input
                            id="q"
                            className={searching ? "loading" : ""}
                            aria-label="Search contacts"
                            placeholder="Search"
                            type="search"
                            name="q"
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

                    {/* 突变提交：提交表单时，React Router 将 action 与路由匹配，并使序列化的FormData调用 <Route action> */}
                    {/* 操作完成后，页面的所有 loader 都会自动重新验证，以保持页面与数据同步 */}
                    <Form method="post" style={{ display: 'flex', gap: '0.5rem'}}>
                        <button type="submit">New</button>
                        <button type="button" onClick={() => navigate('/tutorial')}>Home</button>
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