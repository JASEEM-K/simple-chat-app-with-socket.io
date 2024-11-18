var socket = io('http://localhost:3000');

var form = document.getElementById('form');
var input = document.getElementById('input');
var ul = document.getElementById('messages');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const toUser = document.getElementById('user-id-private').textContent
    if(toUser){
        socket.emit('private-message', toUser, input.value)
        displayMessage({user:'You',id:'',msg:input.value,type:'private'})
    }
    if (!toUser && input.value){
        socket.emit('chat message', input.value);
        displayMessage({user:'You',id:'',msg:input.value})
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
        const name =  data.name
        document.getElementById('online-typing').textContent = name
    }else{
        document.getElementById('online-typing-status').style.display = 'none'
    }
})

socket.on('whos-online', (names) => {
    const count = names.length  
    document.getElementById('online-count').textContent = count
})

socket.on('private-message', (data) => {
    data.id !== socket.id && displayMessage({user:data.user,id:data.id,msg:data.msg,type:'private'})
})

socket.on('chat message', (user,id, msg) => {
    socket.emit('whos-online')
    id !== socket.id && displayMessage({user , id ,msg})
})

const displayMessage = ({user,id,msg,type}) => {
    const item = document.createElement('li')
    const namespan = document.createElement('span')
    const textspan = document.createElement('span')
    namespan.textContent = user + " : "
    textspan.textContent = msg
    namespan.id = 'username-style'
    if(type === 'private'){
        textspan.style.color = 'red'
        namespan.style.color = '#d500a3fb'
        namespan.textContent = '(Private) ' + namespan.textContent
    }
    item.addEventListener('dblclick', (e) => {
        e.preventDefault()
        document.getElementById('private-input').value = namespan.textContent
        document.getElementById('user-id-private').textContent = id 
    })
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
        displayMessage({user:'You',id:'',msg:' connected'})
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
function clearPrivate() {
    document.getElementById('private-input').value = ''
    document.getElementById('user-id-private').textContent = ''
}