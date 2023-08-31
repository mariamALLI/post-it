import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, onChildAdded, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const textArea = document.getElementById('post-it')
const inputFrom = document.getElementById('post-it-from')
const inputTo = document.getElementById('post-it-to')
const postBtn = document.getElementById('post-it-btn')
const postPage = document.getElementById('post-page')
let likes = 5;
let isLiked = false

const appSetting = {
    databaseURL: "https://endorsement-post-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSetting)
const dataBase = getDatabase(app)
const endorsementDb = ref(dataBase, "endorsement-post")

postBtn.addEventListener('click', ()=>{
   if(!isInputValid()){
    return;
   }else{
    let textAreaValue = textArea.value 
    let inputFromValue = inputFrom.value
    let inputToValue = inputTo.value
    let endorsementPost = {
        'text': textAreaValue,
        'from': inputFromValue,
        'to': inputToValue,
        'isLiked': isLiked,
        'likes': likes
    }
     push(endorsementDb, endorsementPost)
   }
    clearTextField()
})


onValue(endorsementDb, (snapshot)=>{
    if(snapshot.exists()){
        let  postsArray = Object.entries(snapshot.val()).reverse()
        clearPostPage()

        for(let i=0; i < postsArray.length; i++){
                     let currentPost = postsArray[i]
                     let currentPostId = currentPost[0]
                     let currentPostTxt = currentPost[1].text
                     let currentPostFrm = currentPost[1].from
                     let currentPostTo = currentPost[1].to
                     let currentPostIsliked = currentPost[1].isLiked
                     let currentPostlikes = currentPost[1].likes

                     displayEndorsmentPost(currentPost)
                    
      }
    }else{
        postPage.innerHTML = "Be the first to add an endorsement post!"
    }
 
})
  

function clearTextField() {
    textArea.value = ''
    inputTo.value = ''
    inputFrom.value = ''
}

function isInputValid(){
    if(!textArea.value){
        textArea.focus()
        return;
    }
    if(!inputFrom.value){
        inputFrom.focus()
        return false;
    }
    if(!inputTo.value){
        inputTo.focus()
        return false;
    }
    return true;
}

function clearPostPage(){
    postPage.innerHTML = ""
}

function displayEndorsmentPost(post){
    let postId = post[0]
    let postTxt = post[1].text
    let postFrom = post[1].from
    let postTo = post[1].to
    let postIsLiked = post[1].isLiked
    let postLikes = post[1].likes
    // likes++

    let newDiv = document.createElement('div')
    newDiv.classList.add('post-box')

    newDiv.addEventListener('click', (e)=>{
        if(e.target.dataset.likes){
            console.log('clicked')
             console.log(postLikes++) 
            }else{
                console.log(postLikes--)
            }
    })

    newDiv.innerHTML = `
        <div class="post-msg">
            <h5>To ${postTo}</h5>
            <p>${postTxt}</p>

            <div class="flex">
                <h5>From ${postFrom}</h5>
                 <p class="likes" data-likes=${postId}>🖤${postLikes}</p>   
            </div>          
        </div>
    `
     
  


    newDiv.addEventListener('dblclick', ()=>{
        let deleteClickedPost = ref(dataBase, `endorsement-post/${postId}`)
        remove(deleteClickedPost)
    })

   

    postPage.append(newDiv)
}


