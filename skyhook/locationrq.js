module.exports = function (RED) {

  var request = require('request');

  function LocationRQNode (config) {
    RED.nodes.createNode(this, config);
    var node = this;
   
    this.log('skyhook-locationrq - Initialized') ;
	
    this.on('input', function (msg) {
      this.log('skyhook-locationrq - Input received');
		
      var message = '';
      if (!msg.payload) {
			 message = 'Missing property: msg.payload';
			 node.error(message, msg);
			 return;
      }

      var username = this.credentials.username;
      var password = this.credentials.password;
      this.status({});  
			
      if (!username || !password) {
        this.status({fill:'red', shape:'ring', text:'missing credentials'});  
        message = 'Missing LocationRQ service credentials';
        this.error(message, msg);
        return;
      } 

      var listSSID = msg.payload;
      var constrXML;
      constrXML = '<?xml version="1.0" encoding="UTF-8"?><LocationRQ xmlns="http://trueposition.com/truefix" version="2.23" ><authentication version="2.2"><key key="'+ password +'" username ="'+ username +'"/></authentication>'
      listSSID.forEach(function(val){
        constrXML += '<access-point><mac>' + val.mac.replace(/:/g, '').toUpperCase() + '</mac><signal-strength>' + val.signal_level + '</signal-strength></access-point>';
      });
      constrXML += "</LocationRQ>";

      this.status({fill:'blue', shape:'ring', text:'requesting'});
      request.post({
        headers: {'content-type' : 'text/xml'},
        url:     'https://tfdemo-lg.trueposition.com:8443/wps2/location',
        body:    constrXML
      }, function(error, response, body){
        if(error) {
          msg.payload = 'Error: ' + error;
          node.send(msg);
          node.status({fill:'red', shape:'ring', text:'request error'});
        } else {
          msg.payload = response.body;
          node.send(msg);
          node.status({});
        }
      }); 	  
    });
  }
  
  //Register the node as skyhook-locationrq to nodeRED 
  RED.nodes.registerType('skyhook-locationrq', 
                         LocationRQNode, 
                         {credentials: { username: {type:'text'},
                                         password: {type:'text'}
                                       }
                         });
							
};


