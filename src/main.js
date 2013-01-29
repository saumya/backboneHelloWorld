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
//All references
//Ref : http://net.tutsplus.com/sessions/build-a-contacts-manager-using-backbone-js/?search_index=1
//individual page or excercise
//Ref : http://net.tutsplus.com/tutorials/javascript-ajax/build-a-contacts-manager-using-backbone-js-part-2/
//making a contacts list
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
		        photo: "assets/images/placeholder.png",
		        name: "Default Name",
				address: "Default Address",
				tel: "00100",
				email: "default@default.com",
				type: "deafult"
		    }
		});
	var Directory = Backbone.Collection.extend({
		model: Contact
	});
	//VIEW
	//contact view
	var ContactView = Backbone.View.extend({
		tagName: "article",
		className: "contact-container",
		template: $("#contactTemplate").html(),//rendering only template
		editTemplate: _.template($("#contactEditTemplate").html()),//edit contact template
		render: function(){
			var tmpl = _.template(this.template);
			this.$el.html(tmpl(this.model.toJSON()));
			return this;
		},
		events: {
		    "click button.delete": "deleteContact"
		},
		deleteContact: function () {
		   var removedType = this.model.get("type").toLowerCase();
		    this.model.destroy();
		    this.remove();
		    if (_.indexOf(directory.getTypes(), removedType) === -1) {
		        directory.$el.find("#filter select").children("[value='" + removedType + "']").remove();
		    }
		}
	});
	//main view : DirectoryView
	var DirectoryView = Backbone.View.extend({
	    el: $("#contacts"),
	    initialize: function () {
	    	console.log('DirectoryView : initialize : ');
	        this.collection = new Directory(contacts);
	        this.render();
	        //
	        this.$el.find("#filter").append(this.createSelect());//for select
	        //Registering EventHandlers
	        this.on("change:filterType", this.filterByType, this);//registering event handlers
	        //EventHandlers on Collection
	        this.collection.on("reset", this.render, this);
	        this.collection.on("add", this.renderContact, this);
	        this.collection.on("remove", this.removeContact, this);
	    },
	    render: function () {
	    	console.log('DirectoryView : render');
	        var that = this;
	        
	        this.$el.find("article").remove();
	        this.$el.find("#addContact").slideToggle();//hide the input form in the beginning
	        
	        _.each(this.collection.models, function (item) {
	            that.renderContact(item);
	        }, this);
	    },
	    renderContact: function (item) {
	        var contactView = new ContactView({
	            model: item
	        });
	        this.$el.append(contactView.render().el);
	    },
	    getTypes: function () {
		    return _.uniq(this.collection.pluck("type"), false, function (type) {
															        return type.toLowerCase();
															    });
		},
		createSelect: function () {
		    /*var filter = this.$el.find("#filter"),*/
		    var select = $("<select/>", {
		            html: "<option value='all'>All</option>"
		        });
		    _.each(this.getTypes(), function (item) {
		    var option = $("<option/>", {
								            value: item.toLowerCase(),
								            text: item.toLowerCase()
								        }).appendTo(select);
		    });
		    return select;
		},
		//Events
		events: {
		    "change #filter select": "setFilter",
		    "click #add": "addContact",
		    "click #showForm": "showForm",
		    //events of edit form
		    "click button.edit": "editContact",
			"change select.type": "addType",
			"click button.save": "saveEdits",
			"click button.cancel": "cancelEdit"
		},
		//Event handler
		setFilter: function (e) {
		    this.filterType = e.currentTarget.value;
		    this.trigger("change:filterType");
		},
		filterByType: function () {
			console.log('DirectoryView : filterByType');
		    if (this.filterType === "all") {
		        this.collection.reset(contacts);
		        contactsRouter.navigate("filter/all");
		    } else {
		        this.collection.reset(contacts, { silent: true });
		        var filterType = this.filterType,
		            filtered = _.filter(this.collection.models, function (item) {
			            return item.get("type").toLowerCase() === filterType;
			        });
		        this.collection.reset(filtered);
		        contactsRouter.navigate("filter/" + filterType);
		    }
		},
		addContact: function (e) {
		console.log('DirectoryView : addContact');
		    e.preventDefault();
		    var formData = {};
		    $("#addContact").children("input").each(function (i, el) {
		        if ($(el).val() !== "") {
		            formData[el.id] = $(el).val();
		      }
		    });
		    contacts.push(formData);
		    if (_.indexOf(this.getTypes(), formData.type) === -1) {
		         this.collection.add(new Contact(formData));
		        this.$el.find("#filter").find("select").remove().end().append(this.createSelect());
		    } else {
		        this.collection.add(new Contact(formData));
		    }
		},
		removeContact: function (removedModel) {
		    var removed = removedModel.attributes;
		    if (removed.photo === "assets/images/placeholder.png") {
		        delete removed.photo;
		    }
		    _.each(contacts, function (contact) {
		        if (_.isEqual(contact, removed)) {
		            contacts.splice(_.indexOf(contacts, contact), 1);
		        }
		    });
		},
		showForm: function () {
		    this.$el.find("#addContact").slideToggle();
		}
		
		
		
		
	});//End Main View : DirectoryView
	//Routes
	var ContactsRouter = Backbone.Router.extend({
	    routes: {
		        "filter/:type": "urlFilter"
		    },
		    urlFilter: function (type) {
		        directory.filterType = type;
		        directory.trigger("change:filterType");
		    }
	});//End Routes
	
	//The Final part, initialisation and configuration
	//finally initialise the main view
	var directory = new DirectoryView();
	//adding the routes support
	var contactsRouter = new ContactsRouter();
	//adds url route
	Backbone.history.start();
				
				
} (jQuery));