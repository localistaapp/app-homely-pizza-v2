import React, { Component } from 'react';
import { render } from 'react-dom';


import CreateApp from './createApp.jsx';
import Content from './content.jsx';
import { BrowserRouter as Router, Route, Link, withRouter } from 'react-router-dom';

var CreateAppWithRouter = withRouter(CreateApp);
var ContentWithRouter = withRouter(Content);

render(<Router>
    <div>
        <Route path="/app" exact render={() => (
                    <div className="results">
                            <Route exact path="/" component={CreateAppWithRouter} />
                        <Route  path="/app" component={CreateAppWithRouter} />
                    </div>)} />
        <Route path="/app/content" exact render={() => (
                <div className="results">
                        <Route exact path="/" component={ContentWithRouter} />
                    <Route  path="/app/content" component={ContentWithRouter} />
                </div>)} />
    </div>
</Router>, document.getElementById('containerWiz'));