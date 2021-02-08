import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import routes from "../routes.js";
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';
import {Route, Switch} from 'react-router-dom';


export default class Common extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            state: "",
        }
        this.sections = [
            { title: 'Home', url: '/' },
            { title: 'By States', url: 'states' }
        ];
    }

    getRoutes = routes => {
        return routes.map((prop, key) => {
            return (
            <Route
                exact
                path={prop.layout + prop.path}
                render={props => (
                <prop.component
                    {...props}
                />
                )}
                key={key}
            />
            )
        })
    }

    render() {
        return (
            <React.Fragment>
                <CssBaseline />
                <Container maxWidth="lg">
                <Header title="Real Estate Politics" sections={this.sections}/>
                    <Switch>{this.getRoutes(routes)}</Switch>
                </Container>
                <Footer title="ACRE" description="Action Center on Race &amp; the Economy"/>
            </React.Fragment>
        );
    }
}
