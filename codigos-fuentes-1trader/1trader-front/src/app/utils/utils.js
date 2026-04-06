import { gambatteApi } from 'app/api/gambatteApi';
import { differenceInSeconds } from 'date-fns';
import moment from 'moment';
import momentTz from 'moment-timezone';
import _ from 'lodash'
import { Grid, Typography } from '@mui/material';
import CryptoJS from 'crypto-js'
import React from "react";
import "../css/main.css";
export const convertHexToRGB = (hex) => {
  // check if it's a rgba
  if (hex.match('rgba')) {
    let triplet = hex.slice(5).split(',').slice(0, -1).join(',');
    return triplet;
  }

  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');

    return [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',');
  }
};

export function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
}

export function isMobile() {
  if (window) {
    return window.matchMedia(`(max-width: 767px)`).matches;
  }
  return false;
}

export function isMdScreen() {
  if (window) {
    return window.matchMedia(`(max-width: 1199px)`).matches;
  }
  return false;
}

function currentYPosition(elm) {
  if (!window && !elm) {
    return;
  }
  if (elm) return elm.scrollTop;
  // Firefox, Chrome, Opera, Safari
  if (window.pageYOffset) return window.pageYOffset;
  // Internet Explorer 6 - standards mode
  if (document.documentElement && document.documentElement.scrollTop)
    return document.documentElement.scrollTop;
  // Internet Explorer 6, 7 and 8
  if (document.body.scrollTop) return document.body.scrollTop;
  return 0;
}

function elmYPosition(elm) {
  var y = elm.offsetTop;
  var node = elm;
  while (node.offsetParent && node.offsetParent !== document.body) {
    node = node.offsetParent;
    y += node.offsetTop;
  }
  return y;
}

export function scrollTo(scrollableElement, elmID) {
  var elm = document.getElementById(elmID);

  if (!elmID || !elm) {
    return;
  }

  var startY = currentYPosition(scrollableElement);
  var stopY = elmYPosition(elm);

  var distance = stopY > startY ? stopY - startY : startY - stopY;
  if (distance < 100) {
    scrollTo(0, stopY);
    return;
  }
  var speed = Math.round(distance / 50);
  if (speed >= 20) speed = 20;
  var step = Math.round(distance / 25);
  var leapY = stopY > startY ? startY + step : startY - step;
  var timer = 0;
  if (stopY > startY) {
    for (var i = startY; i < stopY; i += step) {
      setTimeout(
        (function (leapY) {
          return () => {
            scrollableElement.scrollTo(0, leapY);
          };
        })(leapY),
        timer * speed
      );
      leapY += step;
      if (leapY > stopY) leapY = stopY;
      timer++;
    }
    return;
  }
  for (let i = startY; i > stopY; i -= step) {
    setTimeout(
      (function (leapY) {
        return () => {
          scrollableElement.scrollTo(0, leapY);
        };
      })(leapY),
      timer * speed
    );
    leapY -= step;
    if (leapY < stopY) leapY = stopY;
    timer++;
  }
  return false;
}

export function getTimeDifference(date) {
  let difference = differenceInSeconds(new Date(), date);

  if (difference < 60) return `${Math.floor(difference)} sec`;
  else if (difference < 3600) return `${Math.floor(difference / 60)} min`;
  else if (difference < 86400) return `${Math.floor(difference / 3660)} h`;
  else if (difference < 86400 * 30) return `${Math.floor(difference / 86400)} d`;
  else if (difference < 86400 * 30 * 12) return `${Math.floor(difference / 86400 / 30)} mon`;
  else return `${(difference / 86400 / 30 / 12).toFixed(1)} y`;
}

export function generateRandomId() {
  let tempId = Math.random().toString();
  let uid = tempId.substr(2, tempId.length - 1);
  return uid;
}

export function getQueryParam(prop) {
  var params = {};
  var search = decodeURIComponent(
    window.location.href.slice(window.location.href.indexOf('?') + 1)
  );
  var definitions = search.split('&');
  definitions.forEach(function (val, key) {
    var parts = val.split('=', 2);
    params[parts[0]] = parts[1];
  });
  return prop && prop in params ? params[prop] : params;
}

export function classList(classes) {
  return Object.entries(classes)
    .filter((entry) => entry[1])
    .map((entry) => entry[0])
    .join(' ');
}

export const flat = (array) => {
  var result = [];
  array.forEach(function (a) {
    result.push(a);
    if (Array.isArray(a.children)) {
      result = result.concat(flat(a.children));
    }
  });
  return result;
};


// Utils dev
export function formatoPrecio(val) {
  try {
    const value = val.replace("$", "").replace(/,/g, "");
    return parseInt(value ? value : 0);
  } catch (error) {
    console.error(error);
  }
}

export function formatPrice(val) {
  try {
    if (val > 0) {
      let value = parseFloat(val).toFixed(0);
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return `$${value}`;
    } else if (val === 0) {
      return "$" + val;
    } else if (val === "") {
      return val;
    }
    return null;
  } catch (error) {
    console.error(error);
  }
}

export function validateEmail(value, id = null) {
  return new Promise(async (resolve, reject) => {
    try {
      if (value !== undefined && id !== undefined && id !== null) {
        gambatteApi.post(`/validate/email`, { email: value, id: id })
          .then((res) => {
            let { data: { data: { email }, status } } = res
            if (status === 'ok') {
              if (email === 1) {
                resolve(true)
              }
              else if (email === 2) {
                resolve(true)
              }
              else if (email === 3) {
                resolve(false)
              }
            }
          })
          .catch((error) => {
            return resolve(false);
          });
      } else if (value !== undefined && id == null) {
        gambatteApi.post(`/validate/email`, { email: value, id: null })
          .then((res) => {
            let { data: { data: { email }, status } } = res
            if (status === 'ok') {
              if (email === 1) {
                resolve(true)
              }
              else if (email === 2) {
                resolve(true)
              }
              else if (email === 3) {
                resolve(false)
              }
            }
          })
          .catch((error) => {
            return resolve(false);
          });
      } else {
        return resolve(false);
      }
    } catch (error) {
      console.log(error);
      return resolve(false);
    }
  });
}


export const findData = (data, filter) => {
  if (typeof data === 'object') {
    return _.find(data, filter)
  }
  else if (typeof data === 'array') {
    console.log('hola', _.find(data, filter));
    return _.find(data, filter)
  }
}

export const indexData = (data, index) => {
  let reducerData = data.reduce((acc, item) => {
    acc[item[index]] = item
    return acc
  }, {})
  return reducerData
}

export const generateCardToken = (card) => {
  try {
    const bytes = CryptoJS.AES.decrypt(card, 'KEY_88_66_33');
    const originalCard = bytes.toString(CryptoJS.enc.Utf8);
    return originalCard
  } catch (e) {
    throw e;
  }
}

export const validState = (value, styles = null, ml = null, w100) => {
  // div-main-states div-main-states
  if (value == '0' || value == 0) {
    return (
      <Grid item md={3} xs={'auto'} style={ml} className={`div-main-states ${w100}`}>
        <Grid xs={12} className='pendiente'>
          <Typography style={{ fontSize: '13px' }}>En proceso</Typography>
        </Grid>
      </Grid>)
  }
  else if (value == '1' || value == 1) {
    return (
      <Grid item sm={12} md={12} className='div-main-states'>
        <Grid className='pagado'>
          <Typography style={{ fontSize: '13px' }}>Pagado</Typography>
        </Grid>
      </Grid>)
  }
  else if (value == '2' || value == 2) {
    return (
      <Grid item md={3} xs={'auto'} style={ml} className={`div-main-states ${w100}`}>
        <Grid xs={12} className='pendiente'>
          <Typography style={{ fontSize: '13px' }}>Cancelado</Typography>
        </Grid>
      </Grid>)
  }
}

export const getValueDocumentType = (optionsDocumentType, idDocumentType) => {
  if (idDocumentType) {
    let type
    type = _.find(optionsDocumentType, { value: parseInt(idDocumentType) })
    return type ? type.label : ''
  } else {
    return '';
  }
};

export const getHour = () => {
  let momt = momentTz()
  return momt.tz('America/Bogota').format('HH:mm A')
}


export default function LoadingSpinner() {
  return (
    <div className="spinner-container">
      <div className="loading-spinner">
      </div>
    </div>
  );
}