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

    // https://con-emea-jbaby-menap.jnjemeab19d3-dev.jjc-devops.com/ar   social-media-link
    //var styles = node.ownerDocument.defaultView.getComputedStyle(node);
    
    var objects = node.getElementsByTagName("*");
    //var objects = {"0":{"sizcache013994122734975445":10,"sizset":527},"1":{"sizcache013994122734975445":10,"sizset":528},"2":{},"3":{"sizcache013994122734975445":10,"sizset":530},"4":{},"5":{"sizcache013994122734975445":10,"sizset":532},"6":{},"7":{"sizcache013994122734975445":10,"sizset":534},"8":{},"9":{"sizcache013994122734975445":10,"sizset":536},"10":{},"11":{"sizcache013994122734975445":10,"sizset":538},"12":{}}

    var arrayNodes = Object.values(objects);
    arrayNodes.unshift(node);

    objects = {};
    arrayNodes.forEach(function(item, i) {
      objects[i] = item;
    });

    var nodes = {}, styles;
    var i = 0;
    for (var key in objects) {
      if (objects[key] && JSON.stringify(objects[key]) !== '{}' && !Number.isInteger(objects[key]) && typeof objects[key] === 'object') {
        styles = objects[key].ownerDocument.defaultView.getComputedStyle(objects[key]);
        //styles = {"0":"animation-delay","1":"animation-direction","2":"animation-duration","3":"animation-fill-mode","4":"animation-iteration-count","5":"animation-name","6":"animation-play-state","7":"animation-timing-function","8":"background-attachment","9":"background-blend-mode","10":"background-clip","11":"background-color","12":"background-image","13":"background-origin","14":"background-position","15":"background-repeat","16":"background-size","17":"border-bottom-color","18":"border-bottom-left-radius","19":"border-bottom-right-radius","20":"border-bottom-style","21":"border-bottom-width","22":"border-collapse","23":"border-image-outset","24":"border-image-repeat","25":"border-image-slice","26":"border-image-source","27":"border-image-width","28":"border-left-color","29":"border-left-style","30":"border-left-width","31":"border-right-color","32":"border-right-style","33":"border-right-width","34":"border-top-color","35":"border-top-left-radius","36":"border-top-right-radius","37":"border-top-style","38":"border-top-width","39":"bottom","40":"box-shadow","41":"box-sizing","42":"break-after","43":"break-before","44":"break-inside","45":"caption-side","46":"clear","47":"clip","48":"color","49":"content","50":"cursor","51":"direction","52":"display","53":"empty-cells","54":"float","55":"font-family","56":"font-kerning","57":"font-size","58":"font-stretch","59":"font-style","60":"font-variant","61":"font-variant-ligatures","62":"font-variant-caps","63":"font-variant-numeric","64":"font-variant-east-asian","65":"font-weight","66":"height","67":"image-rendering","68":"isolation","69":"justify-items","70":"justify-self","71":"left","72":"letter-spacing","73":"line-height","74":"list-style-image","75":"list-style-position","76":"list-style-type","77":"margin-bottom","78":"margin-left","79":"margin-right","80":"margin-top","81":"max-height","82":"max-width","83":"min-height","84":"min-width","85":"mix-blend-mode","86":"object-fit","87":"object-position","88":"offset-distance","89":"offset-path","90":"offset-rotate","91":"opacity","92":"orphans","93":"outline-color","94":"outline-offset","95":"outline-style","96":"outline-width","97":"overflow-anchor","98":"overflow-wrap","99":"overflow-x","100":"overflow-y","101":"padding-bottom","102":"padding-left","103":"padding-right","104":"padding-top","105":"pointer-events","106":"position","107":"resize","108":"right","109":"scroll-behavior","110":"speak","111":"table-layout","112":"tab-size","113":"text-align","114":"text-align-last","115":"text-decoration","116":"text-decoration-line","117":"text-decoration-style","118":"text-decoration-color","119":"text-decoration-skip","120":"text-underline-position","121":"text-indent","122":"text-rendering","123":"text-shadow","124":"text-size-adjust","125":"text-overflow","126":"text-transform","127":"top","128":"touch-action","129":"transition-delay","130":"transition-duration","131":"transition-property","132":"transition-timing-function","133":"unicode-bidi","134":"vertical-align","135":"visibility","136":"white-space","137":"widows","138":"width","139":"will-change","140":"word-break","141":"word-spacing","142":"word-wrap","143":"z-index","144":"zoom","145":"-webkit-appearance","146":"backface-visibility","147":"-webkit-background-clip","148":"-webkit-background-origin","149":"-webkit-border-horizontal-spacing","150":"-webkit-border-image","151":"-webkit-border-vertical-spacing","152":"-webkit-box-align","153":"-webkit-box-decoration-break","154":"-webkit-box-direction","155":"-webkit-box-flex","156":"-webkit-box-flex-group","157":"-webkit-box-lines","158":"-webkit-box-ordinal-group","159":"-webkit-box-orient","160":"-webkit-box-pack","161":"-webkit-box-reflect","162":"column-count","163":"column-gap","164":"column-rule-color","165":"column-rule-style","166":"column-rule-width","167":"column-span","168":"column-width","169":"align-content","170":"align-items","171":"align-self","172":"flex-basis","173":"flex-grow","174":"flex-shrink","175":"flex-direction","176":"flex-wrap","177":"justify-content","178":"-webkit-font-smoothing","179":"grid-auto-columns","180":"grid-auto-flow","181":"grid-auto-rows","182":"grid-column-end","183":"grid-column-start","184":"grid-template-areas","185":"grid-template-columns","186":"grid-template-rows","187":"grid-row-end","188":"grid-row-start","189":"grid-column-gap","190":"grid-row-gap","191":"-webkit-highlight","192":"hyphens","193":"-webkit-hyphenate-character","194":"-webkit-line-break","195":"-webkit-line-clamp","196":"-webkit-locale","197":"-webkit-margin-before-collapse","198":"-webkit-margin-after-collapse","199":"-webkit-mask-box-image","200":"-webkit-mask-box-image-outset","201":"-webkit-mask-box-image-repeat","202":"-webkit-mask-box-image-slice","203":"-webkit-mask-box-image-source","204":"-webkit-mask-box-image-width","205":"-webkit-mask-clip","206":"-webkit-mask-composite","207":"-webkit-mask-image","208":"-webkit-mask-origin","209":"-webkit-mask-position","210":"-webkit-mask-repeat","211":"-webkit-mask-size","212":"order","213":"perspective","214":"perspective-origin","215":"-webkit-print-color-adjust","216":"-webkit-rtl-ordering","217":"shape-outside","218":"shape-image-threshold","219":"shape-margin","220":"-webkit-tap-highlight-color","221":"-webkit-text-combine","222":"-webkit-text-decorations-in-effect","223":"-webkit-text-emphasis-color","224":"-webkit-text-emphasis-position","225":"-webkit-text-emphasis-style","226":"-webkit-text-fill-color","227":"-webkit-text-orientation","228":"-webkit-text-security","229":"-webkit-text-stroke-color","230":"-webkit-text-stroke-width","231":"transform","232":"transform-origin","233":"transform-style","234":"-webkit-user-drag","235":"-webkit-user-modify","236":"user-select","237":"-webkit-writing-mode","238":"-webkit-app-region","239":"buffered-rendering","240":"clip-path","241":"clip-rule","242":"mask","243":"filter","244":"flood-color","245":"flood-opacity","246":"lighting-color","247":"stop-color","248":"stop-opacity","249":"color-interpolation","250":"color-interpolation-filters","251":"color-rendering","252":"fill","253":"fill-opacity","254":"fill-rule","255":"marker-end","256":"marker-mid","257":"marker-start","258":"mask-type","259":"shape-rendering","260":"stroke","261":"stroke-dasharray","262":"stroke-dashoffset","263":"stroke-linecap","264":"stroke-linejoin","265":"stroke-miterlimit","266":"stroke-opacity","267":"stroke-width","268":"alignment-baseline","269":"baseline-shift","270":"dominant-baseline","271":"text-anchor","272":"writing-mode","273":"vector-effect","274":"paint-order","275":"d","276":"cx","277":"cy","278":"x","279":"y","280":"r","281":"rx","282":"ry","283":"caret-color","284":"line-break","alignContent":"normal","alignItems":"normal","alignSelf":"auto","alignmentBaseline":"auto","all":"","animation":"none 0s ease 0s 1 normal none running","animationDelay":"0s","animationDirection":"normal","animationDuration":"0s","animationFillMode":"none","animationIterationCount":"1","animationName":"none","animationPlayState":"running","animationTimingFunction":"ease","backfaceVisibility":"visible","background":"rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box","backgroundAttachment":"scroll","backgroundBlendMode":"normal","backgroundClip":"border-box","backgroundColor":"rgba(0, 0, 0, 0)","backgroundImage":"none","backgroundOrigin":"padding-box","backgroundPosition":"0% 0%","backgroundPositionX":"0%","backgroundPositionY":"0%","backgroundRepeat":"repeat","backgroundRepeatX":"","backgroundRepeatY":"","backgroundSize":"auto","baselineShift":"0px","blockSize":"0px","border":"0px none rgb(0, 0, 0)","borderBottom":"0px none rgb(0, 0, 0)","borderBottomColor":"rgb(0, 0, 0)","borderBottomLeftRadius":"0px","borderBottomRightRadius":"0px","borderBottomStyle":"none","borderBottomWidth":"0px","borderCollapse":"separate","borderColor":"rgb(0, 0, 0)","borderImage":"none","borderImageOutset":"0px","borderImageRepeat":"stretch","borderImageSlice":"100%","borderImageSource":"none","borderImageWidth":"1","borderLeft":"0px none rgb(0, 0, 0)","borderLeftColor":"rgb(0, 0, 0)","borderLeftStyle":"none","borderLeftWidth":"0px","borderRadius":"0px","borderRight":"0px none rgb(0, 0, 0)","borderRightColor":"rgb(0, 0, 0)","borderRightStyle":"none","borderRightWidth":"0px","borderSpacing":"0px 0px","borderStyle":"none","borderTop":"0px none rgb(0, 0, 0)","borderTopColor":"rgb(0, 0, 0)","borderTopLeftRadius":"0px","borderTopRightRadius":"0px","borderTopStyle":"none","borderTopWidth":"0px","borderWidth":"0px","bottom":"auto","boxShadow":"none","boxSizing":"content-box","breakAfter":"auto","breakBefore":"auto","breakInside":"auto","bufferedRendering":"auto","captionSide":"top","caretColor":"rgb(0, 0, 0)","clear":"none","clip":"auto","clipPath":"none","clipRule":"nonzero","color":"rgb(0, 0, 0)","colorInterpolation":"sRGB","colorInterpolationFilters":"linearRGB","colorRendering":"auto","columnCount":"auto","columnFill":"balance","columnGap":"normal","columnRule":"0px none rgb(0, 0, 0)","columnRuleColor":"rgb(0, 0, 0)","columnRuleStyle":"none","columnRuleWidth":"0px","columnSpan":"none","columnWidth":"auto","columns":"auto auto","contain":"none","content":"","counterIncrement":"none","counterReset":"none","cursor":"auto","cx":"0px","cy":"0px","d":"none","direction":"ltr","display":"block","dominantBaseline":"auto","emptyCells":"show","fill":"rgb(0, 0, 0)","fillOpacity":"1","fillRule":"nonzero","filter":"none","flex":"0 1 auto","flexBasis":"auto","flexDirection":"row","flexFlow":"row nowrap","flexGrow":"0","flexShrink":"1","flexWrap":"nowrap","float":"none","floodColor":"rgb(0, 0, 0)","floodOpacity":"1","font":"normal normal 400 normal 16px / normal \"Times New Roman\"","fontDisplay":"","fontFamily":"\"Times New Roman\"","fontFeatureSettings":"normal","fontKerning":"auto","fontSize":"16px","fontStretch":"100%","fontStyle":"normal","fontVariant":"normal","fontVariantCaps":"normal","fontVariantEastAsian":"normal","fontVariantLigatures":"normal","fontVariantNumeric":"normal","fontVariationSettings":"normal","fontWeight":"400","grid":"none / none / none / row / auto / auto","gridArea":"auto / auto / auto / auto","gridAutoColumns":"auto","gridAutoFlow":"row","gridAutoRows":"auto","gridColumn":"auto / auto","gridColumnEnd":"auto","gridColumnGap":"0px","gridColumnStart":"auto","gridGap":"0px 0px","gridRow":"auto / auto","gridRowEnd":"auto","gridRowGap":"0px","gridRowStart":"auto","gridTemplate":"none / none / none","gridTemplateAreas":"none","gridTemplateColumns":"none","gridTemplateRows":"none","height":"0px","hyphens":"manual","imageRendering":"auto","inlineSize":"1904px","isolation":"auto","justifyContent":"normal","justifyItems":"normal","justifySelf":"auto","left":"auto","letterSpacing":"normal","lightingColor":"rgb(255, 255, 255)","lineBreak":"auto","lineHeight":"normal","listStyle":"disc outside none","listStyleImage":"none","listStylePosition":"outside","listStyleType":"disc","margin":"8px","marginBottom":"8px","marginLeft":"8px","marginRight":"8px","marginTop":"8px","marker":"","markerEnd":"none","markerMid":"none","markerStart":"none","mask":"none","maskType":"luminance","maxBlockSize":"none","maxHeight":"none","maxInlineSize":"none","maxWidth":"none","maxZoom":"","minBlockSize":"0px","minHeight":"0px","minInlineSize":"0px","minWidth":"0px","minZoom":"","mixBlendMode":"normal","objectFit":"fill","objectPosition":"50% 50%","offset":"none 0px auto 0deg","offsetDistance":"0px","offsetPath":"none","offsetRotate":"auto 0deg","opacity":"1","order":"0","orientation":"","orphans":"2","outline":"rgb(0, 0, 0) none 0px","outlineColor":"rgb(0, 0, 0)","outlineOffset":"0px","outlineStyle":"none","outlineWidth":"0px","overflow":"visible","overflowAnchor":"auto","overflowWrap":"normal","overflowX":"visible","overflowY":"visible","overscrollBehavior":"auto auto","overscrollBehaviorX":"auto","overscrollBehaviorY":"auto","padding":"0px","paddingBottom":"0px","paddingLeft":"0px","paddingRight":"0px","paddingTop":"0px","page":"","pageBreakAfter":"auto","pageBreakBefore":"auto","pageBreakInside":"auto","paintOrder":"fill stroke markers","perspective":"none","perspectiveOrigin":"952px 0px","placeContent":"normal normal","placeItems":"normal normal","placeSelf":"auto auto","pointerEvents":"auto","position":"static","quotes":"","r":"0px","resize":"none","right":"auto","rx":"auto","ry":"auto","scrollBehavior":"auto","shapeImageThreshold":"0","shapeMargin":"0px","shapeOutside":"none","shapeRendering":"auto","size":"","speak":"normal","src":"","stopColor":"rgb(0, 0, 0)","stopOpacity":"1","stroke":"none","strokeDasharray":"none","strokeDashoffset":"0px","strokeLinecap":"butt","strokeLinejoin":"miter","strokeMiterlimit":"4","strokeOpacity":"1","strokeWidth":"1px","tabSize":"8","tableLayout":"auto","textAlign":"start","textAlignLast":"auto","textAnchor":"start","textCombineUpright":"none","textDecoration":"none solid rgb(0, 0, 0)","textDecorationColor":"rgb(0, 0, 0)","textDecorationLine":"none","textDecorationSkip":"objects","textDecorationStyle":"solid","textIndent":"0px","textOrientation":"mixed","textOverflow":"clip","textRendering":"auto","textShadow":"none","textSizeAdjust":"auto","textTransform":"none","textUnderlinePosition":"auto","top":"auto","touchAction":"auto","transform":"none","transformOrigin":"952px 0px","transformStyle":"flat","transition":"all 0s ease 0s","transitionDelay":"0s","transitionDuration":"0s","transitionProperty":"all","transitionTimingFunction":"ease","unicodeBidi":"normal","unicodeRange":"","userSelect":"auto","userZoom":"","vectorEffect":"none","verticalAlign":"baseline","visibility":"visible","webkitAppRegion":"no-drag","webkitAppearance":"none","webkitBackgroundClip":"border-box","webkitBackgroundOrigin":"padding-box","webkitBorderAfter":"0px none rgb(0, 0, 0)","webkitBorderAfterColor":"rgb(0, 0, 0)","webkitBorderAfterStyle":"none","webkitBorderAfterWidth":"0px","webkitBorderBefore":"0px none rgb(0, 0, 0)","webkitBorderBeforeColor":"rgb(0, 0, 0)","webkitBorderBeforeStyle":"none","webkitBorderBeforeWidth":"0px","webkitBorderEnd":"0px none rgb(0, 0, 0)","webkitBorderEndColor":"rgb(0, 0, 0)","webkitBorderEndStyle":"none","webkitBorderEndWidth":"0px","webkitBorderHorizontalSpacing":"0px","webkitBorderImage":"none","webkitBorderStart":"0px none rgb(0, 0, 0)","webkitBorderStartColor":"rgb(0, 0, 0)","webkitBorderStartStyle":"none","webkitBorderStartWidth":"0px","webkitBorderVerticalSpacing":"0px","webkitBoxAlign":"stretch","webkitBoxDecorationBreak":"slice","webkitBoxDirection":"normal","webkitBoxFlex":"0","webkitBoxFlexGroup":"1","webkitBoxLines":"single","webkitBoxOrdinalGroup":"1","webkitBoxOrient":"horizontal","webkitBoxPack":"start","webkitBoxReflect":"none","webkitColumnBreakAfter":"auto","webkitColumnBreakBefore":"auto","webkitColumnBreakInside":"auto","webkitFontSizeDelta":"","webkitFontSmoothing":"auto","webkitHighlight":"none","webkitHyphenateCharacter":"auto","webkitLineBreak":"auto","webkitLineClamp":"none","webkitLocale":"auto","webkitLogicalHeight":"0px","webkitLogicalWidth":"1904px","webkitMarginAfter":"8px","webkitMarginAfterCollapse":"collapse","webkitMarginBefore":"8px","webkitMarginBeforeCollapse":"collapse","webkitMarginBottomCollapse":"collapse","webkitMarginCollapse":"","webkitMarginEnd":"8px","webkitMarginStart":"8px","webkitMarginTopCollapse":"collapse","webkitMask":"","webkitMaskBoxImage":"none","webkitMaskBoxImageOutset":"0px","webkitMaskBoxImageRepeat":"stretch","webkitMaskBoxImageSlice":"0 fill","webkitMaskBoxImageSource":"none","webkitMaskBoxImageWidth":"auto","webkitMaskClip":"border-box","webkitMaskComposite":"source-over","webkitMaskImage":"none","webkitMaskOrigin":"border-box","webkitMaskPosition":"0% 0%","webkitMaskPositionX":"0%","webkitMaskPositionY":"0%","webkitMaskRepeat":"repeat","webkitMaskRepeatX":"","webkitMaskRepeatY":"","webkitMaskSize":"auto","webkitMaxLogicalHeight":"none","webkitMaxLogicalWidth":"none","webkitMinLogicalHeight":"0px","webkitMinLogicalWidth":"0px","webkitPaddingAfter":"0px","webkitPaddingBefore":"0px","webkitPaddingEnd":"0px","webkitPaddingStart":"0px","webkitPerspectiveOriginX":"","webkitPerspectiveOriginY":"","webkitPrintColorAdjust":"economy","webkitRtlOrdering":"logical","webkitRubyPosition":"before","webkitTapHighlightColor":"rgba(0, 0, 0, 0.18)","webkitTextCombine":"none","webkitTextDecorationsInEffect":"none","webkitTextEmphasis":"","webkitTextEmphasisColor":"rgb(0, 0, 0)","webkitTextEmphasisPosition":"over right","webkitTextEmphasisStyle":"none","webkitTextFillColor":"rgb(0, 0, 0)","webkitTextOrientation":"vertical-right","webkitTextSecurity":"none","webkitTextStroke":"","webkitTextStrokeColor":"rgb(0, 0, 0)","webkitTextStrokeWidth":"0px","webkitTransformOriginX":"","webkitTransformOriginY":"","webkitTransformOriginZ":"","webkitUserDrag":"auto","webkitUserModify":"read-only","webkitWritingMode":"horizontal-tb","whiteSpace":"normal","widows":"2","width":"1904px","willChange":"auto","wordBreak":"normal","wordSpacing":"0px","wordWrap":"normal","writingMode":"horizontal-tb","x":"0px","y":"0px","zIndex":"auto","zoom":"1"};


        nodes[i] = {
          'tag': objects[key].tagName,
          'id': (objects[key].attributes.id) ? objects[key].attributes.id.value : undefined,
          'class': (objects[key].attributes.class) ? objects[key].attributes.class.value : undefined,
          'style': styleDeclarationToSimpleObject(styles)
        };
        i++;
      }

    }
    return nodes;
  }
  return init();
}


//var tabObj = {"0":{},"1":{},"2":{},"3":{},"4":{},"5":{},"6":{},"7":{},"8":{},"9":{},"10":{},"11":{"sizcache06304045768605915":10,"sizset":54},"12":{},"13":{"sizcache06304045768605915":10,"sizset":468},"14":{},"15":{"sizcache06304045768605915":10,"sizset":546},"16":{},"17":{},"18":{},"19":{},"20":{},"21":{},"22":{},"23":{},"24":{},"25":{},"26":{},"27":{},"28":{},"29":{},"30":{},"31":{},"32":{},"33":{}};
//var tabObj = {"sizcache013994122734975445":10,"sizset":527};

//CSSSnapshooter(tabObj);
