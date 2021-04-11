/*eslint-disable*/
import React from "react";

// reactstrap components
import { Container } from "reactstrap";

// core components

function FooterBlack() {
  return (
    <>
      <footer className="footer" data-background-color="black">
        <Container>
          <nav>
            <ul>
              <li>
                <a
                  href="https://acrecampaigns.org"
                  target="_blank"
                >
                  ACRE Campaigns
                </a>
              </li>
              <li>
                <a
                  href="/"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/methodology"
                >
                  Methodology
                </a>
              </li>
            </ul>
          </nav>
          <div className="copyright" id="copyright">
            © {new Date().getFullYear()}
          </div>
        </Container>
      </footer>
    </>
  );
}

export default FooterBlack;
