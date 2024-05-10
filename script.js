//select items from dom

const alert = document.querySelector(".alert")
const form = document.querySelector(".grocery-form")
const grocery = document.getElementById("grocery")
const submitBtn = document.querySelector(".submit-btn")
const contaoner = document.querySelector(".grocery-container")
const list = document.querySelector(".grocery-list")
const clearBtn = document.querySelector(".clear-btn")


//edit options
let editElement;
let editFlag = false;
let editID = "";



//FUNCTIONS
let addItem =(e) =>{
    e.preventDefault();
    
    const value = grocery.value;
    const id = new Date().getTime().toString();




    if(value && !editFlag){
        createListItems(id, value)
        //display alert
        displayAlert("item added to the list", "success")
        //show container
        contaoner.classList.add("show-container")
        //add to local storage
        addToLocalStorage(id,value);

        //set back to default
        setBackToDefault();

        // console.log("add");
    } else if(value && editFlag){
        editElement.innerHTML = value;
        displayAlert("value changed", "succes")

        editLocalStorage(editID,value);
        setBackToDefault()
    } else{
        displayAlert("please enter a value", "danger")
        
    }

    // console.log(id)
    // console.log(value)
}

//display alert

let displayAlert = (text,action) =>{
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    //remove alert
    setTimeout(function(){
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 1000);
}

// clear items

let clearItems = () =>{
    const items = document.querySelectorAll(".grocery-item");

    if(items.length > 0){
        items.forEach((item)=>{
            list.removeChild(item);
        })
    }
    contaoner.classList.remove("show-container");
    displayAlert("empty-list", "danger")

    localStorage.removeItem("list")
}

//edit function
let editItem = (e) =>{
    const element = e.currentTarget.parentElement.parentElement
    // const id = element.dataset.id;

    //set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling;
    //set form value
    grocery.value = editElement.innerHTML;

    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = "edit";
}
//delete function
let deleteItem = (e) =>{
    const element = e.currentTarget.parentElement.parentElement
    const id = element.dataset.id;
    list.removeChild(element);
    if(list.children.length === 0){
        contaoner.classList.remove("show-container");
    }
    displayAlert("item removed", "danger");
    setBackToDefault();
    //remove from local storage
    removeFromLocalStorage(id)

}

//set back to default
let setBackToDefault = () => {
    grocery.value = "";
    editFlag = false;
    editId = "";
    submitBtn.textContent = "submit";
}
//LOCAL STORAGE

let addToLocalStorage = (id,value) =>{
    // console.log("added to storage");
    const grocery = {id,value}


    let items = getLocalStorage()
    

    
    items.push(grocery);
    localStorage.setItem("list",JSON.stringify(items));
}

let removeFromLocalStorage = (id) =>{
    let items = getLocalStorage();

    items = items.filter((item) =>{
        if(item.id !== id){
            return item;

        }

    })
    localStorage.setItem("list",JSON.stringify(items))
}

let editLocalStorage = (id, value) =>{
    let items = getLocalStorage(); 
    items = items.map((item)=>{
        if(item.id === id){
            item.value = value
        }
        return item
    })
    localStorage.setItem("list",JSON.stringify(items))
}

let getLocalStorage=()=>{
    return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

//creating list items
let createListItems = (id, value) =>{
    const element = document.createElement("article");
    //add class
    element.classList.add("grocery-item");
    //add id
    const attr = document.createAttribute("data-id");
    attr.value= id;
    element.setAttributeNode(attr);
    element.innerHTML= `<p class="title">${value}</p>
    <div class="btn-container">
        <button type="button" class="edit-btn">
            <i class="fas fa-edit"></i>
        </button>
        <button type="button" class="delete-btn">
            <i class="fas fa-trash"></i>
        </button>
    </div>`;
    

    const deleteBtn = element.querySelector(".delete-btn")
    const editBtn = element.querySelector(".edit-btn")


    deleteBtn.addEventListener("click", deleteItem);
    editBtn.addEventListener("click", editItem);
    //append child
    list.appendChild(element);

    
}


//SETUP ITEMS

let setupItems = () =>{
    let items = getLocalStorage();
    if(items.length > 0){
        items.forEach((item)=>{
            createListItems(item.id,item.value)
        })
        contaoner.classList.add('show-container')
    }
}


//EVENT LISTENERS
//submiting form

form.addEventListener("submit", addItem)

//clear items
clearBtn.addEventListener("click", clearItems )


//load items

window.addEventListener('DOMContentLoaded', setupItems)



