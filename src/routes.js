import Home from "views/Home";
import States from "views/States";
import RecordDetail from "views/RecordDetail"


var routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
        layout: ""
    },
    {
        path: "/states",
        name: "States",
        component: States,
        layout: ""
    },
    {
        path: "/states/record-details",
        name: "RecordDetail",
        component: RecordDetail,
        layout: ""
    }
]
export default routes;
