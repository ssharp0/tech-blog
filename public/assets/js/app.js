const { axios } = window

// event listener when goHome button is pressed go to index/home
document.getElementById('goHome').addEventListener('click', () => {
  window.location = '/index.html'
})

// event listener when goDashboard button is pressed
document.getElementById('goDashboard').addEventListener('click', () => {
  // if there is a token in local storge (set upon login) then go to dashboard page
  if (localStorage.getItem('token')) {
    console.log("user is currently logged in")
    window.location = '/dashboard.html'
  }
  // else if there is no token go to log in screen
  else {
    window.location = '/login.html'
  }
})

// event listener to logout when logout button is clicked remove token from local storage and go to login screen
document.getElementById('logOut').addEventListener('click', () => {
  localStorage.removeItem('token')
  window.location = '/login.html'
})

// function to refresh window
function reloadWindow() {
  location.reload()
}

// function to format the date from sql db to MM/DD/YYYY
function formatDate(postDate) {
  let dateObj = new Date(postDate)
  let month = dateObj.getUTCMonth() + 1
  let day = dateObj.getUTCDate()
  let year = dateObj.getUTCFullYear()
  formattedDate = month + "/" + day + "/" + year
  return formattedDate
}

// get all posts without auth
axios.get('/api/posts')
  .then(({ data: posts }) => {
    // console.log(posts)
    // for each post grab the data to render to html
    posts.forEach(({ id, title, body, date, createdAt, updatedAt, u: { username } }) => {
      // format the date from SQL db
      let formattedCreateDate = formatDate(createdAt)
      let formattedUpdateDate = formatDate(updatedAt)
      // create a list element for the post and add a class and innerHTML with the post data
      const postElem = document.createElement('li')
      postElem.className = 'd-flex justify-content-between align-items-start mb-2 rounded postListItem'
      postElem.innerHTML =
        `
        <div class="col-12 postDivision">

          <div class="postHeader text-white d-flex justify-content-between fw-bold rounded">
            ${title}
            <span class=" float-right badge fw-bold rounded-pill infoPill">Posted by ${username} on ${formattedCreateDate}</span>
          </div>

          <div class="postBodyArea rounded">
            ${body}
          </div>

          <div class="postFooter rounded">
            <button type="button" class="btn btn-primary commentBtn" data-id="${id}">Add a Comment</button>
            <span class="float-right badge fw-bold rounded-pill infoPill">Post Last Update:${formattedUpdateDate}</span>
            <div id="${id}" class ="text-dark commentSection"></div>
            <br>
          </div>

        </div>
        `
      // prepend the post elemement with the post data to posts div on html
      document.getElementById('posts').prepend(postElem)

      //  get the comments by post id
      axios.get(`/api/comments/${id}`)
        .then(res => {
          // response (spread/rest) to comments array to grab all data
          let commentsArr = [...res.data]

          // for each comment in the comments array
          commentsArr.forEach(comment => {

            // if the id (post id) matches the commments post id
            if (id == comment.postId) {

              // format the createdAt date
              formattedCommentCreateDate = formatDate(comment.createdAt)
              let commentListItem = document.createElement('ul')
              commentListItem.className = "list-group"
              commentListItem.innerHTML =
              `
              <li class="list-group-item commentElemItem">
                <div>${comment.comment}</div>
                <span class="badge badge-secondary mb-1 commentDetails">
                  From ${comment.username} on ${formattedCommentCreateDate}
                </span>
              </li>
              `
              //  append the comment list item to the post with the id
              document.getElementById(id).append(commentListItem)
            }
          })
        })
        .catch(err => { console.log(err) })
    })
  })
  .catch(err => { console.log(err) })

// add global event listener for when click (create comment input)
document.addEventListener('click', event => {
  // if the event target class list contains comment (comment btn)
  if (event.target.classList.contains('commentBtn')) {
    // if there is a token in  location storage (user is logged in)
    if (localStorage.getItem('token')) {

      // id is the event target dataset id (post id from comment button on post) and create a form element
      let id = event.target.dataset.id
      let commentForm = document.createElement('form')
      // add a classname to the form as the formid (post id) and add the inner html to gather user input text for comment
      commentForm.className = `commentPost${id}`
      commentForm.innerHTML =
        `
        <div class="mb-4">
          <label for="commentBody" class="mt-2 text-white form-label"><strong>Comment: </strong></label>
          <input type="text" class="form-control" id="commentBody">
        </div>
        <button data-id="${id}" type="submit" class="btn btn-dark createComment">Submit</button>
        <button data-id="${id}" type="submit" class="btn btn-dark cancelBtn">Cancel</button>
        `
      // append the comment form to the post with the same post id
      document.getElementById(id).append(commentForm)
    }
    // else if there is no token go to log in screen
    else {
      window.location = '/login.html'
    }
  }
})

// global event listener when clicked create comment (post user comment data from inputs)
document.addEventListener('click', event => {
  // if the event target class contains createComment
  if (event.target.classList.contains('createComment')) {
    // id is the event target dataset id post id
    let id = event.target.dataset.id
    let comment = document.getElementById('commentBody').value
    // post (create) the comment with auth
    axios.post('/api/comments',
      {
        id: id,
        comment: comment
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      // then for the comments data
      .then(({ data: commentsData }) => {
        console.log(commentsData);
        // set an index to comments length to grab the username and comment (last comment)
        let commentIndex = commentsData.length
        let commentUsername = commentsData[commentIndex - 1].username
        let commentDate = commentsData[commentIndex - 1].createdAt
        // format date and set id
        let formattedCommentDate = formatDate(commentDate)
        let id = event.target.dataset.id

        // create a comment list element with comment data
        let commentElem = document.createElement('li')
        commentElem.className = 'list-group-item commentElemItem'
        commentElem.innerHTML = 
        `
        <div>${comment}</div>
        <span class="badge badge-secondary mb-1 commentDetails">
          From ${commentUsername} on ${formattedCommentDate}
        </span>
        `
        // get element id post id and append the comment to the post
        document.getElementById(`${id}`).append(commentElem)
        // can alternatively just reload window and remove above since get request will show/render the new comments but aligning for reference in future
        // reloadWindow()
      })
      // catch error
      .catch(err => { console.log(err) })
  }
})

// global event listener if cancel button is clicked (to cancel a comment) then reload the page
document.addEventListener('click', event => {
  if (event.target.classList.contains('cancelBtn')) {
    reloadWindow()
  }
})

// function to set/reset the activity time based on user activity in window
let inactiveTime = function () {

  // create time variable and reset the timer when user moves mouse, keys or clicks
  let time
  window.onload = resetTimer
  document.onmousemove = resetTimer
  document.onkeydown = resetTimer
  document.onclick = resetTimer

  // function to log out and return to the login page
  function logout() {
    alert("User is logged out.")
    localStorage.removeItem('token')
    window.location = '/login.html'
  }

  // function to reset the timer (will log out after 20 min of no activity) 1000ms = 1s
  function resetTimer() {
    clearTimeout(time);
    time = setTimeout(logout, 1200000)
    // console.log(time)
  }
};

// on window load call function of inactivity
window.onload = function () {
  inactiveTime();
}

// remove token after 30 min and go to log in page
setTimeout(() => {
  localStorage.removeItem('token')
  window.location = '/login.html'
}, 1800000);

// function to check if user is logged in
function userLoggedInCheck() {
  // if local storage token then logged in
  if (localStorage.getItem('token')) {
    console.log("user is currently logged in")
  }
  // else if no token then user is not logged in and set the lotout button to say Login so user can go to sign in page 
  else {
    console.log('user is not logged in')
    let signButton = document.getElementById('logOut')
    signButton.innerHTML = `Login`
  }
}

// call the function to check if user is logged in
userLoggedInCheck()

