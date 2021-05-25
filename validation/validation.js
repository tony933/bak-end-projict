// ======
// Register validation Function
// ======
const registerValidation = async (data)=>{
    var userName,email,password;
    var userAuth = Array;
    //check email null or not 
    if(data.email.length != 0){
        email =  data.email;
      }else{
          return ({emailEmpty: "\"email\" is not allowed to be empty"});
      }
    if(data.password.length != 0){
        password = data.password;
    }else{
        return ({passwordEmpty: "\"Password\" is not allowed to be empty"})
    }
    //check userName null or not 
    if(data.userName.length != 0 ){
        userName = data.userName
    }else{
        return ({userNameEmpty: "\"User Name\" is not allowed to be empty"});
    }

   //check email At~@ exist or not
    if (email.search(/(@)/gi) == -1)
        return({emailError: "\"Email\" is not Valid"});
    if(email.match(/(@)/gi).length == 1){
        userAuth = email.split('@');
    }else{
        return({emailError: "\"Email\" is not Valid"});
    }
    
    //check email local-part 
    if(userAuth[0].length < 6 | userAuth[0].length > 30)
        return({emailError: "\"Email\" is not Valid"});
    //check email type
    const emailType = userAuth[1].search(/(gmail.com|yahoo.com|outlook.sa|outlook.com|hotmail.com|@zohomail.com)/gi);
    if(emailType == -1)
        return({emailError: "\"Email\" is not Valid"});
    //check password
    if(password.length < 8)
        return ({passwordError: "\"Password\" Use 8 characters at less"});
    if(password.length > 30)
        return ({passwordError: "\"Password\" Use 30 characters at most"});
    //check userName greater than 4 or not  
    if(userName.length < 4 | userName.length > 25 ){
        return ({userNameError: "\"User Name\" Use 4 to 25 characters at less"});
    }
}

// ======
// Login validation Function
// ======
const loginValidation = async (data)=>{
    var email,password;
    var userAuth = Array;
    //check email null or not 
    if(data.email.length != 0){
        email =  data.email;
      }else{
          return ({emailEmpty: "\"email\" is not allowed to be empty"});
      }
    if(data.password.length != 0){
        password = data.password;
    }else{
        return ({passwordEmpty: "\"Password\" is not allowed to be empty"})
    }
    
    //check email At~@ exist or not
    if (email.search(/(@)/gi) == -1)
        return({emailError: "\"Email\" is not Valid"});
    if(email.match(/(@)/gi).length == 1){
        userAuth = email.split('@');
    }else{
        return({emailError: "\"Email\" is not Valid"});
    }

    //check email local-part 
    if(userAuth[0].length < 6 | userAuth[0].length > 30)
        return({emailError: "\"Email\" is not Valid"});
    //check email type
    const emailType = userAuth[1].search(/(gmail.com|yahoo.com|outlook.sa|outlook.com|hotmail.com|@zohomail.com)/gi);
    if(emailType == -1)
        return({emailError: "\"Email\" is not Valid"});
    //check password
    if(password.length < 8)
        return ({passwordError: "\"Password\" Use 8 characters at less"});
    if(password.length > 30)
        return ({passwordError: "\"Password\" Use 30 characters at most"});
}
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;

