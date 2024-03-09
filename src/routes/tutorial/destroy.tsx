import { redirect, ActionFunctionArgs } from "react-router-dom";
import { deleteContact } from "./contacts.ts";

export async function action({ params }: ActionFunctionArgs) {
    await deleteContact(params.contactId!);
    return redirect("/tutorial");
}