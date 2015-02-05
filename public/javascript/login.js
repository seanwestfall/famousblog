console.log('hey!');
console.log(Template.login);
Template.login.events({
      'submit .form-signin' : function(e, t){
      e.preventDefault();
      // retrieve the input field values
      var email = t.find('#inputEmail').value
        , password = t.find('#inputPassword').value;

        // Trim and validate your fields here.... 

        // If validation passes, supply the appropriate fields to the
        // Meteor.loginWithPassword() function.
        Meteor.loginWithPassword(email, password, function(err){
        if (err) {
		alert(err);
          // The user might not have been found, or their passwword
          // could be incorrect. Inform the user that their
          // login attempt has failed. 
        } else {
          // The user has been logged in.
	}
      });
         return false; 
      }
});
