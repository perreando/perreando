const hbs = require('hbs');

hbs.registerHelper('hasHobbie', function(user, hobbie, options){
  if(user.hobbies.includes(hobbie)){
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
});


hbs.registerHelper('hasRole', (user, role, options) => {
  if (user.role === role) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
})