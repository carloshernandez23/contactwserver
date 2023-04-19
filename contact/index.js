const nameInput = document.querySelector('#name-input');
const tlfInput = document.querySelector('#tlf-input');
const form = document.querySelector('#form');
const list = document.querySelector('#list');
const btn = document.querySelector('#boton-registrar')
const closeBtn = document.querySelector('#cerrar-btn');
const user = JSON.parse(localStorage.getItem('user'));

// const getPersonas = () => {
//     list.innerHTML = localStorage.getItem('guardado');
// }

// getPersonas();

if (!user) {
    window.location.href = '../home/index.html';
   } 


// Regex
const NAME_REGEX = /^[A-Za-z ]*$/;
const TLF_REGEX = /^([0]{1})([2,4]{1})([1,2]{1})([2,4,6]{1})([0-9]{7})$/;



const validation = (validation, input) => {
    if (validation) {
        input.classList.remove('wrong');
        input.classList.add('correct');
        input.parentElement.children[2].classList.remove('display-text');
    } else {
        input.classList.add('wrong');
        input.classList.remove('correct');
        input.parentElement.children[2].classList.add('display-text');
    }
}


nameInput.addEventListener('input', e =>{
    const nameValidation = NAME_REGEX.test (e.target.value);
    validation(nameValidation, nameInput);
});

tlfInput.addEventListener('input', e =>{
    const tlfValidation = TLF_REGEX.test (e.target.value);
    validation(tlfValidation, tlfInput);
});



btn.addEventListener('click', async e => {
e.preventDefault();
    
const responseJSON = await fetch('http://localhost:3000/contact', {
method: 'POST', 
headers: {
    'Content-Type': 'application/json'},body: JSON.stringify({name: nameInput.value, tlf: tlfInput.value, user: user.username}),
});

const response = await responseJSON.json();


const listItem = document.createElement('li');
listItem.innerHTML= `
<li class="li1" id="${response.id}">
<span>${response.name}</span>
<input class="li-input" type="text" value="${response.tlf}"readonly>
<button class="delete-btn">
<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash" width="28" height="32" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ff2825" fill="none" stroke-linecap="round" stroke-linejoin="round">
<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
<line x1="4" y1="7" x2="20" y2="7" />
<line x1="10" y1="11" x2="10" y2="17" />
<line x1="14" y1="11" x2="14" y2="17" />
<path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
<path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
</svg>
</button>
<button class="check-btn">
<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-pencil" width="28" height="32" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
<path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"></path>
<path d="M13.5 6.5l4 4"></path>
</svg>
</button>
</li>
`;

listItem.classList.add('li');
list.append(listItem);

tlfInput.value='';
nameInput.value='';
if (nameInput.classList.contains('correct') && tlfInput.classList.contains('correct')) {
    nameInput.classList.remove('correct')
    tlfInput.classList.remove('correct')
} 
});        


  
list.addEventListener('click', async e => {
    if(e.target.classList.contains('delete-btn')){
    const id = e.target.parentElement.id;
    await fetch(`http://localhost:3000/contact/${id}`, {method: 'DELETE', });    
    e.target.parentElement.remove();
   
    }

    if(e.target.classList.contains('check-btn')){
        const input = e.target.parentElement.children[1];
        if(input.hasAttribute('readonly')) {
            input.removeAttribute('readonly');
        } else {
            input.setAttribute('value',input.value);
            input.setAttribute('readonly',true);
            const id = e.target.parentElement.id
            await fetch(`http://localhost:3000/contact/${id}`, {
                method: 'PATCH', 
                headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({tlf: e.target.parentElement.children[1].hasAttribute('readonly') ? input.value : input.value }),
            });
           
        }
    }
    });

    function validar(){
       let deshabilitar = false;

        if(nameInput.classList.contains('correct') && tlfInput.classList.contains('correct'))
        {
        deshabilitar = true; 
        } if(nameInput.classList.contains('correct') && tlfInput.value===''){
            deshabilitar = true; 
        
        } if(tlfInput.classList.contains('correct') && nameInput.value===''){
            deshabilitar = true; 
        
        }
         if (deshabilitar == true && btn.hasAttribute('disabled'))
           {
            btn.removeAttribute('disabled');
           } else {
            btn.setAttribute('disabled', true);
           }

    }

    form.addEventListener("keyup", validar);

    closeBtn.addEventListener('click', async e => {
        localStorage.removeItem('user');
        window.location.href= '../home/index.html'
        })

        const getContact = async () => {
            const response = await fetch('http://localhost:3000/contact', {method: 'GET'});
            const contact = await response.json();
            const userContacts = contact.filter(contact => contact.user === user.username);
            userContacts.forEach(contact => {
                const listItem = document.createElement('li');
                listItem.innerHTML= `
                <li class="li1" id="${contact.id}">
                <span>${contact.name}</span>
                <input class="li-input" type="text" value="${contact.tlf}"readonly>
                <button class="delete-btn">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash" width="28" height="32" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ff2825" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                </svg>
                </button>
                <button class="check-btn">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-pencil" width="28" height="32" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"></path>
                <path d="M13.5 6.5l4 4"></path>
                </svg>
                </button>
                </li>
                `;
                
                listItem.classList.add('li');
                list.append(listItem);
            });
        }
        getContact();


