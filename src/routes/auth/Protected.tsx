import {fakeAuthProvider} from "./auth";
import {LoaderFunctionArgs, redirect} from "react-router-dom";

export const loader = ({ request }: LoaderFunctionArgs) => {
    if (!fakeAuthProvider.isAuthenticated) {
        const params = new URLSearchParams()
        params.set('from', new URL(request.url).pathname)
        return redirect('/auth/login?' + params.toString())
    }
    return null
}
const Protected = () => {
    return (
        <div>Protected</div>
    )
}

export default Protected