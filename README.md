# zetta-led-pi-driver
Zetta Driver for Integrating LED Device with Raspberry PI Board

## Install

```sh
$ npm install zetta-led-pi-driver --save
```


## Usage

var zetta = require('zetta');
var LED = require('zetta-led-pi-driver');

zetta()
  .name('Firstname-Lastname')
  .use(LED, 18)
  .listen(1337, function(){
     console.log('Zetta is running..');
});
