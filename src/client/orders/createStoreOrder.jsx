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

import StoreIcon from '@material-ui/icons/Store';
import WarningIcon from '@material-ui/icons/Warning'

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

class ReviewContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {activeIndex: 0, activeOptions: [], activeCrustIndex: 0, qty: 0};
        this.setActiveTopic = this.setActiveTopic.bind(this);
    }
    componentDidMount() {
    }
    setOpinionArray(topicName) {
        let reviewTopics = this.props.reviewTopics;
        let activeOpinions = [];
        reviewTopics.forEach((reviewTopic)=> {
            if(reviewTopic.topic == topicName) {
                activeOpinions = reviewTopic.opinions;
            }
        });
        this.setState({activeOpinions: activeOpinions});

    }
    setCrustPrice(crustIndex) {
        let itemId = this.props.itemId.replace('p','').replace('g','');
        let crust = this.props.crustOptions[crustIndex].topic;
        let item = this.props.item;
        console.log('::Size::', this.props.reviewTopics[this.state.activeIndex].topic);
        console.log('::Crust::', crust);
        console.log('::Price::', this.props.reviewTopics[this.state.activeIndex]["pricing"][crust]);
        document.getElementById('price'+itemId).innerHTML = this.props.reviewTopics[this.state.activeIndex]["pricing"][crust] * (this.state.qty > 0 ? this.state.qty : 1);
        let N = Math.round(this.props.reviewTopics[this.state.activeIndex]["pricing"][crust] * (this.state.qty > 0 ? this.state.qty : 1) * 0.85);
        document.getElementById('priceNew'+itemId).innerHTML = isValidCoupon() ? Math.ceil(N / 10) * 10 : Math.round(this.props.reviewTopics[this.state.activeIndex]["pricing"][crust] * (this.state.qty > 0 ? this.state.qty : 1));
        if(this.state.qty > 0){
            var event = new CustomEvent('basket-updated', { detail: {type: item.type, name: item.title, crust: this.props.crustOptions[crustIndex].topic, size: this.props.reviewTopics[this.state.activeIndex].topic, qty: this.state.qty, price: this.props.reviewTopics[this.state.activeIndex]["pricing"][crust] * this.state.qty, itemId: this.props.itemId}});
            document.dispatchEvent(event);
        }
    }
    setSizePrice(activeIndex) {
        let size = this.props.reviewTopics[activeIndex].topic;
        let item = this.props.item;
        let itemId = this.props.itemId.replace('p','').replace('g','');
        console.log('::Size::', size);
        console.log('::Crust::', this.props.crustOptions[this.state.activeCrustIndex].topic);
        console.log('::Price::', this.props.crustOptions[this.state.activeCrustIndex]["pricing"][size]);
        document.getElementById('price'+itemId).innerHTML = this.props.crustOptions[this.state.activeCrustIndex]["pricing"][size] * (this.state.qty > 0 ? this.state.qty : 1);
        let N = Math.round(this.props.crustOptions[this.state.activeCrustIndex]["pricing"][size] * (this.state.qty > 0 ? this.state.qty : 1) * 0.85);
        document.getElementById('priceNew'+itemId).innerHTML = isValidCoupon() ? Math.ceil(N / 10) * 10 : Math.round(this.props.crustOptions[this.state.activeCrustIndex]["pricing"][size] * (this.state.qty > 0 ? this.state.qty : 1));
        if(this.state.qty > 0){
            var event = new CustomEvent('basket-updated', { detail: {type: item.type, name: item.title, crust: this.props.crustOptions[this.state.activeCrustIndex].topic, size: this.props.reviewTopics[activeIndex].topic, qty: this.state.qty, price: this.props.crustOptions[this.state.activeCrustIndex]["pricing"][size] * this.state.qty, itemId: this.props.itemId}});
            document.dispatchEvent(event);
        }
    }
    setActiveCrust(item, indexCrust) {
        console.log('index: ', indexCrust);
        this.setState({activeCrustIndex: indexCrust});
        this.setOpinionArray(item.topic);
    }
    setActiveTopic(item, index) {
            console.log('index: ', index);
            this.setState({activeIndex: index});
            this.setOpinionArray(item.topic);
            let itemId = this.props.itemId.replace('p','').replace('g','');

            if(document.querySelector('#primaryImg'+itemId).className.indexOf('rotate') != -1) {
                document.querySelector('#primaryImg'+itemId).classList.remove('rotate');
            } else {
                document.querySelector('#primaryImg'+itemId).classList.add('rotate');
            }
            if (index == 1) {
                 document.querySelector('#primaryImg'+itemId).style.padding = '12px';
            } else if (index == 2) {
                 document.querySelector('#primaryImg'+itemId).style.padding = '21px';
            } else if (index == 0) {
                 document.querySelector('#primaryImg'+itemId).style.padding = '0px';
            }
        }
    showMore(e) {
        e.target.parentNode.classList.add('scrollable');
        e.target.style.display = 'none';
        e.target.parentNode.children[e.target.parentNode.children.length - 1].style.marginTop = '7px';
    }
    updatePrice(qty) {
        if(qty >= 1) {
            let size = this.props.reviewTopics[this.state.activeIndex].topic;
            let itemId = this.props.itemId.replace('p','').replace('g','');
            document.getElementById('price'+itemId).innerHTML = this.props.crustOptions[this.state.activeCrustIndex]["pricing"][size] * qty;
            let N = Math.round(this.props.crustOptions[this.state.activeCrustIndex]["pricing"][size] * qty * 0.85);
            document.getElementById('priceNew'+itemId).innerHTML = isValidCoupon() ? Math.ceil(N / 10) * 10 : Math.round(this.props.crustOptions[this.state.activeCrustIndex]["pricing"][size] * qty);
        }
    }
    getPrice(qty) {
        let size = this.props.reviewTopics[this.state.activeIndex].topic;
        return this.props.crustOptions[this.state.activeCrustIndex]["pricing"][size] * qty;
    }

    render() {
        let {reviewTopics, crustOptions, item, itemId, type} = this.props;
        let {activeIndex, activeCrustIndex, activeOpinions, qty} = this.state;
        let activeDefaultOpinions = [];
        console.log('reviewTopics[0]:', reviewTopics[0]);
        activeDefaultOpinions = reviewTopics[0].opinions;

        let extraClasses = '', incrementerClass = '';
        if(type == 'starters') {
            extraClasses = 'starter-height';
            incrementerClass = 'starter-bottom-inc';
        }

        return (
          <div className={`reviews-container ${extraClasses}`}>
              <div className="topic-container">
                {type != 'starters' && reviewTopics && reviewTopics.map((review, index) => {
                    return (
                        <React.Fragment>
                            <div className={activeIndex===index ? 'review-topic active': 'review-topic'} onClick={()=>{this.setActiveTopic(review, index);  this.setSizePrice(index); }}>
                                {review.topic}
                            </div>
                        </React.Fragment>
                    );
                })}
                </div>


                {type != 'starters' && <div className="topic-container" style={{height: '76px'}}>
                    <div className="card-mini-title">Select your crust:</div>
                    {crustOptions && crustOptions.map((crust, indexCrust) => {
                        return (
                            <React.Fragment>
                                <div className={activeCrustIndex===indexCrust ? 'review-topic active-crust': 'review-topic'} onClick={()=>{this.setActiveCrust(crust, indexCrust); this.setCrustPrice(indexCrust); }}>
                                    {crust.topic}
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>}

                {type == 'starters' && <div>
                    <div class="title starter-title">Freshly baked on arrival of your order</div>
                </div>}

                <div className={`incrementer sf-inc ${incrementerClass}`}>
                    <div class="card-mini-title" >Quantity:</div>
                    <div class="quantity">
                        <a className="quantity__minus"><span onClick={()=>{if(this.state.qty>0){this.setState({qty: this.state.qty - 1});}this.updatePrice(this.state.qty - 1);var event = new CustomEvent('basket-updated', { detail: {type: item.type, name: item.title, crust: crustOptions[this.state.activeCrustIndex].topic, size: reviewTopics[this.state.activeIndex].topic, qty: this.state.qty - 1, price: this.getPrice(this.state.qty - 1), itemId: itemId}});document.dispatchEvent(event);}} style={{fontSize: '25px', lineHeight: '0px', marginLeft: '2px'}}>-</span></a>
                        <input name="quantity" type="text" className="quantity__input" value={this.state.qty} />
                        <a className="quantity__plus"><span onClick={()=>{this.setState({qty: this.state.qty + 1});console.log('item:',item);var event = new CustomEvent('basket-updated', { detail: {type: item.type, name: item.title, crust: crustOptions[this.state.activeCrustIndex].topic, size: reviewTopics[this.state.activeIndex].topic, qty: this.state.qty + 1, price: this.getPrice(this.state.qty + 1), itemId: itemId}});document.dispatchEvent(event);this.updatePrice(this.state.qty + 1)}}>+</span></a>
                      </div>
                </div>
          </div>
        );
    }
}

class QuoteCard extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
    }
    appendZero(number) {
        if (number > 0 && number < 10) {
            return '0' + number;
        }
        return number;
    }

    render() {
        let {index, data} = this.props;
        let prefix = 'p';
        let extraClasses = '';
        if(this.props.type && this.props.type == 'starters') {
         prefix = 'g';
         extraClasses = 'starter';
        }
        let defaultPrice = 235;
        return (
        <div className="card-container">
            <div className="section-one" style={{display: 'block'}}>
                <br/>
                <div className="usp-desc">Toppings of guest's choice</div>
                <div className="top">
                    <div className="top-left" style={{position:'absolute',margin:'0 auto',left:'0',right:'0'}}>
                        <img id={`primaryImg${index}`} className={`primary-img rotatable sf-img ${extraClasses}`} src={`../../../img/images/${prefix}${index+1}.png`} />
                    </div>
                    <div className="top-right">
                        <div className="usp-title"></div>

                    </div>
                </div>
            </div>
            <div className="section-two">
                <div className="pricing" style={{top: '-86px'}}><label className="price"><span className="slashed" id={`price${index}`}>{defaultPrice * parseInt(sessionStorage.getItem('qty'),10)}</span><span className="rupee" style={{marginLeft: '6px'}}>₹</span><span className="orig" id={`priceNew${index}`}>{Math.ceil(defaultPrice * parseInt(sessionStorage.getItem('qty'),10) * 0.85)}</span></label></div>
                <div className="top">
                </div>
            </div>
        </div>)
    }
}

class Card extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
    }
    appendZero(number) {
        if (number > 0 && number < 10) {
            return '0' + number;
        }
        return number;
    }

    render() {
        let {index, data} = this.props;
        let prefix = 'p';
        let extraClasses = '';
        if(this.props.type && this.props.type == 'starters') {
         prefix = 'g';
         extraClasses = 'starter';
        }
        return (
        <div className="card-container">
            <div className="section-one">
                <br/>
                <div className="top">
                    <div className="top-left">
                        <img id={`primaryImg${index}`} className={`primary-img rotatable sf-img ${extraClasses}`} src={`../../../img/images/${prefix}${index+1}.png`} />
                    </div>
                    <div className="top-right">
                        <div className="usp-title"></div>
                        <div className="usp-desc">{data.usp[0]}</div>
                    </div>
                </div>
            </div>
            <div className="title">{data.title}</div>
            <hr className="line"/>
            <div className="section-two">
                <div className="pricing"><label className="price"><span className="slashed" id={`price${index}`}>{data.qna[0].defaultPrice}</span><span className="rupee" style={{marginLeft: '6px'}}>₹</span><span className="orig" id={`priceNew${index}`}>{isValidCoupon() ? Math.ceil(Math.round(data.qna[0].defaultPrice*0.85) / 10) * 10 : data.qna[0].defaultPrice}</span></label></div>
                <div className="top">
                    <ReviewContainer reviewTopics={data.qna[0].responses} crustOptions={data.qna[0].crust} itemId={`${prefix}${index}`} item={data} type={this.props.type} />
                </div>
            </div>
        </div>)
    }
}

class SummaryCard extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
    }
    appendZero(number) {
        if (number > 0 && number < 10) {
            return '0' + number;
        }
        return number;
    }

    render() {
        let {index, data, summaryId} = this.props;
        let prefix = 'p';
        if(data.type && data.type == 'starter') {
            prefix = 'g';
        }
        return (
        <div className="card-container small" style={{padding: '0px 12px 0px 12px'}}>
            <div className="section-one">
                <div className="top">
                    <div className="top-left">
                            <img id={`primaryImg${index}`} className="primary-img rotatable" src={`../../../img/images/${prefix}${summaryId}.png`} style={{width: '72px',paddingTop: '0px'}} />
                    </div>
                    <div className="top-right">
                        <div className="usp-title"><div className="title" style={{marginTop: '10px'}}>{data.name}</div></div>
                        {data.type == 'starter' ? <div className="usp-desc">{data.qty} single starter(s)</div> : <div className="usp-desc">{data.qty} {data.size} pizza(s)</div>}
                    </div>
                </div>
            </div>

            <div className="section-two small">
                <div className="pricing"><label className="price"><span className="slashed" id={`price${index}`}>{data.price}</span><span className="rupee" style={{marginLeft: '6px'}}>₹</span><span className="orig" id={`priceNew${index}`}>{isValidCoupon() ? Math.ceil(Math.round(data.price*0.85) / 10) * 10 : Math.ceil(Math.round(data.price) / 10) * 10}</span></label></div>
                <div className="top">
                </div>
            </div>
        </div>)
    }
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
            franchises: [],
            status: window.location.href.indexOf('?status=success') >= 0 ? 'success' :'default',
            pizzaQty: 0,
            wrapsQty: 0,
            breadQty: 0,
            takeAwayQty: 0,
        };
        window.currSlotSelected = '';
        this.handleTabChange = this.handleTabChange.bind(this);
    }
    getLocation() {
        var msg; 
        if(window.location.href.indexOf('status=success')>=0) {
            return;
        }
      
        /** 
        first, test for feature support
        **/
        if('geolocation' in navigator){
          // geolocation is supported :)
          requestLocation();
        }else{
          // no geolocation :(
          msg = "Sorry, looks like your browser doesn't support geolocation";
          outputResult(msg); // output error message
          $('.pure-button').removeClass('pure-button-primary').addClass('pure-button-success'); // change button style
        }
      
        /*** 
        requestLocation() returns a message, either the users coordinates, or an error message
        **/
        function requestLocation(){
          /**
          getCurrentPosition() below accepts 3 arguments:
          a success callback (required), an error callback  (optional), and a set of options (optional)
          **/
        
          var options = {
            // enableHighAccuracy = should the device take extra time or power to return a really accurate result, or should it give you the quick (but less accurate) answer?
            enableHighAccuracy: false,
            // timeout = how long does the device have, in milliseconds to return a result?
            timeout: 5000,
            // maximumAge = maximum age for a possible previously-cached position. 0 = must return the current position, not a prior cached position
            maximumAge: 0
          };
        
          navigator.geolocation.getCurrentPosition(success, error, options); 
        
          // upon success, do this
          function success(pos){
            // get longitude and latitude from the position object passed in
            var lng = pos.coords.longitude;
            var lat = pos.coords.latitude;
            window.storeLat = lat;
            window.storeLong = lng;
            msg = 'You appear to be at longitude: ' + lng + ' and latitude ' + lat;
            outputResult(msg); // output message
          }
        
          function error(err){
            msg = 'Error: ' + err + ' :(';
            outputResult(msg);
          }  
        } // end requestLocation();
      
        function outputResult(msg){
            var lat = window.storeLat;
            var long = window.storeLong;
            //Make axios GET call passing lat & long
        }
      } // end getLocation()
    getFranchises() {
        axios.get('/franchises')
          .then(function (response) {
            this.setState({franchises: response.data});
          }.bind(this));
    }
    componentDidMount() {
        var winHeight = window.innerHeight;
        this.getLocation();
        this.getFranchises();
    }
    handleTabChange(event, newValue) {
        console.log('neValue: ', newValue);
        this.setState({value: newValue});
    }
    createStoreOrder() {
        var hasReviewed = document.getElementById('hasReviewed').checked;
        var clubCode = document.getElementById('clubCode').value.toUpperCase();
        var pizzaQty = this.state.pizzaQty;
        var wrapsQty = this.state.wrapsQty;
        var breadQty = this.state.breadQty;
        var takeAwayQty = this.state.takeAwayQty;
        var storeLat = window.storeLat;
        var storeLong = window.storeLong;

        let franchiseId = -1;
        if (sessionStorage.getItem('user-profile') != null) {
            franchiseId = JSON.parse(sessionStorage.getItem('user-profile'))[0].id;
        }

        //create store
        var http = new XMLHttpRequest();
        var url = '/createStoreOrder';
        var params = 'hasReviewed='+hasReviewed+'&clubCode='+clubCode+'&pizzaQty='+pizzaQty;
        params += '&wrapsQty='+wrapsQty+'&breadQty='+breadQty+'&takeAwayQty='+takeAwayQty;
        params += '&storeLat='+storeLat+'&storeLong='+storeLong+'&franchiseId='+franchiseId;
        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
                console.log('confirmed order creation post response:', http.responseText);
                var res = http.responseText;
                if(res.indexOf('error-not-in-vicinity') >= 0) {
                    alert('There was an issue processing your order. Please contact the franchisor.');
                } else if(res.indexOf('error') >= 0){
                    alert('Sorry! Unable to process to your order.');
                } else if(res != null){
                    res = JSON.parse(res);
                    sessionStorage.setItem('orderId', res.orderId);
                    sessionStorage.setItem('storeIdFromOrder', res.storeId);
                    window.location.href='/dashboard-pay-store-order?id='+res.orderId+'&p='+res.price;
                }
            }
        }.bind(this);
        http.send(params);
    }

    render() {
        const {franchises, status, orderTitle, dateTime, booking, customer, toppings, extras, location, mapUrl, comments, showLoader, results, starters, orderSummary, showCoupon, showSlot, showList, showWizard, numVistors, curStep, redirect} = this.state;

        return (<div style={{marginTop: '84px'}}>
                    <img id="logo" className="logo-img" src="../img/logo_sc.png" style={{width: '142px'}} onClick={()=>{window.location.href='/dashboard';}} />
                    {status == 'success' && <span className="stage-heading status-success">Store created successfully</span>}
                    <Paper>

                                              <TabPanel value={this.state.value} index={0}>
                                                   <span className="stage-heading" style={{top: '12px'}}><StoreIcon />&nbsp;&nbsp;Create Store Order</span>
                                                   <hr className="line-light" style={{visibility: 'hidden'}}/>
                                                   <span className="stage-desc" >Pizzas: 
                                                        <div class="quantity" style={{marginTop: '-35px'}}>
                                                            <a className="quantity__minus"><span onClick={()=>{if(this.state.pizzaQty>0){this.setState({pizzaQty: this.state.pizzaQty - 1});}}} style={{fontSize: '25px', lineHeight: '0px', marginLeft: '2px'}}>-</span></a>
                                                            <input name="quantity" type="text" className="quantity__input" value={this.state.pizzaQty} />
                                                            <a className="quantity__plus"><span onClick={()=>{this.setState({pizzaQty: this.state.pizzaQty + 1});}}>+</span></a>
                                                        </div>
                                                   </span>
                                                   <hr className="line-light" style={{marginTop: '18px'}}/>
                                                   <span className="stage-desc" >Wraps: 
                                                        <div class="quantity" style={{marginTop: '-35px'}}>
                                                            <a className="quantity__minus"><span onClick={()=>{if(this.state.wrapsQty>0){this.setState({wrapsQty: this.state.wrapsQty - 1});}}} style={{fontSize: '25px', lineHeight: '0px', marginLeft: '2px'}}>-</span></a>
                                                            <input name="quantity" type="text" className="quantity__input" value={this.state.wrapsQty} />
                                                            <a className="quantity__plus"><span onClick={()=>{this.setState({wrapsQty: this.state.wrapsQty + 1});}}>+</span></a>
                                                        </div>
                                                   </span>
                                                   <hr className="line-light" style={{marginTop: '18px'}}/>
                                                   <span className="stage-desc" >Garlic Bread: 
                                                        <div class="quantity" style={{marginTop: '-35px'}}>
                                                            <a className="quantity__minus"><span onClick={()=>{if(this.state.breadQty>0){this.setState({breadQty: this.state.breadQty - 1});}}} style={{fontSize: '25px', lineHeight: '0px', marginLeft: '2px'}}>-</span></a>
                                                            <input name="quantity" type="text" className="quantity__input" value={this.state.breadQty} />
                                                            <a className="quantity__plus"><span onClick={()=>{this.setState({breadQty: this.state.breadQty + 1});}}>+</span></a>
                                                        </div>
                                                   </span>
                                                   <hr className="line-light" style={{marginTop: '18px'}}/>
                                                   <span className="stage-desc" >Take away: 
                                                        <div class="quantity" style={{marginTop: '-35px'}}>
                                                            <a className="quantity__minus"><span onClick={()=>{if(this.state.takeAwayQty>0){this.setState({takeAwayQty: this.state.takeAwayQty - 1});}}} style={{fontSize: '25px', lineHeight: '0px', marginLeft: '2px'}}>-</span></a>
                                                            <input name="quantity" type="text" className="quantity__input" value={this.state.takeAwayQty} />
                                                            <a className="quantity__plus"><span onClick={()=>{this.setState({takeAwayQty: this.state.takeAwayQty + 1});}}>+</span></a>
                                                        </div>
                                                   </span>
                                                   <hr className="line-light" style={{marginTop: '18px'}}/>
                                                   <span className="stage-desc" >Club code: 
                                                        <input id="clubCode" type="text" className="txt-field right" style={{left: '143px',textTransform: 'uppercase'}}/>
                                                   </span>
                                                   <hr className="line-light" style={{marginTop: '18px'}}/>
                                                   <span className="stage-desc" >Reviewed: 
                                                        <input id="hasReviewed" type="checkbox" className="txt-field right" style={{left: '143px', width: '30px'}}/>
                                                   </span>
                                                   

                                                   <br/><br/><br/><br/>
                                                   <a className="button" onClick={()=>{this.createStoreOrder();}} style={{position:'fixed', bottom: '12px'}}>Create Order →</a>
                                                   <br/><br/><br/><br/>

                                              </TabPanel>
                                              <TabPanel value={this.state.value} index={1}>



                                              </TabPanel>
                                            </Paper>
                </div>)
    }
}

export default withRouter(Dashboard);