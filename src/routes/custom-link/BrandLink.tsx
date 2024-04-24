import {LinkProps, useSearchParams, Link} from "react-router-dom";

interface BrandLinkProps extends Omit<LinkProps, "to"> {
    brand: string;
}

function BrandLink({ brand, children, ...props }: BrandLinkProps) {
    // useSearchParams：获取当前URL中的搜索参数
    const [searchParams] = useSearchParams();
    const isActive = searchParams.get("brand") === brand;

    // const location = useLocation()
    // const searchParams = new URLSearchParams(location.search)
    // const isActive = searchParams.get("brand") === brand;

    return (
        <Link
            to={`?brand=${brand}`}
            {...props}
            style={{
                ...props.style,
                color: isActive ? "red" : "black",
            }}
        >
            {children}
        </Link>
    );
}

export default BrandLink