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
        openDialogButton.addEventListener("click", () => dialog.showModal());
        dialog.addEventListener('close', () => console.log(dialog.returnValue ))
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
            curStep: 0,
            redirect: false,
            status: window.location.href.indexOf('?status=success') >= 0 ? 'success' :'default',
            clubUserSrc: '',
            loggedIn: localStorage.getItem('club-user-email') != null
        };
        window.currSlotSelected = '';
        this.handleTabChange = this.handleTabChange.bind(this);
    }
    componentDidMount() {
        var winHeight = window.innerHeight;
        if(window.pushalertbyiw ) {
            (pushalertbyiw = window.pushalertbyiw || []).push(['onReady', this.onPAReady.bind(this)]);
        }
        if(localStorage.getItem('notification-dialog')!=null && localStorage.getItem('notification-dialog')=='true') {
            this.setState({curStep: 1});
        }
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
        this.setState({curStep: stepNum});
    }
    login(user) {
        /*user = {
            email: "sampath.oops@gmail.com",
            name: "Sampath Kumar",
            picture: "https://lh3.googleusercontent.com/a/ACg8ocLtum4AlxFD493ly4Vq6eWkcn5OVzamu8t38lwSh57P=s96-c"
        }*/
        var email = '';
        var name = '';
        var picture = '';
        if (localStorage.getItem('club-user-name') != null) {
            email = localStorage.getItem('club-user-email');
            name = localStorage.getItem('club-user-name');
            picture = localStorage.getItem('club-user-pic');
            this.setState({loggedIn: true});
            this.setState({clubUserSrc: picture});
            if (localStorage.getItem('notification-dialog') == 'false' && localStorage.getItem('onboarded')!=null && localStorage.getItem('onboarded')=='true') {
                this.setState({curStep: 3});
            } else {
                this.setState({curStep: 1});
            }
            
            return;
        } else {
            email = user.email;
            name = user.name;
            picture = user.picture;
            localStorage.setItem('club-user-pic',user.picture);
            this.setState({clubUserSrc: picture});
        }
        
        //create order
        var http = new XMLHttpRequest();
        var url = '/createClubUser';
        var params = 'email='+email+'&name='+name;
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
                    }
                    localStorage.setItem('clubCode', res.code);
                    localStorage.setItem('club-user-email',email);
                    localStorage.setItem('club-user-name',name);
                    this.setState({loggedIn: true});
                    this.showNotificationDialog();
                }
            }
        }.bind(this);
        http.send(params);
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
                            axios.get(`/user-orders/${localStorage.getItem('club-user-email')}`)
                              .then(function (response) {
                                console.log('User orders-----', response.data);
                                if(response.data != 'error') {
                                    var userOrders = JSON.stringify(response.data);
                                    console.log('--user orders--', userOrders);
                                }
                              }.bind(this));
                    }
                }
            }
        }.bind(this);
        http.send(params);
    }

    render() {
        const {status, orderTitle, dateTime, booking, customer, toppings, extras, location, mapUrl, comments, showLoader, results, starters, orderSummary, showCoupon, showSlot, showList, showWizard, numVistors, curStep, redirect} = this.state;

        return (<div style={{marginTop: '84px'}}>
                    <img id="logo" className="logo-img" src="../img/images/logo_scr.jpg" style={{width: '142px'}} onClick={()=>{window.location.href='/dashboard';}} />
                    <img className='club-logo' src="../img/images/offer.png" />
                    <span className='club'>Club</span>
                    {this.state.clubUserSrc != '' && <img className='club-user-avatar' src={this.state.clubUserSrc} onClick={()=>{document.querySelector("#dialog").showModal()}}/>}
                    {status == 'success' && <span className="stage-heading status-success">Order created successfully</span>}
                    <Paper>

                                              <TabPanel value={this.state.value} index={0}>
                                                {!this.state.loggedIn && <div className="club-main" >
                                                   <span className="club-heading" style={{top: '12px'}}>Welcome to the club!</span>
                                                   <hr className="line-light" style={{marginTop: '52px', marginBottom: '0px',visibility: 'hidden'}}/>
                                                   <span className="club-desc" >Get exclusive benefits instantly! Login with your Google account for instant access.</span>
                                                   <br/><br/><br/>
                                                   <img className='club-banner' src="../img/images/club-banner.png" />
                                                   {localStorage.getItem('club-user') == null && this.state.clubUserSrc == '' && localStorage.getItem('club-user-pic') == null && <GoogleOneTapLogin onError={(error) => console.log(error)} onSuccess={(response) => {console.log('club login response: ',response);this.login(response);}} googleAccountConfigs={{ client_id: '854842086574-uk0kfphicblidrs1pkbqi7r242iaih80.apps.googleusercontent.com',auto_select: false,cancel_on_tap_outside: false }} />}
                                                   <br/><br/><br/><br/><br/>
                                                   <br/><br/><br/><br/>
                                                </div>}
                                                {this.state.loggedIn && curStep != 3 &&
                                                   <div className="md-stepper-horizontal orange">
                                                        <div id="step1" className="md-step" style={{paddingLeft: '10px'}}>
                                                        <div className={`md-step-circle ${this.state.curStep == 1 ? 'active' : ''}`}><span>1</span></div>
                                                        <div className={`md-step-title ${this.state.curStep == 1 ? 'active' : ''}`}>Subscribe</div>
                                                        <div className="md-step-bar-left"></div>
                                                        <div className="md-step-bar-right"></div>
                                                        </div>
                                                        <div id="step2" className="md-step">
                                                        <div className={`md-step-circle ${this.state.curStep == 2 ? 'active' : ''}`}><span>2</span></div>
                                                        <div className={`md-step-title ${this.state.curStep == 2 ? 'active' : ''}`}>Review</div>
                                                        <div className="md-step-bar-left"></div>
                                                        <div className="md-step-bar-right"></div>
                                                        </div>
                                                        <div id="step3" className="md-step">
                                                        <div className={`md-step-circle ${this.state.curStep == 3 ? 'active' : ''}`}><span>3</span></div>
                                                        <div className={`md-step-title ${this.state.curStep == 3 ? 'active' : ''}`}>Avail</div>
                                                        <div className="md-step-bar-left"></div>
                                                        <div className="md-step-bar-right"></div>
                                                        </div>
                                                    </div>}
                                                {curStep == 1 && <div>
                                                    <span className="club-heading" style={{top: '12px'}}></span>
                                                        <hr className="line-light" style={{marginTop: '22px', marginBottom: '0px',visibility: 'hidden'}}/>
                                                        <span className="club-desc-1" >Subscribe to notifications to continue. You will receive delivery, tracking & offer notifications.</span>
                                                        <br/><br/><br/>
                                                        <img className='club-banner' src="../img/images/club-banner.png" style={{marginTop: '6px'}}/>
                                                        {localStorage.getItem('club-user') == null && this.state.clubUserSrc == '' && localStorage.getItem('club-user-email') == null && <GoogleOneTapLogin onError={(error) => console.log(error)} onSuccess={(response) => {console.log('club login response: ',response);this.login(response);}} googleAccountConfigs={{ client_id: '854842086574-uk0kfphicblidrs1pkbqi7r242iaih80.apps.googleusercontent.com',auto_select: false,cancel_on_tap_outside: false }} />}
                                                        <br/>
                                                        <a id="nextStep1" class="button" style={{bottom: '20px'}} onClick={()=>{this.changeStep(2);this.loadSurvey();}}>Next</a>
                                                        <br/>
                                                   </div>}
                                                   {curStep == 2 && <div>
                                                    <span className="club-heading" style={{top: '12px'}}></span>
                                                        <hr className="line-light" style={{marginTop: '4px', marginBottom: '0px',visibility: 'hidden'}}/>
                                                        <span className="club-desc-2" >Your club code:<span className="club-code">{localStorage.getItem('clubCode')}</span></span>
                                                        <br/>
                                                        <span className='club-desc-1' style={{marginTop: '64px'}}>
                                                        🎉 You're now a CLUB member! Share your experience to get more loyalty benefits.
                                                        </span>
                                                        <br/>
                                                        <button type="button" className="login-with-google-btn" onClick={()=>{window.open('https://g.page/r/CQwiiF6lQrvREBM/review');}}>Share via Google</button>
                                                        <a id="nextStep1" class="button" style={{bottom: '20px'}} onClick={()=>{this.changeStep(3);this.onboardClubUser();}}>Next</a>
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