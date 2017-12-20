'use strict';

const NavCreator = function() {
    this.setRequester();
    this.setConstants();
};

NavCreator.prototype.setRequester = function() {
    this.requester = new XMLHttpRequest();
};

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

NavCreator.prototype.init = function() {
    this.bindEvents();
    this.openRequester();
    this.fetch();
};

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

NavCreator.prototype.openRequester = function() {
    this.requester.open(this.CONSTANTS.METHOD, this.CONSTANTS.URL);
};

NavCreator.prototype.fetch = function() {
    this.requester.send();
};

NavCreator.prototype.handleResponse = function(response) {
    if (this.requester.readyState === XMLHttpRequest.DONE) {
        this.buildMenu(JSON.parse(this.requester.responseText));
    }
};

NavCreator.prototype.handleError = function(evt) {
    console.warn("An error ocurred getting the data" + evt);
};

NavCreator.prototype.buildMenu = function(items) {
    var header = document.getElementsByClassName(this.CONSTANTS.SELECTORS.HEADER)[0],
        menu = this.createMenuItems(items.items);

    header.appendChild(menu);
    this.bindUiEvents();
};

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

NavCreator.prototype.bindUiEvents = function() {
    var hamburger = document.querySelector(".hamburguer"),
        mainList = document.getElementsByClassName('menu-list')[0],
        closeBtn = document.querySelector(".close"),
        menuElements = document.getElementsByClassName('icon-chevron-down');

    hamburger.addEventListener('click', this.toggleShowClass);
    closeBtn.addEventListener('click', this.toggleShowClass);

    for (var i = 0, len = menuElements.length; i < len; i++) {
        menuElements[i].addEventListener('click', this.openSubMenu);
    }
}

NavCreator.prototype.toggleShowClass = function(evt) {
    var logo = evt.target.parentElement.querySelector('.logo-text'),
        menu = evt.target.parentElement.parentElement.querySelector('.menu-list');

    evt.target.classList.remove('show');

    if (evt.target.className === 'hamburguer icon-menu') {
        logo.classList.add('show');
        menu.classList.add('active');
        evt.target.parentElement.querySelector('.close').classList.add('show');
    } else {
        logo.classList.remove('show');
        menu.classList.remove('active');
        evt.target.parentElement.querySelector('.hamburguer').classList.add('show');
    }
}

NavCreator.prototype.openSubMenu = function(evt) {
    if (evt.target.href) {
        evt.preventDefault();
        evt.target.parentElement.querySelector('.menu-list').classList.toggle('open')
    } else {
        evt.target.querySelector('.menu-list').classList.toggle('open');
    }
}