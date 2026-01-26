'use client'
// import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Crimson_Text } from 'next/font/google'
import InfoHeader from '@/components/InfoHeader'
// import NavBar from '@/components/NavBar'
import localFont from 'next/font/local'
import NavBar from '@/components/NavBar'
import ContactUsFormFooter from '@/components/ContactUsFormFooter'
import Footer from '@/components/Footer'
import { usePathname } from 'next/navigation'
import { SnackbarProvider } from 'notistack'
import { Provider } from 'jotai'
import { ROUTES } from '@/utils/utils'
import Script from 'next/script'
import { useEffect } from 'react'
import { fetchExchangeRatesOnce } from '@/lib/fetchExchangeRates'

const crimson = Crimson_Text({
  variable: '--font-crimson',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
})
const ivyOra = localFont({
  src: [
    { path: './fonts/IvyOraDisplay-Thin.ttf', weight: '100', style: 'normal' },
    { path: './fonts/IvyOraDisplay-ThinItalic.ttf', weight: '100', style: 'italic' },
    { path: './fonts/IvyOraDisplay-RegularItalic.ttf', weight: '400', style: 'italic' },
    { path: './fonts/IvyOraDisplay-Light.ttf', weight: '300', style: 'normal' },
    { path: './fonts/IvyOraDisplay-Regular.ttf', weight: '400', style: 'normal' },
    { path: './fonts/IvyOraDisplay-Medium.ttf', weight: '500', style: 'normal' },
    { path: './fonts/IvyOraDisplay-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-ivyOra',
})
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  const contactFormHiddenRoutes = [
    ROUTES.comingSoon,
    ROUTES.medicalHealthAssessment,
    ROUTES.booking,
    ROUTES.roomDetails,
    ROUTES.reservation,
    ROUTES.paymentReturn,
    ROUTES.thankYou,
    ROUTES.disclaimer,
    ROUTES.privacyPolicy,
  ]

  const hideContactForm =
    pathname.startsWith('#') || contactFormHiddenRoutes.some((route) => pathname.includes(route))

  const isAssessmentPage = pathname.includes(ROUTES.medicalHealthAssessment)

  useEffect(() => {
    // fetchExchangeRatesOnce()
  }, [])
  return (
    <html lang='en'>
      <head>
        <Script id='passive-wheel-listeners' strategy='beforeInteractive'>
          {`
            // Fix for non-passive wheel event listeners
            // This makes wheel event listeners passive by default to improve scroll performance
            (function() {
              if (typeof window === 'undefined') return;
              
              var addEventListener = EventTarget.prototype.addEventListener;
              EventTarget.prototype.addEventListener = function(type, listener, options) {
                var passive = options;
                
                // If options is an object, check if passive is explicitly set
                if (typeof options === 'object' && options !== null) {
                  passive = options.passive;
                }
                
                // For wheel events, default to passive unless explicitly set to false
                if (type === 'wheel' && passive === undefined) {
                  options = typeof options === 'object' && options !== null
                    ? Object.assign({}, options, { passive: true })
                    : { passive: true };
                }
                
                return addEventListener.call(this, type, listener, options);
              };
            })();
          `}
        </Script>
        <Script id='clarity-tx5y3ka0h5' strategy='afterInteractive'>
          {` (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "tx5y3ka0h5");`}
        </Script>
        <Script
          id='zoho-gclid'
          src='https://forms.zoho.in/js/zf_gclid.js'
          strategy='afterInteractive'
        />

        <Script id='zoho-utm-tracking' strategy='afterInteractive'>
          {`
function ZFAdvLead(){
}
ZFAdvLead.utmPValObj = ZFAdvLead.utmPValObj || {};

ZFAdvLead.utmPNameArr = new Array('utm_source','utm_medium','utm_campaign','utm_term','utm_content');ZFAdvLead.utmcustPNameArr = new Array();ZFAdvLead.isSameDomain = false;

ZFAdvLead.prototype.zfautm_sC = function( paramName,path,domain,secure ){
  var value = ZFAdvLead.utmPValObj[paramName];
  if ( typeof value !== "undefined" && value !== null ){
    var cookieStr = paramName + "=" + encodeURIComponent( value );
    var exdate=new Date();
    exdate.setDate(exdate.getDate()+7);
    cookieStr += "; expires=" + exdate.toGMTString();
    cookieStr += "; path=/";
    if ( domain ) {
      cookieStr += "; domain=" + encodeURIComponent( domain );
    }
    if ( secure ) {
      cookieStr += "; secure";
    }
    document.cookie = cookieStr;
  }
};
ZFAdvLead.prototype.zfautm_ini = function (){
  this.zfautm_bscPCap();
  var url_search = document.location.search;
  for (var i = 0; i < ZFAdvLead.utmcustPNameArr.length ; i ++){
    var zf_pN = ZFAdvLead.utmcustPNameArr[i];
    var zf_pV;
    if ( zf_pN == 'referrername' ) {
      zf_pV = ( document.URL || '' ).slice( 0, 1500 );
    } else {
      zf_pV = this.zfautm_gP(url_search, zf_pN);
      if (zf_pV == undefined || zf_pV == ''){
          zf_pV = this.zfautm_gC(zf_pN);
      }
    }
    if ( typeof zf_pV !== "undefined" && zf_pV !== null & zf_pV != "" ) {
      ZFAdvLead.utmPValObj[ zf_pN ] = zf_pV;
    }
  }
  for (var pkey in ZFAdvLead.utmPValObj) {
    this.zfautm_sC(pkey);
  }
};
ZFAdvLead.prototype.zfautm_bscPCap = function () {
  var trafSrc = this.zfautm_calcTrafSrc();
  if ( trafSrc.source != "" ) {
    ZFAdvLead.utmPValObj.utm_source = trafSrc.source;
  }
  if ( trafSrc.medium != "" ) {
    ZFAdvLead.utmPValObj.utm_medium = trafSrc.medium;
  }
  if ( trafSrc.campaign != "" ) {
    ZFAdvLead.utmPValObj.utm_campaign = trafSrc.campaign;
  }
  if ( trafSrc.term != "" ) {
    ZFAdvLead.utmPValObj.utm_term = trafSrc.term;
  }
  if ( trafSrc.content != "" ) {
    ZFAdvLead.utmPValObj.utm_content = trafSrc.content;
  }
}
ZFAdvLead.prototype.zfautm_calcTrafSrc = function() {
  var u1='', u2='', u3='', u4='', u5='';
  var search_engines = [['bing', 'q'], ['google', 'q'], ['yahoo', 'q'], ['baidu', 'q'], ['yandex', 'q'], ['ask', 'q']]; //List of search engines 
  var ref = document.referrer;
  ref = ref.substr(ref.indexOf('//')+2);
  ref_domain = ref;
  ref_path = '/';
  ref_search = '';

  // Checks for campaign parameters
  var url_search = document.location.search;
  if(url_search.indexOf('utm_source') > -1 || url_search.indexOf('utm_medium') > -1 || url_search.indexOf('utm_campaign') > -1 || url_search.indexOf('utm_term') > -1 || url_search.indexOf('utm_content') > -1) {
    u1 = this.zfautm_gP(url_search, 'utm_source'); 
    u2 = this.zfautm_gP(url_search, 'utm_medium'); 
    u3 = this.zfautm_gP(url_search, 'utm_campaign'); 
    u4 = this.zfautm_gP(url_search, 'utm_term'); 
    u5 = this.zfautm_gP(url_search, 'utm_content'); 
  } else if ( this.zfautm_gP(url_search, 'gclid')) {
    u1 = 'Google Ads'; 
    u2 = 'cpc'; 
    u3 = '(not set)'; 
    if ( !ZFAdvLead.utmcustPNameArr.includes('gclid') ) {
      ZFAdvLead.utmcustPNameArr.push('gclid');
    }
  } else if(ref) {
    var r_u1 = this.zfautm_gC('utm_source'); 
    var r_u2 = this.zfautm_gC('utm_medium'); 
    var r_u3 = this.zfautm_gC('utm_campaign'); 
    var r_u4 = this.zfautm_gC('utm_term'); 
    var r_u5 = this.zfautm_gC('utm_content'); 
    if ( typeof r_u1 === "undefined" && typeof r_u2 === "undefined" && typeof r_u3 === "undefined" && typeof r_u4 === "undefined" && typeof r_u5 === "undefined") {
      // separate domain, path and query parameters
      if (ref.indexOf('/') > -1) {
        ref_domain = ref.substr(0,ref.indexOf('/'));
        ref_path = ref.substr(ref.indexOf('/'));
        if (ref_path.indexOf('?') > -1) {
          ref_search = ref_path.substr(ref_path.indexOf('?'));
          ref_path = ref_path.substr(0, ref_path.indexOf('?'));
        }
      }
      u2 = 'referral'; 
      u1 = ref_domain;                    
    // Extract term for organic source
      for (var i=0; i<search_engines.length; i++){
        if(ref_domain.indexOf(search_engines[i][0]) > -1){
          u2 = 'organic'; 
          u1 = search_engines[i][0];
          u4 = this.zfautm_gP(ref_search, search_engines[i][1]) || '(not provided)';
          break;
        }
      }
    } else {
      if ( typeof r_u1 !== "undefined" ) {
        u1 = r_u1;
      }
      if ( typeof r_u2 !== "undefined" ) {
          u2 = r_u2;
      }
      if ( typeof r_u3 !== "undefined" ) {
        u3 = r_u3;
      }
      if ( typeof r_u4 !== "undefined" ) {
        u4 = r_u4;
      }
      if ( typeof r_u5 !== "undefined" ) {
        u5 = r_u5;
      }
    }
  } else {
    var r_u1 = this.zfautm_gC('utm_source'); 
    var r_u2 = this.zfautm_gC('utm_medium'); 
    var r_u3 = this.zfautm_gC('utm_campaign'); 
    var r_u4 = this.zfautm_gC('utm_term'); 
    var r_u5 = this.zfautm_gC('utm_content'); 
    if ( typeof r_u1 === "undefined" && typeof r_u2 === "undefined" && typeof r_u3 === "undefined" && typeof r_u4 === "undefined" && typeof r_u5 === "undefined") {
      var locRef = document.URL;
      locRef = locRef.substr(locRef.indexOf('//')+2);
      if (locRef.indexOf('/') > -1) {
        locRef = locRef.substr(0,locRef.indexOf('/'));
      }
      u1 = locRef;
      u2 = 'referral'; 
    } else {
      if ( typeof r_u1 !== "undefined" ) {
        u1 = r_u1;
      }
      if ( typeof r_u2 !== "undefined" ) {
        u2 = r_u2;
      }
      if ( typeof r_u3 !== "undefined" ) {
        u3 = r_u3;
      }
      if ( typeof r_u4 !== "undefined" ) {
        u4 = r_u4;
      }
      if ( typeof r_u5 !== "undefined" ) {
        u5 = r_u5;
      }
    }
  }
  return {
    'source'  : u1, 
    'medium'  : u2, 
    'campaign': u3, 
    'term'    : u4, 
    'content' : u5 
  };
}
ZFAdvLead.prototype.zfautm_gP = function(s, q) {
  try{
      var match = s.match('[?&]' + q + '=([^&]+)');
      if ( match ) {
        if ( match[1].length > 199 ) {
          var raw = decodeURIComponent(match[1]);
          raw = raw.replace(/[^A-Za-z0-9_]/g, '');
          return raw.slice( 0, 199 );
        } else {
          return decodeURIComponent(match[1]);
        }
        
      } else {
        return '';
      }
  } catch(e){
    return '';  
  }
}
ZFAdvLead.prototype.zfautm_gC = function( cookieName ){
  var cookieArr = document.cookie.split('; ');
  for ( var i = 0 ; i < cookieArr.length ; i ++ ){
    var cookieVals = cookieArr[i].split('=');
      if ( cookieVals[0] === cookieName && cookieVals[1] ) {
        return decodeURIComponent(cookieVals[1]);
      }
  }
};
ZFAdvLead.prototype.zfautm_gC_enc = function( cookieName ){
  var cookieArr = document.cookie.split('; ');
  for ( var i = 0 ; i < cookieArr.length ; i ++ ){
    var cookieVals = cookieArr[i].split('=');
      if ( cookieVals[0] === cookieName && cookieVals[1] ) {
        return cookieVals[1];
      }
  }
};
ZFAdvLead.prototype.zfautm_iframeSprt = function () {
  var zf_frame = document.getElementsByTagName("iframe");
  for(var i = 0; i < zf_frame.length; ++i){
    if((zf_frame[i].src).indexOf('formperma') > 0 ){
      var zf_src = zf_frame[i].src;
      for( var prmIdx = 0 ; prmIdx < ZFAdvLead.utmPNameArr.length ; prmIdx ++ ) {
        var utmPm = ZFAdvLead.utmPNameArr[ prmIdx ];
        utmPm = ( ZFAdvLead.isSameDomain && ( ZFAdvLead.utmcustPNameArr.indexOf(utmPm) == -1 ) ) ? "zf_" + utmPm : utmPm;
        var utmPmregex = new RegExp("[?&]" + utmPm + "=");
        if ( ! utmPmregex.test(zf_src) ) {
          var utmVal = this.zfautm_gC_enc( ZFAdvLead.utmPNameArr[ prmIdx ] );
          if ( typeof utmVal !== "undefined" ) {
            if ( utmVal != "" ){
              if(zf_src.indexOf('?') > 0){
                zf_src = zf_src+'&'+utmPm+'='+ utmVal;
              }else{
                zf_src = zf_src+'?'+utmPm+'='+ utmVal;
              }
            }
          }
        }
      }
      if ( zf_frame[i].src.length < zf_src.length ) {
        zf_frame[i].src = zf_src;
      }
    }
  }
};
ZFAdvLead.prototype.zfautm_DHtmlSprt = function () {
  var zf_formsArr = document.forms;
  for ( var frmInd = 0 ; frmInd < zf_formsArr.length ; frmInd ++ ) {
    var zf_form_act = zf_formsArr[frmInd].action;
      if ( zf_form_act && zf_form_act.indexOf('formperma') > 0 ){
        for( var prmIdx = 0 ; prmIdx < ZFAdvLead.utmPNameArr.length ; prmIdx ++ ) {
          var utmPm = ZFAdvLead.utmPNameArr[ prmIdx ];
          var utmVal = this.zfautm_gC( ZFAdvLead.utmPNameArr[ prmIdx ] );
          if ( typeof utmVal !== "undefined" ) {
            if ( utmVal != "" ) {
              var fieldObj = zf_formsArr[frmInd][utmPm];
            if ( fieldObj ) {
              fieldObj.value = utmVal;
            }
          }
        }
      }
    }
  }
};
ZFAdvLead.prototype.zfautm_jsEmbedSprt = function ( id ) {
  document.getElementById('zforms_iframe_id').removeAttribute("onload");
  var jsEmbdFrm = document.getElementById("zforms_iframe_id");
  var embdSrc = jsEmbdFrm.src;
  for( var prmIdx = 0 ; prmIdx < ZFAdvLead.utmPNameArr.length ; prmIdx ++ ) {
    var utmPm = ZFAdvLead.utmPNameArr[ prmIdx ];
    utmPm = ( ZFAdvLead.isSameDomain && ( ZFAdvLead.utmcustPNameArr.indexOf(utmPm) == -1 ) ) ? "zf_" + utmPm : utmPm;
    var utmVal = this.zfautm_gC_enc( ZFAdvLead.utmPNameArr[ prmIdx ] );
    if ( typeof utmVal !== "undefined" ) {
      if ( utmVal != "" ) {
        if(embdSrc.indexOf('?') > 0){
                    embdSrc = embdSrc+'&'+utmPm+'='+utmVal;
        }else{
            embdSrc = embdSrc+'?'+utmPm+'='+utmVal;
        }
      }
    }
  }
  jsEmbdFrm.src = embdSrc;
};
var zfutm_zfAdvLead = new ZFAdvLead();
zfutm_zfAdvLead.zfautm_ini();
if( document.readyState == "complete" ){
    zfutm_zfAdvLead.zfautm_iframeSprt();
    zfutm_zfAdvLead.zfautm_DHtmlSprt();
} else {
  window.addEventListener('load', function (){
        zfutm_zfAdvLead.zfautm_iframeSprt();
        zfutm_zfAdvLead.zfautm_DHtmlSprt();
  }, false);
          }
    `}
        </Script>

        <Script
          id='gtg-11427236555'
          strategy='afterInteractive'
          src='https://www.googletagmanager.com/gtag/js?id=AW-11427236555'
        ></Script>
        <Script id='gtg-11427236555' strategy='afterInteractive'>
          {`  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-11427236555');
  gtag('config', 'G-99HF45FGTH');`}
        </Script>
        <Script id='facebook-pixel' strategy='afterInteractive'>
          {`!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1247845413834133');
          fbq('track', 'PageView');`}
        </Script>
        <Script id='linkedin-track' strategy='afterInteractive'>
          {`_linkedin_partner_id = "8369052";
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);
</script><script type="text/javascript">
(function(l) {
if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
window.lintrk.q=[]}
var s = document.getElementsByTagName("script")[0];
var b = document.createElement("script");
b.type = "text/javascript";b.async = true;
b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
s.parentNode.insertBefore(b, s);})(window.lintrk);`}
        </Script>
        <noscript>
          <img
            height='1'
            width='1'
            style={{ display: 'none' }}
            alt=''
            src='https://px.ads.linkedin.com/collect/?pid=8369052&fmt=gif'
          />
        </noscript>
        <noscript>
          <img
            height='1'
            width='1'
            style={{ display: 'none' }}
            src='https://www.facebook.com/tr?id=1247845413834133&ev=PageView&noscript=1'
            alt='facebook pixel'
          />
        </noscript>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${crimson.variable} ${ivyOra.variable} bg-white font-crimson antialiased scroll-smooth`}
      >
        <Provider>
          <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
            {!isAssessmentPage && <InfoHeader />}
            <NavBar />
            {children}
            {!hideContactForm && <ContactUsFormFooter />}
            {!isAssessmentPage && <Footer />}
          </SnackbarProvider>
        </Provider>
      </body>
    </html>
  )
}
