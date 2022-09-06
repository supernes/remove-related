// ==UserScript==
// @name        Remove "Related Tweets"
// @description Disable injection of "Realted Tweets" section in conversations on twitter.com
// @match       https://*.twitter.com/*
// @grant       none
// @version     1.0
// @run-at      document-start
// @noframes
// @author      supernes
// @description 06/09/2022, 13:40:57
// ==/UserScript==
  
const _XHR = window.XMLHttpRequest;

const XMLHttpRequest = class {
  #impl;
  #intercept = false;

  constructor() {
    this.#impl = new _XHR;
  }
  
  // Filter implementation
  
  #filter(text) {
    var result;

    try {
      const response = JSON.parse(text);

      response.data?.threaded_conversation_with_injections_v2?.instructions?.forEach(ins => {
        if (ins.type === 'TimelineAddEntries') {
          ins.entries = ins.entries?.filter(ent => ent.content?.clientEventInfo?.component !== 'related_tweet');
        }
      });

      result = JSON.stringify(response);
    }
    catch (e) {
      console.error('Failed to parse and/or modify GQL response', e);
    }

    return result;
  }  

  // Properties

  get readyState() {
    return this.#impl.readyState;
  }

  get responseUrl() {
    return this.#impl.responseUrl;
  }

  get responseXml() {
    return this.#impl.responseXml;
  }

  get response() {
    if (this.#intercept) {
      console.debug('XHR intercept response (no modifications)', this.#impl.response);
    }

    return this.#impl.response;
  }

  get responseText() {
    if (this.#intercept) {
      console.debug('Modifying response text');

      return this.#filter(this.#impl.responseText);
    }

    return this.#impl.responseText;
  }

  get responseType() {
    return this.#impl.responseType;
  }

  set responseType(rt) {
    this.#impl.responseType = rt;
  }

  get status() {
    return this.#impl.status;
  }

  get statusText() {
    return this.#impl.statusText;
  }

  get timeout() {
    return this.#impl.timeout;
  }

  set timeout(t) {
    this.#impl.timeout = t;
  }

  get withCredentials() {
    return this.#impl.withCredentials;
  }

  set withCredentials(wc) {
    this.#impl.withCredentials = wc;
  }

  // Methods

  open(method, url, async = true, user = undefined, password = undefined) {
    if (url.includes('/TweetDetail?')) {
      console.debug('Intercepting XHR request', { method, url, async });
      this.#intercept = true;
    }

    this.#impl.open(method, url, async, user, password);
  }

  send(body) {
    this.#impl.send(body);
  }

  setRequestHeader(header, value) {
    this.#impl.setRequestHeader(header, value);
  }

  abort() {
    this.#impl.abort();
  }

  getAllResponseHeaders() {
    return this.#impl.getAllResponseHeaders();
  }

  getResponseHeader(name) {
    return this.#impl.getResponseHeader(name);
  }

  overrideMimeType(type) {
    this.#impl.overrideMimeType(type);
  }

  // Events

  set onreadystatechange(callback) {
    this.#impl.onreadystatechange = callback;
  }

  set ontimeout(callback) {
    this.#impl.ontimeout = callback;
  }

  set onloadstart(callback) {
    this.#impl.onloadstart = callback;
  }

  set onload(callback) {
    this.#impl.onload = callback;
  }

  set onloadend(callback) {
    this.#impl.onloadend = callback;
  }

  set onprogress(callback) {
    this.#impl.onprogress = callback;
  }

  set onerror(callback) {
    this.#impl.onerror = callback;
  }

  set onabort(callback) {
    this.#impl.onabort = callback;
  }
}

window.XMLHttpRequest = XMLHttpRequest;