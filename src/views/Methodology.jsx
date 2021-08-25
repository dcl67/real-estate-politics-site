import React from "react";
import FooterBlack from "components/Footers/FooterBlack.js";
import ScrollTransparentNavbar from "components/Navbars/ScrollTransparentNavbar.js";


export default class Methodology extends React.Component {
    constructor(props) {
        super(props)
        this.state ={
            state: "",
            recipient: "",
            getDetails: false,
            loading: true,
            sum: 0.00,
            positionHeld: ""
        }
    }

    render() {
        return(
            <div>
                <div style={{marginBottom: `7em`}}>
                    <ScrollTransparentNavbar />
                </div>
                <div style={{marginLeft: `1.7em`}}>
                    <h3>
                        Methodology
                    </h3>
                </div>
                <div style={{marginLeft: `2em`}}>
                    Special thanks to <a href="https://www.followthemoney.org/" style={{color: `#003049`}}><strong>Open Secrets</strong></a>, their important work and comprehensive data made this project possible.
                <br/><br/><br/>

                <h5>Where does this data come from?</h5>
                To compile the data for this site, we relied on Open Secrets’s campaign contribution and independent expenditure data. We aggregated these numbers to show contributions to and on behalf of sitting state and federal elected officials over the past 5 years.<br/><br/>

                <h5>This data covers the past 5 years, starting when?</h5>
                Our site is set up to retrieve data from Open Secrets on a rolling basis, so data will always reflect 5 years back from the current date.<br/><br/>

                <h5>What are independent expenditures?</h5>
                Independent expenditures are expenses made for or against a candidate or ballot initiative without direct coordination with a candidate or campaign. Unlike the direct contributions, independent expenditure data is available for only 30 states.<br/><br/>

                <h5>How do you define real estate money?</h5>
                Because our site relies on OpenSecrets’s data, we rely on their coding for real estate contributors. In their data, the ‘Real Estate’ code includes realtor associations and real estate agents and developers. Real estate agents and developers includes both companies and individuals.<br/><br/>

                The real estate category does not include organizations that engage in activities like affordable housing advocacy. It also does not include companies like homeowner insurance or home builders, which would be coded under insurance or construction industry, respectively.<br/><br/>

                Lastly, and importantly, this category does not include the finance sector. Because private equity and institutional investors tend to be diversified, they are reflected in a separate business category.<br/><br/>

                </div>
                <div style={{marginTop: `1.5em`, bottom: 0, width: `100%`}}>
                    <FooterBlack />
                </div>
            </div>
        )
    }
}
