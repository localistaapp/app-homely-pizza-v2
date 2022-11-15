import React, { Component } from 'react';
import { render } from 'react-dom';

import OrdersList from './ordersList.jsx';
import OrderDetail from './orderDetail.jsx';
import Inventory from './inventory.jsx';
import { BrowserRouter as Router, Route, Link, withRouter } from 'react-router-dom';


var OrdersWithRouter = withRouter(OrdersList);
var OrderDetailWithRouter = withRouter(OrderDetail);
var InventoryWithRouter = withRouter(Inventory);

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
    </div>
</Router>, document.getElementById('containerWiz'));