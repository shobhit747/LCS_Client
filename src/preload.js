// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { ipcRenderer, contextBridge } = require("electron");



contextBridge.exposeInMainWorld(
    'electronAPI', {
    send: (channel,data) =>{
        let validChannels = ['connectToServer','getDirInformation','getStorageInfo','fetchDirInformation'];
        let fileOperationChannels = ['rename','download','upload','delete','createFolder'];
        validChannels = validChannels.concat(fileOperationChannels);
        if(validChannels.includes(channel)){
            ipcRenderer.send(channel,data);
        }
    },
    receive: (channel,callback) =>{
        let validChannels = ['connectToServerReply','replyInPopUp','getDirInformationReply','getStorageInfoReply','fetchDirInformationReply','showFile'];
        let fileOperationChannels = ['renameReply','uploadReply','downloadReply','deleteReply','createFolderReply'];
        validChannels = validChannels.concat(fileOperationChannels);
        if(validChannels.includes(channel)){
            ipcRenderer.on(channel,(_event, ...args) => callback(...args));
        }
    }
})