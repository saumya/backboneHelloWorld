/*
(function ($) {
  
  Friend = Backbone.Model.extend({
    //Create a model to hold friend atribute
    name: null
  });
  
  Friends = Backbone.Collection.extend({
    //This is our Friends collection and holds our Friend models
    initialize: function (models, options) {
      this.bind("add", options.view.addFriendLi);
      //Listen for new additions to the collection and call a view function if so
    }
  });
  
  AppView = Backbone.View.extend({
    el: $("body"),
    initialize: function () {
      this.friends = new Friends( null, { view: this });
      //Create a friends collection when the view is initialized.
      //Pass it a reference to this view to create a connection between the two
    },
    events: {
      "click #add-friend":  "showPrompt",
    },
    showPrompt: function () {
      var friend_name = prompt("Who is your friend?");
      var friend_model = new Friend({ name: friend_name });
      //Add a new friend model to our friend collection
      this.friends.add( friend_model );
    },
    addFriendLi: function (model) {
      //The parameter passed is a reference to the model that was added
      $("#friends-list").append("<li>" + model.get('name') + "</li>");
      //Use .get to receive attributes of the model
    }
  });
  
  var appview = new AppView;
})(jQuery);
*/
(function ($) {
	console.log('init app');
    var contacts = [
        { name: "Contact 1", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
        { name: "Contact 2", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
        { name: "Contact 3", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "friend" },
        { name: "Contact 4", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "colleague" },
        { name: "Contact 5", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
        { name: "Contact 6", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "colleague" },
        { name: "Contact 7", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "friend" },
        { name: "Contact 8", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" }
    ];
    var Contact = Backbone.Model.extend({
		defaults: {
		        photo: "assets/images/placeholder.png"
		    }
		});
	var Directory = Backbone.Collection.extend({
		model: Contact
	});
	//VIEW
	var ContactView = Backbone.View.extend({
		tagName: "article",
		className: "contact-container",
		template: $("#contactTemplate").html(),
		render: function(){
			var tmpl = _.template(this.template);
			this.$el.html(tmpl(this.model.toJSON()));
			return this;
		}
	});
	var DirectoryView = Backbone.View.extend({
	    el: $("#contacts"),
	    initialize: function () {
	    	console.log('DirectoryView : initialize : ');
	        this.collection = new Directory(contacts);
	        this.render();
	    },
	    render: function () {
	        var that = this;
	        _.each(this.collection.models, function (item) {
	            that.renderContact(item);
	        }, this);
	    },
	    renderContact: function (item) {
	        var contactView = new ContactView({
	            model: item
	        });
	        this.$el.append(contactView.render().el);
	    }
	});
	//finally initialise the main view
	var directory = new DirectoryView();
				
				
} (jQuery));