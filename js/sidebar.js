(function () {
  "use strict";

  var body, button, diffRenderer;

  // Returns CSS properties (in alphabetic order) that differ between two given HTML elements.
  function compareStyles(aComputed, bComputed) {

    if (!aComputed || !bComputed) {
      return null;
    }

    var diff = [];

    for (var aname in aComputed) {
      var avalue = aComputed[aname];
      var bvalue = bComputed[aname];

      if (!aComputed.hasOwnProperty(aname) || avalue === bvalue) {
        continue;
      }

      diff.push({
        name: aname,
        value1: avalue,
        value2: bvalue
      });
    }

    //sort array by property name
    diff = diff.sort(function (a, b) {
      return a.name > b.name ? 1 : -1;
    });

    return diff;
  }

  function renderDiff(elements) {
    body.querySelector('#wrapper').classList.add('showMessage');
    body.querySelector('#wrapper').classList.remove('showResult');

    if (elements.length === 0) {
      body.querySelector('#message p').innerHTML = "Nothing to compare. Please inspect two elements first.";
    } else if (elements.length === 1) {
      body.querySelector('#message p').innerHTML = "One element was selected. Please select second element";
    } else {
      var elem1 = elements[0], elem2 = elements[1];
      var counter = (Object.keys(elem1).length > Object.keys(elem2).length) ? Object.keys(elem1).length : Object.keys(elem2).length;

      for (var i = 0; counter - 1 > i; i++) {
        var diff = compareStyles(elem1[i].style, elem2[i].style);
        diffRenderer.render({
          id: elem1[i].id,
          tag: elem1[i].tag,
          'class': elem1[i].class,
          differentTab: (elem1.tabId !== chrome.devtools.inspectedWindow.tabId)
        }, {
          id: elem2[i].id,
          tag: elem2[i].tag,
          'class': elem2[i].class,
          differentTab: (elem2.tabId !== chrome.devtools.inspectedWindow.tabId)
        }, diff);

        body.querySelector('#wrapper').classList.add('showResult');
        body.querySelector('#wrapper').classList.remove('showMessage');

      }
    }
  }

  function pushNewElement(element) {
    var elements = [],
      json = localStorage.getItem('elements');

    if (json) {
      elements = JSON.parse(json);
    }


    elements.unshift(element);
    if (elements.length > 2) {
      elements.length = 2; //keep only two elements
    }
    localStorage.setItem('elements', JSON.stringify(elements));

    renderDiff(elements);
  }

  function loadLastSelected(callback) {
    //var tabObj = {"sizcache013994122734975445":10,"sizset":527};
    chrome.devtools.inspectedWindow.eval("(" + CSSSnapshooter.toString() + ")($0)", function (result, isException) {
      if (!isException && result !== null) {
        //include tabId so that we are able to differentiate between elements from current and other tab
        result.tabId = chrome.devtools.inspectedWindow.tabId;
        callback(result);
      }
    });
    /*var result = CSSSnapshooter(tabObj);
    result.tabId = 666;
    callback(result);*/
  }

  function recognizeOS() {
    var os = null;
    if (navigator.appVersion.indexOf("Win") !== -1) {
      os = "windows";
    }
    if (navigator.appVersion.indexOf("Mac") !== -1) {
      os = "mac";
    }
    if (navigator.appVersion.indexOf("Linux") !== -1) {
      os = "linux";
    }

    return os;
  }

  window.onload = function () {
    body = document.getElementsByTagName('body')[0];
    button = body.querySelector('#selected button');

    if (localStorage.getItem('elements').length !== '') {
      body.querySelector('#message p').innerHTML = "One element was selected. Please select second element.";
    }

    diffRenderer = new DiffRenderer(body);

    //chrome.devtools.panels.elements.onSelectionChanged.addListener(loadLastSelected.bind(this, updateLastSelected));

    //load last inspected element right away
    //loadLastSelected(updateLastSelected);

    var containerWrapper = '';
    button.addEventListener('click', function () {
      containerWrapper += '<div id="containers">';
      containerWrapper += '<div id="comparing"></div>';
      containerWrapper += '<table class="monospace first"></table>';
      containerWrapper += '<table class="monospace second"></table>';
      containerWrapper += '</div>';
      body.querySelector('#result').innerHTML = containerWrapper;
      loadLastSelected(pushNewElement);
    });

    //load elements from storage and render them right away
    var elements = [];

    /*try {
      var json = localStorage.getItem('elements');

      if (json) {
        elements = JSON.parse(json);
      }

    } catch (e) {
      body.querySelector('#thirdPartyCookiesWarning').classList.add('visible');
    }


    renderDiff(elements);*/

    window.addEventListener('storage', function (storage) {
      if (storage.key === 'elements') {
        try {
          renderDiff(JSON.parse(storage.newValue));
        } catch (e) {
          //
        }
      }
    });

    //different fonts are used for different platforms
    var os = recognizeOS();
    if (os) {
      body.classList.add('platform-' + os);
    }
  };
})();
