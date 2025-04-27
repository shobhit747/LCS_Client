function changeSection(filePath,divId,callback){
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById(divId).innerHTML = data;
            callback(true,null)
        })
        .catch(error => {
            console.error('Error loading section:', error)
            callback(null,error);
        });
}
changeSection('connectToServer.html','mainSection',(complete,err)=>{
    (complete) ? console.log('ok') : console.log(err);
});

let waitForElement = async(elementId,property,propertyValue) =>{
    return new Promise((resolve)=>{
        let observer = new MutationObserver((mutations,obs) =>{
            let element = document.getElementById(elementId);
            if(element){
                obs.disconnect();
                resolve(element);
            }
        })
        observer.observe(document.getElementById('mainSection'),{subtree:true,childList:true});
    })
}

function popUpMessage(messageObj){
    let messageElement = document.getElementById('popUpMessage');
    let messageElementMsg = document.getElementById('popUpMessageMsg');
    let messageSvg = document.getElementById('popUpMessageSvg');
    let animationAndStyle = () => {
        if(messageObj.hasOwnProperty('nature')){
            if(messageObj.nature == 'success'){
                messageElement.style.backgroundColor = 'green';
                messageSvg.innerHTML = `
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M16.0001 2.66669C8.63631 2.66669 2.66675 8.63625 2.66675 16C2.66675 23.3637 8.63631 29.3334 16.0001 29.3334C23.3638 29.3334 29.3334 23.3637 29.3334 16C29.3334 8.63625 23.3639 2.66669 16.0001 2.66669ZM16.0001 26.6667C10.1185 26.6667 5.33344 21.8816 5.33344 16C5.33344 10.1184 10.1184 5.33337 16.0001 5.33337C21.8817 5.33337 26.6667 10.1184 26.6667 16C26.6667 21.8816 21.8817 26.6667 16.0001 26.6667ZM21.0211 11.2363L22.9065 13.1217L14.6667 21.396L9.72406 16.4533L11.6094 14.5679L14.6667 17.6252L21.0211 11.2363Z" fill="#FFFFFF"/>
                    </svg>
                `;
            }else if(messageObj.nature == 'error'){
                messageElement.style.backgroundColor = '#910808';
                messageSvg.innerHTML = `
                    <svg width="28" height="28" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.0002 24.0833C17.4016 24.0833 17.7382 23.9473 18.0102 23.6753C18.2822 23.4033 18.4178 23.067 18.4168 22.6666C18.4159 22.2661 18.2799 21.9299 18.0088 21.6579C17.7378 21.3859 17.4016 21.2499 17.0002 21.2499C16.5988 21.2499 16.2626 21.3859 15.9915 21.6579C15.7204 21.9299 15.5844 22.2661 15.5835 22.6666C15.5826 23.067 15.7186 23.4037 15.9915 23.6767C16.2644 23.9496 16.6007 24.0851 17.0002 24.0833ZM15.5835 18.4166H18.4168V9.91659H15.5835V18.4166ZM17.0002 31.1666C15.0404 31.1666 13.1988 30.7945 11.4752 30.0503C9.75155 29.306 8.25225 28.2969 6.97725 27.0228C5.70225 25.7488 4.69311 24.2495 3.94983 22.5249C3.20655 20.8004 2.83444 18.9587 2.8335 16.9999C2.83255 15.0411 3.20466 13.1995 3.94983 11.4749C4.695 9.75036 5.70414 8.25106 6.97725 6.977C8.25036 5.70295 9.74967 4.69381 11.4752 3.94959C13.2007 3.20536 15.0423 2.83325 17.0002 2.83325C18.958 2.83325 20.7997 3.20536 22.5252 3.94959C24.2507 4.69381 25.75 5.70295 27.0231 6.977C28.2962 8.25106 29.3058 9.75036 30.0519 11.4749C30.798 13.1995 31.1697 15.0411 31.1668 16.9999C31.164 18.9587 30.7919 20.8004 30.0505 22.5249C29.3091 24.2495 28.3 25.7488 27.0231 27.0228C25.7462 28.2969 24.2469 29.3065 22.5252 30.0517C20.8034 30.7968 18.9618 31.1685 17.0002 31.1666Z" fill="white"/>
                    </svg>    
                `;
            }
        }else{
            messageElement.style.backgroundColor = '#7A306C';
        }
        console.log(messageObj);
        
        setTimeout(() => {
            messageElement.style.display = 'flex';
            setTimeout(() => {
                messageElement.style.scale = '1';
                setTimeout(() => {
                    messageElementMsg.innerHTML = messageObj.message;
                    messageElement.style.width = `${messageObj.message.length}em`;
                    setTimeout(() => {
                        messageElementMsg.style.display = 'block';
                        setTimeout(() => {
                            messageElementMsg.style.opacity = '1';
                        }, 100);
                    }, 200);
                },200);
            }, 100);
        }, 100);
        
        setTimeout(() => {
            messageElementMsg.style.opacity = '0';
            setTimeout(() => {
                messageElementMsg.style.display = 'none';
                setTimeout(() => {
                    messageElement.style.width = '28px';
                    setTimeout(() => {
                        messageElement.style.scale = '0';
                        setTimeout(() => {
                            messageElement.style.display = 'none';
                        }, 200);
                    }, 200);
                }, 100);
            }, 200);
        }, 5000);        
    }
    
    let style = window.getComputedStyle(messageElement),
        display = style.getPropertyValue('display');
    if(display == 'flex'){
        setTimeout(() => {
            animationAndStyle();
        }, 4000);
    }else{
        animationAndStyle();
    }
    
};

