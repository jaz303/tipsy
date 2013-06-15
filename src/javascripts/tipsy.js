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
  reposition: function() {
    var pm = $.extend({}, this.pointee.offset(), {
      width   : this.pointee[0].offsetWidth,
      height  : this.pointee[0].offsetHeiight
    });
    
    var tm = {
      width   : this.tip.ele[0].offsetWidth,
      height  : this.tip.ele[0].offsetHeight
    };
    
    var gravity = value(this.options.gravity, this.pointee[0]),
        top     = null,
        left    = null;
        
    switch (gravity[0]) {
      case 'n':
        top = pm.top + pm.height;
        left = pm.left + pm.width / 2 - tm.width / 2;
        break;
      case 's':
        top = pm.top - tm.height;
        left = pm.left + pm.width / 2 - tm.width / 2;
        break;
      case 'e':
        top = pm.top + pm.height / 2 - tm.height / 2;
        left = pm.left - tm.width;
        break;
      case 'w':
        top = pm.top + pm.height / 2 - tm.height / 2;
        left = pm.left + pm.width;
        break;
    }
        
    if (gravity[1] === 'w') {
      left = pm.left + pm.width / 2 - 15;
    } else if (gravity[1] === 'e') {
      left = pm.left + pm.width / 2 - tm.width + 15;
    }
    
    this.tip.ele.css({top: top, left: left});
  },
  
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
  var tip   = $('<div class="tipsy-default"><div class="tipsy-arrow"/></div>'),
      inner = $('<div class="tipsy-default-inner"/>').appendTo(tip);
  
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