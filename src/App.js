import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import bostaLogo from './bosta-logo.png';
import delivered from './delivered.jpg'
import delivery from './delivery.jpg'
import received from './received.jpg'
import ticket from './ticket.jpg'
import address from './address.png'
import { FaSearch } from "react-icons/fa";

const TrackingApp = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [branch, setBranch] = useState('');
  const [date, setDate] = useState('');
  const [currentStatus, setStatus] = useState('');
  const [time, setTime] = useState('');
  const [promised, setPromised] = useState('');
  const [provider, setProvider] = useState('');
  const [latestUpdate, setUpdate] = useState('');
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en');

  var stageFound;

 // to fetch data from the API
  const fetchData = async () => {
    try {
      const response = await axios.get(`https://tracking.bosta.co/shipments/track/${trackingNumber}`);
      const trackingData = response.data;
      setTrackingData(trackingData);
      setBranch('Nasr City');
      setDate(trackingData.timestamp);
      setStatus(trackingData.CurrentStatus.state);
      setTime(trackingData.CurrentStatus.time);
      setPromised(trackingData.PromisedDate);
      setProvider(trackingData.provider);
      if(trackingData.nextWorkingDay){
        setUpdate(trackingData.nextWorkingDay[trackingData.nextWorkingDay.length - 1].dayName + ' ' + trackingData.nextWorkingDay[trackingData.nextWorkingDay.length - 1].dayDate);
      }
      setError(null);
    }

    catch (error) {
      console.error('Error fetching data:', error);
      setTrackingData(null);
      setError('Error fetching data. Please try again.');
    }
  };

  // to change page language according to user's desire
  const handleLanguageChange = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'en' ? 'ar' : 'en'));
  };

  // translating so that page can support both languages
  const translate = (state) => {
    if(state == 'TICKET_CREATED') state = 'تم انشاء الشحنة'
    if(state == 'PACKAGE_RECEIVED') state = 'تم استلام الشحنة من التاجر'
    if(state == 'OUT_FOR_DELIVERY') state = 'الشحنة خرجت للتسليم'
    if(state == 'WAITING_FOR_CUSTOMER_ACTION') state = 'في انتظار تأكيد العميل'
    if(state == 'IN_TRANSIT') state = 'في الطريق'
    if(state== 'NOT_YET_SHIPPED') state = 'لم تشحن بعد'
    if(state == 'DELIVERED') state = 'تم التسليم'
    if(state == 'DELIVERED_TO_SENDER') state = 'تم التسليم الـى المرسل'
    if(state == 'CANCELLED') state = 'تم الغاء الشحنة'
  
    return state;
  };

  // determining  the color of the checkpoints in the progress bar according to shipment tracking
  const getCheckpointClass = () => {
    const state = trackingData.CurrentStatus.state;

    if (state === 'DELIVERED') {
      return 'green-text';
    } else if (state === 'CANCELLED') {
      return 'red-text';
    } else {
      return 'yellow-text';
    }
  };

  // determining whether the checkpoint will be ticked
  const getTick = (stage) => {
    let stageFound = false;

    for (let i = 0; i < trackingData.TransitEvents.length; i++) {
      const event = trackingData.TransitEvents[i];
      if (event.state === stage) {
        stageFound = true;
        return stageFound;
      }
    }
  }

  return (
    <div className='body'>
      {/* first part of menu */}
      <div className="menu">
        <img src={bostaLogo} alt="Bosta Logo" className="logo" style={{ width: '10%', height: 'auto' }}/>
        <ul>{language === 'en' ? 'Home' : 'الرئيسية'}</ul>
        <ul>{language === 'en' ? 'Pricing' : 'الأسعار'}</ul>
        <ul>{language === 'en' ? 'Call Sales' : 'كلم المبيعات'}</ul>
      
      {/* second part of menu */}

        <div className='menu-options'>
            <div className="track-shipment">
              <ul>{language === 'en' ? 'Track Shipment' : 'تتبع شحنتك'}</ul>

              {/* tracking shipment */}
              <div className="search-container">
                <input type="text" placeholder={language === 'en' ? 'Enter tracking number' : 'أدخل رقم التتبع'} value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}/>
                <button onClick={fetchData} type="submit" className='search-icon'><FaSearch /></button>
            </div>
            
          </div>

          <ul>{language === 'en' ? 'Login' : 'تسجيل الدخول'} </ul>
          <button className="fetch-button" onClick={fetchData}></button>
          <ul><button className="language-switch" onClick={handleLanguageChange}>{language === 'en' ? 'العربية' : 'En'}</button></ul>
        </div>

      </div>

{trackingData && trackingData.TransitEvents && (
  // top table shows general information
  <div className='top-container'>
    <div className="top-table-container">
      <table className="top-table">

        <thead>
          <tr>
            <th>{language === 'en' ? 'Shipment Number ' : ' رقم الشاحنة '}{trackingData.TrackingNumber}</th>
            <th>{language === 'en' ? 'Latest Update' : 'أخر تحديث'}</th>
            <th>{language === 'en' ? 'Provider' : 'اسم التاجر'}</th>
            <th>{language === 'en' ? 'Delivery Within' : 'موعد التسليم خلال'}</th>
          </tr>
        </thead>

        <tbody>
          {<td>
            {/* text's color is determined according to status */}
            <p className={trackingData.TransitEvents[trackingData.TransitEvents.length - 1].state == 'CANCELLED' ? 'red-text' : trackingData.TransitEvents[trackingData.TransitEvents.length - 1].state == 'DELIVERED' ? 'green-text' : 'yellow-text'}>
            {language === 'en'
                      ? trackingData.TransitEvents[trackingData.TransitEvents.length - 1].state
                      : translate(trackingData.TransitEvents[trackingData.TransitEvents.length - 1].state)}
            </p>
        
          </td>}
          {<td>{latestUpdate}</td>}
          {<td>{provider}</td>}
          {<td>{new Date(promised).toLocaleDateString()}</td>}
        </tbody>

      </table>
    </div>

    {/* progress bar   */}
    <div className="wrapper" >
      {/* bar is colored according to shipment data */}
      <div className="content" id="content" data-progress={trackingData.CurrentStatus.state === 'DELIVERED' ? 'full' : trackingData.CurrentStatus.state === 'CANCELLED' ? 'halfOrLess' : 'moreThanHalf'}>

      {/* checkpoints to describe shipment process */}
          <div className="checkpoint" {...stageFound = getTick('TICKET_CREATED')} text= {trackingData.CurrentStatus.state == 'TICKET_CREATED' || !stageFound ? 'white-text' : getCheckpointClass()}>
            {trackingData.CurrentStatus.state !=='TICKET_CREATED' && stageFound ? <span className="tick">✓</span>:<span></span>}
            {trackingData.CurrentStatus.state == 'TICKET_CREATED' || !stageFound ? <img src={ticket} alt="Ticket Created"  style={{ width: '90%', height: '90%' }}/>:<span></span>}
            <div className="header"><p>{language === 'en' ? 'Ticket Created' : 'تم انشاء الشحنة'}</p></div>
          </div>   
          
          <div className="checkpoint" {...stageFound = getTick('PACKAGE_RECEIVED')} text= {trackingData.CurrentStatus.state == 'PACKAGE_RECEIVED' || !stageFound ? 'white-text' : getCheckpointClass()}>
            {trackingData.CurrentStatus.state !=='PACKAGE_RECEIVED' && stageFound ? <span className="tick">✓</span>:<span></span>}
            {trackingData.CurrentStatus.state == 'PACKAGE_RECEIVED' || !stageFound ? <img src={received} alt="Package Received"  style={{ width: '90%', height: '90%' }}/>:<span></span>}
            <div className="header"><p>{language === 'en' ? 'Package Received' : 'تم استلام الشحنة'}</p></div>
          </div>  
          
          <div className="checkpoint" {...stageFound = getTick('OUT_FOR_DELIVERY')} text= {trackingData.CurrentStatus.state == 'OUT_FOR_DELIVERY' || !stageFound ? 'white-text' : getCheckpointClass()}>
            {trackingData.CurrentStatus.state !=='OUT_FOR_DELIVERY' && stageFound ? <span className="tick">✓</span>:<span></span>}
            {trackingData.CurrentStatus.state == 'OUT_FOR_DELIVERY' || !stageFound ? <img src={delivery} alt="Out For Delivery"  style={{ width: '90%', height: '90%' }}/>:<span></span>}
            <div className="header"><p>{language === 'en' ? 'Out for Delivery' : 'الشحنة خرجت للتسليم'}</p></div>
        </div>
        
        <div className="checkpoint" {...stageFound = getTick('DELIVERED')} text= {!stageFound ? 'white-text' : getCheckpointClass()}>
          {trackingData.CurrentStatus.state === 'DELIVERED'? <span className="tick">✓</span> : <span><img src={delivered} alt="Delivered" className="logo" style={{ width: '90%', height: 'auto' }}/></span>}
          <div className="header"><p>{language === 'en' ? 'Delivered' : 'تم التسليم'}</p></div>
        </div>
        
      </div>


      

  </div>
</div>
)}

  {trackingData && trackingData.TransitEvents &&(
    <div className='shipment-details'>
        
        {/* address and reporting an issue */}
        <div className="delivery-address-container">
                    <h2>{language === 'en' ? 'Delivery Address' : 'عنوان التسليم'}</h2>
                    <div className="delivery-address-content">
                      <div className="delivery-text">
                        <p>{language === 'en' ? 'Imbaba Talaat Harb St. Madinat al-Omal next to al-Brens Apartment 17 Block 22, Cairo' : 'امبابة شارع طلعت حرب مدينة العمال بجوار البرنس منزل 17 بلوك 22, Cairo'}</p>
                      </div>
                        <div className='address-bottom'>
                          <div>
                            <p>{language === 'en' ? 'Is there an issue with your shipment?' : 'هل يوجد مشكلة في شحنتك؟'}</p>
                          </div>
                          <div className="delivery-image">
                            <img src={address} alt="Issue with shipment" style={{ width: '100%', height: 'auto' }}/>
                          </div>
                          <button>{language === 'en' ? 'Report an issue' : 'ابلاغ عن مشكلة'}</button>
                      </div>
                    </div>
          </div>
        
        {/* table to display shipment details */}

        <div className="table-container">
          <h2>{language === 'en' ? 'Shipping Details' : 'تفاصيل الشحنة'}</h2>

              <table className="tracking-table">
          
                <thead>
                  <tr>
                    <th>{language === 'en' ? 'Branch' : 'الفرع'}</th>
                    <th>{language === 'en' ? 'Date' : 'التاريخ'}</th>
                    <th>{language === 'en' ? 'Time' : 'الوقت'}</th>
                    <th>{language === 'en' ? 'Details' : 'التفاصيل'}</th>
                  </tr>
                </thead>
          
                <tbody>
                  {trackingData.TransitEvents.map((event, index) => (
                    <tr key={index}>
                      <td>{language === 'en' ? (branch) : 'مدينة نصر'}</td>
                      <td>{new Date(event.timestamp).toLocaleDateString()}</td>
                      <td>{new Date(event.timestamp).toLocaleTimeString()}</td>
                      <td>
                        {language === 'en'
                          ? event.state
                          : translate(event.state)}
                      </td>                
                    </tr>
                  ))}
                </tbody>
              </table>
              
        </div>

    </div>  

        
  )}

    {error && <div style={{ color: 'red' }}>{error}</div>}
      
  </div>
  );
};

export default TrackingApp;
