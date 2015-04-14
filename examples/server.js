var zetta = require('zetta');
var LED = require('../index');

zetta()
  .use(LED, 18)
  .listen(1337);
