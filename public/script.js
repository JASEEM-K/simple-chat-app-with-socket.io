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
/*
let timeout
input.addEventListener('input', (e) => {
    socket.emit('whos-typing')
    clearTimeout(timeout)

    timeout = setTimeout(() => {
        socket.emit('whos-typing','lksjdfl')
    },1000)
})

socket.on('whos-typing', (data) => {
    if(data.typing){
        document.getElementById('online-typing').style.display = 'block'
        document.getElementById('online-typing').textContent = user
    }else{
        document.getElementById('online-typing').style.display = 'none'
    }
})
*/

socket.on('whos-online', (names) => {
    const count = names.length  
    document.getElementById('online-count').textContent = count
})

socket.on('chat message', (user, msg) => {
    socket.emit('whos-online')
    displayMessage(user, msg)
})

const displayMessage = (user,msg) => {
    var item = document.createElement('li')
    const namespan = document.createElement('span')
    const textspan = document.createElement('span')
    namespan.textContent = user
    textspan.textContent = msg
    namespan.id = 'username-style'
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