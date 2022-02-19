(function(){
    let btn = document.querySelector('#firstButton');
    let btnTxt = document.querySelector('#secondButton');

    let divContainer = document.querySelector('#container');
    let templates = document.querySelector('.myTemplates');
    let breadCrumb = document.querySelector('#breadCrumb');
    let aRootPath = breadCrumb.querySelector("[purpose = 'path']");
    let divApp = document.querySelector("#app");
    let divAppTitlebar = document.querySelector('#app-title-bar');
    let divAppTitle = document.querySelector('#app-title');
    let divAppMenuBar = document.querySelector('#app-menu-bar');
    let divAppBody = document.querySelector('#app-body');

    let resources = [];
    let cfid = -1;  // intially we are at root (which has an id of -1)
    let rid =0;
    btn.addEventListener('click',addFolder);
    btnTxt.addEventListener('click',addTextFile);
    aRootPath.addEventListener('click',viewFolderFromPath);

    function addFolder(){
        let rname = prompt("folder's name")
        rname= rname.trim();
        if(!!rname){
            let alreadyExist = resources.some(r => r.name == rname && r.pid == cfid);
            if(alreadyExist){
                alert('already exist,try other name');
                return;
            }
            else {
                let pid = cfid;
                //html
                rid++;
                addResourceinHtml(rname,rid,pid);
                //ram
                resources.push({
                    id:rid,
                    name:rname,
                    rtype:"folder",
                    pid:cfid
                })
                saveToStorage();
            }
        }else{
            alert('please enter something');
            return;
        }

    }
    function addTextFile(){
        let rname = prompt("Enter text file name")
        rname= rname.trim();
        if(!!rname){
            let alreadyExist = resources.some(r => r.name == rname && r.pid == cfid && r.rtype == 'text-file');
            if(alreadyExist){
                alert('already exist,try other name');
                return;
            }
            else {
                let pid = cfid;
                rid++;
                //html
                addTextFileinHtml(rname,rid,pid);
                //ram
                resources.push({
                    id:rid,
                    name:rname,
                    rtype:"text-file",
                    pid:cfid,
                    isBold: false,
                    isItalic: false,
                    isUnderline : false,
                    bgColor: '#FFFFFF',
                    textColor: '#000000',
                    fontSize: 22,
                    content: 'I am the new file.'
                })
                saveToStorage();
            }
        }else{
            alert('please enter something');
            return;
        }
    }
    function editFolder(){
        let nrname = prompt("Enter Folder's name ")
        // empty ,old, unique -> validation 
        if(nrname != null){
            nrname = nrname.trim();
        }
        if(!nrname){
            alert('emptyy spacces not allowed');
            return;
        }

        let spanRename = this;
        let divFolder = spanRename.parentNode;
        divName = divFolder.querySelector('[purpose = name]');
        let orname = divName.innerHTML;
        let ridtbU = parseInt(divFolder.getAttribute('rid')); 
         // ridtBU => resource id to be updated

        if(nrname == orname){
            alert('please enter the new name ');
            return;
        }

        let alreadyExist = resources.some(r => r.name == nrname && r.pid == cfid);
        if(alreadyExist){
            alert(nrname+" already exist");
            return;
        }
        // change html
        divName.innerHTML = nrname;
        // change ram 
        let resource = resources.find(r => r.id == ridtbU);
        resource.name = nrname;
        // change storage
        saveToStorage();
    }

   function editTextFile (){
       let nrname = prompt("enter file's name ");
       if(nrname != null){
           nrname = nrname.trim();
       }
       if(!nrname ){
           alert("empty names are not allowed");
           return;
       }
       let spanRename = this;
       let divFolder = spanRename.parentNode;
       let divName = divFolder.querySelector("[purpose = 'name']");
       let orname = divName.innerHTML;
       let ridTBU = parseInt(divFolder.getAttribute('rid'));
       if(nrname == orname){
           alert("please enter the new name");
           return;
       }
       let alreadyExist = resources.some(r => nrname == r.name && r.pid == cfid && r.rtype == 'text-file');
       if(alreadyExist){
           alert(nrname +" already exist");
           return;
       }
       // html 
       divName.innerHTML = nrname;
       // change ram 
       let resource = resources.find(r => r.id = ridTBU);
       resource.rname = nrname;
       // local storage 
       saveToStorage();
   }
    function deleteHelper(fidTBD){

        let children = resources.filter(r => r.pid == fidTBD);
        for(let i =0;i<children.length;i++){
            deleteHelper(children[i].rid); // faith (this is capable of del)
        }

        // post order 
        let ridx = resources.findIndex(r => r.id == fidTBD);
        resources.splice(ridx,1);
    }
    function deleteFolder(){    
        let spanDelete = this;
        let divFolder = spanDelete.parentNode;
        let divName = divFolder.querySelector("[purpose = 'name']");

        let fidTBD = parseInt(divFolder.getAttribute('rid')); // fidtbu => fid to be deleted
        let fname = divName.innerHTML;

        let sure = confirm (`Do you want to delete ${fname}`);
        if(!sure){
            return;
        }
        // html 
        divContainer.removeChild(divFolder);
        // ram 
        deleteHelper(fidTBD);

        // storage 
        saveToStorage();


        // let confirmDel = confirm('Do you want to delete');
        // if(confirmDel){

        //     let spanDelete = this;
        //     let spanFolder = spanDelete.parentNode;
        //     // let getId = parseInt(spanFolder.getAttribute('rid'));
        //     let divName = spanFolder.querySelector("[purpose = 'name']");
        //     //html
        //     divContainer.removeChild(spanFolder);
        //     //ram 
        //     let getIndex = resources.findIndex(r => r.name == divName);
        //     resources.splice(getIndex,1);
        //     //storage 
        //     saveToStorage();
        //     if(resources.length >0){
        //         rid = resources.length ;
        //     }else {
        //         rid = rid;
        //     }
        // }
    }
    function deleteTextFile(){
        let spanDelete = this;
        let deleteTextFile = spanDelete.parentNode;
        let divName = deleteTextFile.querySelector("[purpose = 'name']");

        let fidTBD = parseInt(deleteTextFile.getAttribute('rid'));
        let fname = divName.innerHTML;

        let sure = confirm(`are you sure you want to delete the ${fname} ?`);
        if(!sure){
            return;
        }
        //html 
        divContainer.removeChild(deleteTextFile);
        // ram 
        let ridx = resources.findIndex(r => r.id == fidTBD);
        resources.splice(ridx,1);
        // save to local storage
        saveToStorage();

    }
    function viewFolderFromPath(){
        let aPath = this;
        let fid = parseInt(aPath.getAttribute('rid'));

        //set the breadCrumb
        while(aPath.nextSibling){
            aPath.parentNode.removeChild(aPath.nextSibling);
                    // aPath ka jo next sibling hai usko remove krdo parentNode se i.e breadcrumb se click krne pe 
        }
        // set the container
        cfid = fid;
        divContainer.innerHTML = "";
        for(let i =0;i<resources.length;i++){
            if(resources[i].pid == cfid){
                if(resources[i].rtype=="folder"){
                    addResourceinHtml(resources[i].name,resources[i].id,resources[i].pid);
                }else if(resources[i].rtype == "text-file"){
                    addTextFileinHtml(resources[i].name,resources[i].id,resources[i].pid);
                }
            }
        }
    }
    function viewFolder(){
        let spanView = this;
        let divFolder = spanView.parentNode;
        let divName = divFolder.querySelector("[purpose = 'name']");

        let fname = divName.innerHTML;
        let fid = parseInt(divFolder.getAttribute('rid'));

        let aPathTemplate = templates.content.querySelector("a[purpose = 'path']");
        let aPath = document.importNode(aPathTemplate,true);

        aPath.innerHTML = fname;
        aPath.setAttribute('rid',fid);
        aPath.addEventListener('click', viewFolderFromPath);
        breadCrumb.appendChild(aPath);
        
        cfid = fid;
        divContainer.innerHTML = "";
        for(let i =0;i<resources.length;i++){
            if(resources[i].pid == cfid){
                addResourceinHtml(resources[i].name,resources[i].id,resources[i].pid);
            }
        }
    }
    function viewTextFile(){
        let spanView = this;
        let viewFile = spanView.parentNode;
        divName = viewFile.querySelector("[purpose = name]");
        let fname = divName.innerHTML;
        let fid = parseInt(viewFile.getAttribute('rid'));

        let divNotepadMenuTemplate = templates.content.querySelector("[purpose = notepad-menu]");
        let divNotepadMenu = document.importNode(divNotepadMenuTemplate,true);
        divAppMenuBar.innerHTML = "";
        divAppMenuBar.appendChild(divNotepadMenu);

        let divNotepadBodyTemplate = templates.content.querySelector("[purpose =notepad-body]");
        let divNotepadBody = document.importNode(divNotepadBodyTemplate,true);
        divAppBody.innerHTML = "";
        divAppBody.appendChild(divNotepadBody);

        divAppTitlebar.innerHTML = fname;
        divAppTitle.setAttribute("rid",fid);

        let spanSave = divAppMenuBar.querySelector("[action = save]");
        let spanBold = divAppMenuBar.querySelector("[action = bold]");
        let spanItalic = divAppMenuBar.querySelector("[action = italic]");
        let spanUnderline = divAppMenuBar.querySelector("[action = underline]");
        let inputBGColor = divAppMenuBar.querySelector("[action = bg-color]");
        let inputTextColor = divAppMenuBar.querySelector("[action = fg-color]");
        let selectFontFamily = divAppMenuBar.querySelector("[action =font-family]")
        let selectFontSize = divAppMenuBar.querySelector("[action = font-size]")
        let textArea = divAppBody.querySelector("textarea");

        spanSave.addEventListener('click',saveNotepad);
        spanBold.addEventListener('click',makeNotepadBold);
        spanItalic.addEventListener('click',makenotepadItalic);
        spanUnderline.addEventListener('click',makenotepadUnderline);
        inputBGColor.addEventListener('change',changeNotepadBGcolor);
        inputTextColor.addEventListener('change',changeNotepadTextColor);
        selectFontFamily.addEventListener('change',changeNotepadFontfamily);
        selectFontSize.addEventListener('change',changeNotepadFontSize);

        let resource = resources.find(r => r.id == fid);
        spanBold.setAttribute('pressed', !resource.isBold);
        spanItalic.setAttribute('pressed',!resource.isItalic);
        spanUnderline.setAttribute('pressed',!resource.isUnderline);
        inputBGColor.value = resource.bgColor;
        selectFontFamily.value = resource.fontFamily;
        selectFontSize.value = resource.fontSize;
        textArea.content = resource.content;
        
        // spanBold.dispatchEvent(new Event("click"));
        // spanItalic.dispatchEvent(new Event("click"));
        // spanUnderline.dispatchEvent(new Event("click"));
        // inputBGColor.dispatchEvent(new Event("change"));
        // selectFontFamily.dispatchEvent(new Event('change'));
        // selectFontSize.dispatchEvent(new Event('change'));
        
    }
    function saveNotepad(){
        let fid = parseInt(divAppTitle.getAttribute('rid'));
        let resource = resource.find(r => r.id == fid);

       
        let spanBold = divAppMenuBar.querySelector("[action = bold]");
        let spanItalic = divAppMenuBar.querySelector("[action = italic]");
        let spanUnderline = divAppMenuBar.querySelector("[action = underline]");
        let inputBGColor = divAppMenuBar.querySelector("[action = bg-color]");
        let inputTextColor = divAppMenuBar.querySelector("[action = fg-color]");
        let selectFontFamily = divAppMenuBar.querySelector("[action =font-family]")
        let selectFontSize = divAppMenuBar.querySelector("[action = font-size]")
        let textArea = divAppBody.querySelector("textarea");

        resource.isBold = spanBold.getAttribute('pressed') == 'true';
        resource.isItalic = spanItalic.getAttribute('pressed') == 'true';
        resource.isUnderline = spanUnderline.getAttribute('pressed') == 'true';
        resource.bgColor = inputBGColor.value;
        resource.textColor = inputTextColor.value;
        resource.fontFamily = selectFontFamily.value;
        resource.fontSize = selectFontSize.value;
        resource.content = textArea.value;

        saveToStorage();
        
    }
    function makeNotepadBold(){
        let textArea = divAppBody.querySelector("textArea");
        let isPressed = this.getAttribute('pressed') == "true";
        // this is true then true will be in isPressed, otherwise false
        if(isPressed == false){
            this.setAttribute('pressed',true);
            textArea.style.fontWeight = "bold";
        }else{
            this.setAttribute('pressed',false);
            textArea.style.fontWeight = "normal";
        }
    }
    function makenotepadItalic(){
        let textArea = divAppBody.querySelector("textArea");
        let isPressed = this.getAttribute('pressed') == "true";
        // this is true then true will be in isPressed, otherwise false
        if(isPressed == false){
            this.setAttribute('pressed',true);
            textArea.style.fontStyle = "italic";
        }else{
            this.setAttribute('pressed',false);
            textArea.style.fontStyle = "normal";
        }
    }
    function makenotepadUnderline(){
        let textArea = divAppBody.querySelector("textArea");
        let isPressed = this.getAttribute('pressed') == "true";
        // this is true then true will be in isPressed, otherwise false
        if(isPressed == false){
            this.setAttribute('pressed',true);
            textArea.style.textDecoration = "underline";
        }else{
            this.setAttribute('pressed',false);
            textArea.style.textDecoration= "none";
        }
    }
    function changeNotepadBGcolor(){
        let color = this.value;
        let textArea = divAppBody.querySelector('textArea');
        textArea.style.backgroundColor = color;

    }
    function changeNotepadTextColor(){
        let color = this.value;
        let textArea = divAppBody.querySelector('textarea');
        textArea.style.color = color;
    }
    function changeNotepadFontfamily(){
        let fontStyle = this.value;
        let textArea = divAppBody.querySelector('textarea');
        textArea.style.fontFamily = fontStyle;
    }
    function changeNotepadFontSize(){
        let textArea = divAppBody.querySelector('textarea');
        let size = this.value;
        textArea.style.fontSize = size;
    }
    
    function addResourceinHtml(rname,rid,pid){
        let innerTemplate = templates.content.querySelector('.folder');
        let newTemplate = document.importNode(innerTemplate,true);

        let spanEdit = newTemplate.querySelector("span[action='edit']");
        let spanDelete = newTemplate.querySelector("span[action = 'delete']");
        let spanView = newTemplate.querySelector("span[action = 'view']");
        let divName = newTemplate.querySelector("[purpose='name']");

        newTemplate.setAttribute("rid",rid);
        newTemplate.setAttribute("pid",pid);

        spanEdit.addEventListener('click',editFolder);
        spanDelete.addEventListener('click',deleteFolder);
        spanView.addEventListener('click',viewFolder);

        divName.innerHTML = rname;
        divContainer.append(newTemplate);
    }
    function addTextFileinHtml(rname,rid,pid){
        let innerTemplate = templates.content.querySelector('.text-file');
        let newTemplate = document.importNode(innerTemplate,true);

        let spanEdit = newTemplate.querySelector("span[action='edit']");
        let spanDelete = newTemplate.querySelector("span[action = 'delete']");
        let spanView = newTemplate.querySelector("span[action = 'view']");
        let divName = newTemplate.querySelector("[purpose='name']");

        newTemplate.setAttribute("rid",rid);
        newTemplate.setAttribute("pid",pid);

        spanEdit.addEventListener('click',editTextFile);
        spanDelete.addEventListener('click',deleteTextFile);
        spanView.addEventListener('click',viewTextFile);    

        divName.innerHTML = rname;
        divContainer.appendChild(newTemplate);
    }


    function saveToStorage(){
        let rjson = JSON.stringify(resources);
        localStorage.setItem('data',rjson);
    }
    function loadFromStorage(){
        let rjson = localStorage.getItem('data');
        if(!rjson){
            return;
        }
        resources = JSON.parse(rjson);
        for(let i=0;i<resources.length;i++){
            if(resources[i].pid == cfid){
                if(resources[i].rtype == 'folder'){
                    addResourceinHtml(resources[i].name,resources[i].id,resources[i].pid);
                }else if (resources[i].rtype == 'text-file'){
                    addTextFileinHtml(resources[i].name,resources[i].id,resources[i].pid);
                }
            }
            if(resources[i].id > rid){
                rid = resources[i].id;
            }
        }
    }
    loadFromStorage();
    
})()