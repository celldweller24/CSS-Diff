function CSSSnapshooter(node) {
  "use strict";

  // list of shorthand properties based on CSSShorthands.in from the Chromium code (https://code.google.com/p/chromium/codesearch)
  // TODO this list should not be hardcoded here
  var shorthandProperties = {
    'animation': 'animation',
    'background': 'background',
    'border': 'border',
    'border-top': 'borderTop',
    'border-right': 'borderRight',
    'border-bottom': 'borderBottom',
    'border-left': 'borderLeft',
    'border-width': 'borderWidth',
    'border-color': 'borderColor',
    'border-style': 'borderStyle',
    'border-radius': 'borderRadius',
    'border-image': 'borderImage',
    'border-spacing': 'borderSpacing',
    'flex': 'flex',
    'flex-flow': 'flexFlow',
    'font': 'font',
    'grid-area': 'gridArea',
    'grid-column': 'gridColumn',
    'grid-row': 'gridRow',
    'list-style': 'listStyle',
    'margin': 'margin',
    'marker': 'marker',
    'outline': 'outline',
    'overflow': 'overflow',
    'padding': 'padding',
    'text-decoration': 'textDecoration',
    'transition': 'transition',
    '-webkit-border-after': 'webkitBorderAfter',
    '-webkit-border-before': 'webkitBorderBefore',
    '-webkit-border-end': 'webkitBorderEnd',
    '-webkit-border-start': 'webkitBorderStart',
    '-webkit-columns': 'webkitBorderColumns',
    '-webkit-column-rule': 'webkitBorderColumnRule',
    '-webkit-margin-collapse': 'webkitMarginCollapse',
    '-webkit-mask': 'webkitMask',
    '-webkit-mask-position': 'webkitMaskPosition',
    '-webkit-mask-repeat': 'webkitMaskRepeat',
    '-webkit-text-emphasis': 'webkitTextEmphasis',
    '-webkit-transition': 'webkitTransition',
    '-webkit-transform-origin': 'webkitTransformOrigin'
  };

  /**
   * Changes CSSStyleDeclaration to simple Object removing unwanted properties ('1','2','parentRule','cssText' etc.) in the process.
   *
   * @param CSSStyleDeclaration style
   * @returns {}
   */
  function styleDeclarationToSimpleObject(style) {
    var i, l, cssName, camelCaseName,
      output = {};

    for (i = 0, l = style.length; i < l; i++) {
      output[style[i]] = style[style[i]];
    }

    // Work around http://crbug.com/313670 (the "content" property is not present as a computed style indexed property value).
    output.content = fixContentProperty(style.content);

    // Since shorthand properties are not available in the indexed array, copy them from named properties
    for (cssName in shorthandProperties) {
      if (shorthandProperties.hasOwnProperty(cssName)) {
        camelCaseName = shorthandProperties[cssName];
        output[cssName] = style[camelCaseName];
      }
    }

    return output;
  }

  // Partial workaround for http://crbug.com/315028 (single words in the "content" property are not wrapped with quotes)
  function fixContentProperty(content) {
    var values, output, value, i, l;

    output = [];

    if (content) {
      //content property can take multiple values - we need to split them up
      //FIXME this won't work for '\''
      values = content.match(/(?:[^\s']+|'[^']*')+/g);

      for (i = 0, l = values.length; i < l; i++) {
        value = values[i];

        if (value.match(/^(url\()|(attr\()|normal|none|open-quote|close-quote|no-open-quote|no-close-quote|chapter_counter|'/g)) {
          output.push(value);
        } else {
          output.push("'" + value + "'");
        }
      }
    }

    return output.join(' ');
  }

  /*function getChildElementsRecursive(nodes) {
    var childElements = [];
    for (var key in nodes) {
      if (nodes[key] === 'object' && JSON.stringify(nodes[key]) !== '{}' && !Number.isInteger(nodes[key])) {
        for (var node in nodes[key].getElementsByTagName("*")) {
          if (node.indexOf('sizcache') === 0) {
            childElements.push(nodes[key]);
            getChildElementsRecursive(nodes[key].getElementsByTagName("*"));
          }
        }
      }
    }
    return childNodes;
  }*/

  function init() {
    if (!node) {
      return null;
    }

    //chrome.extension.getBackgroundPage().console.log('foo');
    // https://con-emea-jbaby-menap.jnjemeab19d3-dev.jjc-devops.com/ar   social-media-link
    //var styles = node.ownerDocument.defaultView.getComputedStyle(node);

    var parentNode = node;
    var childNodes = node.getElementsByTagName("*");
    var objects = Object.assign(parentNode, childNodes);
    alert(JSON.stringify(parentNode));
    alert(JSON.stringify(childNodes));
    alert(JSON.stringify(objects));


    //var objects = node.getElementsByTagName("*");
    //var objects = {"0":{"sizcache06304045768605915":10,"sizset":528},"1":{},"2":{"sizcache06304045768605915":10,"sizset":530},"3":{},"4":{"sizcache06304045768605915":10,"sizset":532},"5":{},"6":{"sizcache06304045768605915":10,"sizset":534},"7":{},"8":{"sizcache06304045768605915":10,"sizset":536},"9":{},"10":{"sizcache06304045768605915":10,"sizset":538},"11":{}};

    //var objects = node.querySelectorAll("*");
    //var objects = node.getElementsByTagName("*");

    var nodeProperties = [], nodes = {}, styles, childNodes = [];
    /*childNodes = getChildElementsRecursive(objects);
    childNodes.forEach(function(item, i) {
      styles = window.getComputedStyle(item[i]);

      nodeProperties.push({
        'tag': objects[key].tagName,
        'id': (objects[key].attributes.id) ? objects[key].attributes.id.value : undefined,
        'class': (objects[key].attributes.class) ? objects[key].attributes.class.value : undefined,
        'style': styleDeclarationToSimpleObject(styles)
      });
    });*/
    for (var key in objects) {
      if (objects[key] && JSON.stringify(objects[key]) !== '{}' && !Number.isInteger(objects[key]) && typeof objects[key] === 'object') {
        //styles = objects[key].ownerDocument.defaultView.getComputedStyle(objects[key]);
        styles = objects[key].ownerDocument.defaultView.getComputedStyle(objects[key]);
        //styles = {"style":{"animation-delay":"0s","animation-direction":"normal","animation-duration":"0s","animation-fill-mode":"none","animation-iteration-count":"1","animation-name":"none","animation-play-state":"running","animation-timing-function":"ease","background-attachment":"scroll","background-blend-mode":"normal","background-clip":"border-box","background-color":"rgb(241, 236, 223)","background-image":"none","background-origin":"padding-box","background-position":"0% 0%","background-repeat":"repeat","background-size":"auto","border-bottom-color":"rgb(102, 102, 102)","border-bottom-left-radius":"0px","border-bottom-right-radius":"0px","border-bottom-style":"none","border-bottom-width":"0px","border-collapse":"separate","border-image-outset":"0px","border-image-repeat":"stretch","border-image-slice":"100%","border-image-source":"none","border-image-width":"1","border-left-color":"r... rgb(102, 102, 102)","border-left":"0px none rgb(102, 102, 102)","border-width":"0px","border-color":"rgb(102, 102, 102)","border-style":"none","border-radius":"0px","border-image":"none","border-spacing":"0px 0px","flex":"0 1 auto","flex-flow":"row nowrap","font":"normal normal 400 normal 16px / 24px desktop","grid-area":"auto / auto / auto / auto","grid-column":"auto / auto","grid-row":"auto / auto","list-style":"disc outside none","margin":"0px","marker":"","outline":"rgb(102, 102, 102) none 0px","overflow":"","padding":"0px","transition":"all 0s ease 0s","-webkit-border-after":"0px none rgb(102, 102, 102)","-webkit-border-before":"0px none rgb(102, 102, 102)","-webkit-border-end":"0px none rgb(102, 102, 102)","-webkit-border-start":"0px none rgb(102, 102, 102)","-webkit-columns":null,"-webkit-column-rule":null,"-webkit-margin-collapse":"","-webkit-mask":"","-webkit-text-emphasis":"","-webkit-transition":"all 0s ease 0s","-webkit-transform-origin":"951.5px 1016.73px"}};

        nodeProperties.push({
          'tag': objects[key].tagName,
          'id': (objects[key].attributes.id) ? objects[key].attributes.id.value : undefined,
          'class': (objects[key].attributes.class) ? objects[key].attributes.class.value : undefined,
          'style': styleDeclarationToSimpleObject(styles)
        });

        /*nodeProperties.push({
          'tag': 'tag-' + i,
          'id': i,
          'class': 'class-' + i,
          'style': styles
        });*/
      }
      //i++;
    }

    nodeProperties.forEach(function(item, i) {
      nodes[i] = item;
    });

    /*return {
      'tag': node.tagName,
      'id': (node.attributes.id) ? node.attributes.id.value : undefined,
      'class': (node.attributes.class) ? node.attributes.class.value : undefined,
      'style': styleDeclarationToSimpleObject(styles)
    };*/
    return nodes;

  }

  return init();
}


//var tabObj = {"0":{},"1":{},"2":{},"3":{},"4":{},"5":{},"6":{},"7":{},"8":{},"9":{},"10":{},"11":{"sizcache06304045768605915":10,"sizset":54},"12":{},"13":{"sizcache06304045768605915":10,"sizset":468},"14":{},"15":{"sizcache06304045768605915":10,"sizset":546},"16":{},"17":{},"18":{},"19":{},"20":{},"21":{},"22":{},"23":{},"24":{},"25":{},"26":{},"27":{},"28":{},"29":{},"30":{},"31":{},"32":{},"33":{}};
//var tabObj = {"sizcache0661332189112815":10,"sizset":540};

//CSSSnapshooter(tabObj);
