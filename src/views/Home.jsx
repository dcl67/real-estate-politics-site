import React from "react";
import '../assets/css/react-map.css';
import Popover from '@material-ui/core/Popover';
import MUIDataTable from "mui-datatables";
import USAMap from "react-usa-map";
import {states} from "variables/Variables";
import { CircularProgress } from "@material-ui/core";
import jsonData from "../homepage_data.json";
import stateDataJson from "../state_data.json";
import { Link } from "react-router-dom";


export default class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mapData: {},
            open: false,
            anchorEl: null,
            popUpState: "",
            contributorData: [],
            dataWorkspace: {},
            loading: true,
            APIError: false,
            stateData: {},
            stateRecipientsData: {}
        }
        this.id = this.state.open ? 'simple-popover' : undefined;
        this.columns = [
            {
                name: "",
                label: "Contributor",
                options: {
                    filter: true,
                    sort: false
                }
            },
            {
                name: "dollar amount",
                label: "Dollar Amount",
                options: {
                    filter: false,
                    sort: false,
                    sortOrder: 'desc'
                }
            },
        ];

        this.options={
            rowsPerPageOptions: [10,20,25,50],
            download: false,
            filter: true,
            print: false,
            viewColumns: false,
            selectableRowsHeader: false,
            selectableRows: "none"
        }
    }

    handleClick = (event) => {
        this.setState({
            anchorEl: event.currentTarget,
            open: true
        })
    };

    handleClose = () => {
        this.setState({
            anchorEl: null,
            open: false
        })
    };

    initializeStateDict = () => {
        let stateDict = {}
        for (let state in states) {
            stateDict[state] = {}
        }
        return stateDict
    }

    numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    isFloat = (n) => {
        return Number(n) === n && n % 1 !== 0;
    }

    fetchTopContributorsStatic = () => {
        let dataRows = []
        jsonData.forEach(record => {
            dataRows.push([
                record.contributor,
                "$ " + this.numberWithCommas(record.total_money.toFixed(2)),
            ])
        })
        this.setState({
            data: dataRows,
            APIError: false,
            loading: false
        })
    }

    getTopRecipientsByState = () => {
        let stateData = {}
        for (const state in states) {
            let data = []
            let sortData = []
            let recipientDict = {}
            let count = 0
            for (const recipient of Object.keys(stateDataJson[state])) {
                for (const value of Object.values(stateDataJson[state][recipient])) {
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
            while (count < 3) {
                data.push([
                    <div>{count+1 + ": " + sortData[count].recipient}
                    {": $ " + this.numberWithCommas(sortData[count].value.toFixed(2))}<br/></div>
                ])
                count++
            }
            stateData[state] = data
        }
        this.setState({
            stateRecipientsData: stateData
        })
    }

    /* Needed for react-usa-map component */
    mapHandler = (event) => {
        this.setState({
            popUpState: event.target.dataset.name,
            open: true,
            anchorEl: event.currentTarget
        })
      };

    componentDidMount() {
        this.fetchTopContributorsStatic()
        this.getTopRecipientsByState()
    }

    render() {
        return (
            <main>
                <div style={{textAlign: "center", fontSize: `16px`, marginLeft: `8.6%`, width: `80%`}}>
                <p>Our housing system is broken. In the richest country in the world, why do we tolerate people going without housing? Why do we accept that so many people pay too much of their income on rent?<br/>
                And worse, why don’t our elected officials care/do anything about it?</p>

                <p>The answer is the avalanche/torrent real estate money in politics. The real estate industry has locked up our political system (in addition to oil and gas, insurance, pharma, etc.), so instead of the things we need, we get solutions that make the heads of the industry even richer, meanwhile people are losing their homes for (average $ amount in areas)</p>

                <p>It’s time to ask our elected officials: who do you work for? The real estate industry, or the people who live in your community?</p>

                <p>Click on your state below to see which real estate companies make the biggest campaign contributions.</p>

                </div>

                <div>
                    <span style={{color: "white"}}>Real Estate Money in Politics</span>
                    <USAMap onClick={this.mapHandler} />
                    <Popover
                        id={this.id}
                        open={this.state.open}
                        anchorEl={this.state.anchorEl}
                        onClose={this.handleClose}
                        className="popover_class"
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <Link to={{
                            pathname: "states",
                            state: {
                                stateData: this.state.stateData[this.state.popUpState]
                            },
                            search: "?state=" + states[this.state.popUpState]
                        }}>
                            {states[this.state.popUpState]}
                        </Link>
                        <div>Top recipients:</div>
                        {this.state.stateRecipientsData ?
                            this.state.stateRecipientsData[this.state.popUpState]
                        :
                            null
                        }
                    </Popover>
            </div>
            <div style={{textAlign: "center", marginTop: `3em`, fontSize: `18px`}}>Everyone should know these names and their relationships to our elected officials.</div>
                <div style={{marginTop: `2em`}}>
                    {!this.state.loading && !this.state.APIError ?
                        <MUIDataTable
                            title={"Top representatives and corporations"}
                            data={this.state.data}
                            columns={this.columns}
                            options={this.options}
                        />
                    :
                        <span style={{paddingLeft: `48%`}}>
                            <CircularProgress
                                color="secondary"
                                strokeWidth="8.3"
                                className="homepage-loading"
                                variant="indeterminate"
                                disableShrink
                                size={50}
                                thickness={4}
                            />
                        </span>
                    }
                    {this.state.APIError ?
                        <div style={{textAlign: "center"}}>
                            An error has occurred on the API
                        </div>
                    :
                        null
                    }
                </div>
            </main>
        )
    }
}
