const { bootstrap } = window

// event listener when register button is clicked
document.getElementById('registerBtn').addEventListener('click', event => {
 event.preventDefault()

 // assign variables (and send the username input to lower case to help prevent duplciates)
 let errorMessage = document.getElementById('errorMsg')
 let usernameInput = document.getElementById('rUsername').value.toLowerCase()
 let passwordInput = document.getElementById('rPassword').value

 // axios get all usernames to check for any same case existing
 axios.get('/api/usernames')
  .then(({ data: usernames }) => {
   // map the database usernames to lower case to help prevent duplicates
   const usernamesLowerCase = usernames.map(username => username.toLowerCase())
   // if the (lowercase) desired user name exists in the database (lowercase) usernames then set error message to username already exists
   if (usernamesLowerCase.indexOf(usernameInput) !== -1) {
    errorMessage.textContent = '⚠️ Username already exists, please choose another username'
    errorMessage.style.color = 'red'
   }
   // else if the username input and/or the password input is blank/empty set error message to notify user
   else {
    if (usernameInput === '' || passwordInput === '') {
     errorMessage.textContent = '⚠️ Please enter a username and password'
     errorMessage.style.color = 'red'
    } 
    // else, the user name is valid - register the user
    else {
     axios.post('/api/users/register', {
      username: usernameInput,
      password: passwordInput
     })
      // then notify user of successful registration
      .then(() => {
       errorMessage.textContent = 'Success! Logging in now...'
       errorMessage.style.color = 'green'
       errorMessage.style.fontWeight = 'bold'
      // log the user into the application
       axios.post('api/users/login', {
         username: usernameInput,
         password: passwordInput
       })
        .then(({ data: token }) => {
          // set token in local storage and login to home page
          localStorage.setItem('token', token)
          window.location = '/index.html'
        })
        .catch(err => console.log(err))
      })
      .catch(err => console.error(err))
    }
   }
  })
  .catch(err => console.log(err))//
})
