import React from "react";
import Popover from '@material-ui/core/Popover';
import { CircularProgress } from "@material-ui/core";
import '../../assets/css/react-map.css';
import USAMap from "react-usa-map";
import { Link } from "react-router-dom";
import MUIDataTable from "mui-datatables";

import { states } from "variables/Variables";
import jsonData from "../../data/homepage_data.json";
import stateDataJson from "../../data/state_data.json";

// reactstrap components
import { Row, Col } from "reactstrap";


export default class Components extends React.Component {
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
      stateRecipientsData: {},
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
            if (sortData[count] !== undefined) {
                let recipient = sortData[count].recipient.split('&')[0]
                data.push([
                    <div>{count+1 + ": " + recipient}
                    {": $ " + this.numberWithCommas(sortData[count].value.toFixed(2))}<br/></div>
                ])
            }
            count++
        }
        stateData[state] = data
    }
    this.setState({
        stateRecipientsData: stateData
    })
}

componentDidMount() {
    this.fetchTopContributorsStatic()
    this.getTopRecipientsByState()
}

  /* Needed for react-usa-map component */
  mapHandler = (event) => {
    this.setState({
      popUpState: event.target.dataset.name,
      open: true,
      anchorEl: event.currentTarget
    })
  };

  render() {
    return (
      <>
        <div
          className="section section-components"
          data-background-color="dark-blue"
        >
          {/* <Container> */}
            <Row>
              <Col xs={12} md={4} style={{backgroundColor: "white"}}>
                <img
                  style={{marginLeft: `2em`, marginTop: `2em`, width: `85%`, height: `auto`}}
                  src={require("assets/img/presentation-page/30271935096_e2ee2c806d_o.jpg")}
                  alt="group of people"
                />
              </Col>
              <Col xs={6} md={8} className="" style={{backgroundColor: "white"}}>
                {/* <h2 className="text-center title">
                  <small className="description">
                    Electeds: Bought and Sold
                  </small>
                </h2> */}
                <div>
                  <h3 className="text-center" style={{width: `85%`, color: `black`, textAlign: `center`, marginTop: `2.6em`, marginRight: `2em`}}>
                    Why is it that instead of housing justice, our elected officials work for the real estate industry?<br/>
                  </h3>

                  <h3 className="text-center" style={{width: `85%`, color: `black`, textAlign: `center`, marginRight: `2em`, fontWight: `400`}}>
                    <strong>The answer is real estate money in politics.</strong><br/>
                  </h3><br/>

                </div>
              </Col>
              <Col xs={12} md={12} style={{backgroundColor: "white"}}>
                <div className="text-center description" style={{width: `85%`, color: `black`, textAlign: `center`, marginLeft: `8%`}}>

                  <br/>
                  <h3 className="text-center" style={{width: `85%`, color: `black`, textAlign: `center`, marginLeft: `2.8em`}}>
                    <strong>
                      How to use this site
                    </strong>
                  </h3>

                  <h5 className="text-center description" style={{width: `85%`, color: `black`, textAlign: `center`, marginLeft: `3.7em`}}>
                    Click on a state in the map below to see which sitting electeds netted the most real estate money over the last 5 years.
                  <br/><br/>

                    Click on any state name for more detail. On each state page toggle between donors and recipients at the top, and click on an elected’s name to see their donors
                  <br/><br/>

                    See our <Link to="/bought-and-sold/methodology" style={{color: `#003049`}}><strong>methodology page</strong></Link> for more info and FAQs
                  </h5>
                  <br/>

                </div>
                {/* <div className="space-50"></div> */}
              </Col>
            </Row>
            <Row>
              <Col className="ml-auto mr-auto" md="8" lg="9" style={{marginTop: `4em`}}>
                <USAMap title={"US State map"} onClick={this.mapHandler} defaultFill={`#EAE2B7`}/>
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
                  <div style={{marginTop: `1%`, marginLeft: `2%`}}>
                  <Link to={{
                    pathname: "states",
                    state: {
                      stateData: this.state.stateData[this.state.popUpState]
                    },
                    search: "?state=" + states[this.state.popUpState]
                  }}>
                    <h5><strong>{states[this.state.popUpState]}</strong></h5>
                  </Link>
                    <div>Top recipients:</div>
                    {this.state.stateRecipientsData ?
                      this.state.stateRecipientsData[this.state.popUpState]
                    :
                      null
                    }
                    </div>
                </Popover>
              </Col>
            </Row>
            <Row>
              <Col className="">
                <div  style={{textAlign: `center`, marginLeft: `3%`}}>
                  <br/>
                  <h4>
                    <strong>Below are the top 50 donors to sitting elected officials over the past 5 years.<br/>Everyone should know these names.</strong>
                  </h4>
                  <br/>
                </div>
              <div style={{marginTop: `2em`, width: `85%`, marginLeft: `7.4%`}}>
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
              </Col>
            </Row>
          {/* </Container> */}
        </div>
      </>
    );
  }
}

