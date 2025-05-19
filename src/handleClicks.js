document.getElementById('mainSection').addEventListener('click', (event) =>{
    if(event.target.closest('button')){
        let buttonClicked = event.target.closest('button');
        let currentPath = document.getElementById('currentPathInput');
        
        if(buttonClicked.id == 'submitServerInfo'){
            let form = document.getElementById('connectToServerForm');
            form.onsubmit = () =>{
                try {
                    let password = form['password'].value;
                    let ipAddress = form['ipAddress'].value;
                    let port = form['port'].value;
                    window.electronAPI.send('connectToServer',
                        {
                            password : password,
                            ipAddress : ipAddress,
                            port : port
                        });
                    
                } catch (error) {
                    popUpMessage(error)
                }    
                return false;
            }
        }

        else if(buttonClicked.id == 'tableRow'){
            window.electronAPI.send('fetchDirInformation',buttonClicked.getAttribute('path'));
        }

        else if(buttonClicked.id == 'backDir'){
            window.electronAPI.send('fetchDirInformation','..');
        }


        else if(buttonClicked.id == 'rename'){

        }
        else if(buttonClicked.id == 'upload'){
            console.log(currentPath);
            let operationInfo = {
                currentPath : currentPath.getAttribute('value')
            }
            window.electronAPI.send('upload',operationInfo);
        }
        else if(buttonClicked.id == 'download'){
            let operationInfo = {
                fileName : buttonClicked.getAttribute('path'),
            }
            window.electronAPI.send('download',operationInfo);
        }
        else if(buttonClicked.id == 'delete'){

        }
        else if(buttonClicked.id == 'createFolderOption'){
            let ele = `
                    <input type="text" placeholder="Enter folder name" required>
                    <button class="button_style_one">Create</button>
                    <button class="button_style_one" id="cancelOption" style="padding:5px; border-radius:20px;">
                        <svg width="25" height="25" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M26.2802 7.61328L24.3869 5.71997L16.0002 14.12L7.61353 5.71997L5.72021 7.61328L14.1202 16L5.72021 24.3867L7.61353 26.28L16.0002 17.88L24.3869 26.28L26.2802 24.3867L17.8802 16L26.2802 7.61328Z" fill="black"/>
                        </svg>

                    </button>
            `;
            document.getElementById('buttonOptionInput').innerHTML = ele;
        }
        else if(buttonClicked.id == 'createFolder'){

        }
        else if(buttonClicked.id == 'cancelOption'){
            document.getElementById('buttonOptionInput').innerHTML = '';
        }
        
    }
})

document.getElementById('header').addEventListener('click',(event)=>{
    if(event.target.closest('button')){
        let buttonClicked = event.target.closest('button');
        console.log(buttonClicked.id);
        
        //shut down server handler
        if(buttonClicked.id == 'disconnect'){
            
        }
    }
})

let previousEventBtn = undefined;
document.getElementById('mainSection').addEventListener('contextmenu',(event)=>{
    
    if(previousEventBtn){
       previousEventBtn.removeAttribute('style');
        changeSection('normalOptions.html','optionButtons',(complete,err)=>{
            try {
                if(err){throw err};
                if(complete){}
            } catch (error) {
                console.log(error);
            }
        })
    }
    let selectedBtn = event.target.closest('button');
    console.log(selectedBtn.id);
    
    if(selectedBtn.id == 'tableRow'){
        selectedBtn.style.backgroundColor = '#2A1920'
        previousEventBtn = selectedBtn;
        if(selectedBtn.getAttribute('isFile') == 'true'){
            changeSection('fileOptions.html','optionButtons',(complete,err)=>{
                try {
                    if(err){throw err};
                    if(complete){
                        document.getElementById('download').setAttribute('path',selectedBtn.getAttribute('path'));
                        document.getElementById('rename').setAttribute('path',selectedBtn.getAttribute('path'));
                        document.getElementById('delete').setAttribute('path',selectedBtn.getAttribute('path'));
                    }
                } catch (error) {
                    console.log(error);
                }
            })
        }else if(selectedBtn.getAttribute('isFolder') == 'true'){
            changeSection('folderOptions.html','optionButtons',(complete,err)=>{
                try {
                    if(err){throw err};
                    if(complete){
                        document.getElementById('rename').setAttribute('path',selectedBtn.getAttribute('path'));
                        document.getElementById('delete').setAttribute('path',selectedBtn.getAttribute('path'));
                    }
                } catch (error) {
                    console.log(error);
                }
            })
        }

    }


})