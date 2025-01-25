import React, { Component } from 'react';
import { render } from 'react-dom';


import CreateApp from './createApp.jsx';
import { BrowserRouter as Router, Route, Link, withRouter } from 'react-router-dom';

var CreateAppWithRouter = withRouter(CreateApp);

render(<Router>
    <div>
        <Route path="/app" exact render={() => (
                    <div className="results">
                            <Route exact path="/" component={CreateAppWithRouter} />
                        <Route  path="/app" component={CreateAppWithRouter} />
                    </div>)} />
    </div>
</Router>, document.getElementById('containerWiz'));