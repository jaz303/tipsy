var defaultOptions = {
  renderer        : 'default',
  gravity         : 'n',
  offsetX         : 0,
  offsetY         : 0,
};

var nextId = 1;

function id() {
  return 'tipsy-tooltip-' + (nextId++);
}

function value(thing) {
  return (typeof thing === 'function') ? thing() : thing;
}

function isElementInDOM(ele) {
  while (ele = ele.parentNode) {
    if (ele === document) return true;
  }
  return false;
}

function Tipsy(pointee, options) {
  
  if (typeof options === 'string')
    options = {text: options};
  
  options = $.extend({}, defaultOptions, options);
  
  this.pointee = pointee;
  this.tip = renderers[options.renderer](options);
  
  var ele = this.tip.ele[0];
  
  ele.id = id();
  ele.attr('role', 'tooltip');
  this.pointee.setAttribute('aria-describedby', ele.id);
  
}

Tipsy.prototype = {
  show: function(callback) {
    
  },
  
  hide: function(callback) {
    
  },
  
  setText: function(text) {
    this.tip.setText(text);
    // TODO: reposition/move
  },
  
  setHTML: function(html) {
    this.tip.setHTML(html);
    // TODO: reposition/move
  },
  
  validate: function() {
    if (!isElementInDOM(this.pointee)) {
      this.destroy();
    }
  },
  
  destroy: function() {
    var self = this;
    this.hide(function() {
      self.tip.ele.remove();
      self.pointee = null;
      self.tip = null;
    });
  }
};

var defaultRenderer = function(options) {
  var tip   = $('<div class="tipsy"><div class="tipsy arrow"/></div>'),
      inner = $('<div class="tipsy-inner"/>').appendTo(tip);
  
  function setText(text) { inner.text(text); }
  function setHTML(html) { inner.html(html); }
  
  if ('text' in options) {
    setText(options.text);
  } else if ('html' in options) {
    setHTML(options.html);
  }
  
  if (options.theme) {
    tip.addClass(options.theme);
  }
  
  if ('maxWidth' in options) {
    tip.css('maxWidth', options.maxWidth + 'px');
  }

  return {
    ele       : tip,
    setText   : setText,
    setHTML   : setHTML
  };
};

var renderers = {
  "default"     : defaultRenderer
};

Tipsy.Renderers   = renderers;
Tipsy.Defaults    = defaultOptions;