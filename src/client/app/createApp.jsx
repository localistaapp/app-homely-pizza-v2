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
var crypto = require('crypto');
import GoogleOneTapLogin from 'react-google-one-tap-login';
import Dialog from "@material-ui/core/Dialog";

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

class ReviewContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {activeIndex: 0, activeOptions: [], activeCrustIndex: 0, qty: 0};
        this.setActiveTopic = this.setActiveTopic.bind(this);
    }
    componentDidMount() {
        const dialog = document.querySelector("#dialog");
        const openDialogButton = document.querySelector("#openDialog");
        openDialogButton != null && openDialogButton.addEventListener("click", () => dialog.showModal());
        dialog != null && dialog.addEventListener('close', () => console.log(dialog.returnValue ));

        window.addEventListener("scroll",function () {
            if(window.scrollY <= 120) {
                document.querySelector("#checkoutHeader").style.top = "0px";
            } else {
                document.querySelector("#checkoutHeader").style.top = (window.scrollY-2)+"px";
            }
        });

        document.addEventListener('basket-updated', function(e) {
            console.log('basket-updated event', e.detail);
            var currBasketData = localStorage.getItem("basket");
            var basketData;
            if(currBasketData == null) {
                 basketData = new Object();
            } else {
                basketData = JSON.parse(currBasketData);
            }
            if(e.detail != null) {
                console.log('e.detail.itemId: ', e.detail.itemId);
                console.log('e.detail.qty: ', e.detail.qty);
                if (e.detail.qty <=0 && basketData[e.detail.itemId] != null) {
                    delete basketData[e.detail.itemId];
                    document.getElementById('checkoutCount').innerHTML = Object.keys(basketData).length;
                    if (Object.keys(basketData).length == 0) {
                        document.getElementById('checkoutHeader').style.display = 'none';
                    }
                } else {
                    if (e.detail.qty > 0) {
                        basketData[e.detail.itemId] = e.detail;
                    }
                }
            }

            if(Object.keys(basketData).length >= 1) {
                document.getElementById('checkoutHeader').style.display = 'inline';
                document.getElementById('checkoutCount').innerHTML = Object.keys(basketData).length;
            }
            var basketStr = JSON.stringify(basketData);
            localStorage.setItem("basket",basketStr)
        });

        if (location.href.indexOf('/redirect') >= 0) {
            this.setState({redirect: true});
        }
        const label = document.querySelector('.dropdown__filter-selected')
        const options = Array.from(document.querySelectorAll('.dropdown__select-option'))

        options.forEach((option) => {
        	option.addEventListener('click', () => {
        		label.textContent = option.textContent
        	})
        })
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
    renderPizzaSize(sizeText) {
        if(sizeText == 'Large') {
            return 'Large 10"';
        } else if(sizeText == 'Medium') {
            return 'Medium 8"';
        } else if(sizeText == 'Small') {
            return 'Small 6"';
        }
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
                            {this.renderPizzaSize(review.topic)}
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
        if (data.qty == 0) {
            return null;
        } else {
            return (
            <div className="card-container small" style={{padding: '0px 12px 0px 12px', height: '163px'}}>
                <div className="section-one">
                    <div className="top">
                        <div className="top-left-mini">
                                <img id={`primaryImg${index}`} className="primary-img rotatable" src={`../../../img/images/${prefix}${summaryId}.png`} style={{width: '72px',paddingTop: '0px'}} />
                        </div>
                        <div className="top-right-mini">
                            <div className="usp-title"><div className="title" style={{marginTop: '-10px'}}>{data.name}</div></div>
                            {data.type == 'starter' ? <div className="usp-desc" style={{color:'#656565', marginTop: '48px'}}>{data.qty} single starter(s)</div> : <div className="usp-desc" style={{color:'#656565', marginTop: '48px'}}>{data.qty} {data.size} pizza(s)</div>}
                        </div>
                    </div>
                </div>

                <div className="section-two small">
                    <div className="pricing"><label className="price"><span className="slashed" id={`price${index}`}>{data.price}</span><span className="rupee" style={{marginLeft: '6px'}}>₹</span><span className="orig" id={`priceNew${index}`}>{isValidCoupon() ? Math.ceil(Math.round(data.price*0.85) / 10) * 10 : Math.ceil(Math.round(data.price) / 10) * 10}</span></label></div>
                    <div className="top">
                    </div>
                </div>
        </div>);
        }
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
            showList: '',
            showWizard: '',
            numVistors: 0,
            mobileNum: '',
            curStep: 0,
            redirect: false,
            status: window.location.href.indexOf('?status=success') >= 0 ? 'success' :'default',
            payStatus: window.location.href.indexOf('?apppay=success') >= 0 ? 'success' :'default',
            clubUserSrc: '',
            orderSavings: 0,
            qty: 0,
            storeAcceptingOrders: false,
            showDeliveryOptions: false,
            deliveryNotSupported: false,
            onlineOrdersTimings: {},
            currDayTimings: [],
            showOrderConfirmationMsg: false,
            loggedIn: true,
            trackingLink: '',
            orderCompleted: false
        };
        window.weekdays = new Array(7);
        window.weekdays[0] = "Sunday";
        window.weekdays[1] = "Monday";
        window.weekdays[2] = "Tuesday";
        window.weekdays[3] = "Wednesday";
        window.weekdays[4] = "Thursday";
        window.weekdays[5] = "Friday";
        window.weekdays[6] = "Saturday";
        this.fetchJson();
        window.currSlotSelected = '';
        this.handleTabChange = this.handleTabChange.bind(this);
        this.checkDeliveryOptions = this.checkDeliveryOptions.bind(this);
        this.checkOrderStatusNow = this.checkOrderStatusNow.bind(this);
        this.checkOrderStatus = this.checkOrderStatus.bind(this);
        this.isOlderThanNinetyMinutes = this.isOlderThanNinetyMinutes.bind(this);
    }
    componentDidMount() {
        var winHeight = window.innerHeight;
        if(window.pushalertbyiw ) {
            (pushalertbyiw = window.pushalertbyiw || []).push(['onReady', this.onPAReady.bind(this)]);
        }
        var signedInUser = false;
        //if (location.href.indexOf('?track=true') != -1 || location.href.indexOf('?apppay=') != -1) {
            axios.get(`/store/web-order/${localStorage.getItem('onlineOrderId')}`)
                .then(function (response) {
                    console.log('tracking data-----', response.data);
                    this.setState({trackingLink: response.data.tracking_link, payStatus: response.data.status});
                }.bind(this));
        //}
        if (window.location.href.indexOf('?apppay=success') != -1) {
            
            axios.post(`/store/update-web-order/`, {onlineOrderId: localStorage.getItem('onlineOrderId'), status: 'PAYMENT_SUCCESS'}).then((response) => {
                console.log(response.status);
                });
                this.setState({payStatus: 'PAYMENT_SUCCESS'});

        } else if (window.location.href.indexOf('?apppay=failure') != -1) {
            axios.post(`/store/update-web-order/`, {onlineOrderId: localStorage.getItem('onlineOrderId'), status: 'PAYMENT_FAILED'}).then((response) => {
                console.log(response.status);
                });
            this.setState({payStatus: 'PAYMENT_FAILED'});
        }
        /*if(localStorage.getItem('clubCode') != null) {
            axios.get(`/user/get/${localStorage.getItem('clubCode')}`)
          .then(function (response) {
            console.log('user signed up-----', response.data);
            signedInUser = response.data;
            if(localStorage.getItem('notification-dialog')!=null && localStorage.getItem('notification-dialog')=='true' && !signedInUser) {
                this.setState({curStep: 1});
            } else {
                this.setState({curStep: 3});
            }
          }.bind(this));
        } else {
            if(localStorage.getItem('notification-dialog')!=null && localStorage.getItem('notification-dialog')=='true' && !signedInUser) {
                this.setState({curStep: 1});
            } 
        } */

        this.login();
        
    }
    handleTabChange(event, newValue) {
        console.log('neValue: ', newValue);
        this.setState({value: newValue});
    }
    showNotificationDialog() {
        if(localStorage.getItem('notification-dialog') == null) {
            localStorage.setItem('notification-dialog', 'true');
            setTimeout(()=>{location.reload();},1000);
        }
    }
    onPAReady() {
        console.log('notification sub data: ', PushAlertCo.getSubsInfo()); //You can call this method to get the subscription status of the subscriber
        //set localStorage.getItem('notification-dialog','false') after subscrbed
        //this.setState({curStep: 2});
        if (PushAlertCo.getSubsInfo().status == "subscribed" && localStorage.getItem('onboarded')!=null && localStorage.getItem('onboarded')=='true') {
            localStorage.getItem('notification-dialog','false');
            this.setState({curStep: 3});
            this.fetchJson();
        }
    }
    loadSurvey() {
        (function (w,d,s,o,f,js,fjs) {
            if(d.getElementById(o)) return;
            js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];
            js.id = o; js.src = f; js.async = 1; fjs.parentNode.insertBefore(js, fjs);
          }(window, document, 'script', 'trustmary-embed', 'https://embed.trustmary.com/embed.js'));
    }
    changeStep(stepNum) {
        if (stepNum == 2){
            var http = new XMLHttpRequest();
            var url = '/signUpClubUser';
            var params = 'email='+localStorage.getItem('club-user-email');
            http.open('POST', url, true);
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            http.onreadystatechange = function() {//Call a function when the state changes.
                if(http.readyState == 4 && http.status == 200) {
                }
            }.bind(this);
            http.send(params);
        }
        this.setState({curStep: stepNum});
    }
    fetchJson() {
        let task = 'interior';
        let loc = 'blr';
        let zone = 'east';

        axios.get(`/data/${task}/${loc}/${zone}`)
          .then(function (response) {
            console.log('response data-----', response.data);
            this.setState({results: response.data.results});
          }.bind(this));
        axios.get(`/data/${task}/${loc}/${zone}/starter`)
                  .then(function (response) {
                    this.setState({starters: response.data.results});
                  }.bind(this));
        //if (localStorage.getItem('club-user-email') != null) {
            this.isStoreAcceptingOrders();
        //}
        
    }
    getTotal() {
        let orderSummary = this.state.orderSummary;
        let total = 0;
        let discounted = 1;
        
        if(isValidCoupon()) {
            discounted = 0.85;
        }
        orderSummary && Object.keys(orderSummary).map((index) => {
            if(typeof index !== 'undefined') {
                //total += orderSummary[index].price;
                total += Math.ceil(Math.round(orderSummary[index].price*discounted) / 10) * 10
            }
        });

        total = total + (0.04*total) + 75;
        if(!this.state.couponApplied) {
            localStorage.setItem('dPrice', Math.round(total));
        }
        return Math.round(total);
    }
    applyCoupon() {
        let curPrice = document.getElementById('price').innerHTML;
        let couponCode = document.getElementById('dCoupon').value;
        if(!this.state.couponApplied && couponCode != '' && couponCode.toUpperCase() == 'SLICE20') {
            curPrice = parseInt(curPrice,10);
            let revPrice = curPrice - curPrice * .2;;
            revPrice = Math.round(revPrice);
            document.getElementById('price').innerHTML = revPrice;
            localStorage.setItem('dPrice', revPrice);
            this.setState({couponApplied: true});
        }
    }
    selectSlot() {
        var e = document.getElementById("slots");
        var slot = e.options[e.selectedIndex].value;
        window.currSlotSelected = slot;
    }
    captureSchedule() {
        let pincode = document.getElementById('dPincode').value;
        let deliverySchedule = 'unknown';
        let deliveryTimeSlot = 'unknown';
        if (document.getElementById('deliverNow').checked) {
            deliverySchedule = 'now';
        } else if (document.getElementById('deliverSchedule').checked) {
            deliverySchedule = 'later';
            deliveryTimeSlot = document.getElementById('slot').options[document.getElementById('slot').selectedIndex].value;
        }
        sessionStorage.setItem('delivery-pincode',pincode);
        sessionStorage.setItem('delivery-schedule',deliverySchedule);
        sessionStorage.setItem('delivery-timeslot',deliveryTimeSlot);
        this.setState({activeStep: 3, showSlot: true});
    }

     async initiatePayment (amount, customerDetails) {
        try {
            const response = await fetch('https://www.slimcrust.com/api/my-initiate-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount,
                    customerDetails
                })
            });
    
            const result = await response.json();
            
            if (result.success) {
                // Redirect to PhonePe payment page
                window.location.href = result.data.instrumentResponse.redirectInfo.url;
            } else {
                throw new Error(result.message || 'Transaction failed');
            }
            
            return result;
        } catch (error) {
            console.error('Payment initiation failed:', error);
            throw error;
        }
    };
    
    
    startPayment(name, mobile, price) {
        const customerDetails = {
            userId: name,
            mobileNumber: mobile
        };
        
        this.initiatePayment(10, customerDetails) // Amount in rupees
            .then(response => {
                console.log('Transaction initiated:', response);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };
    captureAddress() {
        let deliveryPincode = sessionStorage.getItem('delivery-pincode');
        let deliverySchedule = sessionStorage.getItem('delivery-schedule');
        let deliveryTimeslot = sessionStorage.getItem('delivery-timeslot');
        let deliveryAddress = document.getElementById('dAddress').value;
        let deliveryMobile = document.getElementById('dMobile').value;
        let deliveryName = document.getElementById('dName').value;
        let storeId = localStorage.getItem('storeId');
        let clubCode = localStorage.getItem('clubCode');
        
        sessionStorage.setItem('dAddress',deliveryAddress);
        sessionStorage.setItem('dMobile',deliveryMobile);
        sessionStorage.setItem('dName',deliveryName);
        let price = localStorage.getItem('dPrice');
        let summary = localStorage.getItem('basket');

        this.setState({showOrderConfirmationMsg: true});
        document.getElementById('checkoutBtnStep11').style.display = 'none';
        document.getElementById('checkoutBtnStep12').style.display='block';

        summary = summary != null ? summary : '';

        var inputVal = window.confirm("You will be notified to make payment once the order is dispatched.");
        if (inputVal) {
            //show the confirmation with food is being prepared screen
        }

        //create order
        var http = new XMLHttpRequest();
        var url = '/store/web-order';
        var params = 'storeId='+storeId+'&clubCode='+clubCode+'&price='+price+'&mobile='+deliveryMobile+'&name='+deliveryName+'&slot='+deliveryTimeslot+'&items='+summary+'&pincode='+deliveryPincode+'&schedule='+deliverySchedule+'&address='+deliveryAddress;
        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        document.getElementById('step3Circle').classList.add('active');this.setState({showSlot: true, activeStep: 3});
        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
                console.log('order creation post response:', http.responseText);
                var res = http.responseText;
                if(res.indexOf('error')>=0) {
                    alert('There was an error creating your order! Please try again.');
                } else {
                    if(res != null) {
                        console.log('---order created---', res);
                        var onlineOrderId = JSON.parse(res).onlineOrderId;
                        var onlineOrderName = JSON.parse(res).onlineOrderName;
                        var onlineOrderMobile = JSON.parse(res).onlineOrderMobile;
                        var onlineOrderPrice = JSON.parse(res).onlineOrderPrice;
                        localStorage.setItem('onlineOrderId', onlineOrderId);
                        localStorage.setItem('onlineOrderName', onlineOrderName);
                        localStorage.setItem('onlineOrderMobile', onlineOrderMobile);
                        localStorage.setItem('onlineOrderPrice', onlineOrderPrice);
                        localStorage.setItem('order-created', 'true');
                    }
                }
                
            }
        }.bind(this);
        http.send(params);
    }
    payOrderNow() {
        let oName = localStorage.getItem('onlineOrderName');
        let oMobile = localStorage.getItem('onlineOrderMobile');
        let oPrice = localStorage.getItem('onlineOrderPrice');
        this.startPayment(oName,oMobile,oPrice);
    }
    makePaymentRequest() {
        //uncomment
        //return;
        var http = new XMLHttpRequest();
        var url = '/paymentRequest';
        var orderId = 0;
        orderId = localStorage.getItem('orderId') != null ? localStorage.getItem('orderId') : orderId;

        var params = 'amount='+localStorage.getItem('dPrice')+'&phone='+localStorage.getItem('dMobile')+'&name='+localStorage.getItem('dName')+'&orderId='+orderId+'&slot='+sessionStorage.getItem('deliverySlot');
        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
                console.log('post response:', http.responseText);
                var res = http.responseText;
                res = JSON.parse(res);
                localStorage.setItem('paymentLink',res.payment_request.longurl);
                localStorage.setItem('paymentRequestId', res.payment_request.id);

                location.href = res.payment_request.longurl;
            }
        }
        http.send(params);
    }
    zeroPrefix(min) {
        return min < 10 ? '0'+min : min;
    }
    getDeliveryTime() {
        var newDateObj = new Date(new Date().getTime() + 90*60000);
        var lastDateObj = new Date(new Date().getTime() + 120*60000);
        var startHours = newDateObj.getHours() > 12 ? newDateObj.getHours() % 12 : newDateObj.getHours();
        var endHours = lastDateObj.getHours() > 12 ? lastDateObj.getHours() % 12 : lastDateObj.getHours();
        var ampmstart = newDateObj.getHours() >= 12 ? 'PM' : 'AM';
        var ampmend = lastDateObj.getHours() >= 12 ? 'PM' : 'AM';
        return startHours+":"+this.zeroPrefix(newDateObj.getMinutes() < 50 ? Math.ceil(newDateObj.getMinutes() / 10) * 10 : 50)+ampmstart+" and "+endHours+":"+this.zeroPrefix(lastDateObj.getMinutes() < 50 ? Math.ceil(lastDateObj.getMinutes() / 10) * 10 : 50)+ampmend;
    }
    setCOD() {
        var http = new XMLHttpRequest();
                var url = '/setCOD';
                var orderId = 0;
                orderId = localStorage.getItem('orderId') != null ? localStorage.getItem('orderId') : orderId;
                var params = 'orderId='+orderId;
                http.open('POST', url, true);
                http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

                http.onreadystatechange = function() {//Call a function when the state changes.
                    if(http.readyState == 4 && http.status == 200) {
                        console.log('post response:', http.responseText);
                        var res = http.responseText;
                        location.href = '/redirect/?payment_id=MOJO0629U05N96486745&payment_status=Credit&payment_request_id=388ed5d05e75428f9dc74327df7aa314';
                    }
                }
                http.send(params);
    }
    getQuoteString(numVistors) {
                return <div className="quote-txt" style={{marginTop: '22px'}}>Quote for {numVistors} large pizzas:</div>
            }
    saveEvent() {
        if (sessionStorage.getItem('mobileNum') == null || sessionStorage.getItem('mobileNum') == "") {
            alert("Mobile number is mandatory for an instant quote.");
            return;
        }
        //create order
        var http = new XMLHttpRequest();
        var url = '/eventOrder';
        var params = 'eDate='+sessionStorage.getItem('eventDate')+'&ePincode='+sessionStorage.getItem('venuePinCode')+'&eMobile='+sessionStorage.getItem('mobileNum');
        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
                console.log('event order creation post response:', http.responseText);
                var res = http.responseText;
                if(res != null){
                    res = JSON.parse(res);
                    console.log('--event order id--', res);
                    sessionStorage.setItem('eventOrderId', res.orderId);
                }
            }
        }.bind(this);
        http.send(params);
        this.setState({curStep:2});
        gtag('event', 'entered_event_details', {'eDate': sessionStorage.getItem('eventDate')});
    }
    updateQuantity(eventQty) {
            //create order
            var http = new XMLHttpRequest();
            var url = '/updateEventOrder';
            var defaultPrice = 235;
            var eventQuote = Math.ceil(defaultPrice * parseInt(sessionStorage.getItem('qty'),10) * 0.85);
            var params = 'eventOrderId='+sessionStorage.getItem('eventOrderId')+'&eventQuantity='+eventQty+'&eventQuote='+eventQuote;
            http.open('POST', url, true);
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            http.onreadystatechange = function() {//Call a function when the state changes.
                if(http.readyState == 4 && http.status == 200) {
                    console.log('event order update post response:', http.responseText);
                    var res = http.responseText;
                }
            }.bind(this);
            http.send(params);
            gtag('event', 'entered_num_guests', {'eDate': eventQty});
        }
        makeid() {
            let result = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;
            let counter = 0;
            while (counter < 30) {
              result += characters.charAt(Math.floor(Math.random() * charactersLength));
              counter += 1;
            }
            return result;
        }
    login(user) {
        /*user = {
            randomFingerPrint: "323b0e12-4f15-47fa-b9f6-c498b1c74801"
        }*/
        var randomFingerPrint = '';
        var name = '';
        var picture = '';
        if (localStorage.getItem('app-fp') != null) {
            randomFingerPrint = localStorage.getItem('app-fp');
            name = localStorage.getItem('club-user-name');
            picture = localStorage.getItem('club-user-pic');
            this.setState({loggedIn: true});
            this.setState({clubUserSrc: picture});
            if (localStorage.getItem('notification-dialog') == 'false' && localStorage.getItem('onboarded')!=null && localStorage.getItem('onboarded')=='true') {
                this.setState({curStep: 3});
                this.fetchJson();
            } else {
                this.setState({curStep: 1});
            }
            
            this.setState({curStep: 3});
            return;
        } else {
            if (user) {
                randomFingerPrint = user.randomFingerPrint;
                this.setState({clubUserSrc: ''});
            }
        }
        
        //create order
        var http = new XMLHttpRequest();
        var url = '/createAppUser';
        var randomFingerPrint = localStorage.getItem('fp');
        if (randomFingerPrint == null) {
            randomFingerPrint = this.makeid();
        }
        var params = 'fingerprint='+randomFingerPrint;
        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
                console.log('confirmed order creation post response:', http.responseText);
                var res = http.responseText;
                if(res != null){
                    res = JSON.parse(res);
                    console.log('--res--', res);
                    if(res.registered != null && res.registered == 'true' && localStorage.getItem('onboarded')!=null && localStorage.getItem('onboarded')=='true') {
                        this.setState({curStep: 3});
                        this.fetchJson();
                    }
                    localStorage.setItem('clubCode', res.code);
                    localStorage.setItem('app-fp',randomFingerPrint);
                    this.setState({loggedIn: true, curStep: 3});
                    this.showNotificationDialog();
                }
            }
        }.bind(this);
        http.send(params);
    }
    getCurrentTimeInFormat() {
        const now = new Date();
        let hours = now.getHours();
        const isPM = hours >= 12;
        if (hours > 12) {
            hours -= 12;
        } else if (hours === 0) {
            hours = 12;
        }
        const period = isPM ? "pm" : "am";
        return hours;
    }
    isStoreAcceptingOrders() {
        axios.get(`/store/get-all`)
          .then(function (response) {
            console.log('storeAcceptingOrders-----', response.data);
            this.setState({onlineOrdersTimings:response.data[0].online_orders_timings, storeAcceptingOrders: response.data[0].accepting_online_orders == 'Y' ? true: false, onlineOrdersPinCodes: response.data[0].online_orders_pincodes});
          }.bind(this));
        return true;
    }
    isOlderThanNinetyMinutes() {
        const savedDate = localStorage.getItem('onlineOrderCreationTime');
        if (!savedDate) return true;  // If no date saved, consider it as old
        
        const now = new Date();
        const timestamp = new Date(savedDate);
        //let duration = 90;
        let duration = 3;//use above for prod
        const ninetyMinutesInMs = duration * 60 * 1000;
        
        return (now - timestamp) > ninetyMinutesInMs;
    }
    checkOrderStatusNow() {
        if (this.isOlderThanNinetyMinutes()) {
            this.setState({orderCompleted: true});
        }
        axios.get(`/store/web-order/${localStorage.getItem('onlineOrderId')}`)
                .then((response) => {
                    console.log('tracking data1-----', response.data);
                    if (response.data.tracking_link !=null && response.data.tracking_link != '' && response.data.tracking_link != 'null' && response.data.status == 'PENDING') {
                        this.setState({trackingLink: response.data.tracking_link});
                        localStorage.setItem('onlineOrderId', response.data.onlineOrderId);
                        localStorage.setItem('onlineOrderName', response.data.onlineOrderName);
                        localStorage.setItem('onlineOrderMobile', response.data.onlineOrderMobile);
                        localStorage.setItem('onlineOrderPrice', response.data.onlineOrderPrice);
                        localStorage.setItem('onlineOrderStatus', response.data.status);
                        localStorage.setItem('onlineOrderCreationTime', new Date().toISOString());
                        localStorage.setItem('order-created', 'true');
                    } else if (response.data.status == 'COMPLETE') {
                        localStorage.removeItem('onlineOrderId');
                        localStorage.removeItem('onlineOrderName');
                        localStorage.removeItem('onlineOrderMobile');
                        localStorage.removeItem('onlineOrderPrice');
                        localStorage.removeItem('onlineOrderStatus');
                        localStorage.removeItem('order-created');
                    } else if (response.data.status == 'PAYMENT_SUCCESS') {
                    } 
                });
        return true;
    }
    checkOrderStatus() {
        window.checkOStatus = setInterval(()=> {
            if (this.isOlderThanNinetyMinutes()) {
                this.setState({orderCompleted: true});
            }
            if (localStorage.getItem('order-created') != null && localStorage.getItem('order-created') == 'true' && this.state.trackingLink != '' && this.state.trackingLink != 'null' || localStorage.getItem('onlineOrderId') == null) {
                return;
            }
            axios.get(`/store/web-order/${localStorage.getItem('onlineOrderId')}`)
                .then((response) => {
                    console.log('tracking data1-----', response.data);
                    if (response.data.tracking_link !=null && response.data.tracking_link != '' && response.data.tracking_link != 'null' && response.data.status == 'PENDING') {
                        this.setState({trackingLink: response.data.tracking_link});
                        localStorage.setItem('onlineOrderId', response.data.onlineOrderId);
                        localStorage.setItem('onlineOrderName', response.data.onlineOrderName);
                        localStorage.setItem('onlineOrderMobile', response.data.onlineOrderMobile);
                        localStorage.setItem('onlineOrderPrice', response.data.onlineOrderPrice);
                        localStorage.setItem('onlineOrderStatus', response.data.status);
                        localStorage.setItem('order-created', 'true');
                    } else if (response.data.status == 'COMPLETE') {
                        localStorage.removeItem('onlineOrderId');
                        localStorage.removeItem('onlineOrderName');
                        localStorage.removeItem('onlineOrderMobile');
                        localStorage.removeItem('onlineOrderPrice');
                        localStorage.removeItem('onlineOrderStatus');
                        localStorage.removeItem('order-created');
                    } else if (response.data.status == 'PAYMENT_SUCCESS') {
                    } 
                })}, 10000);
        return true;
    }
    onboardClubUser() {
        var http = new XMLHttpRequest();
        var url = '/onboardClubUser';
        var params = 'email='+localStorage.getItem('club-user-email');
        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
                console.log('confirmed order creation post response:', http.responseText);
                var res = http.responseText;
                if(res != null){
                    res = JSON.parse(res);
                    if(res.registered != null && res.registered == 'true') {
                        localStorage.setItem('onboarded', 'true');
                        window.userOrdersInterval = setInterval(function(){axios.get(`/user-orders/${localStorage.getItem('club-user-email')}`)
                              .then(function (response) {
                                console.log('User orders-----', response.data);
                                if(response.data != 'error') {
                                    var userOrders = JSON.stringify(response.data);
                                    console.log('--user orders--', userOrders);
                                    if(response.data.length == 1) {
                                        clearInterval(window.userOrdersInterval);
                                        this.setState({orderSavings: response.data[0].total_price - response.data[0].discounted_price});
                                        //alert(response.data[0].total_price - response.data[0].discounted_price);
                                    }
                                }
                              }.bind(this));
                            }.bind(this), 2000);
                    }
                }
            }
        }.bind(this);
        http.send(params);
    }
    checkDeliveryOptions() {
        if (this.state.onlineOrdersPinCodes && this.state.onlineOrdersPinCodes.indexOf(document.getElementById('dPincode').value)>=0) {
            var curDay = weekdays[new Date().getDay()].toLowerCase();
            if (this.state.onlineOrdersTimings.hasOwnProperty(curDay) && this.state.onlineOrdersTimings[curDay].length > 0) {
                console.log('--schedule--', this.state.onlineOrdersTimings[curDay]);
                this.setState({currDayTimings: this.state.onlineOrdersTimings[curDay].filter((slotStr)=>{return parseInt(slotStr.substr(0,slotStr.indexOf('pm'))) > this.getCurrentTimeInFormat()})});

                this.setState({showDeliveryOptions: true, deliveryNotSupported: false});
                document.getElementById('checkoutBtnStep2').style.display = 'block';
            } else {
                this.setState({showDeliveryOptions: false, deliveryNotSupported: true});
                document.getElementById('checkoutBtnStep2').style.display = 'none';
            }
        } else {
            this.setState({showDeliveryOptions: false, deliveryNotSupported: true});
            document.getElementById('checkoutBtnStep2').style.display = 'none';
        }
    }

    render() {
        const {status, orderTitle, dateTime, booking, customer, toppings, extras, location, mapUrl, comments, showLoader, results, starters, orderSummary, showCoupon, showSlot, showList, showWizard, numVistors, curStep, redirect} = this.state;
        console.log('::results::', results);
        return (<div style={{marginTop: '84px'}}>
                    <img id="logo" className="logo-img" src="../img/images/logo_scr.jpg" style={{width: '142px',zIndex:'-1'}} onClick={()=>{window.location.href='/dashboard';}} />
                    <img className='club-logo' src="../img/images/offer.png" style={{zIndex:'-1'}} />
                    <span className='club'  style={{zIndex:'-1'}}>App</span>
                    <div id="checkoutHeader">
                        <div id="checkoutBtn" className="card-btn checkout" onClick={()=>{document.getElementById('checkoutModal').style.top='-40px';this.setState({orderSummary: localStorage.getItem('basket') != null ? JSON.parse(localStorage.getItem('basket')) : []});}}>Checkout&nbsp;→
                            <div className=""></div>
                            <div id="checkoutCount" class="c-count">0</div>
                        </div>
                    </div>
                    {this.state.clubUserSrc != '' || localStorage.getItem('club-user-pic') != null && <img className='club-user-avatar' src={localStorage.getItem('club-user-pic')} onClick={()=>{document.querySelector("#dialog").showModal()}}/>}
                    {status == 'success' && <span className="stage-heading status-success">Order created successfully</span>}
                    <Paper>

                                              <TabPanel value={this.state.value} index={0}>
                                              {this.state.loggedIn && curStep != 3 && curStep != 1 && curStep != 2 && 
                                                    <div>
                                                        <br/><br/>
                                                        <span class="club-desc-2" style={{fontSize: '15px', marginTop: '-34px'}}>🎉  Place your order with best of savings!</span>
                                                        <div class="shimmer-card">
                                                        <div class="loader-shimmer-banner shimmer-animation"></div>
                                                        <div class="loader-shimmer-content">
                                                            <div class="loader-shimmer-header">
                                                            <div class="loader-shimmer-title shimmer-animation"></div>
                                                            <div class="loader-shimmer-rating shimmer-animation"></div>
                                                            </div>
                                                            <div class="loader-shimmer-list shimmer-animation"></div>
                                                            <div class="loader-shimmer-info shimmer-animation"></div>
                                                        </div>
                                                        </div>
                                                        <div class="shimmer-card">
                                                        <div class="loader-shimmer-banner shimmer-animation"></div>
                                                        <div class="loader-shimmer-content">
                                                            <div class="loader-shimmer-header">
                                                            <div class="loader-shimmer-title shimmer-animation"></div>
                                                            <div class="loader-shimmer-rating shimmer-animation"></div>
                                                            </div>
                                                            <div class="loader-shimmer-list shimmer-animation"></div>
                                                            <div class="loader-shimmer-info shimmer-animation"></div>
                                                        </div>
                                                        </div>
                                                    </div>
                                                }
                                                
                                                
                                                   {curStep == 3 && <div>
                                                    <span className="club-heading" style={{top: '12px'}}></span>
                                                        <hr className="line-light" style={{marginTop: '4px', marginBottom: '0px',visibility: 'hidden'}}/>
                                                        {this.state.orderSavings != 0 && <span className="club-desc-2" style={{fontSize: '15px'}}>🎉  Your savings with club till now: ₹<span className="club-code" id="orderSavings">{this.state.orderSavings}</span></span>}
                                                        {this.state.orderSavings == 0 && <span className="club-desc-2" style={{fontSize: '15px'}}>🎉  Place your order with best of savings!</span>}
                                                        <br/>
                                                       {/*<iframe id="trackingElem" style={{width: '103%',height:'100vh',marginLeft: '-8px'}} src="https://porter.in/rd/c5b9a2528d"></iframe>*/}
                                                       
                                                       
                                                        <div className={`main fadeInBottom ${this.state.showList}`}>
                        
                        <div id="checkoutModal" className="card-container checkout-modal modal-show">
                            <div className="modal-heading">
                                <div className="right" onClick={()=>{document.getElementById('checkoutModal').style.top='1200px';this.setState({activeStep: 1, showCoupon: false, showSlot: false, couponApplied: false});}}>
                                    <img src="../../../img/images/ic_close.png" />
                                </div>
                            </div>
                            <div className="md-stepper-horizontal orange" style={{marginTop:'56px'}}>
                                <div id="step1" className="md-step">
                                  <div className="md-step-circle active"><span>1</span></div>
                                  <div className="md-step-title">Order Summary</div>
                                  <div className="md-step-bar-left"></div>
                                  <div className="md-step-bar-right"></div>
                                </div>
                                <div id="step2" className="md-step">
                                  <div className="md-step-circle" id="step2Circle"><span>2</span></div>
                                  <div className="md-step-title">Delivery Schedule</div>
                                  <div className="md-step-bar-left"></div>
                                  <div className="md-step-bar-right"></div>
                                </div>
                                <div id="step3" className="md-step">
                                  <div className="md-step-circle" id="step3Circle"><span>3</span></div>
                                  <div className="md-step-title">Delivery Details</div>
                                  <div className="md-step-bar-left"></div>
                                  <div className="md-step-bar-right"></div>
                                </div>
                              </div>
                              {this.state.activeStep == 1 &&
                              <div className="checkout-content" style={{height: '312px', overflowY: 'scroll'}}>
                                {orderSummary && Object.keys(orderSummary).map((index) => {
                                    if(typeof index !== 'undefined') {
                                        let sumId = index;
                                        sumId = sumId.replace('p','').replace('g','');
                                        sumId = parseInt(sumId, 10);
                                        return (<SummaryCard index={index} data={orderSummary[index]} summaryId={sumId+1} />);
                                    }
                                })}
                                <div className="summary-total">Total:  <span className="rupee">₹</span><span id="price">{Math.round(this.getTotal())}</span>
                                    <div style={{fontSize: '13px', marginTop: '5px', marginLeft: '2px'}}>(incl GST + delivery apprx.)</div>
                                </div>
                                <div id="checkoutBtn" className="card-btn checkout" style={{bottom: '120px', marginTop: 'auto'}} onClick={()=>{document.getElementById('step1').classList.add('done');this.setState({showCoupon: false, activeStep: 2});document.getElementById('step2Circle').classList.add('active');}}>Next&nbsp;→
                                    <div className=""></div>
                                </div>
                              </div>}
                              {this.state.showCoupon == true &&
                                <div className="checkout-content">
                                    <div className="card-container small" style={{padding: '0px 12px 0px 12px'}}>
                                        <div className="section-one">
                                            <div className="top-right">
                                                <div className="usp-title" style={{left: '0',right: '0',margin: '0 auto'}}>
                                                    <span className="title-ff" style={{top:'7px'}}>Use slice20 as the coupon code:</span>
                                                    <input id="dCoupon" type="text" className="step-input" placeholder="Enter coupon code" style={{marginTop: '10px'}}/>
                                                     <div id="applyCouponBtn" className="card-btn coupon-btn" style={{marginTop: '20px'}} onClick={()=>{this.applyCoupon()}}>Apply
                                                        <div className=""></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {this.state.couponApplied == true &&
                                        <div className="summary-total" style={{top: '496px'}}><span style={{opacity: '0.5'}}>Total:  </span><span className="rupee" style={{opacity: '0.5'}}>₹</span><span id="priceOriginal" style={{textDecoration: 'line-through', opacity: '0.5'}}>{this.getTotal()}</span>
                                        <span><img src="../../../img/images/ic_btick.png" style={{width: '32px', marginLeft: '20px'}}/><span style={{fontSize: '18px',marginLeft: '4px'}}>Coupon applied!</span></span>
                                        </div>
                                    }
                                    <div className="summary-total">Total:  <span className="rupee">₹</span><span id="price">{this.getTotal()}</span>
                                        <div style={{fontSize: '14px', marginTop: '5px', marginLeft: '2px'}}>(incl GST at 4%)</div>
                                    </div>
                                        <div id="checkoutBtnStep11" className="card-btn checkout" style={{top: '532px', marginTop: 'auto'}} onClick={()=>{document.getElementById('step2').classList.add('active');document.getElementById('step2Circle').classList.add('active');this.setState({showCoupon: false, activeStep: 2});}}>Next&nbsp;→
                                            <div className=""></div>
                                        </div>
                                </div>
                              }
                              {this.state.activeStep == 2 &&
                                <div className="checkout-content">

                                <div className="card-container" style={{padding: '0px 12px 0px 12px'}}>
                                            <div className="section-one">
                                                <div className="top">
                                                    <div className="top-right">
                                                    <img src="../img/images/delivery.png" className="delivery-icon" style={{marginTop: '12px'}}/>

                                                    <span className="title-ff" style={{top:'6px', padding: '10px', lineHeight: '22px', width: '260px'}}>Share your pincode to check delivery options:</span>

                                                    </div>
                                                </div>
                                                <div className="top-right" style={{marginTop: '70px'}}>
                                              
                                              <div className="usp-title" style={{left: '0',right: '0',margin: '0 auto'}}>
                                                  <div className="usp-title">
                                                            <input id="dPincode" type="text" className="step-input" placeholder="Your pincode" style={{left: '20px',top: '0px'}}/>
                                                            <input type="button" class="pincode-btn" value="Check Options" onClick={this.checkDeliveryOptions} />
                                                        </div>
                                                  <div className="delivery-section" style={{top:'50px', display: `${this.state.showDeliveryOptions == true ? 'block' : 'none'}`}}>
                                                    {this.state.storeAcceptingOrders == true && <div class="radios">
                                                        <input type="radio" id="deliverNow" name="deliveryTime" value="deliverNow" checked/>
                                                        <label for="deliverNow" style={{color:'green'}}>Deliver Now (Delivery in 30 minutes)</label><br/>
                                                        <input type="radio" id="deliverSchedule" name="deliveryTime" value="deliverSchedule" style={{marginTop: '14px'}} selected />
                                                        <label for="deliverSchedule">Deliver Later</label>
                                                    </div>}
                                                     {this.state.storeAcceptingOrders == true && <div className="deliver-cell" style={{marginTop: '12px', marginLeft: '40px'}}>
                                                          <span>Select your time slot for delivery today:</span>
                                                          
                                                      </div>}
                                                      {this.state.storeAcceptingOrders == true && <div className="deliver-cell" style={{marginTop: '12px', marginLeft: '30px'}}>
                                                          <select name="slot" id="slot" style={{height:'36px',marginLeft: '10px'}} className="slot-dropdown" onChange={(e)=>{sessionStorage.setItem('deliverySlot',e.target.options[e.target.selectedIndex].text);}}>
                                                              {this.state.currDayTimings && this.state.currDayTimings.map((item)=> {
                                                                return (<option value={item}>{item}</option>)
                                                              })}
                                                            </select>
                                                      </div>}
                                                      <div className="slot"></div>
                                                  </div>
                                                  {this.state.storeAcceptingOrders}
                                                  <div className="delivery-section msg" style={{top:'50px', display: `${this.state.deliveryNotSupported == true || this.state.storeAcceptingOrders == false ? 'block' : 'none'}`}}>
                                                    
                                                      <div className="deliver-cell" style={{marginTop: '12px', marginLeft: '6px'}}>
                                                          <span>Sorry! We don't have any of your nearby stores accepting online orders at the moment.</span>
                                                          
                                                      </div>
                                                      
                                                      <div className="slot"></div>
                                                  </div>
                                                  <br/>
                                              </div>
                                          </div>
                                            </div>


                                        </div>

                                <div id="checkoutBtnStep2" className="card-btn checkout" style={{top: '569px', marginTop: 'auto', display: 'none'}} onClick={()=>{document.getElementById('step2').classList.add('done');this.captureSchedule();}}>Next&nbsp;→
                                    <div className=""></div>
                                </div>
                              </div>}
                              {this.state.showSlot &&
                              <div className="checkout-content">
                                  <div className="card-container small" style={{position:'absolute',left:'20px',padding: '0px 12px 0px 12px', minHeight: '246px',display: `${!this.state.showOrderConfirmationMsg ? 'block' : 'none'}`}}>
                                      <div className="section-one">
                                      <div className="top">
                                                    <div className="top-right" style={{width: '90%'}}>
                                                        <div className="usp-title" style={{left: '0px', top: '-68px',width: '100%'}}>
                                                            <textarea id="dAddress"  style={{width: '100%'}} className="step-input" className="step-input step-textarea" placeholder="Delivery address (with landmark)" />
                                                            <input id="dMobile" type="text" className="step-input" placeholder="Mobile number" style={{top:'198px',width: '100%'}}/>
                                                            <input id="dName" type="text" className="step-input" placeholder="Your full name" style={{top:'238px',width: '100%'}}/>
                                                        </div>
                                                    </div>
                                                </div>
                                      </div>
                                      <div className="deliver-cell" style={{marginTop: '104px', marginLeft: '6px', fontSize: '14px', paddingBottom: '24px', color:'#6c4c00'}}>
                                                          <span>*You may use any payment mode to pay the delivery agent on delivery of your order.</span>
                                                          
                                                      </div>
                                  </div>

                                  <div className="card-container small" style={{display: `${this.state.showOrderConfirmationMsg ? 'block' : 'none'}`,padding: '0px 12px 0px 12px', minHeight: '246px'}}>
                                      <div className="section-one">
                                      <div className="deliver-cell" style={{marginLeft: '6px', fontSize: '14px', paddingBottom: '24px', color:'#6c4c00', margin: '0 auto',width: '78px', marginTop: '36px',textAlign: 'center'}}>
                                                          <img src="../img/images/tickvo.gif" style={{width: '78px'}} />  
                                                          <span className="order-conf-msg">Thank you for your order! Our agent will notify you once the order is dispatched.</span>
                                                          
                                                      </div>
                                    </div>
                                  </div>

                                      <div id="checkoutBtnStep11" className="card-btn checkout" style={{top: '548px', marginTop: 'auto', width: '220px'}} onClick={()=>{document.getElementById('step2').classList.remove('active');document.getElementById('step3').classList.add('done');document.getElementById('step3Circle').classList.add('active');this.captureAddress();}}>Confirm & Pay Later&nbsp;→
                                          <div className=""></div>
                                      </div>
                                      <div id="checkoutBtnStep12" className="card-btn checkout home-btn" style={{top: '548px', marginTop: 'auto', width: '190px', display: 'none'}} onClick={()=>{window.location.href='/app';}}>←&nbsp;Back Home
                                          <div className=""></div>
                                      </div>
                              </div>
                            }
                              {!this.state.showSlot && this.state.activeStep == 3 &&
                                  <div className="checkout-content">

                                  <div className="card-container" style={{padding: '0px 12px 0px 12px',minHeight: '200px'}}>
                                              <div className="section-one">
                                                  <div className="top">
                                                      <div className="top-right">
                                                          <div className="label-redirect">
                                                            Redirecting to payment partner... Please wait...
                                                          </div>
                                                          <div className="pizza">
                                                           {loaderElems}
                                                          </div>
                                                      </div>
                                                  </div>
                                              </div>


                                          </div>


                                </div>}
                        </div></div>
                                                       
                                                       
                                                       
                                                       
                                                       
                                                        {results && window.location.href.indexOf('/redirect/')==-1 && window.location.href.indexOf('/credits/')==-1 && results.map((resultItem, index) => {
                                                                       return (<Card index={index} data={resultItem} type="pizzas" />);
                                                                   })}

                                                        {this.state.orderCompleted == false && localStorage.getItem('order-created') != null && localStorage.getItem('order-created') == 'true' && this.state.trackingLink != '' && this.state.trackingLink != 'null' &&
                                                            <div className="card-container notify-card-track">
                                                                <div className="section-one-notify">
                                                                </div>
                                                                <div className="title notify-title"><img src="./img/images/trk.gif" style={{width: '42px'}}/><span className='track-icon-title'>Track your order</span></div>
                                                                
                                                                <div className="section-two">
                                                                    <div className="top">
                                                                        <iframe className='track-frame' src={`https://${this.state.trackingLink}`} style={{width: `${screen.width-32}px`}} />
                                                                        <br/>
                                                                        {this.state.payStatus != 'PAYMENT_SUCCESS' && <div className='pay-card'>
                                                                            <span>Your payment is pending. Please pay now to complete your order.</span>
                                                                        </div>}
                                                                        {this.state.payStatus != 'PAYMENT_SUCCESS' && <span className='card-btn pay-now' onClick={()=>{this.payOrderNow()}}>Pay Now</span>}

                                                                        {this.state.payStatus == 'PAYMENT_FAILED' && <div className='pay-card'>
                                                                            <span>Your payment FAILED! Please TRY AGAIN to complete your order.</span>
                                                                        </div>}
                                                                        {this.state.payStatus == 'PAYMENT_FAILED' && <span className='card-btn pay-now' onClick={()=>{this.payOrderNow()}}>Pay Now</span>}

                                                                        {this.state.payStatus == 'PAYMENT_SUCCESS' && <div className='pay-card'>
                                                                            <span style={{color: '#407f40'}}>Your payment is successful. Thanks for ordering with Slimcrust!</span>
                                                                        </div>}
                                                                        
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
                                                        
                                                        {(this.state.payStatus != 'COMPLETE' || this.state.payStatus != 'PAYMENT_SUCCESS') && localStorage.getItem('order-created') != null && localStorage.getItem('order-created') == 'true'  && (this.state.trackingLink == '' || this.state.trackingLink == 'null') &&
                                                            this.checkOrderStatusNow() &&  this.checkOrderStatus() &&
                                                            <div className="card-container notify-card">
                                                            <div className="section-one-notify">
                                                            </div>
                                                            <div className="title notify-title">Preparing your order...</div>
                                                            <hr className="line"/>
                                                            <div className="section-two">
                                                                <div className="top">
                                                                    <img className='notify-img flip' src="./img/images/otop.gif" />
                                                                    <br/>
                                                                    <span class="notify-desc">Our staff will notify you once your order is dispatched.</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        }


                               {window.location.href.indexOf('/redirect/')!=-1 && window.location.href.indexOf('&payment_status=Credit') !=-1 && <div className="card-container">
                                       <div className="status-title">
                                           <br/>
                                           <span>Thanks for ordering your homely pizza!</span>
                                           <br/>
                                           <img className="ic-delivery" src="../img/images/ic_delivery.png" />
                                           <br/>
                                           <div className="small-title">Our delivery executive will get in touch with you once your pizza is dispatched.</div>
                                        </div>

                               </div>}

                               {window.location.href.indexOf('/redirect/')!=-1 && window.location.href.indexOf('&payment_status=Credit') == -1 && <div className="card-container">
                                       <div className="status-title" style={{paddingTop: '38px'}}>
                                           <span>Your order is still pending</span>
                                           <br/><br/>
                                           <span className="small-title">Payment failed. Please retry by clicking the button below.</span>
                                           <br/>
                                           <div className="card-btn checkout small" onClick={()=>{window.location.href=localStorage.getItem('paymentLink');}}>Retry Payment
                                                                               <div className=""></div>
                                                                           </div>
                                           <br/>
                                           <span className="small-title" style={{marginTop: '92px', fontSize: '16px'}}>If you continue to face issues, please call us at <a style={{color: '#ffd355'}} href="tel:+91-7619514999">+91-7619514999</a></span>
                                        </div>

                               </div>}

                               {window.location.href.indexOf('/credits/')!=-1 && <div className="card-container">
                                                                           <div className="status-title">

                                                                               <span>Special Credits</span>
                                                                               <br/>
                                                                               <img className="ic-delivery" src="../../../img/images/medal.png" style={{marginLeft: '0px'}} />
                                                                               <span className="small-title" style={{textAlign: 'justify'}}>We take pride in our team, especially our junior artists who strive to craft a memorable experience in their own creative ways.</span>

                                                                            </div>
                                                                            <div className="status-title" style={{marginTop: '140px'}}>

                                                                                <span style={{fontSize: '20px',marginTop:'14px',fontWeight: 'bold'}}>Akshara, Creative logo & concept</span>
                                                                                <div className="ic-delivery avataraks"  style={{marginLeft: '0px'}} />

                                                                             </div>
                                                                             <div className="status-title" style={{marginTop: '10px'}}>

                                                                              <span style={{fontSize: '20px',marginTop:'14px',fontWeight: 'bold'}}>Antara, Visual design & logo art</span>
                                                                              <div className="ic-delivery avatarant"  style={{marginLeft: '0px'}} />

                                                                           </div>
                                                                           <div className="status-title" style={{marginTop: '10px'}}>

                                                                              <span style={{fontSize: '20px',marginTop:'14px',fontWeight: 'bold'}}>Srishti, Customer happiness</span>
                                                                              <div className="ic-delivery avatarsr"  style={{marginLeft: '0px'}} />
                                                                              <br/><br/><br/>

                                                                           </div>

                                <div className="credits"> © 2020 homely.pizza<span style={{marginLeft: '20px',textDecoration: 'underline'}} onClick={()=>{location.href='/credits/'}}>Special Credits</span></div>

                                                                   </div>}
                                                        <br/>
                                                   </div>}
                                                   

                                                        <dialog id="dialog" className="bg-white   rounded-lg border-t-8 border-orange p-0   font-sans">
                                                        <form  id="form" method="dialog">
                                                            <header className="text-2xl text-center py-4 text-black bg-grey-lighter border-b border-grey-light" style={{marginTop: '6px'}}>
                                                                <span>Your club code: {localStorage.getItem('clubCode')}</span>
                                                            </header>
                                                            <button type="submit" className="bg-orange flex-1 text-white p-2 yes-button" value="yes">Close</button>
                                                            
                                                        </form>
                                                        </dialog>

                                              </TabPanel>
                                              
                    </Paper>
                </div>)
    }
}

export default withRouter(Dashboard);