// const shortId = require('shortid');
let add = document.querySelector('.add-btn');
let remove = document.querySelector('.remove-btn');
let modal = document.querySelector('.modal');
let addFlag = false;
let removeFlag = false;
let textArea = document.querySelector('textarea');
let mainContainer = document.querySelector('.main-cont');
let priorityColor = document.querySelectorAll('.priority-color');
let ticketColor = "black"; // by default it is black 
let ticketLock = document.querySelector('.ticket-lock');
let ticketLockFlag = true; // true -> lock 
let colors = ["lightpink", "lightblue", "lightgreen", "black"];
let toolBoxColors = document.querySelectorAll('.color');

let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";

let ticketsArr = [];

if(localStorage.getItem("jira_tickets")){
    ticketsArr = JSON.parse(localStorage.getItem("jira_tickets"));
    ticketsArr.forEach((ticketObj) =>{
        createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketID);
    })
}
for(let i =0;i<toolBoxColors.length;i++){
    toolBoxColors[i].addEventListener('click',(e) =>{
        let currentToolBoxColor = toolBoxColors[i].classList[0];

        let filteredTickets = ticketsArr.filter((ticketObj) =>{
            return currentToolBoxColor == ticketObj.ticketColor;
        })

        // remvove previous ticket 
        let allTicketsCont = document.querySelectorAll('.ticket-cont');
        for(let i =0;i<allTicketsCont.length;i++){
            allTicketsCont[i].remove();
        }

        filteredTickets.forEach((ticketObj) =>{
            createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketID);

        })
    })

    toolBoxColors[i].addEventListener('dblclick',(e) =>{
        // remove previous ticket 
        let allTicketsCont = document.querySelectorAll('.ticket-cont');
        for(let i =0;i<allTicketsCont.length;i++){
            allTicketsCont[i].remove();
        }

        ticketsArr.forEach((ticketObj) =>{
            createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketID);

        })
    })
}
add.addEventListener('click',(e) =>{
    addFlag = !addFlag;

    // display modal    
    if(addFlag)
        modal.style.display = 'flex';
    else 
        modal.style.display = 'none';
    // click and then create new modal  
})



remove.addEventListener('click' , (e) =>{

    removeFlag = !removeFlag; //toggle button 

})

textArea.addEventListener('keydown',(e) =>{
    let key = e.key;
    if(key == 'Shift'){
        
        createTicket(ticketColor,textArea.value);
        setModalToDefault();
        addFlag = false;
    }
})

priorityColor.forEach((color) =>{
    color.addEventListener('click',(e)=>{
        priorityColor.forEach((priorityColorElem) =>{
        priorityColorElem.classList.remove('border');
        })
    color.classList.add('border');
    ticketColor = color.classList[0];
    })
})


function createTicket(ticketColor,ticketTask,ticketID){
    let id = ticketID || shortid();
let ticket = document.createElement('div');
        ticket.setAttribute('class','ticket-cont');
        ticket.innerHTML = `
        <div class= "ticket-color ${ticketColor}"></div>
            <div class="ticket-id">
                #${id}
            </div>
            <div class="task-area">${ticketTask}</div>
            <div class="ticket-lock">
            <i class="fa-solid fa-lock"><i>
            </div>`
        mainContainer.appendChild(ticket);
        if(!ticketID) {
            ticketsArr.push({ticketColor,ticketTask,ticketID : id});
            localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr));
        }
        console.log('id_create ',id);
        handleLock(ticket,id);
        handleColor(ticket,id);
        removeTicket(ticket,id);
}

function removeTicket(ticket,id){
    ticket.addEventListener('click', (e) =>{
        if(!removeFlag) return;

        let idx = getTicketIdx(id);
        console.log(idx);
        // DB REMOVAL
        ticketsArr.splice(idx,1);
        let strTicketsArr = JSON.stringify(ticketsArr);
        localStorage.setItem("jira_tickets",strTicketsArr);

        ticket.remove(); // ui removal 
    })
}


function handleLock(ticket,id){

    let ticketLockElem = ticket.querySelector('.ticket-lock');
    let ticketLock = ticketLockElem.children[0];
    let ticketTaskArea = ticket.querySelector('.task-area');
    ticketLock.addEventListener('click',(e) =>{
        let ticketIdx = getTicketIdx(id);
        console.log("idx" ,ticketIdx);
        
        if(ticketLock.classList.contains(lockClass)) {
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            ticketTaskArea.setAttribute('contenteditable','true');
        }
        else {
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            ticketTaskArea.setAttribute('contenteditable','false');

        }   
        ticketsArr[ticketIdx].ticketTask = ticketTaskArea.innerHTML;
        localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr));
    })
}

function handleColor(ticket,id){
    let ticket_color = ticket.querySelector('.ticket-color');
    ticket_color.addEventListener('click',(e) =>{
        let currentTicketColor = ticket_color.classList[1];
        let ticketIdx = getTicketIdx(id);
        console.log(ticketIdx);
        let currentTicketColorIdx = colors.findIndex((color) =>{
            return currentTicketColor == color;
        })

        // currentTicketColorIdx++;
        let newTicketColorIdx = (currentTicketColorIdx+1) % colors.length;
        let newticketColor = colors[newTicketColorIdx];
        ticket_color.classList.remove(currentTicketColor);
        ticket_color.classList.add(newticketColor);
        
        ticketsArr[ticketIdx].ticketColor = newticketColor;
        localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr));
    })
}

function setModalToDefault(){
    modal.style.display = 'none';
    textArea.value = "";
    priorityColor.forEach((priorityColorElem) =>{
        priorityColorElem.classList.remove('border');
    })

    priorityColor[priorityColor.length -1].classList.add('border');
}

function getTicketIdx(id){
    let ticketIdx = ticketsArr.findIndex((ticket) =>{
        return ticket.ticketID == id;
    })

    return ticketIdx;
}