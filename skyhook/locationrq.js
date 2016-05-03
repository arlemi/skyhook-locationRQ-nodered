/**
 * Copyright and License are going here
 **/

module.exports = function (RED) {

  var request = require('request');

  function LocationQRNode (config) {
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

      var username = sUsername || this.credentials.username;
      var password = sPassword || this.credentials.password;
      this.status({});  
			
      if (!username || !password) {
        this.status({fill:'red', shape:'ring', text:'missing credentials'});  
        message = 'Missing Watson Dialog service credentials';
        this.error(message, msg);
        return;
      } 

      /*var dialog = watson.dialog({
        username: username,
        password: password,
        version: 'v1'
      });	  

      var params = {};
      if (config.mode === 'create') {
        performCreate(node,dialog,msg);
      }
      else if (config.mode === 'delete') {
        performDelete(node,dialog,msg,config);
      }
      else if (config.mode === 'deleteall') {
        performDeleteAll(node,dialog,msg,config);
      }
       else if (config.mode === 'list') {
        performList(node,dialog,msg);
      } else {
            node.status({fill:'blue', shape:'dot', text:'Requesting dialog profile variables'});
            dialog.getProfile (params, function (err, dialog_data) {
              node.status({});
              if (err) {
                node.status({fill:'red', shape:'ring', text:'call to dialog service failed'}); 
                node.error(err, msg);
              } else {
                msg.dialog = dialog_data;		  
                msg.payload = 'Check msg.dialog dialog data';
                node.send(msg);
              }  
            });
         }*/			  	  
    });
  }

  // This function performs the operation to fetch a list of all dialog templates
  /*function performList(node,dialog,msg) {
  
  node.status({fill:'blue', shape:'dot', text:'requesting list of dialogs'});	    
	dialog.getDialogs({}, function(err, dialogs){
    node.status({});
	  if (err) {
        node.status({fill:'red', shape:'ring', text:'call to dialog service failed'});
        node.error(err, msg);		
      } else {
        msg.dialog = dialogs;
        msg.payload = 'Check msg.dialog for list of dialogs';
        node.send(msg);
      }		  
    });
  }*/		

  
  //Register the node as service-dialog to nodeRED 
  RED.nodes.registerType('skyhook-locationrq', 
                         LocationQRNode, 
                         {credentials: { username: {type:'text'},
                                         password: {type:'password'}
                                       }
                         });
							
};


