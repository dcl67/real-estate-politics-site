import React from "react";
import MUIDataTable from "mui-datatables";
import jsonData from "../state_data.json";
import {statesReversed as states} from "variables/Variables";
const queryString = require('query-string');


export default class RecordDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state ={
            state: "",
            recipient: "",
            getDetails: false,
            loading: true,
            sum: 0.00
        }

        this.columns = [
            {
                name: "Donor",
                label: "Donor",
                options: {
                    filter: true,
                    sort: false
                }
            },
            {
                name: "Total Money",
                label: "Total Money",
                options: {
                    filter: true,
                    sort: false
                }
            },
        ];

        this.options={
            rowsPerPageOptions: [10,20,25,50,100],
            download: false,
            filter: false,
            print: false,
            viewColumns: false,
            selectableRowsHeader: false,
            selectableRows: "none"
        }
    }

    capitalizeString = (str) => {
        return(str.charAt(0).toUpperCase() + str.slice(1));
    }

    numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    getData = () => {
        if (this.state.state && this.state.recipient && this.state.getDetails && !this.state.data) {
            let sum = 0
            let rowData = []
            let sortData = []
            let donorDict = {}
            for (const [donor, value] of Object.entries(jsonData[this.state.state][this.state.recipient])) {
                if (!(donor in donorDict)) {
                    donorDict[donor] = 0.00
                }
                if (!isNaN(value)) {
                    donorDict[donor] += parseFloat(value)
                    sum += parseFloat(value)
                }
            }
            for (const [donor, value] of Object.entries(donorDict)) {
                sortData.push({"donor": donor, "value": value})
            }
            sortData.sort((a,b) => (a.value > b.value) ? -1 : (a.value === b.value) ? ((a.donor > b.donor) ? -1 : 1) : 1);
            sortData.forEach((record) => {
                rowData.push([
                    record.donor,
                    "$ " + this.numberWithCommas(record.value.toFixed(2))
                ])
            })
            this.setState({
                data: rowData,
                sum: sum.toFixed(2),
                loading: false
            })
        }
    }

    componentDidMount() {
        const parsed = queryString.parse(this.props.location.search);
        if (parsed.state) {
            this.setState({
                state: states[this.capitalizeString(parsed.state)]
            }, () => {
                this.setState({getDetails: true})
            });
        }
        if (parsed.recipient) {
            this.setState({
                recipient: parsed.recipient
            }, () => {
                this.setState({getDetails: true})
            });
        }
    }

    render() {
        if (this.state.getDetails) {
            this.getData();
        }
        return(
            <div>
                <div>
                    <h3>
                        Details
                    </h3>
                </div>
                <div>
                    {!this.state.loading ?
                        <MUIDataTable
                            title={"All records for " + this.capitalizeString(this.state.recipient) + (this.state.sum !== 0.00 ? " - sum: $" + this.numberWithCommas(this.state.sum) : " - sum: $0.00")}
                            data={this.state.data}
                            columns={this.columns}
                            options={this.options}
                        />
                        :
                        null
                    }
                </div>
            </div>
        )
    }
}