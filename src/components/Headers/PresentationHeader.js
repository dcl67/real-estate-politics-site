/*eslint-disable*/
import React from "react";
import '../../../node_modules/video-react/dist/video-react.css';
import { Player, BigPlayButton } from 'video-react';

// reactstrap components

// core components

function PresentationHeader() {
  return (
    <>
      <div className="page-header clear-filter">
        {/* <div className="rellax-header rellax-header-sky" data-rellax-speed="-4">
          <div
            className="page-header-image"
            style={{
              backgroundImage:
                "url(" +
                require("assets/img/presentation-page/top_header.jpg") +
                ")",
            }}
          ></div>
        </div> */}
        <div
          className="rellax-header rellax-header-buildings"
          data-rellax-speed="0"
        >
          <div
            className="page-header-image" // page-header-city"
            style={{
              backgroundImage:
                "url(" +
                require("assets/img/presentation-page/webhero-filter.png") +
                ")",
            }}
          ></div>
        </div>
        <div className="h3-description" style={{backgroundColor: `#F77F00`, textAlign: `center`, margin: `auto`, width: `54.5%`, marginTop: `-11.1em`, paddingTop: `-11.1em`, marginLeft: `24.5%`, height: `5em`}}/>
        <h3 className="h3-description rellax-text" data-rellax-speed="-1" style={{marginTop: `-6.5em`, paddingTop: `-6.5em`}}>
          <div style={{backgroundColor: `#FCBF49`, textAlign: `center`, margin: `auto`, width: `55%`, height: `2.6em`, paddingTop: `0.9%`}}>
          <strong style={{fontSize: `175%`,}}>Real Estate Money in Politics</strong>
          </div>
        </h3>
        <div className="rellax-text-container rellax-text">
          {/* <div className="pro">PRO</div> */}
        </div>

      </div>
      {/* <div>
        <Player>
          <source src={require("assets/img/presentation-page/realestate_01.mp4")}/>
          <BigPlayButton position="center" />
        </Player>
      </div> */}
      {/* <div>
        <img src={require("assets/img/presentation-page/17493143_857430264395776_2914708679210327569_o.jpg")}/>
      </div> */}
    </>
  );
}

export default PresentationHeader;
