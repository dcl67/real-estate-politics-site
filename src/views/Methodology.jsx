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
                <div style={{marginLeft: `1.5em`}}>
                    <h3>
                        Methodology
                    </h3>
                </div>
                <div style={{marginLeft: `2em`}}>
                    Special thanks to the National Institute for Money in Politics. Their important work and comprehensive data made this project possible.
                    <br/><br/>

                    To compile this information, we pulled campaign spending for the past 5 years focused on current officeholders in state and federal elected office.
                    <br/>
                    Our numbers include campaign contributions and independent expenditures, which are made on behalf of or against a candidate, but are not<br/>
                    allowed in coordination with campaigns. Independent expenditure data was available for 30 states.
                </div>
                <div style={{marginTop: `3em`,  position: `absolute`, bottom: 0, width: `100%`}}>
                    <FooterBlack />
                </div>
            </div>
        )
    }
}
