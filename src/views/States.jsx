import React from "react";
import Button from '@material-ui/core/Button';
import MUIDataTable from "mui-datatables";
import jsonData from "../state_data.json";
import {statesReversed as states} from "variables/Variables";
import { Link } from "react-router-dom";
const queryString = require('query-string');


export default class States extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            state: "",
            county: "",
            city: "",
            data: [],
            donorData: [],
            isRecipient: true,
            loading: true
        }

        this.columns = [
            {
                name: "Recipient",
                label: "Recipient",
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

        this.donorColumns = [
            {
                name: "Contributor",
                label: "Contributor",
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

    setRecipient = () => {
        this.setState({
            isRecipient: true
        })
    }

    setDonor = () => {
        this.setState({
            isRecipient: false
        })
    }

    capitalizeString = (str) => {
        return(str.charAt(0).toUpperCase() + str.slice(1));
    }

    isFloat = (n) => {
        return Number(n) === n && n % 1 !== 0;
    }

    numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    getData = (data) => {
        let rowData = []
        let sortData = []
        let recipientDict = {}
        for (const recipient of Object.keys(data)) {
            for (const value of Object.values(data[recipient])) {
                if (!(recipient in recipientDict)) {
                    recipientDict[recipient] = 0.00
                }
                if (!isNaN(value)) {
                    recipientDict[recipient] += parseFloat(value)
                }
            }
        }
        for (const [recipient, value] of Object.entries(recipientDict)) {
            sortData.push({"recipient": recipient, "value": value})
        }
        sortData.sort((a,b) => (a.value > b.value) ? -1 : (a.value === b.value) ? ((a.recipient > b.recipient) ? -1 : 1) : 1);
        sortData.forEach((record) => {
            rowData.push([
                <Link to={{
                    pathname: "states/record-details",
                    state: {
                        detailedData: jsonData[states[this.state.state]][record.recipient]
                    },
                    search: "?recipient=" + record.recipient + "&state=" + this.state.state
                }}>
                    {record.recipient}
                </Link>,
                "$ " + this.numberWithCommas(record.value.toFixed(2))
            ])
        })
        this.setState({
            data: rowData,
            loading: false
        })
    }

    getDonorData = (data) => {
        let rowData = []
        let sortData = []
        let count = 0
        let donorDict = {}
        for (const recipient of Object.keys(data)) {
            for (const [donor, value] of Object.entries(data[recipient])) {
                if (!(donor in donorDict)) {
                    donorDict[donor] = 0.00
                }
                if (!isNaN(value)) {
                    donorDict[donor] += parseFloat(value)
                }
            }
        }
        for (const [donor, value] of Object.entries(donorDict)) {
            sortData.push({"donor": donor, "value": value})
        }
        sortData.sort((a,b) => (a.value > b.value) ? -1 : (a.value === b.value) ? ((a.donor > b.donor) ? -1 : 1) : 1);

        while (count < 15) {
            rowData.push([
                sortData[count].donor,
                "$ " + this.numberWithCommas(sortData[count].value.toFixed(2))
            ])
            count++;
        }
        this.setState({
            donorData: rowData,
            loading: false
        })
    }

    componentDidMount() {
        const parsed = queryString.parse(this.props.location.search);
        if (parsed.state) {
            this.setState({
                state: this.capitalizeString(parsed.state)
            }, () => {
                this.getData(jsonData[states[this.state.state]])
                this.getDonorData(jsonData[states[this.state.state]])
            })
        }
        // if (parsed.county) {
        //     this.setState({
        //         county: this.capitalizeString(parsed.county)
        //     })
        // }
        // if (parsed.city) {
        //     this.setState({
        //         city: this.capitalizeString(parsed.city)
        //     })
        // }
    }

    render() {
        return(
            <div>
                <div>
                    <h3>
                        States
                    </h3>
                </div>
                <div style={{marginTop: `2em`, marginLeft: `40%`, marginBottom: `3em`}}>
                    <span>
                        <Button variant="contained" disabled={this.state.isRecipient ? true : false} onClick={() => {this.setRecipient()}}>Recipient</Button>
                    </span>
                    <span style={{marginLeft: `5%`}}>
                        <Button variant="contained" disabled={this.state.isRecipient ? false : true} onClick={() => {this.setDonor()}}>Donor</Button>
                    </span>
                </div>

                <div>
                    {this.state.isRecipient ?
                        <MUIDataTable
                            title={"Top recipients for the state of " + this.state.state}
                            data={this.state.data}
                            columns={this.columns}
                            options={this.options}
                        />
                        :
                        <MUIDataTable
                            title={"Top donors for the state of " + this.state.state}
                            data={this.state.donorData}
                            columns={this.donorColumns}
                            options={this.options}
                        />
                    }
                </div>
            </div>
        )
    }
}
