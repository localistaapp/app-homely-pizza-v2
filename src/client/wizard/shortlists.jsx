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
import RestaurantIcon from '@material-ui/icons/Restaurant';

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
        let defaultPrice = 199;
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
                <div className="pricing" style={{top: '-86px'}}><label className="price"><span className="slashed" id={`price${index}`}>{(defaultPrice * parseInt(sessionStorage.getItem('qty'),10)) + 2900 + ((defaultPrice * parseInt(sessionStorage.getItem('qty'),10)) * 0.2)}</span><span className="rupee" style={{marginLeft: '6px'}}>₹</span><span className="orig" id={`priceNew${index}`}>{Math.ceil(defaultPrice * parseInt(sessionStorage.getItem('qty'),10))+1900}</span></label></div>
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


class Shortlists extends Component {

    constructor() {
        super();
        Date.prototype.toDateInputValue = (function() {
                    var local = new Date(this);
                    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
                    return local.toJSON().slice(0,10);
                });
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
            redirect: window.location.href.indexOf('success')>=0,
            eventDate: new Date().toDateInputValue(),
            deliveryDate: new Date().toDateInputValue(),
            orderSummary: localStorage.getItem('basket') != null ? JSON.parse(localStorage.getItem('basket')) : [],
            numGuests: 20,
            selectedPackage: 1,
            selectPkgActualPrice: '',
            selectPkgPrice: '',
            selectedPkgDescription: '',
            selectedPkgTitle: '',
        };
        sessionStorage.setItem('eventDate',new Date().toDateInputValue());
        window.currSlotSelected = '';
        this.handleTabChange = this.handleTabChange.bind(this);
        this.selectPackage = this.selectPackage.bind(this);
        this.bookPackage = this.bookPackage.bind(this);
    }
    componentDidMount() {

        this.fetchJson();
        var winHeight = window.innerHeight;
        gtag('event', 'clicked_get_quote', {'mounted': 'true'});



        if(isValidCoupon()) {
            document.getElementById('discountModal').style.top = '1200px';
        }

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
                    basketData[e.detail.itemId] = e.detail;
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

        // Close dropdown onclick outside
        /* document.addEventListener('click', (e) => {
            console.log('--Num guests--', e.target.getAttribute('data-num-guests'));

        	const toggle = document.querySelector('.dropdown__switch')
        	const element = e.target

        	if (element == toggle) return;

        	const isDropdownChild = element.closest('.dropdown__filter')

        	if (!isDropdownChild) {
        		toggle.checked = false
        	}
        }); */
    }
    fetchJson() {
        console.log('this.props.match: ', this.props.match);
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
    }
    handleTabChange(event, newValue) {
        console.log('neValue: ', newValue);
        this.setState({value: newValue});
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
    captureAddress() {
        let pincode = document.getElementById('dPincode').value;

        let address = document.getElementById('dAddress').value;
        let mobile = document.getElementById('dMobile').value;
        let name = document.getElementById('dName').value;
        localStorage.setItem('dPincode',pincode);
        localStorage.setItem('dAddress',address);
        localStorage.setItem('dMobile',mobile);
        localStorage.setItem('dName',name);
        let price = localStorage.getItem('dPrice');
        let slot = sessionStorage.getItem('deliverySlot') != null ? sessionStorage.getItem('deliverySlot') : '';
        let summary = localStorage.getItem('basket');
        let referralCode = localStorage.getItem('discountCode');
        let eOrderId = sessionStorage.getItem('eventOrderId');
        summary = summary != null ? summary : '';
        //create order
        var http = new XMLHttpRequest();
        var url = '/homelyOrder';
        var params = 'dPrice='+price+'&dMobile='+localStorage.getItem('dMobile')+'&dName='+localStorage.getItem('dName')+'&dSlot='+slot+'&dItems='+summary+'&dPincode='+pincode+'&referralCode='+referralCode+'&dAddress='+address+'&eOrderId='+eOrderId;
        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
                console.log('order creation post response:', http.responseText);
                var res = http.responseText;
                if(!pincode.includes('560') || !this.slotsAvailable) {
                    alert('Sorry, our slots are full. Pls check back again later!');
                    location.href = '/';
                }
                if(res != null){
                    res = JSON.parse(res);
                    /*if(res.whitelisted == false) {
                        alert("Sorry, we're not able to deliver to your location temporarily!");
                        this.setState({activeStep: 2});
                    } else {*/
                        document.getElementById('step3Circle').classList.add('active');this.setState({showSlot: true, activeStep: 3});
                        localStorage.setItem('orderId', res.orderId);
                    /*}*/
                }
            }
        }.bind(this);
        http.send(params);
        fbq('track', 'InitiateCheckout');
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
    setNumGuests(numGuests) {
        document.getElementById('packages').style.opacity = '1';
        document.getElementById('packages').style.pointerEvents = 'all';
        this.setState({numGuests: numGuests});
    }
    showMore(packElem){
        document.getElementById(packElem).style.height = '660px';
        document.getElementById(packElem+'BottomDiv').style.display = 'none';
        document.getElementById(packElem+'ShowBtn').style.display = 'none';
        document.getElementById(packElem+'Learn').style.display = 'block';
        document.getElementById(packElem+'Chat').style.display = 'block';
    }
    selectPackage(packageNum) {
        this.setState({curStep: 2, selectedPackage: packageNum});
        window.scrollTo(0, 0);

         setTimeout(function(){new Glider(document.querySelector(".glider"), {
                  slidesToShow: 1.5,
                  slidesToScroll: 1,
                  draggable: true,
                  dots: ".dots",
                  responsive: [
                    {
                      // If Screen Size More than 768px
                      breakpoint: 768,
                      settings: {
                        slidesToShow: 1.5,
                        slidesToScroll: 1,
                        duration: 0.5,
                        arrows: {
                          prev: ".glider-prev",
                          next: ".glider-next"
                        }
                      }
                    },
                    {
                      // If Screen Size More than 1024px
                      breakpoint: 1024,
                      settings: {
                        slidesToShow: 2.5,
                        slidesToScroll: 1,
                        duration: 0.5,
                        arrows: {
                          prev: ".glider-prev",
                          next: ".glider-next"
                        }
                      }
                    }
                  ]
                });},1000);
    }
    bookPackage() {
        var pkg = this.state.selectedPackage;
        var numGuests = this.state.numGuests;
        var deliveryDate = this.state.deliveryDate;
        var e = document.getElementById("slot");
        var slot = e.options[e.selectedIndex].text;
        var mob = document.getElementById('evtMobile').value;

        var eMobile = document.getElementById('evtMobile').value;
        var eDate = this.state.deliveryDate;
        var eSlot = e.options[e.selectedIndex].text;
        var eGuests = this.state.numGuests;
        var ePackage = this.state.selectedPackage;

        //create order
        var http = new XMLHttpRequest();
        var url = '/createBooking';
        var params = 'eMobile='+eMobile+'&eDate='+eDate+'&eSlot='+eSlot;
        params += '&eGuests='+eGuests+'&ePackage='+ePackage;
        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
                console.log('confirmed booking creation post response:', http.responseText);
                var res = http.responseText;
                if(res != null){
                    res = JSON.parse(res);
                    console.log('--event order id--', res);
                    sessionStorage.setItem('confirmedOrderId', res.orderId);
                    window.location.href='/booking-success';
                }
            }
        }.bind(this);
        http.send(params);
    }
    render() {
        const {numGuests, showLoader, results, starters, orderSummary, showCoupon, showSlot, showList, showWizard, numVistors, curStep, redirect} = this.state;
        this.slotsAvailable = true;

        console.log('orderSummary: ', orderSummary);
        let loaderElems = [];
        console.log('::results::', results);
        for(var i=0; i<14; i++) {
            loaderElems.push(<div className="slice"></div>)
        }

        let slots = [];
        let currentHour = new Date().getHours();
        let currentMin = new Date().getMinutes();

        slots = ["Saturday 3PM - 4PM","Saturday 4PM - 5PM","Saturday 5PM - 6PM","Saturday 6PM - 7PM","Saturday 7PM - 8PM"];

        if(slots.length > 0) {
            window.currSlotSelected = slots[0];
        }

        let proposedPackage1 = {
                  "title": "Mediterranean Feast",
                  "type": "pizza",
                  "shortTitle": "Asense Interior",
                  "subTitle": "129, Siddapura",
                  "address": "129, Siddapura, Whitefield, Bengaluru, Karnataka, India, Varthur Main Road, Bengaluru",
                  "qna": [
                    {
                      "defaultPrice": 305,
                      "responses": [
                        {
                          "topic": "Large",
                          "pricing": {"Slim":  305, "Thick":  315}
                        },
                        {
                          "topic": "Medium",
                          "pricing": {"Slim":  295, "Thick":  305}
                        },
                        {
                          "topic": "Small",
                          "pricing": {"Slim":  275, "Thick":  295}
                        }
                      ],
                      "crust": [
                        {
                          "topic": "Slim",
                          "pricing": {"Large":  305, "Medium":  295, "Small":  275}
                        }
                      ]
                    }
                  ],
                  "usp": [
                    "Mild blend of Black Olives, Onion & Sweet corn"
                  ],
                  "images": {
                    "primary": "https://lh5.googleusercontent.com/p/AF1QipMfveOLCLmjGRfpfzooSICq5nskYbHGIdJVKtud=s870-k-no",
                    "secondary": []
                  }
                };

        let pkgs = {
                     1: {
                       "selectPkgActualPrice": "199",
                       "selectPkgPrice": "239",
                       "selectedPkgDescription": "A total of [qty] Large pizzas (11 inch) will be served at the live counter.",
                       "selectedPkgTitle": " Large pizzas"
                     },
                     2: {
                       "selectPkgActualPrice": "249",
                       "selectPkgPrice": "299",
                       "selectedPkgDescription": "A starter mini veg wrap (4 inch long) or veg pasta, 3 slices of pizza and a choice of drink (Virgin mojito or Pacific blue)",
                       "selectedPkgTitle": " Pizza Mini Combo Meal"
                     },
                     3: {
                       "selectPkgActualPrice": "299",
                       "selectPkgPrice": "359",
                       "selectedPkgDescription": "A starter full veg wrap (8 inch long) or veg pasta, 3 slices of pizza and a choice of drink (Virgin mojito or Pacific blue)",
                       "selectedPkgTitle": " Pizza Large Combo Meal"
                     },
                     4: {
                       "selectPkgActualPrice": "359",
                       "selectPkgPrice": "429",
                       "selectedPkgDescription": "A starter 2 slice garlic bread, 3 slices of pizza and a choice of drink (Virgin mojito or Pacific blue)",
                       "selectedPkgTitle": " Pizza Mega Combo Meal"
                     },
                     5: {
                       "selectPkgActualPrice": "399",
                       "selectPkgPrice": "479",
                       "selectedPkgDescription": "A starter garlic bread, 1 veg wrap (8 inch long) or veg pasta & 3 slices pizza and 1 choice of drink (Virgin mojito or Pacific blue)",
                       "selectedPkgTitle": " Pizza Mega Combo Meal"
                     }
                   };

        return (<div>
                    <img onClick={()=>{location.href='/';}} id="logo" className="logo-img" src="../img/images/logo_scr.jpg" style={{width: '142px'}} />
                    <div id="checkoutHeader">
                        <div id="checkoutBtn" className="card-btn checkout" onClick={()=>{document.getElementById('checkoutModal').style.top='-20px';this.setState({orderSummary: localStorage.getItem('basket') != null ? JSON.parse(localStorage.getItem('basket')) : []});}}>Checkout&nbsp;→
                            <div className=""></div>
                            <div id="checkoutCount" class="c-count">0</div>
                        </div>
                    </div>

                    <div><i className="loading" id="myTasksLoader" style={{top: '28px'}}></i></div>
                    <div className={`main fadeInBottom ${this.state.showWizard}`}>

                        {redirect == true && <div className="step-detail step-1">
                                <div class="payment-success">
                                <span style={{marginLeft: '-8px'}}>🎉 Booking Successful!</span></div>
                                <br/>
                                <div>
                                    <span>Thanks for booking Slimcrust. Our team will contact you shortly to complete the next steps.</span>
                                </div>
                        </div>}
                        {curStep == 1 && !redirect && <div className="step-detail step-1">
                            <div class="header">Select a package, for <br/>your party!<br/></div>
                                    <div className="dropdown">
                                        <input type="checkbox" className="dropdown__switch" id="filter-switch" hidden />
                                        <label for="filter-switch" className="dropdown__options-filter">
                                            <ul className="dropdown__filter" role="listbox" tabindex="-1">
                                                <li className="dropdown__filter-selected" aria-selected="true">
                                                    Pick the number of guests:
                                                </li>
                                                <li>
                                                    <ul className="dropdown__select">
                                                        <li className="dropdown__select-option" data-num-guests="25" role="option" onClick={()=>{this.setNumGuests('25');}}>
                                                            25 Guests
                                                        </li>
                                                        <li className="dropdown__select-option" data-num-guests="30" role="option" onClick={()=>{this.setNumGuests('30');}}>
                                                            30-35 Guests
                                                        </li>
                                                        <li className="dropdown__select-option" data-num-guests="40" role="option" onClick={()=>{this.setNumGuests('40');}}>
                                                            40-45 Guests
                                                        </li>
                                                        <li className="dropdown__select-option" data-num-guests="55" role="option" onClick={()=>{this.setNumGuests('55');}}>
                                                            50-60 Guests
                                                        </li>
                                                        <li className="dropdown__select-option" data-num-guests="80" role="option" onClick={()=>{this.setNumGuests('80');}}>
                                                            70-100 Guests
                                                        </li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </label>
                                        <div id="packages" className="packages">
                                            <div id="pack1" className="menu-container-ls" style={{height: '320px'}}>
                                                <img src="../img/images/pack1.png" style={{width: '106px', position: 'absolute', zIndex: '1', left: '12px', top: '11px'}} />
                                                <span className="phead">{this.state.numGuests} Large pizzas</span>
                                                <div className="pricing"><label className="price"><span className="slashed">{this.state.numGuests * 239}</span><span className="rupee" style={{marginLeft: '6px'}}>₹</span><span className="orig" style={{marginRight: '12px'}}>{this.state.numGuests * 199}</span></label></div>
                                                <div className="pdetail">
                                                    A total of {this.state.numGuests} Large pizzas (11 inch) will be served at the live counter.
                                                </div>
                                                <br/>
                                                <span className="phead" style={{marginTop: '160px',left: '22px'}}>Inclusions</span>
                                                <br/>
                                                <img class="icheck" src="../img/images/icheck.png" style={{marginTop:'166px'}}/>
                                                <br/><br/>
                                                <div className="pdetail incl1">Live counter setup for 3-4 hrs</div>
                                                <img class="icheck" src="../img/images/icheck.png" style={{position:'absolute',marginTop:'-25px'}}/>
                                                <div className="pdetail incl2" >Any 4 toppings of your choice</div>
                                                <img class="icheck" src="../img/images/icheck.png" style={{position:'absolute',marginTop:'14px'}}/>
                                                <div className="pdetail incl3" >Fresh base, live pizzas</div>
                                                <img class="icheck" src="../img/images/icheck.png" style={{position:'absolute',marginTop:'54px'}}/>
                                                <div className="pdetail incl4" >Chef & helper for serving</div>
                                                <img class="icheck" src="../img/images/icheck.png" style={{position:'absolute',marginTop:'94px'}}/>
                                                <div className="pdetail incl5" >Pizza making kids workshop</div>
                                                <div className="bottom-bar-div" id="pack1BottomDiv"></div>
                                                <a id="pack1ShowBtn" className="button show-more" onClick={()=>{this.showMore('pack1')}}>Show More</a>
                                                <a id="pack1Learn" class="button cta" onClick={()=>{this.selectPackage(1);}}>Select package</a>
                                                <a id="pack1Chat" onClick={()=>{gtag_report_conversion()}} href={`https://wa.me/7619514999?text=I'm%20interested%20in%20pizza%20package%20num%201%20for%20${this.state.numGuests}%20guests`} className="button show-more" style={{display: 'none'}}><img src="../img/images/whatsapp.png" className="btn-icon"/>Chat before order</a>
                                            </div>
                                            <div id="pack2" className="menu-container-ls" style={{height: '320px'}}>
                                                <img src="../img/images/pack2.png" style={{width: '106px', position: 'absolute', zIndex: '1', left: '12px', top: '11px'}}  />
                                                <span className="phead">{this.state.numGuests} Pizza Mini Combo Meal</span>
                                                <div className="pricing"><label className="price"><span className="slashed">{this.state.numGuests * 299}</span><span className="rupee" style={{marginLeft: '6px'}}>₹</span><span className="orig" style={{marginRight: '12px'}}>{this.state.numGuests * 249}</span></label></div>
                                                <div className="pdetail">
                                                    A starter mini veg wrap (4 inch long) or veg pasta, 3 slices of pizza and a choice of drink (Virgin mojito or Pacific blue)
                                                </div>
                                                <br/><br/><br/>
                                                <span className="phead" style={{marginTop: '220px',left: '22px'}}>Inclusions</span>
                                                <br/>
                                                <img class="icheck" src="../img/images/icheck.png" style={{marginTop:'170px'}}/>
                                                <br/><br/>
                                                <div className="pdetail incl1" style={{marginTop: '187px'}}>Live counter setup for 3-4 hrs</div>
                                                <img class="icheck" src="../img/images/icheck.png" style={{position:'absolute',marginTop:'-25px'}}/>
                                                <div className="pdetail incl2" style={{marginTop: '227px'}}>Any 4 toppings of your choice</div>
                                                <img class="icheck" src="../img/images/icheck.png" style={{position:'absolute',marginTop:'14px'}}/>
                                                <div className="pdetail incl3" style={{marginTop: '267px'}}>Fresh base, live pizzas</div>
                                                <img class="icheck" src="../img/images/icheck.png" style={{position:'absolute',marginTop:'54px'}}/>
                                                <div className="pdetail incl4" style={{marginTop: '307px'}}>Chef & helper for serving</div>
                                                <img class="icheck" src="../img/images/icheck.png" style={{position:'absolute',marginTop:'94px'}}/>
                                                <div className="pdetail incl5" style={{marginTop: '347px'}}>Pizza making kids workshop</div>
                                                <div className="bottom-bar-div" id="pack2BottomDiv"></div>
                                                <a id="pack2ShowBtn" className="button show-more" onClick={()=>{this.showMore('pack2')}}>Show More</a>
                                                <a id="pack2Learn" class="button cta" onClick={()=>{this.selectPackage(2);}}>Select package</a>
                                                <a id="pack2Chat" onClick={()=>{gtag_report_conversion()}} href={`https://wa.me/7619514999?text=I'm%20interested%20in%20pizza%20package%20num%202%20for%20${this.state.numGuests}%20guests`} className="button show-more" style={{display: 'none'}}><img src="../img/images/whatsapp.png" className="btn-icon"/>Chat before order</a>
                                            </div>
                                            <div id="pack3" className="menu-container-ls" style={{height: '320px'}}>
                                                <img src="../img/images/pack3.png" style={{width: '106px', position: 'absolute', zIndex: '1', left: '12px', top: '11px'}} />
                                                <span className="phead">{this.state.numGuests} Pizza Large Combo Meal</span>
                                                <div className="pricing"><label className="price"><span className="slashed">{this.state.numGuests * 359}</span><span className="rupee" style={{marginLeft: '6px'}}>₹</span><span className="orig" style={{marginRight: '12px'}}>{this.state.numGuests * 299}</span></label></div>
                                                <div className="pdetail">
                                                    A starter full veg wrap  (8 inch long) or veg pasta, 3 slices of pizza and a choice of drink (Virgin mojito or Pacific blue)
                                                </div>
                                                <br/><br/><br/>
                                                <span className="phead" style={{marginTop: '214px',left: '22px'}}>Inclusions</span>
                                                <br/>
                                                <img class="icheck" src="../img/images/icheck.png" style={{marginTop:'165px'}}/>
                                                <br/><br/>
                                                <div className="pdetail incl1" style={{marginTop: '181px'}}>Live counter setup for 3-4 hrs</div>
                                                <img class="icheck" src="../img/images/icheck.png" style={{position:'absolute',marginTop:'-25px'}}/>
                                                <div className="pdetail incl2" style={{marginTop: '221px'}}>Any 4 toppings of your choice</div>
                                                <img class="icheck" src="../img/images/icheck.png" style={{position:'absolute',marginTop:'14px'}}/>
                                                <div className="pdetail incl3" style={{marginTop: '261px'}}>Fresh base, live pizzas</div>
                                                <img class="icheck" src="../img/images/icheck.png" style={{position:'absolute',marginTop:'54px'}}/>
                                                <div className="pdetail incl4" style={{marginTop: '301px'}}>Chef & helper for serving</div>
                                                <img class="icheck" src="../img/images/icheck.png" style={{position:'absolute',marginTop:'94px'}}/>
                                                <div className="pdetail incl5" style={{marginTop: '341px'}}>Pizza making kids workshop</div>
                                                <div className="bottom-bar-div" id="pack3BottomDiv"></div>
                                                <a id="pack3ShowBtn" className="button show-more" onClick={()=>{this.showMore('pack3')}}>Show More</a>
                                                <a id="pack3Learn" class="button cta" onClick={()=>{this.selectPackage(3);}}>Select package</a>
                                                <a id="pack3Chat" onClick={()=>{gtag_report_conversion()}} href={`https://wa.me/7619514999?text=I'm%20interested%20in%20pizza%20package%20num%203%20for%20${this.state.numGuests}%20guests`} className="button show-more" style={{display: 'none'}}><img src="../img/images/whatsapp.png" className="btn-icon"/>Chat before order</a>
                                            </div>
                                            <div id="pack4" className="menu-container-ls" style={{height: '320px'}}>
                                                <img src="../img/images/pack4.png" style={{width: '106px', position: 'absolute', zIndex: '1', left: '12px', top: '11px'}} />
                                                <span className="phead">{this.state.numGuests} Pizza Mega Combo Meal</span>
                                                <div className="pricing"><label className="price"><span className="slashed">{this.state.numGuests * 429}</span><span className="rupee" style={{marginLeft: '6px'}}>₹</span><span className="orig" style={{marginRight: '12px'}}>{this.state.numGuests * 359}</span></label></div>
                                                <div className="pdetail">
                                                    A starter 2 slice garlic bread, 3 slices of pizza and a choice of drink (Virgin mojito or Pacific blue)
                                                </div>
                                                <br/><br/><br/>
                                                <span className="phead" style={{marginTop: '214px',left: '22px'}}>Inclusions</span>
                                                <br/>
                                                <img class="icheck" src="../img/images/icheck.png" style={{marginTop:'165px'}}/>
                                                <br/><br/>
                                                <div className="pdetail incl1" style={{marginTop: '181px'}}>Live counter setup for 3-4 hrs</div>
                                                <img class="icheck" src="../img/images/icheck.png" style={{position:'absolute',marginTop:'-25px'}}/>
                                                <div className="pdetail incl2" style={{marginTop: '221px'}}>Any 4 toppings of your choice</div>
                                                <img class="icheck" src="../img/images/icheck.png" style={{position:'absolute',marginTop:'14px'}}/>
                                                <div className="pdetail incl3" style={{marginTop: '261px'}}>Fresh base, live pizzas</div>
                                                <img class="icheck" src="../img/images/icheck.png" style={{position:'absolute',marginTop:'54px'}}/>
                                                <div className="pdetail incl4" style={{marginTop: '301px'}}>Chef & helper for serving</div>
                                                <img class="icheck" src="../img/images/icheck.png" style={{position:'absolute',marginTop:'94px'}}/>
                                                <div className="pdetail incl5" style={{marginTop: '341px'}}>Pizza making kids workshop</div>
                                                <div className="bottom-bar-div" id="pack4BottomDiv"></div>
                                                <a id="pack4ShowBtn" className="button show-more" onClick={()=>{this.showMore('pack4')}}>Show More</a>
                                                <a id="pack4Learn" class="button cta" onClick={()=>{this.selectPackage(4);}}>Select package</a>
                                                <a id="pack4Chat" onClick={()=>{gtag_report_conversion()}} href={`https://wa.me/7619514999?text=I'm%20interested%20in%20pizza%20package%20num%204%20for%20${this.state.numGuests}%20guests`} className="button show-more" style={{display: 'none'}}><img src="../img/images/whatsapp.png" className="btn-icon"/>Chat before order</a>
                                            </div>
                                            <div id="pack5" className="menu-container-ls" style={{height: '320px'}}>
                                                <img src="../img/images/pack5.png" style={{width: '106px', position: 'absolute', zIndex: '1', left: '12px', top: '11px'}} />
                                                <span className="phead">{this.state.numGuests} Italian Meal Combo</span>
                                                <div className="pricing"><label className="price"><span className="slashed">{this.state.numGuests * 479}</span><span className="rupee" style={{marginLeft: '6px'}}>₹</span><span className="orig" style={{marginRight: '12px'}}>{this.state.numGuests * 399}</span></label></div>
                                                <div className="pdetail">
                                                    A starter garlic bread, 1 veg wrap (8 inch long) or veg pasta & 3 slices pizza and 1 choice of drink (Virgin mojito or Pacific blue)
                                                </div>
                                                <br/><br/><br/>
                                                <span className="phead" style={{marginTop: '214px',left: '22px'}}>Inclusions</span>
                                                <br/>
                                                <img class="icheck" src="../img/images/icheck.png" style={{marginTop:'165px'}}/>
                                                <br/><br/>
                                                <div className="pdetail incl1" style={{marginTop: '181px'}}>Live counter setup for 3-4 hrs</div>
                                                <img class="icheck" src="../img/images/icheck.png" style={{position:'absolute',marginTop:'-25px'}}/>
                                                <div className="pdetail incl2" style={{marginTop: '221px'}}>Any 4 toppings of your choice</div>
                                                <img class="icheck" src="../img/images/icheck.png" style={{position:'absolute',marginTop:'14px'}}/>
                                                <div className="pdetail incl3" style={{marginTop: '261px'}}>Fresh base, live pizzas</div>
                                                <img class="icheck" src="../img/images/icheck.png" style={{position:'absolute',marginTop:'54px'}}/>
                                                <div className="pdetail incl4" style={{marginTop: '301px'}}>Chef & helper for serving</div>
                                                <img class="icheck" src="../img/images/icheck.png" style={{position:'absolute',marginTop:'94px'}}/>
                                                <div className="pdetail incl5" style={{marginTop: '341px'}}>Pizza making kids workshop</div>
                                                <div className="bottom-bar-div" id="pack5BottomDiv"></div>
                                                <a id="pack5ShowBtn" className="button show-more" onClick={()=>{this.showMore('pack5')}}>Show More</a>
                                                <a id="pack5Learn" class="button cta" onClick={()=>{this.selectPackage(5);}}>Select package</a>
                                                <a id="pack5Chat" onClick={()=>{gtag_report_conversion()}} href={`https://wa.me/7619514999?text=I'm%20interested%20in%20pizza%20package%20num%205%20for%20${this.state.numGuests}%20guests`} className="button show-more" style={{display: 'none'}}><img src="../img/images/whatsapp.png" className="btn-icon"/>Chat before order</a>
                                            </div>
                                        </div>
                                    </div>
                            <br/>

                        </div> }
                        {curStep == 2 && <div className="step-detail step-1" style={{marginTop: '78px'}}>
                                <hr className="line thin" style={{top: '-2px'}}/>
                                <div className="step-detail-title" style={{marginTop: '-44px',textAlign: 'left'}}>Book your package</div>
                                <div id="packages" className="packages" style={{opacity: '1', pointerEvents: 'all', marginTop: '34px',height:'500px'}}>
                                    <div id="pack1" className="menu-container-ls" style={{height: '320px',boxShadow: 'none',overflow: 'unset'}}>
                                    <img src={`../img/images/pack${this.state.selectedPackage}.png`} style={{width: '106px', position: 'absolute', zIndex: '1', left: '12px', top: '11px'}} />
                                    <span className="phead">{this.state.numGuests}{pkgs[this.state.selectedPackage].selectedPkgTitle}</span>
                                    <div className="pricing" style={{right:'128px'}}><label className="price"><span className="slashed">{this.state.numGuests * pkgs[this.state.selectedPackage].selectPkgPrice}</span><span className="rupee" style={{marginLeft: '6px'}}>₹</span><span className="orig" style={{marginRight: '12px'}}>{this.state.numGuests * pkgs[this.state.selectedPackage].selectPkgActualPrice}</span></label></div>
                                    <div className="pdetail">
                                    {pkgs[this.state.selectedPackage].selectedPkgDescription.replace('[qty]',this.state.numGuests)}
                                    </div>
                                    <br/>
                                    <span className="phead" style={{marginTop: '210px',left: '22px'}}>Inclusions</span>
                                    <br/>
                                    <img class="icheck" src="../img/images/icheck.png" style={{marginTop:'216px'}}/>
                                    <br/><br/>
                                    <div className="pdetail incl1" style={{marginTop: '172px'}}>Live counter setup for 3-4 hrs</div>
                                    <img class="icheck" src="../img/images/icheck.png" style={{position:'absolute',marginTop:'-25px'}}/>
                                    <div className="pdetail incl2" style={{marginTop: '212px'}} >Any 4 toppings of your choice</div>
                                    <img class="icheck" src="../img/images/icheck.png" style={{position:'absolute',marginTop:'14px'}}/>
                                    <div className="pdetail incl3" style={{marginTop: '253px'}} >Fresh base, live pizzas</div>
                                    <img class="icheck" src="../img/images/icheck.png" style={{position:'absolute',marginTop:'54px'}}/>
                                    <div className="pdetail incl4" style={{marginTop: '293px'}} >Chef & helper for serving</div>
                                    <img class="icheck" src="../img/images/icheck.png" style={{position:'absolute',marginTop:'94px'}}/>
                                    <div className="pdetail incl5" style={{marginTop: '333px',marginBottom:'100px'}} >Pizza making kids workshop</div>
                                    <br/><br/><br/><br/>
                                    <a id="pack1Learn" class="button cta" onClick={()=>{gtag_report_conversion();this.selectPackage(1);}}>Book Now</a>
                                    <a id="pack1Chat" onClick={()=>{gtag_report_conversion();}} href={`https://wa.me/7619514999?text=I'm%20interested%20in%20pizza%20package%20num%201%20for%20${this.state.numGuests}%20guests`} className="button show-more" style={{display: 'none'}}><img src="../img/images/whatsapp.png" className="btn-icon" />Chat before order</a>
                                    </div>
                                </div>

                                <div className="section no-padding">
                                        <div className="post-heading" style={{height: '264px'}}>
                                            <div className="info" style={{position: 'relative'}}>
                                                <hr className="line thin"/>
                                                <div className="title" style={{background: '#fff',width: '200px'}}>Event Gallery</div>
                                                <div id="boxEvents">
                                                    <main className="main" style={{marginTop: '-36px'}}>
                                                        <div className="gcontainer">
                                                            <div className="glider-contain">
                                                                <div className="glider">
                                                                    <div className="card-image" style={{height:'210px'}}>
                                                                        <img src="../img/images/e01.jpg" alt="Slider Image"/>
                                                                    </div>
                                                                    <div className="card-image" style={{height:'210px'}}>
                                                                        <img src="../img/images/e6.jpg" alt="Slider Image"/>
                                                                    </div>
                                                                    <div className="card-image" style={{height:'210px'}}>
                                                                        <img src="../img/images/e7.jpg" alt="Slider Image"/>
                                                                    </div>
                                                                    <div className="card-image">
                                                                        <img src="../img/images/e02.jpg" alt="Slider Image"/>
                                                                    </div>
                                                                    <div className="card-image">
                                                                        <img src="../img/images/e03.jpg" alt="Slider Image"/>
                                                                    </div>
                                                                    <div className="card-image">
                                                                        <img src="../img/images/e04.jpg" alt="Slider Image"/>
                                                                    </div>
                                                                    <div className="card-image">
                                                                        <img src="../img/images/e05.jpg" alt="Slider Image"/>
                                                                    </div>
                                                                    <div className="card-image">
                                                                        <img src="../img/images/e06.jpg" alt="Slider Image"/>
                                                                    </div>
                                                                    <div className="card-image">
                                                                        <img src="../img/images/e07.jpg" alt="Slider Image"/>
                                                                    </div>
                                                                    <div className="card-image">
                                                                        <img src="../img/images/e08.jpg" alt="Slider Image"/>
                                                                    </div>
                                                                    <div className="card-image">
                                                                        <img src="../img/images/e09.jpg" alt="Slider Image"/>
                                                                    </div>
                                                                </div>
                                                                <span role="button" aria-label="Previous" className="glider-prev"><i className="fas fa-chevron-left"></i></span>
                                                                <span role="button" aria-label="Next" className="glider-next"><i className="fas fa-chevron-right"></i></span>
                                                                <span role="tablist" className="dots"></span>
                                                            </div>
                                                        </div>
                                                    </main>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>

                                <div className="bottom-bar" ></div>
                                <div className="button" style={{backgroundColor:'#fff',background:'transparent',backdropFilter:'blur(12px)',boxShadow: '0px 0px 13px 6px rgb(131 131 131 / 21%)',bottom: '-7px',borderRadius:'10px',color:'rgb(255 255 255)',border: '1px solid',height: '350px',width: '100%'}}></div>
                                <div className="booking-form">
                                    <div>
                                        <span className="form-label">Date of event:</span>
                                        <input style={{border: '1px solid #cc3c3b',bottom:'2px',marginLeft: '25px',padding:'0',paddingLeft:'8px',width:'180px'}} className="form-input" type="date" value={this.state.deliveryDate} onChange={(e)=>{this.setState({deliveryDate:e.target.value});sessionStorage.setItem('deliveryDate',e.target.value);}}/>
                                    </div>
                                    <div>
                                        <span className="form-label">Serving time:</span>
                                        <select name="slot" id="slot" className="slot-dropdown" onChange={(e)=>{sessionStorage.setItem('deliverySlot',e.target.options[e.target.selectedIndex].text);}}>
                                          <option value="Saturday 6pm to 7p">12pm to 4pm</option>
                                          <option value="Saturday 7pm to 8pm">1pm to 4pm</option>
                                          <option value="Saturday 8pm to 9pm">2pm to 4pm</option>
                                          <option value="Saturday 9pm to 10pm">4pm to 6pm</option>
                                          <option value="Sunday 6pm to 7p">5pm to 7pm</option>
                                          <option value="Sunday 7pm to 8pm">6pm to 9pm</option>
                                        </select>
                                    </div>
                                    <div>
                                        <span className="form-label">Mobile number:</span>
                                        <input id="evtMobile" type="text" className="form-input-mob" placeholder=""/>
                                    </div>
                                    <div><span class="small-msg">*No payment required now. Agent will contact for next steps.</span></div>
                                </div>
                                <a class="button" style={{textTransform: 'none',bottom:'75px'}} onClick={()=>{gtag_report_conversion();this.bookPackage();}}>Book Now</a>
                                <a onClick={()=>{gtag_report_conversion();}} href={`https://wa.me/7619514999?text=I'm%20interested%20in%20pizza%20package%20num%201%20for%20${this.state.numGuests}%20guests`} className="button" style={{display:'block',bottom:'10px',background:'#fff',color:'#ff332d',border:'1px solid',textTransform: 'none'}}><img src="../img/images/whatsapp.png" className="btn-icon" style={{top:'17px'}}/>Chat before order</a>

                        </div>}




                        {curStep == 1 && redirect && <div className="step-detail step-1" style={{marginTop: '78px'}}>

                                                        <div className="bottom-bar" ></div>
                                                        <a class="button" style={{textTransform: 'none',bottom:'75px'}} onClick={()=>{window.location.href='/'}}>Back to Home</a>
                                                        <a href={`https://wa.me/7619514999?text=I'm%20interested%20in%20pizza%20package%20num%201%20for%20${this.state.numGuests}%20guests`} className="button" style={{display:'block',bottom:'10px',background:'#fff',color:'#ff332d',border:'1px solid',textTransform: 'none'}}><img src="../img/images/whatsapp.png" className="btn-icon" style={{top:'17px'}}/>Chat with support</a>

                                                </div>}




                        <br/><br/><br/><br/>
                    </div>
                    <div className={`main fadeInBottom ${this.state.showList}`}>
                        <div className="sample-msg ">Get a <span className="highlight">sample pizza</span> home delivered for <span className="highlight">tasting</span>. You will only be charged for the sample order now.</div>
                        <div id="discountModal" className="card-container checkout-modal modal-show" style={{top:'74px'}}>
                            <div className="modal-heading">
                                <div className="left">
                                    Coupon Code
                                </div>
                                <div className="right" onClick={()=>{document.getElementById('discountModal').style.top='1200px';}}>
                                    <img src="../../../img/images/ic_close.png" />
                                </div>
                                <div className="checkout-content" style={{height: 'calc(100% - 350px)', marginTop:'30px'}}>
                                    <div class="title">
                                        <div>Have a coupon code?</div>
                                        <input id="discountCodeText" type="text" className="step-input" placeholder="Enter coupon code" style={{marginTop: '100px',color: '#000', height: '38px'}}/>
                                        <div id="applyDiscountBtn" className="card-btn coupon-btn" onClick={()=>{localStorage.setItem('discountCode',document.getElementById('discountCodeText').value);location.reload();}}>Apply
                                            <div className=""></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="checkoutModal" className="card-container checkout-modal modal-show">
                            <div className="modal-heading">
                                <div className="right" onClick={()=>{document.getElementById('checkoutModal').style.top='1200px';this.setState({activeStep: 1, showCoupon: false, showSlot: false, couponApplied: false});}}>
                                    <img src="../../../img/images/ic_close.png" />
                                </div>
                            </div>
                            <div className="md-stepper-horizontal orange">
                                <div id="step1" className="md-step">
                                  <div className="md-step-circle active"><span>1</span></div>
                                  <div className="md-step-title">Order Summary</div>
                                  <div className="md-step-bar-left"></div>
                                  <div className="md-step-bar-right"></div>
                                </div>
                                <div id="step2" className="md-step">
                                  <div className="md-step-circle" id="step2Circle"><span>2</span></div>
                                  <div className="md-step-title">Delivery Address</div>
                                  <div className="md-step-bar-left"></div>
                                  <div className="md-step-bar-right"></div>
                                </div>
                                <div id="step3" className="md-step">
                                  <div className="md-step-circle" id="step3Circle"><span>3</span></div>
                                  <div className="md-step-title">Make Payment</div>
                                  <div className="md-step-bar-left"></div>
                                  <div className="md-step-bar-right"></div>
                                </div>
                              </div>
                              {this.state.activeStep == 1 &&
                              <div className="checkout-content" style={{height: 'calc(100% - 350px)', overflowY: 'scroll'}}>
                                {orderSummary && Object.keys(orderSummary).map((index) => {
                                    if(typeof index !== 'undefined') {
                                        let sumId = index;
                                        sumId = sumId.replace('p','').replace('g','');
                                        sumId = parseInt(sumId, 10);
                                        return (<SummaryCard index={index} data={orderSummary[index]} summaryId={sumId+1} />);
                                    }
                                })}
                                <div className="summary-total">Total:  <span className="rupee">₹</span><span id="price">{Math.round(this.getTotal())}</span>
                                    <div style={{fontSize: '13px', marginTop: '5px', marginLeft: '2px'}}>(incl GST + delivery charges)</div>
                                </div>
                                <div id="checkoutBtn" className="card-btn checkout" style={{bottom: '60px', marginTop: 'auto'}} onClick={()=>{document.getElementById('step1').classList.add('done');this.setState({showCoupon: false, activeStep: 2});document.getElementById('step2Circle').classList.add('active');}}>Next&nbsp;→
                                    <div className=""></div>
                                </div>
                              </div>}
                              {this.state.showCoupon &&
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
                                                        <div className="usp-title">
                                                            <input id="dPincode" type="text" className="step-input" placeholder="Your pincode"/>
                                                            <textarea id="dAddress" className="step-input" className="step-input step-textarea" placeholder="Delivery address (with landmark)" />
                                                            <input id="dMobile" type="text" className="step-input" placeholder="Mobile number" style={{top:'198px'}}/>
                                                            <input id="dName" type="text" className="step-input" placeholder="Your full name" style={{top:'238px'}}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                        </div>

                                <div id="checkoutBtnStep2" className="card-btn checkout" style={{top: '532px', marginTop: 'auto'}} onClick={()=>{document.getElementById('step2').classList.add('done');this.captureAddress();}}>Next&nbsp;→
                                    <div className=""></div>
                                </div>
                              </div>}
                              {this.state.showSlot &&
                              <div className="checkout-content">
                                  <div className="card-container small" style={{padding: '0px 12px 0px 12px', minHeight: '246px'}}>
                                      <div className="section-one">
                                          <div className="top-right">
                                              <img src="../img/images/delivery.png" className="delivery-icon" />
                                              <div className="usp-title" style={{left: '0',right: '0',margin: '0 auto'}}>
                                                  <span className="title-ff" style={{top:'-14px', padding: '20px', lineHeight: '22px'}}>When should we deliver your sample order?</span>
                                                  <div className="delivery-section">
                                                      <div className="deliver-cell" style={{marginTop: '60px'}}>
                                                          <span>Date:</span><input type="date" value={this.state.deliveryDate} onChange={(e)=>{this.setState({deliveryDate:e.target.value});sessionStorage.setItem('deliveryDate',e.target.value);}}/>
                                                      </div>
                                                      <div className="deliver-cell" style={{marginTop: '12px'}}>
                                                        <span>Slot:</span>
                                                          <select name="slot" id="slot" className="slot-dropdown" onChange={(e)=>{sessionStorage.setItem('deliverySlot',e.target.options[e.target.selectedIndex].text);}}>
                                                              <option value="Saturday 6pm to 7p">Saturday 6pm to 7pm</option>
                                                              <option value="Saturday 7pm to 8pm">Saturday 7pm to 8pm</option>
                                                              <option value="Saturday 8pm to 9pm">Saturday 8pm to 9pm</option>
                                                              <option value="Saturday 9pm to 10pm">Saturday 9pm to 10pm</option>
                                                              <option value="Sunday 6pm to 7p">Sunday 6pm to 7pm</option>
                                                              <option value="Sunday 7pm to 8pm">Sunday 7pm to 8pm</option>
                                                              <option value="Sunday 8pm to 9pm">Sunday 8pm to 9pm</option>
                                                              <option value="Sunday 9pm to 10pm">Sunday 9pm to 10pm</option>
                                                            </select>
                                                      </div>
                                                      <div className="slot"></div>
                                                  </div>
                                                  <br/>
                                                  <span className="title-ff" style={{top: '210px', padding: '20px', lineHeight: '22px', fontWeight: 'normal', fontSize: '15px', marginLeft: '4px'}}>Proceed to next step to make payment.</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>

                                      <div id="checkoutBtnStep11" className="card-btn checkout" style={{top: '532px', marginTop: 'auto'}} onClick={()=>{document.getElementById('step2').classList.add('active');document.getElementById('step3Circle').classList.add('active');this.setState({showCoupon: false, showSlot: false, activeStep: 3});this.makePaymentRequest();}}>Next&nbsp;→
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
                        </div>





                        <Paper>
                        <Tabs
                            value={this.state.value}
                            onChange={this.handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            centered
                          >
                            <Tab icon={<LocalPizzaIcon />} label="&nbsp;&nbsp;&nbsp;Pizzas&nbsp;&nbsp;&nbsp;" />
                            <Tab icon={<RestaurantIcon />} label="&nbsp;&nbsp;&nbsp;Starters&nbsp;&nbsp;&nbsp;" />
                          </Tabs>
                          <TabPanel value={this.state.value} index={0}>

                               {results && location.href.indexOf('/redirect/')==-1 && location.href.indexOf('/credits/')==-1 && results.map((resultItem, index) => {
                                                                       return (<Card index={index} data={resultItem} type="pizzas" />);
                                                                   })}

                               {location.href.indexOf('/redirect/')!=-1 && location.href.indexOf('&payment_status=Credit') !=-1 && <div className="card-container">
                                       <div className="status-title">
                                           <br/>
                                           <span>Thanks for ordering your homely pizza!</span>
                                           <br/>
                                           <img className="ic-delivery" src="../img/images/ic_delivery.png" />
                                           <br/>
                                           <div className="small-title">Our delivery executive will get in touch with you once your pizza is dispatched.</div>
                                        </div>

                               </div>}

                               {location.href.indexOf('/redirect/')!=-1 && location.href.indexOf('&payment_status=Credit') == -1 && <div className="card-container">
                                       <div className="status-title" style={{paddingTop: '38px'}}>
                                           <span>Your order is still pending</span>
                                           <br/><br/>
                                           <span className="small-title">Payment failed. Please retry by clicking the button below.</span>
                                           <br/>
                                           <div className="card-btn checkout small" onClick={()=>{location.href=localStorage.getItem('paymentLink');}}>Retry Payment
                                                                               <div className=""></div>
                                                                           </div>
                                           <br/>
                                           <span className="small-title" style={{marginTop: '92px', fontSize: '16px'}}>If you continue to face issues, please call us at <a style={{color: '#ffd355'}} href="tel:+91-7619514999">+91-7619514999</a></span>
                                        </div>

                               </div>}

                               {location.href.indexOf('/credits/')!=-1 && <div className="card-container">
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
                          </TabPanel>
                          <TabPanel value={this.state.value} index={1}>

                                {starters && location.href.indexOf('/redirect/')==-1 && location.href.indexOf('/credits/')==-1 && starters.map((resultItem, index) => {
                                                                        return (<Card index={index} data={resultItem} type="starters" />);
                                                                    })}

                                {location.href.indexOf('/redirect/')!=-1 && location.href.indexOf('&payment_status=Credit') !=-1 && <div className="card-container">
                                        <div className="status-title">
                                            <img src="../../../img/images/ic_tickw.png" className="status-img" />
                                            <span>Thanks for ordering your homely pizza!</span>
                                            <br/>
                                            <img className="ic-delivery" src="../../../img/images/ic_delivery.png" />
                                            <span className="small-title">Our delivery executive will get in touch with you as per your chosen delivery slot.</span>
                                         </div>

                                </div>}

                                {location.href.indexOf('/redirect/')!=-1 && location.href.indexOf('&payment_status=Credit') == -1 && <div className="card-container">
                                        <div className="status-title">
                                            <img src="../../../img/images/ic_error.png" className="status-img error" />
                                            <span>Your order is still pending</span>
                                            <br/><br/>
                                            <span className="small-title">Payment failed. Please retry by clicking the button below.</span>
                                            <br/>
                                            <div className="card-btn checkout small" onClick={()=>{location.href=localStorage.getItem('paymentLink');}}>Retry Payment
                                                                                <div className=""></div>
                                                                            </div>
                                            <br/>
                                            <span className="small-title" style={{marginTop: '92px', fontSize: '16px'}}>If you continue to face issues, please call us at <a style={{color: '#ffd355'}} href="tel:+91-7619514999">+91-7619514999</a></span>
                                         </div>

                                </div>}

                                {location.href.indexOf('/credits/')!=-1 && <div className="card-container">
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

                          </TabPanel>
                        </Paper>







                    </div>
                <br/>
                </div>)
    }
}

export default withRouter(Shortlists);