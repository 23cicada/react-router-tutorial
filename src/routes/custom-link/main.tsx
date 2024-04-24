import {RouteObject} from "react-router-dom";
import Root, { loader as rootLoader } from './root'
import SneakerGrid, { loader as sneakerLoader } from "./SneakerGrid";
import SneakerView from "./SneakerView";

const router: RouteObject = {
    path: 'custom-link',
    element: <Root />,
    loader: rootLoader,
    children: [
        {
            index: true,
            element: <SneakerGrid />,
            loader: sneakerLoader
        },
        {
            path: 'sneakers/:id',
            element: <SneakerView />
        }
    ]
}

export default router