let addbtn=document.querySelector(".add");
let body=document.querySelector("body");
let grid=document.querySelector(".grid");
let deleteBtn=document.querySelector(".delete");
let colors=["pink","blue","green","black"];
let deleteMode=false;

let filterChildren=document.querySelectorAll(".filter");
for(let i=0;i<filterChildren.length;i++){
    filterChildren[i].addEventListener("click",function(e){
        console.log(filterChildren[i]);
        let divInFilter=filterChildren[i].querySelector("div");
        if(!filterChildren[i].classList.contains("filter-selected")){
            let filterColor=divInFilter.classList[0];
            console.log(filterColor);
            // let filterChildren=document.querySelectorAll(".filter");
            for(let j=0;j<filterChildren.length;j++){
                filterChildren[j].classList.remove("filter-selected");
            }
            filterChildren[i].classList.add("filter-selected");
            loadTask(filterColor);
        }else{
            filterChildren[i].classList.remove("filter-selected");
            console.log("no");
            loadTask();
        }
        
    })
}
    

if(!localStorage.getItem("AllTickets")){
    let allTickets={};
    allTickets=JSON.stringify(allTickets);
    localStorage.setItem("AllTickets",allTickets);
}

loadTask();




deleteBtn.addEventListener("click",function(e){
    // console.log(e.currentTarget);
    let filterChildren=document.querySelectorAll(".filter");
    for(let j=0;j<filterChildren.length;j++){
        filterChildren[j].classList.remove("filter-selected");
    }
    if(e.currentTarget.classList.contains("delete-selected")){
        e.currentTarget.classList.remove("delete-selected");
        deleteMode=false;
    }else{
        e.currentTarget.classList.add("delete-selected")
        deleteMode=true;
    }
})

addbtn.addEventListener("click",function(){
    let filterChildren=document.querySelectorAll(".filter");
    for(let j=0;j<filterChildren.length;j++){
        filterChildren[j].classList.remove("filter-selected");
    }
    let preModal=document.querySelector(".modal");
    if(preModal!=null)return;

    let div=document.createElement("div");
    div.classList.add("modal");
    div.innerHTML=`<div class="task-section">
    <div class="task-inner-container" contenteditable="true" data-placeholder="Press Enter to Save & Escape to exit"></div>
</div>
<div class="modal-priority-section">
    <div class="priority-inner-section">
        <div class="modal-priority pink"></div>
        <div class="modal-priority blue"></div>
        <div class="modal-priority green"></div>
        <div class="modal-priority black selected"></div>
    </div>
</div>`;
    let allModalPriority=div.querySelectorAll(".modal-priority");
    // console.log(allModalPriority)
    let ticketColor="black";
    for(let i=0;i<allModalPriority.length;i++){
        allModalPriority[i].addEventListener("click",function(e){

            for(let j=0;j<allModalPriority.length;j++){
                allModalPriority[j].classList.remove("selected");
            }
            allModalPriority[i].classList.add("selected");
            ticketColor=allModalPriority[i].classList[1];
        })
    }
    let taskInnerContainer=div.querySelector(".task-inner-container");
    taskInnerContainer.addEventListener("keydown",function(e){
        if(e.key== "Enter"){
            // console.log(e.currentTarget.innerText);
            // console.log(ticketColor);
            let id=Date.now();
            let task=e.currentTarget.innerText;
            let allTickets=JSON.parse(localStorage.getItem("AllTickets"));

            let ticketObj={
                color:ticketColor,
                taskValue:task,
            }

            allTickets[id]=ticketObj;

            localStorage.setItem("AllTickets",JSON.stringify(allTickets));

            div.remove();
            let ticketDiv=document.createElement("div");
            ticketDiv.classList.add("ticket");
            ticketDiv.setAttribute("data-id",id);
            ticketDiv.innerHTML=`<div data-id="${id}" class="ticket-color ${ticketColor}"></div>
            <div class="ticket-id">#${id}</div>
            <div data-id="${id}" class="actual-task" contentEditable="true">
                ${task}
            </div>`;

            let actualTaskDiv=ticketDiv.querySelector(".actual-task")
            actualTaskDiv.addEventListener("input",function(e){
                let updatedTask=e.currentTarget.innerText;
                // console.log(updatedTask);
                let currTicketId=e.currentTarget.getAttribute("data-id");
                let allTickets=JSON.parse(localStorage.getItem("AllTickets"));
                allTickets[currTicketId].taskValue=updatedTask;
                localStorage.setItem("AllTickets",JSON.stringify(allTickets));

            })

            let ticketColorDiv=ticketDiv.querySelector(".ticket-color");
            ticketColorDiv.addEventListener("click",function(e){
                let currTicketId=e.currentTarget.getAttribute("data-id");
                let currColor=ticketColorDiv.classList[1];
                let index=-1;
                for(let i=0;i<colors.length;i++){
                    if(currColor==colors[i])index=i;
                }
                index++;
                index=index%colors.length;
                let newColor=colors[index];
                let allTickets=JSON.parse(localStorage.getItem("AllTickets"));
                allTickets[currTicketId].color=newColor;
                localStorage.setItem("AllTickets",JSON.stringify(allTickets));
                ticketColorDiv.classList.remove(currColor);
                ticketColorDiv.classList.add(newColor);
            })
            ticketDiv.addEventListener("click",function(e){
                if(deleteMode){
                    let currTicketId=e.currentTarget.getAttribute("data-id");
                    // console.log(currTicketId);
                    let allTickets=JSON.parse(localStorage.getItem("AllTickets"));
                    delete allTickets[currTicketId];
                    localStorage.setItem("AllTickets",JSON.stringify(allTickets));
                    e.currentTarget.remove();
                }
            })
            grid.append(ticketDiv);
        }else if(e.key=="Escape"){
            div.remove();
        }
    })
    body.append(div);

})


function loadTask(color){

    let ticketOnUI=document.querySelectorAll(".ticket");
    for(let i=0;i<ticketOnUI.length;i++){
        ticketOnUI[i].remove();
    }
    // 1 fetch all allTickets Data
    // 2 create ticket UI for each ticket object 
    // 3 add required listener
    // 4 add tickets in grid section of UI
    let allTickets=localStorage.getItem("AllTickets");
    allTickets=JSON.parse(allTickets);
    for(let key in allTickets){


        let currTicketId=key;
        let currTicketObj=allTickets[key];

        if(color && color!=currTicketObj.color)continue;

        let ticketDiv=document.createElement("div");
        ticketDiv.classList.add("ticket");
        ticketDiv.setAttribute("data-id",currTicketId);
        ticketDiv.innerHTML=`<div data-id="${currTicketId}" class="ticket-color ${currTicketObj.color}"></div>
        <div class="ticket-id">#${currTicketId}</div>
        <div data-id="${currTicketId}" class="actual-task" contentEditable="true">
            ${currTicketObj.taskValue}
        </div>`;


        let actualTaskDiv=ticketDiv.querySelector(".actual-task")
            actualTaskDiv.addEventListener("input",function(e){
                let updatedTask=e.currentTarget.innerText;
                // console.log(updatedTask);
                let currTicketId=e.currentTarget.getAttribute("data-id");
                let allTickets=JSON.parse(localStorage.getItem("AllTickets"));
                allTickets[currTicketId].taskValue=updatedTask;
                localStorage.setItem("AllTickets",JSON.stringify(allTickets));

            })

        let ticketColorDiv=ticketDiv.querySelector(".ticket-color");
        ticketColorDiv.addEventListener("click",function(e){
            let currTicketId=e.currentTarget.getAttribute("data-id");
            let currColor=ticketColorDiv.classList[1];
            let index=-1;
            for(let i=0;i<colors.length;i++){
                if(currColor==colors[i])index=i;
            }
            index++;
            index=index%colors.length;
            let newColor=colors[index];
            let allTickets=JSON.parse(localStorage.getItem("AllTickets"));
            allTickets[currTicketId].color=newColor;
            localStorage.setItem("AllTickets",JSON.stringify(allTickets));
            ticketColorDiv.classList.remove(currColor);
            ticketColorDiv.classList.add(newColor);
        })
        ticketDiv.addEventListener("click",function(e){
            if(deleteMode){
                let currTicketId=e.currentTarget.getAttribute("data-id");
                // console.log(currTicketId);
                let allTickets=JSON.parse(localStorage.getItem("AllTickets"));
                delete allTickets[currTicketId];
                localStorage.setItem("AllTickets",JSON.stringify(allTickets));
                e.currentTarget.remove();
            }
        })
        grid.append(ticketDiv);
        
    }

}
