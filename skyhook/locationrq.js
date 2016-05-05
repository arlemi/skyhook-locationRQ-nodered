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

      this.status({fill:'blue', shape:'ring', text:'requesting'});
      request.post({
        headers: {'content-type' : 'text/xml'},
        url:     'https://tfdemo-lg.trueposition.com:8443/wps2/location',
        body:    msg.payload
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
                                         password: {type:'password'}
                                       }
                         });
							
};


