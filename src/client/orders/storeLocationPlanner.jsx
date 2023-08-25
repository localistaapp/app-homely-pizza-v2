import React, { Component } from 'react';
import axios from 'axios';
import { render } from 'react-dom';
import { Link, withRouter } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import LocalPizzaIcon from '@material-ui/icons/LocalPizza';
import RestaurantIcon from '@material-ui/icons/Business';
import RequestQuoteIcon from '@material-ui/icons/NotesSharp';
import OrdersIcon from '@material-ui/icons/ViewListSharp';
import InventoryIcon from '@material-ui/icons/ShoppingBasket';

import { questions, conditionalQuestions } from '../../data-source/mockDataQnA';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}


class Dashboard extends Component {

    constructor() {
        super();
        this.state = {
            value: 0,
            results: [],
            starters: [],
            activeStep: 1,
            showCoupon: false,
            couponApplied: false,
            showSlot: false,
            slotSelected: '',
            showList: 'hidden',
            showWizard: '',
            numVistors: 0,
            mobileNum: '',
            curStep: 1,
            redirect: false,
            status: window.location.href.indexOf('?status=success') >= 0 ? 'success' :'default'
        };
        window.currSlotSelected = '';
        this.handleTabChange = this.handleTabChange.bind(this);
    }
    componentDidMount() {
        var winHeight = window.innerHeight;
        //query API to fetch data

    }
    handleTabChange(event, newValue) {
        console.log('neValue: ', newValue);
        this.setState({value: newValue});
    }
    createSampleOrder() {
        var orderName = document.getElementById('orderName').value;
        var orderDate = document.getElementById('orderDate').value;
        var orderTime = document.getElementById('orderTime').value;
        var orderContact = document.getElementById('orderContact').value;
        var orderPrice = document.getElementById('orderPrice').value;
        var orderAddress = document.getElementById('orderAddress').value;
        var orderMapURL = document.getElementById('orderMapURL').value;
        var orderCity = document.getElementById('orderCity').value;
        var orderZone = document.getElementById('orderZone').value;
        var orderPizzaQty = document.getElementById('orderPizzaQty').value;
        var orderPizzaSize = document.getElementById('orderPizzaSize').value;
        var orderGarlicBreadQty = document.getElementById('orderGarlicBreadQty').value;
        var orderWrapsQty = document.getElementById('orderWrapsQty').value;
        var orderToppingIng = document.getElementById('orderToppingIng').value;
        var orderSpecialIng = document.getElementById('orderSpecialIng').value;
        var orderExtras = document.getElementById('orderExtras').value;
        var orderComments = document.getElementById('orderComments').value;
        //create order
        var http = new XMLHttpRequest();
        var url = '/createConfirmedOrder';
        var params = 'orderName='+orderName+'&orderDate='+orderDate+'&orderTime='+orderTime;
        params += '&orderContact='+orderContact+'&orderPrice='+orderPrice+'&orderAmtPaid=0';;
        params += '&orderAddress='+orderAddress+'&orderMapURL='+orderMapURL+'&orderCity='+orderCity;
        params += '&orderZone='+orderZone+'&orderPizzaQty='+orderPizzaQty+'&orderPizzaSize='+orderPizzaSize;
        params += '&orderGarlicBreadQty='+orderGarlicBreadQty+'&orderWrapsQty='+orderWrapsQty+'&orderToppingIng='+orderToppingIng;
        params += '&orderSpecialIng='+orderSpecialIng+'&orderExtras='+orderExtras+'&orderComments='+orderComments+'&orderType=SAMPLE';
        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
                console.log('confirmed order creation post response:', http.responseText);
                var res = http.responseText;
                if(res != null){
                    res = JSON.parse(res);
                    console.log('--event order id--', res);
                    sessionStorage.setItem('confirmedOrderId', res.orderId);
                    window.location.href='/dashboard-create-sample-order?status=success';
                }
            }
        }.bind(this);
        http.send(params);
    }

    render() {
        const {status, orderTitle, dateTime, booking, customer, toppings, extras, location, mapUrl, comments, showLoader, results, starters, orderSummary, showCoupon, showSlot, showList, showWizard, numVistors, curStep, redirect} = this.state;

        return (<div style={{marginTop: '84px'}}>
                    <img id="logo" className="logo-img" src="../img/logo_sc.png" style={{width: '142px'}} onClick={()=>{window.location.href='/dashboard';}} />
                    {status == 'success' && <span className="stage-heading status-success">Order created successfully</span>}
                    <Paper>

                                              <TabPanel value={this.state.value} index={0}>
                                                   <span className="stage-heading" style={{top: '12px',background: '#f6f6f6'}}><OrdersIcon />&nbsp;&nbsp;Store Location Planner</span>
                                                   <hr className="line-light" style={{visibility: 'hidden'}}/>
                                                   <br/>
                                                   <hr className="line-light" style={{marginTop: '18px'}}/>
                                                   

                                                   <br/>
                                                   <br/><br/><br/><br/>

                                              </TabPanel>
                                              <TabPanel value={this.state.value} index={1}>



                                              </TabPanel>
                                            </Paper>
                </div>)
    }
}

export default withRouter(Dashboard);