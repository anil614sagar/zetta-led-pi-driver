var Device = require('zetta-device');
var util = require('util');
var Gpio = require('onoff').Gpio;



var LED = module.exports = function(pin) {
  Device.call(this);
  this.pin = pin;
  this._pin = new Gpio(pin, 'out');
};
util.inherits(LED, Device);

LED.prototype.init = function(config) {
  config
    .type('led')
    .name('LED ' + this.pin)
    .state('off')
    .when('off', { allow: ['turn-on', 'turn-on-pulse', 'turn-on-alternating', 'flash']})
    .when('on', { allow: ['turn-off', 'turn-on-pulse', 'turn-on-alternating', 'flash'] })
    .when('pulse', { allow: ['turn-off', 'turn-on', 'turn-on-alternating', 'flash'] })
    .when('alternating', { allow: ['turn-off', 'turn-on', 'turn-on-pulse', 'flash'] })
    .when('flash', { allow: [] })
    .map('flash', this.flash)
    .map('turn-on', this.turnOn)
    .map('turn-on-pulse', this.turnOnPulse)
    .map('turn-on-alternating', this.turnOnAlternating)
    .map('turn-off', this.turnOff);


    this._pin.write(0, function (err) { // Asynchronous write.
      if (err) {
        throw err;
      }
    });

};

LED.prototype.turnOn = function(cb) {
  var state = 'on';
  var onDuration = Infinity;
  var offDuration = 0;
  this._pattern(onDuration, offDuration, state, cb);
};

LED.prototype.turnOnPulse = function(cb) {
  var state = 'pulse';
  var onDuration = 150;
  var offDuration = 100;
  this._pattern(onDuration, offDuration, state, cb);
};

LED.prototype.turnOnAlternating = function(cb) {
  var state = 'alternating';
  var onDuration = 100;
  var offDuration = 400;
  this._pattern(onDuration, offDuration, state, cb);
};

LED.prototype.flash = function(cb) {
  this.state = 'flash';
  var self = this;
  this.turnOff(function() {
    self._emitLight(100, 750);
  });
  cb();
};

LED.prototype.turnOff = function(cb) {
  if (this._timer != undefined) {
    clearInterval(this._timer);
  }
  this._pin.write(0, function (err) { // Asynchronous write.
    if (err) {
      throw err;
    }
  });
  this.state = 'off';
  cb();
};

LED.prototype._pattern = function(onDuration, offDuration, state, cb) {
  var self = this;
  this.turnOff(function(){
    if (onDuration === Infinity || offDuration === 0) {
      self._pin.write(1, function (err) { // Asynchronous write.
        if (err) {
          throw err;
        }
      });
    } else {
      self._timer = setInterval(self._emitLight.bind(self, onDuration), onDuration + offDuration);
    }
    self.state = state;
    cb();
  });
};

LED.prototype._emitLight = function(delay) {
  var self = this;
  this._pin.write(1, function (err) { // Asynchronous write.
    if (err) {
      throw err;
    }
  });

  var self = this;
  setTimeout(function() {
    self._pin.write(0, function (err) { // Asynchronous write.
      if (err) {
        throw err;
      }
    });
  }, delay);

};
