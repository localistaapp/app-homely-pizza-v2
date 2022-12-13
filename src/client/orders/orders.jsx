import React, { Component } from 'react';
import { render } from 'react-dom';

import OrdersList from './ordersList.jsx';
import OrderDetail from './orderDetail.jsx';
import Inventory from './inventory.jsx';
import Dashboard from './dashboard.jsx';
import Quote from './quote.jsx';
import QuoteRes from './quoteRes.jsx';
import CreateOrder from './createOrder.jsx';
import CreateSampleOrder from'./createSampleOrder.jsx';
import { BrowserRouter as Router, Route, Link, withRouter } from 'react-router-dom';


var OrdersWithRouter = withRouter(OrdersList);
var OrderDetailWithRouter = withRouter(OrderDetail);
var InventoryWithRouter = withRouter(Inventory);
var DashboardWithRouter = withRouter(Dashboard);
var QuoteWithRouter = withRouter(Quote);
var QuoteResWithRouter = withRouter(QuoteRes);
var CreateOrderWithRouter = withRouter(CreateOrder);
var CreateSampleOrderWithRouter = withRouter(CreateSampleOrder);

render(<Router>
    <div>
        <Route path="/" render={() => (
            <div className="results">
                    <Route exact path="/" component={OrdersWithRouter} />
                <Route path="/orders/" component={OrdersWithRouter} />
            </div>)} />
        <Route path="/order-detail" exact render={() => (
                    <div className="results">
                            <Route exact path="/" component={OrderDetailWithRouter} />
                        <Route  path="/order-detail" component={OrderDetailWithRouter} />
                    </div>)} />
        <Route path="/inventory" exact render={() => (
                    <div className="results">
                            <Route exact path="/" component={InventoryWithRouter} />
                        <Route  path="/inventory" component={InventoryWithRouter} />
                    </div>)} />
        <Route path="/dashboard" exact render={() => (
                    <div className="results">
                            <Route exact path="/" component={DashboardWithRouter} />
                        <Route  path="/dashboard" component={DashboardWithRouter} />
                    </div>)} />
        <Route path="/dashboard-quote" exact render={() => (
                    <div className="results">
                            <Route exact path="/" component={QuoteWithRouter} />
                        <Route  path="/dashboard-quote" component={QuoteWithRouter} />
                    </div>)} />
        <Route path="/dashboard-quote-res" exact render={() => (
                    <div className="results">
                            <Route exact path="/" component={QuoteResWithRouter} />
                        <Route  path="/dashboard-quote-res" component={QuoteResWithRouter} />
                    </div>)} />
        <Route path="/dashboard-create-order" exact render={() => (
                    <div className="results">
                            <Route exact path="/" component={CreateOrderWithRouter} />
                        <Route  path="/dashboard-create-order" component={CreateOrderWithRouter} />
                    </div>)} />
        <Route path="/dashboard-create-sample-order" exact render={() => (
                    <div className="results">
                            <Route exact path="/" component={CreateSampleOrderWithRouter} />
                        <Route  path="/dashboard-create-sample-order" component={CreateSampleOrderWithRouter} />
                    </div>)} />
    </div>
</Router>, document.getElementById('containerWiz'));