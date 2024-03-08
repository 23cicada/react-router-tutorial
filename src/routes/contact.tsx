import { Form, useLoaderData, LoaderFunctionArgs, useFetcher, ActionFunctionArgs } from "react-router-dom";
import { getContact, Contacts, updateContact } from "../contacts.ts";

export async function loader({ params }: LoaderFunctionArgs) {
    const contact = await getContact(params.contactId!);
    if (!contact) {
        throw new Response("", {
            status: 404,
            statusText: "Not Found",
        });
    }
    return { contact };
}

export async function action({ request, params }: ActionFunctionArgs) {
    const formData = await request.formData();

    return updateContact(params.contactId!, {
        favorite: formData.get("favorite") === "true",
    });
}

export default function Contact() {
    const { contact } = useLoaderData() as { contact: Contacts };

    return (
        <div id="contact">
            <div>
                <img
                    key={contact.avatar}
                    src={contact.avatar}
                />
            </div>

            <div>
                <h1>
                    {contact.first || contact.last ? (
                        <>
                            {contact.first} {contact.last}
                        </>
                    ) : (
                        <i>No Name</i>
                    )}{" "}
                    <Favorite contact={contact} />
                </h1>

                {contact.twitter && (
                    <p>
                        <a
                            target="_blank"
                            href={`https://twitter.com/${contact.twitter}`}
                        >
                            {contact.twitter}
                        </a>
                    </p>
                )}

                {contact.notes && <p>{contact.notes}</p>}

                <div>
                    {/* get提交与普通导航相同（Link），可以提供参数，从表单进入URL（默认为上下文中最近路径的相对 URL）。*/}
                    <Form action="edit"> {/* contact/:contactId/edit */}
                        <button type="submit">Edit</button>
                    </Form>
                    {/* 与上面相同 */}
                    {/* <button onClick={() => navigate('edit')}>Edit</button> */}
                    <Form
                        method="post"
                        action="destroy" // contact/:contactId/destroy
                        onSubmit={(event) => {
                            if (
                                !confirm(
                                    "Please confirm you want to delete this record."
                                )
                            ) {
                                event.preventDefault();
                            }
                        }}
                    >
                        <button type="submit">Delete</button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

function Favorite({ contact }: { contact: Contacts }) {
    const fetcher = useFetcher();
    let favorite = contact.favorite;
    /**
     * 使用fetcher.formData获取提交给action的表单数据（无需等待网络响应），
     * 当网络响应后，fetcher.formData将不再可用。
     */
    if (fetcher.formData) {
        favorite = fetcher.formData.get("favorite") === "true";
    }
    return (
        // 无需导航（与<Form />基本相同），调用loader或action。
        // 由于没有action，将发送到渲染表单的路由中（contacts/:contactId）。
        <fetcher.Form method="post">
            <button
                name="favorite"
                value={favorite ? "false" : "true"}
                aria-label={
                    favorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                }
            >
                {favorite ? "★" : "☆"}
            </button>
        </fetcher.Form>
    );
}