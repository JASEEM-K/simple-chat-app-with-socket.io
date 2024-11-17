var socket = io('http://localhost:3000');

var form = document.getElementById('form');
var input = document.getElementById('input');
var ul = document.getElementById('messages');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value){
        socket.emit('chat message', input.value);
        input.value = '';
    }
})

// need more optimization
let timeout
let isTyping = false 
input.addEventListener('input', (e) => {
    if(!isTyping){
        socket.emit('whos-typing')
        isTyping = true
    }
    clearTimeout(timeout)
    timeout = setTimeout(() => {
        socket.emit('stop-typing')
        isTyping = false
    },1000)
})

socket.on('whos-typing', (data) => {
    if(data.typing){
        document.getElementById('online-typing-status').style.display = 'block'
        document.getElementById('online-typing').textContent = data.name
        console.log(data)
    }else{
        document.getElementById('online-typing-status').style.display = 'none'
    }
})

socket.on('whos-online', (names) => {
    const count = names.length  
    document.getElementById('online-count').textContent = count
})

socket.on('private-message', (data) => {
    displayMessage(data.user,data.msg,data.type)
})

socket.on('chat message', (user, msg) => {
    socket.emit('whos-online')
    displayMessage(user, msg)
})

const displayMessage = (user,msg,type='') => {
    var item = document.createElement('li')
    const namespan = document.createElement('span')
    const textspan = document.createElement('span')
    namespan.textContent = user
    textspan.textContent = msg
    namespan.id = 'username-style'
    if(type === 'private'){
        namespan.style.backgroundColor = '#efefef'
        textspan.style.backgroundColor = '#efefef'
    }
    item.appendChild(namespan)
    item.appendChild(textspan)
    ul.appendChild(item)
    window.scrollTo(0, document.body.scrollHeight)
}

const authCkeck = () => {
    const name = document.getElementById('name_input').value
    const room = document.getElementById('room_input').value
    if (!name) {
        alert('Please enter room name and username')
        return false
    }else{
        socket.emit('name-auth', name,room);
        return true
    }
}

const init = () => {
    const navbar = document.getElementById('navbar')
    navbar.style.display = 'none'
    form.style.display = 'none'
    ul.style.display = 'none'
    window.scrollTo(1, document.body.scrollHeight)
    const login = document.getElementById('login-form')
    loginform = document.getElementById('login')
    loginform.addEventListener('submit', (e) => {
        e.preventDefault()
        const foo = authCkeck()
        if (foo) {
            navbar.style.display = 'block'
            form.style.display = 'block'
            ul.style.display = 'block'
            login.style.display = 'none'
        }
    })
}