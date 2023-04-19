const pages = []
const containerPage = createContainer()

let getLocal = window.location.href

let searchString = new URL (getLocal)
searchString.search = ''

searchString.pathname = searchString.pathname.replace(searchString.pathname.split('/')[1], 'index.html')

window.history.pushState({}, null, searchString)

// получения ответа с сервера, занесение страниц в массив

async function responseObj () {
  const response = await fetch('https://gorest.co.in/public-api/posts?/page');
  const data = await response.json()

  for (let i = 0; i < data.meta.pagination.pages; i++) {
    pages.push(i+1)
  }

  createNavLinks()
}

responseObj()

// ответ с сервера на переход для конкретной ссылки

async function responseLink (link) {
  const responseLink = await fetch(link)
  const dataLink = await responseLink.json()

  return dataLink
} 

// создаие навигационой панели

function createPageList (list, parentElem) {
  const ul = document.createElement('ul')
  let array = []

  const btnPrev = document.createElement('button')
  const btnNext = document.createElement('button')
  const btnFirst = document.createElement('button')
  const btnOver = document.createElement('button')

  ul.classList.add('nav-list')
  btnNext.classList.add('btn', 'btn-next')
  btnPrev.classList.add('btn', 'btn-prev')
  btnFirst.classList.add('btn', 'btn-first')
  btnOver.classList.add('btn', 'btn-over')

  btnNext.textContent = '>'
  btnPrev.textContent = '<'
  btnFirst.textContent = '<<'
  btnOver.textContent = '>>'

  for (let i = 0; i < list.length; i++) {
  
    const li = document.createElement('li')
    const link = document.createElement('a')
  
    array.push(i)    
    
    link.innerHTML = array[i] + 1

    li.style.display = 'none'
    li.setAttribute('id', `${array[i]}`)

    li.classList.add('nav-link')

    searchString.search = `/pages=${list[i]}`
    link.setAttribute('href', searchString)
    link.textContent = list[i]

    li.append(link)
    ul.append(li)

    link.addEventListener('click', (e) => {
      e.preventDefault()
      
      searchString.search = `page=${list[i]}`
      searchString.pathname = searchString.pathname.replace(searchString.pathname.split('/')[1], 'index.html')

      let numberTarget = Number(e.target.textContent)
      
      if (numberTarget == 1 || numberTarget == 2) {
        isActiveElem (0, 5, ul)
      } else if (numberTarget == ul.children.length - 1 || numberTarget == ul.children.length) {
        isActiveElem (ul.children.length - 5, ul.children.length, ul)
      } else {    
        isActiveElem (numberTarget - 3, numberTarget + 2, ul)
      } 

      li.classList.add('link-active')

      let post = createPostList().postsList  
      addPosts(post, list[i])
      parentElem.append(ul)
      containerPage.innerHTML = ''
      containerPage.append(parentElem)
      containerPage.append(post)
      document.body.append(containerPage)

      if (Number(searchString.search.split('=')[1]) === 1) {
        searchString.search = '/'
      }

      window.history.pushState({}, null, searchString)
    })
  }

  btnPrev.addEventListener('click', (e) => {
    
    e.preventDefault()

    let link = document.querySelectorAll('.nav-link')
    let arrLink = []
    
    link.forEach((el, i) => {

      if (el.getAttribute('style') == 'display: block') {
        arrLink.push(el)
      }
    })

    arrLink.forEach((elem, i) => {

        if(i - 1 != -1) {

          let numberId = Number(elem.getAttribute('id'))
      
          if (Number(arrLink[0].getAttribute('id')) <= 2) {
            isActiveElem (0, 5, ul)
          } else if (numberId == ul.children.length - 1 || numberId == ul.children.length) {
            isActiveElem (ul.children.length - 7, ul.children.length - 2, ul)
          } else {    
            isActiveElem (Number(arrLink[0].getAttribute('id')) - 2, Number(arrLink[0].getAttribute('id')) + 3, ul)
          } 

          parentElem.innerHTML = ''
          parentElem.append(btnFirst)
          parentElem.append(btnPrev)
          parentElem.append(ul)
          parentElem.append(btnNext)
          parentElem.append(btnOver)
        }
    })
    
  })

  btnNext.addEventListener('click', (e) => {
    e.preventDefault()
    let link = document.querySelectorAll('.nav-link')
    let arrLink = []

    link.forEach((el, i) => {

      if (el.getAttribute('style') == 'display: block') {
        arrLink.push(el)
      }
    })

    arrLink.forEach((elem, i) => {

      if(i + 1 < arrLink.length) {
        
        let numberId = Number(elem.getAttribute('id'))
    
        if (Number(arrLink[0].getAttribute('id')) < 2) {
          isActiveElem (2, 7, ul)
        } else if (ul.children.length - numberId <= 2) {
          
          isActiveElem (ul.children.length - 5, ul.children.length, ul)
        } else {    
          isActiveElem (Number(arrLink[0].getAttribute('id')) + 2, Number(arrLink[0].getAttribute('id')) + 7, ul)
        } 

        parentElem.innerHTML = ''
        parentElem.append(btnFirst)
        parentElem.append(btnPrev)
        parentElem.append(ul)
        parentElem.append(btnNext)
        parentElem.append(btnOver) 
      }
    })
  })

  btnOver.addEventListener('click', (e) => {
    e.preventDefault()

    isActiveElem (ul.children.length - 5, ul.children.length, ul)

    parentElem.innerHTML = ''
    parentElem.append(btnFirst)
    parentElem.append(btnPrev)
    parentElem.append(ul)
    parentElem.append(btnNext)
    parentElem.append(btnOver)

  })

  btnFirst.addEventListener('click', (e) => {
    e.preventDefault()

    isActiveElem (0, 5, ul)

    parentElem.innerHTML = ''
    parentElem.append(btnFirst)
    parentElem.append(btnPrev)
    parentElem.append(ul)
    parentElem.append(btnNext)
    parentElem.append(btnOver)

  })

  let arrayPage = []

  arrayPage.push(ul.children)
  if (ul.children.length > 5) {

    let count = 0
    
    while (count < 5) {
      ul.children[count].setAttribute('style', 'display: block')
      ul.children[0].classList.add('link-active')
      count++
    }
  }

  function isActiveElem (first, next, list) {
    let arrayTarget = []
    let arrayPage = []
  
    for (let i = 0; i < list.children.length; i++) {
      list.children[i].setAttribute('style', 'display: none')
      arrayTarget.push(list.children[i])
      list.children[i].classList.remove('link-active')
      arrayPage = arrayTarget.slice(first, next)
    }
  
    arrayPage.forEach(el => {
      el.setAttribute('style', 'display: block')
    })
  }

  return {
    ul,
    btnNext,
    btnPrev,
    btnFirst,
    btnOver
  }
}

function createNavLinks () {

  const nav = document.createElement('nav')
  const btnPrev = createPageList(pages, nav).btnPrev
  const btnNext = createPageList(pages, nav).btnNext
  const btnFirst = createPageList(pages, nav).btnFirst
  const btnOver = createPageList(pages, nav).btnOver
  
  
  nav.classList.add('nav-page')
  
  let ulLinks = createPageList(pages, nav).ul

  nav.prepend(btnFirst)
  nav.prepend(btnPrev)
  nav.append(ulLinks)
  nav.append(btnNext)
  nav.append(btnOver)
  containerPage.append(nav)
  document.body.append(containerPage)
}

// отрисовка постов

function addPosts (el, index) {
  
  document.body.innerHTML = ''
  let response = responseLink (`https://gorest.co.in/public/v2/posts?page=${index}&per_page=20`)

  response.then((value ) => {
    value.forEach(element => {
      
      el.append(createElementList(element.title, element.body, element.id)) 
    });
  })
}

// загрузка первой страницы

function createFirtstPage () {
  let post = createPostList().postsList        
    
  addPosts(post, pages[0])

  containerPage.append(post)
  document.body.append(containerPage)
}

// создание списка статей

function createElementList (title, body, id) {
  let postLi = document.createElement('li')
  let postLink = document.createElement('a')
  let postTitle = document.createElement('h2')
  let postBody = document.createElement('p')

  postLi.classList.add('post-item')

  postLink.setAttribute('href', `./post.html/${id}`)

  postTitle.textContent = title
  postBody.textContent = body

  postLink.append(postTitle)
  postLi.append(postLink)
  postLi.append(postBody)
  

  postLink.addEventListener('click', (e) => {
    e.preventDefault()

    const postList = document.querySelector('.post-list')
    postList.style.display = 'none'

    let containerPost = document.createElement('div')
    containerPost.classList.add('post')

    let id = e.target.parentNode.getAttribute('href').split('/')[2]
    
    searchString.pathname = searchString.pathname.replace(searchString.pathname.split('/')[1], 'post.html')
    searchString.search = `id=${id}`


    let responseNewComments = dataComments(id)
    let commentsList = createCommentsList()
    
    commentsList.classList.add('comments-list')
    
    let responseNewPost = dataNewPost(id)
    responseNewPost.then(value => {
      containerPost.append(createNewPost(value.data.title, value.data.body).post)
      containerPage.append(containerPost)
    })

    responseNewComments.then(value => {

      value.data.forEach(array => {
        commentsList.append(createComments(array.name, array.body))
      })
      containerPost.append(commentsList)
      containerPage.append(containerPost)
    })

    window.history.pushState({}, null, searchString)

  })

  return postLi
}

// функция создания списка для постов на странице

function createPostList () {
  const postsList = document.createElement('ul') 
  const containerPost = createContainer()

  postsList.classList.add('post-list')

  containerPost.append(postsList)

  return {
    containerPost,
    postsList
  }
}


// загрузка страницы подробной информации о посте 

async function dataNewPost (id) {
  const responsePost = await fetch(`https://gorest.co.in/public-api/posts/${id}`)
  const dataPost = await responsePost.json()

  return dataPost
}

// создание страницы поста

function createNewPost (title, body) {
  const post = document.createElement('div')
  const titlePost = document.createElement('h1')
  const bodyPost = document.createElement('p')

  titlePost.innerHTML = title
  bodyPost.innerHTML = body 

  post.classList.add('post-content')

  post.append(titlePost)
  post.append(bodyPost)
  containerPage.append(post)

  return {
    containerPage,
    post
  }
}

// функция загрузки комментариев

async function dataComments (id) {
  const responseComments = await fetch (`https://gorest.co.in/public-api/comments?post_id=${id}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer 74f1620b0a6b241b7f23137926ebd6293447ffa8c3140c2c1a845efac1be8b50',
      'Content-type': 'application/json'
    }
  })
  const dataComments = await responseComments.json()

  return dataComments
}

// отображение комментариев

function createComments (name, body) {
  
  let commentsItem = document.createElement('li')
  let commentsName = document.createElement('h2')
  let commentsBody = document.createElement('p')

  commentsName.innerHTML = name
  commentsBody.innerHTML = body

  commentsItem.classList.add('comment-item')
  
  commentsItem.append(commentsName)
  commentsItem.append(commentsBody)

  return commentsItem
}

// список комментариев 

function createCommentsList () {
  let commentsList = document.createElement('ul') 

  return commentsList
}

// контейнер

function createContainer () {
  const container = document.createElement('div')
  container.classList.add('container')

  return container
}

document.addEventListener('DOMContentLoaded', () => {
  
  createFirtstPage()

  window.addEventListener('popstate', () => {
  
    let linkHistory = window.location

    if (linkHistory.pathname === '/index.html') {
      let postPage = document.querySelectorAll('.post')

      if (postPage) {
        for (let i = 0; i < postPage.length; i++) {
          postPage[i].style.display = 'none'
          postPage[i].remove()
        }
      }
      
      let post = createPostList().postsList
      post.classList.add('post-list')

      addPosts(post, linkHistory.search.split('=')[1])

      containerPage.append(post)
      createNavLinks()

      const postList = document.querySelector('.post-list')
      
      const deleteNavPage = document.querySelectorAll('.nav-page')[1]

      postList.remove()
      
      deleteNavPage.remove()

    }  else if (linkHistory.pathname === '/post.html') {

      const postList = document.querySelector('.post-list')
      postList.style.display = 'none'

      let containerPost = document.createElement('div')
      containerPost.classList.add('post')
      
      let id = linkHistory.search.split('?')[1].split('=')[1]
      let responseNewPost = dataNewPost(id)
      let responseNewComments = dataComments(id)

      let commentsList = createCommentsList()
      commentsList.classList.add('comments-list')

      responseNewComments.then(value => {
        
        value.data.forEach(array => {
          let contentComments = createComments(array.name, array.body)
          commentsList.append(contentComments)
          
        })
        containerPost.append(commentsList)
        containerPage.append(containerPost)
      })

      responseNewPost.then(value => {
        
        containerPost.append(createNewPost(value.data.title, value.data.body).post)
        containerPage.append(containerPost)
      })
    }
  })
})