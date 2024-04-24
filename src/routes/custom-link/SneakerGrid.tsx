import {LoaderFunctionArgs, useLoaderData, Link} from "react-router-dom";
import {filterByBrand, SNEAKERS, Sneaker } from "./snkrs";

export const loader = ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url)
    const brand = url.searchParams.get('brand')
    if (!brand) {
        return SNEAKERS
    } else {
        return filterByBrand(brand)
    }
}
function SneakerGrid() {
    /**
     * example中使用useSearchParams获取brand参数后获取数据，
     * 改造为在loader中获取brand参数后获取数据。
     */

    // const [searchParams] = useSearchParams();
    // const brand = searchParams.get("brand");
    //
    // const sneakers = useMemo(() => {
    //     if (!brand) return SNEAKERS;
    //     return filterByBrand(brand);
    // }, [brand]);

    const sneakers = useLoaderData() as Sneaker[]

    return (
        <main>
            <h2>Sneakers</h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                    gap: "12px 24px",
                }}
            >
                {sneakers.map((snkr) => {
                    const name = `${snkr.brand} ${snkr.model} ${snkr.colorway}`;
                    return (
                        <div key={snkr.id} style={{ position: "relative" }}>
                            <img
                                width={200}
                                height={200}
                                src={snkr.imageUrl}
                                alt={name}
                                style={{
                                    borderRadius: "8px",
                                    width: "100%",
                                    height: "auto",
                                    aspectRatio: "1 / 1",
                                }}
                            />
                            <Link
                                style={{ position: "absolute", inset: 0 }}
                                to={`sneakers/${snkr.id}`}
                            />
                            <div>
                                <p>{name}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}

export default SneakerGrid