import {Outlet, Link, useLoaderData} from "react-router-dom";
import BrandLink from "./BrandLink";
import {brands} from "./snkrs";

export const loader = () => ({ brands })
const Root = () => {
    const { brands: brandList } = useLoaderData() as { brands: string[] }
    return (
        <div>
            <h1>Custom Filter Link Example</h1>
            <nav>
                <h3>Filter by brand</h3>
                <ul>
                    <li>
                        <Link to="/custom-link">All</Link>
                    </li>
                    {brandList.map((brand) => (
                        <li key={brand}>
                            <BrandLink brand={brand}>{brand}</BrandLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <hr />
            <Outlet />
        </div>
    )
}

export default Root