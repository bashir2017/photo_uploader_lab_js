const addPicButton = document.querySelector('#addPicButton')
addPicButton.addEventListener('click', () => {openPicForm('new')})
let formOpen = false
let editFormOpen = false

function openPicForm(action){
    const newPicFormContainer = document.querySelector(`#${action}PicFormContainer`)
    if(formOpen){
        newPicFormContainer.style.height = '0px'
        newPicFormContainer.style.padding = '0px'
    }
    else{
        newPicFormContainer.style.height = '280px'
        newPicFormContainer.style.padding = '20px'
    }
    formOpen = !formOpen
}



//****Start coding below****//

const photoContainer = document.querySelector('#photoContainer')


//initial fetch 
fetch('http://localhost:3000/photos')
.then(resp => resp.json())
.then(photos => {
    photos.forEach(photo => {
        displayPhoto(photo)
    })
})



const newPhotoForm = document.querySelector("#newPicForm")
newPhotoForm.addEventListener('submit', e => {
    e.preventDefault()
    const photoInfo = {
        name: e.target.name.value,
        photo_image_url: e.target.photo_image_url.value,
        owner: e.target.owner.value 
    }

    const config = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(photoInfo)
    }

    fetch('http://localhost:3000/photos', config)
    .then(resp => resp.json())
    .then(photo => {
        displayPhoto(photo)
    })
        
})



function displayPhoto(photo){
    const divTag = document.createElement('div')
    divTag.className = "photo"
    divTag.innerHTML = `
        <div className="photo">
        <h3>${photo.name}</h3>
        <p>By ${photo.owner}</p>
        <img src="${photo.photo_image_url}">
        <button class="removeButton">Remove</button>
        <button class="editPicButton">Edit New Photo</button>
        </div>
    `
    photoContainer.append(divTag)

    const removeBtn = divTag.querySelector('.removeButton')
    removeBtn.addEventListener('click', e => {
        removeImage(photo.id, divTag)
    })

    const editPicButton = divTag.querySelector('.editPicButton')
    // editPicButton.addEventListener('click', openEditPicForm)
    editPicButton.addEventListener('click', e => {editFormHandler(photo, divTag)})
}


function editFormHandler(photo, divTag){
    const editPhotoForm = document.querySelector("#editPicForm")
    openPicForm("edit")
    editPhotoForm.name.value = photo.name 
    editPhotoForm.photo_image_url.value = photo.photo_image_url
    editPhotoForm.addEventListener('submit', e => {
        e.preventDefault()
        const content = {
            name: editPhotoForm.name.value,
            photo_image_url: editPhotoForm.photo_image_url.value
        }
        updateImage(content, photo.id)

        divTag.querySelector('h3').innerText = content.name 
     
        divTag.querySelector('img').src = content.photo_image_url 
        // console.log(divTag.querySelector('img').src)
    })
}


//remove image 
function removeImage(id, uiContainer){
    const config = {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    }

    fetch(`http://localhost:3000/photos/${id}`, config)
    .then(resp => resp.json())
    .then(photo => {
        uiContainer.remove()
    })

}


function updateImage(content, id){
    console.log(content)
    const config = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(content)
    }
    fetch(`http://localhost:3000/photos/${id}`, config)
    .then(resp => resp.json())
    .then(photo => {

    })
}