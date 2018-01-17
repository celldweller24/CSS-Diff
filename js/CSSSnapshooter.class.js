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

  function getChildElementsRecursive(nodes) {
    var childElements = [];
    for (var key in nodes) {
      if (nodes[key] && JSON.stringify(nodes[key]) !== '{}' && !Number.isInteger(nodes[key])) {
        for (var node in nodes[key]) {
          if (node.indexOf('sizcache') === 0) {
            childElements.push(nodes[key]);
            getChildElementsRecursive(nodes[key].childNodes);
          }
        }
      }
    }
    return childNodes;
  }

  function init() {
    if (!node) {
      return null;
    }
    //chrome.extension.getBackgroundPage().console.log('foo');

    // https://con-emea-jbaby-menap.jnjemeab19d3-dev.jjc-devops.com/ar   social-media-link

    //var styles = node.ownerDocument.defaultView.getComputedStyle(node);

    //var objects = node.childNodes;
    var objects = {"1":{"sizcache004254600351253868":10,"sizset":54},"12":{},"13":{"sizcache004254600351253868":10,"sizset":468},"15":{"sizcache004254600351253868":10,"sizset":546}};
    //alert(JSON.stringify(node.childNodes));

    //var objects = node.querySelectorAll("*");
    //var objects = node.getElementsByTagName("*");
    var nodeProperties = [], nodes = {}, styles, childNodes = [];
    childNodes = getChildElementsRecursive(objects);
    //alert(JSON.stringify(childNodes));
    childNodes.forEach(function(item, i) {
      /*styles = window.getComputedStyle(item[i]);

      nodeProperties.push({
        'tag': objects[key].tagName,
        'id': (objects[key].attributes.id) ? objects[key].attributes.id.value : undefined,
        'class': (objects[key].attributes.class) ? objects[key].attributes.class.value : undefined,
        'style': styleDeclarationToSimpleObject(styles)
      });*/
    });

    /*for (var key in objects) {
      //styles = objects[key].ownerDocument.defaultView.getComputedStyle(objects[key]);
      styles = window.getComputedStyle(objects[key]);

      nodeProperties.push({
        'tag': objects[key].tagName,
        'id': (objects[key].attributes.id) ? objects[key].attributes.id.value : undefined,
        'class': (objects[key].attributes.class) ? objects[key].attributes.class.value : undefined,
        'style': styleDeclarationToSimpleObject(styles)
      });
    }

    nodeProperties.forEach(function(item, i) {
      nodes[i] = item;
    });*/
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


//var tabObj = {"1":{"sizcache004254600351253868":10,"sizset":54},"12":{},"13":{"sizcache004254600351253868":10,"sizset":468},"15":{"sizcache004254600351253868":10,"sizset":546}};
var tabObj = {"sizcache0661332189112815":10,"sizset":540};

CSSSnapshooter(tabObj);
