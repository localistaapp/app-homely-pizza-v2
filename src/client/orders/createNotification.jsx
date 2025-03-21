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
import { ChatBubble } from '@material-ui/icons';

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


class CreateNotification extends Component {

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
            notifJsonText: '',
            notifJsonArr: [],
            contentTitle: '', contentDesc: '', contentHTML: '', contentHeroImg: '',
            status: window.location.href.indexOf('?status=success') >= 0 ? 'success' :'default'
        };
        window.currSlotSelected = '';
        this.handleTabChange = this.handleTabChange.bind(this);
        this.createEnquiryOrder = this.createEnquiryOrder.bind(this);
    }
    componentDidMount() {
        var winHeight = window.innerHeight;
        this.handlePaste = this.handlePaste.bind(this);
        this.sendNotif = this.sendNotif.bind(this);
        this.sendContentNotif = this.sendContentNotif.bind(this);
    }
    handlePaste(clipboardText) {
        this.setState({notifJsonText: clipboardText});
        this.setState({notifJsonArr: JSON.parse(clipboardText)});
        console.log('--notifArr--', clipboardText);
        
    }
    sendNotif(pTitle, pDesc) {
        axios.post(`/push-notif`, {title: pTitle, description: pDesc}).then((response) => {
            console.log('--Push Response--', response);
            setTimeout(()=>{window.location.href='/dashboard-create-notif?status=success';},2000);
        });
    }
    sendContentNotif(pTitle, pDesc, pUrl) {
        const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        axios.post(`/push-content-notif`, {title: pTitle, description: pDesc, url: pUrl, currDay: dayName}).then((response) => {
            console.log('--Push Response--', response);
            setTimeout(()=>{window.location.href='/dashboard-create-notif?status=success';},2000);
        });
    }
    handleTabChange(event, newValue) {
        console.log('neValue: ', newValue);
        this.setState({value: newValue});
        if(newValue == 1) { //content tab 
            const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
            axios.get('/get-push-content/'+dayName)
            .then(function (response) {
                console.log('--response.data--', response.data);
                const contentData = response.data && response.data[0] ? response.data[0] : response.data;
                axios.get('https://api.pexels.com/v1/search?per_page=10&query='+contentData.title, {headers: {"Authorization" : "hSw8j6DGI2bdFLRRDenSsYpja0zA0CENUsIIskj5ZdHHNm3mAr7iEgkz"}})
                .then(function (imgres) {
                    console.log('--img res--', imgres.data.photos[Math.floor(Math.random() * 6) + 1].src.large);
                    this.setState({contentTitle: contentData.title, contentDesc: contentData.description, contentHTML: contentData.html, contentHeroImg: imgres.data.photos[Math.floor(Math.random() * 6) + 1].src.large });
                }.bind(this));
            }.bind(this));
        }
    }
    createEnquiryOrder() {
        var orderName = document.getElementById('orderName').value;
        var orderDate = document.getElementById('orderDate').value;
        var orderTime = document.getElementById('orderTime').value;
        var orderContact = document.getElementById('orderContact').value;
        var orderAddress = document.getElementById('orderAddress').value;
        var orderCity = document.getElementById('orderCity').value;
        var orderPizzaQty = document.getElementById('orderPizzaQty').value;
        var orderPizzaSize = document.getElementById('orderPizzaSize').value;
        var orderGarlicBreadQty = document.getElementById('orderGarlicBreadQty').value;
        var orderWrapsQty = document.getElementById('orderWrapsQty').value;
        var orderToppingIng = document.getElementById('orderToppingIng').value;
        var orderSpecialIng = document.getElementById('orderSpecialIng').value;
        var orderExtras = document.getElementById('orderExtras').value;
        var orderComments = document.getElementById('orderComments').value;
        let franchiseId = '1';
        if (sessionStorage.getItem('user-profile') != null) {
            franchiseId = JSON.parse(sessionStorage.getItem('user-profile'))[0].id;
        }
        //create enquiry
        var http = new XMLHttpRequest();
        var url = `/createEnquiry/${franchiseId}`;
        var params = 'orderName='+orderName+'&orderDate='+orderDate+'&orderTime='+orderTime;
        params += '&orderContact='+orderContact;
        params += '&orderAddress='+encodeURI(orderAddress)+'&orderCity='+orderCity;
        params += '&orderPizzaQty='+orderPizzaQty+'&orderPizzaSize='+orderPizzaSize;
        params += '&orderGarlicBreadQty='+orderGarlicBreadQty+'&orderWrapsQty='+orderWrapsQty+'&orderToppingIng='+orderToppingIng;
        params += '&orderSpecialIng='+orderSpecialIng+'&orderExtras='+orderExtras+'&orderComments='+orderComments+'&orderType=EVENT';
        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        http.onreadystatechange = function() {//Call a function when the state changes.
            console.log('http.status: ', http.status);
            if(http.readyState == 4 && http.status == 200) {
                console.log('confirmed enquiry creation post response:', http.responseText);
                var res = http.responseText;
                if(res != null){
                    window.location.href='/dashboard-create-enquiry?status=success';
                }
            }
        }.bind(this);
        http.send(params);
    }

    render() {
        const {status, notifJsonText, notifJsonArr, orderTitle, dateTime, booking, customer, toppings, extras, location, mapUrl, comments, showLoader, results, starters, orderSummary, showCoupon, showSlot, showList, showWizard, numVistors, curStep, redirect} = this.state;

        return (<div style={{marginTop: '84px'}}>
                    <img id="logo" className="logo-img" src="../img/images/logo_scr.jpg" style={{width: '142px',position: 'absolute'}} onClick={()=>{window.location.href='/dashboard';}} />
                    {status == 'success' && <span className="stage-heading status-success">Notification sent successfully</span>}
                    <Paper>
                    <Tabs
                            value={this.state.value}
                            onChange={this.handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            centered
                            style={{paddingLeft: '10px'}}
                          >
                            <Tab label="Event" />
                            <Tab label="Content" />
                            <Tab label="Product/Offer" />
                          </Tabs>
                          <TabPanel value={this.state.value} index={0}>
                                                   <span className="stage-heading" style={{top: '12px',background: '#f6f6f6'}}><ChatBubble />&nbsp;&nbsp;Create Notification</span>
                                                   <hr className="line-light" style={{visibility: 'hidden'}}/>
                                                   <br/>
                                                   <span className="stage-desc"><textarea id="notifJson" value={this.state.notifJsonText} onChange={(e) => this.setState({notifJsonText: e.target.value})} className="txt-field right" style={{float: 'left', left: '40px', width: 'auto', minHeight: '80px'}} onPaste={(e)=>{console.log('--pasted1--', e.clipboardData.getData("text"));this.handlePaste(e.clipboardData.getData("text"));}}></textarea></span>
                                                   
                                                   <br/>

                                                   {
                                                    notifJsonArr.map((item, index) => {
                                                        return (
                                                        <div className="notif-c" style={{marginTop: index == 0? '0px' : '270px'}}>
                                                            <span className="stage-desc" ><textarea id={`notifTitle${index}`} className="txt-field right" style={{float: 'left', left: '40px', width: 'auto', minHeight: '60px', marginTop: '60px'}}  >{item.title}</textarea></span>
                                                            <span className="stage-desc"><textarea id={`notifDesc${index}`} className="txt-field right" style={{float: 'left', left: '40px', width: 'auto', minHeight: '150px', marginTop: '110px'}}  >{item.description}</textarea></span>
                                                            <a className="button" style={{position:'absolute',marginTop:'270px',width:'80%'}} onClick={()=>{this.sendNotif(document.getElementById(`notifTitle${index}`).value,document.getElementById(`notifDesc${index}`).value);}}>Push →</a>
                                                        </div>
                                                        );
                                                    })
                                                   }
                                                   
                                                   <br/><br/>
                                                   <br/>

                                              </TabPanel>
                                              <TabPanel value={this.state.value} index={1}>
                                                <div className='content-elem'>
                                                    <div className='content-post-title' >{this.state.contentTitle}</div>
                                                    <div className='content-post-img' ><img src={this.state.contentHeroImg} /></div>
                                                    <div className='content-post-body' dangerouslySetInnerHTML={{__html: this.state.contentHTML}} />
                                                </div>
                                                <div className='content-notif-elem'>
                                                    <div className='content-elem-title'>{this.state.contentTitle}</div>
                                                    <div className='content-elem-body'>{this.state.contentDesc}</div>
                                                    <a className="button" onClick={()=>{this.sendContentNotif(this.state.contentTitle,this.state.contentDesc,'https://www.slimcrust.com/app?content=true');}}>Push →</a>
                                                </div>
                                              </TabPanel>
                                            </Paper>
                </div>)
    }
}

export default withRouter(CreateNotification);
