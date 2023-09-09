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

import RestaurantIcon from '@material-ui/icons/Business';
import OrdersIcon from '@material-ui/icons/ViewListSharp';
import InventoryIcon from '@material-ui/icons/ShoppingBasket';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import RequestQuoteIcon from '@material-ui/icons/NotesSharp';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import BackIcon from '@material-ui/icons/ArrowBack';
import StarHalfIcon from '@material-ui/icons/StarHalf';
import Button from '@material-ui/core/Button';

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

class SearchInput extends Component {
  render() {
    return (
      <div><input id="searchKey" type="text" className="txt-field right search-key" onKeyUp={(e)=>{this.props.onSearch(e.target.value)}} /><SearchIcon className="search-icon" /><ClearIcon className="clear-icon" onClick={(e)=>{this.props.onClear();document.getElementById('searchKey').value='';}} /></div>
    );
  }
}


class Dashboard extends Component {

    constructor() {
        super();
        this.state = {
            value: 0,
            localities: [],
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
            status: window.location.href.indexOf('?status=success') >= 0 ? 'success' :'default',
            selectedLocality: '',
            nearby: [],
            storeName: '',
            storeNotExists: false
        };
        window.currSlotSelected = '';
        this.styles = [{
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [{
            "lightness": 10
          }, {
            "visibility": "on"
          }]
        }, {
          "featureType": "road",
          "elementType": "labels",
          "stylers": [{
            "visibility": "on"
          }]
        }, {
          "featureType": "poi",
          "elementType": "labels",
          "stylers": [{
            "visibility": "on"
          }]
        }];
    }
    getStoreName() {
      if (sessionStorage.getItem('user-profile') != null) {
          var franchiseId = JSON.parse(sessionStorage.getItem('user-profile'))[0].id;
          axios.get('/store/name/'+franchiseId)
                .then(function (response) {
                  if(response.data.indexOf('error') == -1) {
                      this.setState({storeName: '('+response.data+')'});
                  } else {
                    this.setState({storeNotExists: true});
                  }
                }.bind(this));
          }
    }
    componentDidMount() {
        this.getStoreName();
    }
    render() {

        return (<div style={{marginTop: '84px'}}>
        <img id="logo" className="logo-img" src="../img/logo_sc.png" style={{width: '142px'}} />
        <span id="logout" className="logout" onClick={this.logout}>Logout</span>
        <Paper id="dash-content">
          <TabPanel value={this.state.value} index={0}>
            <br/>
          <span className="stage-desc" onClick={()=>{window.location.href='/dashboard';}}><span style={{marginTop:'-6px',position:'absolute',color:'#afafaf'}}>Dashboard > <span style={{color: '#666'}}>Store</span><span>&nbsp; {this.state.storeName}</span></span></span>
                <hr className="line-light" style={{visibility: 'hidden',marginTop: '8px'}}/>
                <span className="stage-desc">
                  <span class="stage-desc" style={{marginLeft: '0px'}} onClick={()=>{window.location.href='/store-location-planner';}}>Plan</span>{this.state.storeNotExists && <span class="stage-desc" style={{marginLeft: '18px'}} onClick={()=>{if (confirm("Please make sure you're accessing this page from your store's physical location. If not, your store won't be configured correctly. Do you want to proceed?")) {window.location.href = '/dashboard-create-store';}}}>Create Store</span>}
                </span>
                <hr className="line-light" style={{marginTop: '18px'}}/>
                <span className="stage-desc" onClick={()=>{window.location.href='/dashboard-create-store-order';}}>Create Order</span>
                <hr className="line-light" style={{marginTop: '18px'}}/>
                <span className="stage-desc" onClick={()=>{window.location.href='/dashboard-enquiries';}}> Web Orders (0)</span>
                <hr className="line-light" style={{marginTop: '18px'}}/>
                <span className="stage-desc" onClick={()=>{window.location.href='/dashboard-store-inventory';}}>
                    Inventory</span>
                <hr className="line-light" style={{marginTop: '18px'}}/>
                <span className="stage-desc" onClick={()=>{window.location.href='/dashboard-create-sample-order';}}>
                    Checklist</span>
                <hr className="line-light" style={{marginTop: '18px'}}/>
                <span className="stage-desc" onClick={()=>{window.location.href='/dashboard-create-sample-order';}}>
                    Stats</span>
                <br/><br/><br/>

          </TabPanel>
          <TabPanel value={this.state.value} index={1}>



          </TabPanel>
        </Paper>
    </div>)
    }
}

export default withRouter(Dashboard);