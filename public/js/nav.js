'use strict';

/**
* Constructor method
*/
const NavCreator = function() {
    this.setRequester();
    this.setConstants();
};

/**
* @setRequester Set new instance of XMLHttpRequest
*/
NavCreator.prototype.setRequester = function() {
    this.requester = new XMLHttpRequest();
};

/**
* @setConstants CONSTANTS Object
*/
NavCreator.prototype.setConstants = function() {
    this.CONSTANTS = {
        "URL": "/api/nav.json",
        "METHOD": "GET",
        "EVENTS": {
            "LOAD": "readystatechange",
            "ERROR": 'error'
        },
        "SELECTORS": {
            "HEADER": "header"
        }
    };
}

/**
* @init Class initializer
*/
NavCreator.prototype.init = function() {
    this.bindEvents();
    this.openRequester();
    this.fetch();
};

/**
* @bindEvents binding for XMLHttpRequest
*/
NavCreator.prototype.bindEvents = function() {
    this.requester.addEventListener(
        this.CONSTANTS.EVENTS.LOAD,
        this.handleResponse.bind(this)
    );
    this.requester.addEventListener(
        this.CONSTANTS.EVENTS.ERROR,
        this.handleError.bind(this)
    );
}

/**
* @openRequester XMLHttpRequest open handler with method and URL
*/
NavCreator.prototype.openRequester = function() {
    this.requester.open(this.CONSTANTS.METHOD, this.CONSTANTS.URL);
};

/**
* @fetch XMLHttpRequest send handler
*/
NavCreator.prototype.fetch = function() {
    this.requester.send();
};

/**
* @handleResponse handler of XMLHttpRequest response
*/
NavCreator.prototype.handleResponse = function(response) {
    if (this.requester.readyState === XMLHttpRequest.DONE) {
        this.buildMenu(JSON.parse(this.requester.responseText));
    }
};

/**
* @handleError handler of XMLHttpRequest error
*/
NavCreator.prototype.handleError = function(evt) {
    console.warn("An error ocurred getting the data" + evt);
};

/**
* @buildMenu menu constructor
* @items {Object} 
*/
NavCreator.prototype.buildMenu = function(items) {
    var header = document.getElementsByClassName(this.CONSTANTS.SELECTORS.HEADER)[0],
        menu = this.createMenuItems(items.items);

    header.appendChild(menu);
    this.bindUiEvents();
};

/**
* @createMenuItems dom list creator
* @nodesObj {Array} 
*/
NavCreator.prototype.createMenuItems = function(nodesObj) {
    var menu = document.createElement('ul'),
        node,
        options;

    menu.className = 'menu-list';

    for (node in nodesObj) {
        options = nodesObj[node];

        menu.appendChild(
            this.createLeaf(options)
        );
    }

    return menu;
}

/**
* @createLeaf recursive definition of node and leaf
* @options {Array|Object} 
*/
NavCreator.prototype.createLeaf = function(options) {
    var leaf = document.createElement('li'),
        anchore = document.createElement('a'),
        textNode = document.createTextNode(options.label),
        childNodes;

    anchore.setAttribute('href', options.url)
    anchore.classList.add('menu-link-elem')
    anchore.appendChild(textNode);
    leaf.appendChild(anchore);
    leaf.classList.add('menu-child')

    if (options.items) {
        childNodes = this.createMenuItems(options.items);
        leaf.appendChild(childNodes);

        if (childNodes.childElementCount) {
            leaf.classList.add('icon-chevron-down');
        }
    }

    return leaf;
};

/**
* @bindUiEvents bind ui events
*/
NavCreator.prototype.bindUiEvents = function() {
    var toggleMenu = document.querySelector(".toggle-menu"),
        menuElements = document.getElementsByClassName('icon-chevron-down');

    toggleMenu.addEventListener('click', this.toggleShowClass);

    for (var i = 0, len = menuElements.length; i < len; i++) {
        menuElements[i].addEventListener('click', this.openSubMenu.bind(this));
    }
}

/**
* @bindUiEvents activate / deactivate classes to display / hide elements
* @evt {Object} 
*/
NavCreator.prototype.toggleShowClass = function(evt) {
    var logoWrapper = document.querySelector('.logo-wrapper'),
        navMenu = document.querySelector('.menu-list'),
        content = document.querySelector('.content'),
        overlay = document.querySelector('.overlay');

    logoWrapper.classList.toggle('open');
    navMenu.classList.toggle('active');
    overlay.classList.toggle('active');
    content.classList.toggle('menu-open');
}

/**
* @bindUiEvents toggle open class for sub menu elements
* @evt {Object} 
*/
NavCreator.prototype.openSubMenu = function(evt) {

    if (document.body.clientWidth > 768) {
        this.resetMenuElems();
    }

    if (evt.target.href) {
        evt.preventDefault();
        evt.target.parentElement.classList.toggle('active');
        evt.target.parentElement.querySelector('.menu-list').classList.toggle('open')
    } else {
        evt.target.classList.toggle('active');
        evt.target.querySelector('.menu-list').classList.toggle('open');
    }
}

NavCreator.prototype.resetMenuElems = function() {
    var menuElems = document.getElementsByClassName('menu-list '),
        menuChildren = document.getElementsByClassName('menu-child');

    for (var i = 0, len = menuElems.length; i < len; i++) {
        menuElems[i].classList.remove('open');
    }

    for (var i = 0, len = menuChildren.length; i < len; i++) {
        menuChildren[i].classList.remove('active');
    }
}