const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('node:path');
const http = require('http');
const { default: axios, head } = require('axios');
const { CookieJar,MemoryCookieStore } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');
const { HttpCookieAgent } = require('http-cookie-agent/http')
const videoJs = require('video.js')
const fs = require('node:fs');
const mime = require('mime-types')
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}


const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width:1400,
    height:850,
    minHeight:850,
    minWidth:1400,
    autoHideMenuBar:true,
    titleBarOverlay:true,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
        color: '#131212',
        symbolColor: '#FFFFFF',
        height: 30
    },
    webPreferences: {
        contextIsolation:true,
        nodeIntegration:true,
        preload:path.join(__dirname,'preload.js'),
    }

  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '/html/index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

const store = new MemoryCookieStore();
const jar = new CookieJar(store);

const client = wrapper(axios.create({
  jar
}));

ipcMain.on('connectToServer',(event,data)=>{
  client.defaults.baseURL = `http://${data.ipAddress}:${data.port}`;

  let headers = {
    'connection' : 'keep-alive',
  }

  client.get(`/`,{headers : headers})
  .then((res)=>{
    // console.log(res.headers);
    
    event.reply('connectToServerReply',res.data.directoryInfo,res.data.storageInfo,res.data.currentPath,`${data.ipAddress}:${data.port}`);
  }).catch((err)=>{
    console.log(err);
    
    event.reply('replyInPopUp',{
      message : 'cannot connect to server',
      nature : 'error'
    })
  })
});

ipcMain.on('fetchDirInformation',(event,cdPath)=>{
  // console.log(store.getAllCookies());
  let body = {
    cd : cdPath
  }
  let headers = {
    'connection' : 'keep-alive',
  }
  client.post(`/getDirectory`,body,{headers :headers})
  .then((res)=>{
    console.log(res.request._header);
    
    if(res.headers['Content-Disposition'.toLowerCase()]){
      event.reply('showFile',{
        url : `${client.defaults.baseURL}${res.data.filePath}`,
        type : res.headers['Content-Type'.toLowerCase()],
        fileName : res.data.filePath.split('/')[2]
      });
    }else{
      console.log(res.data);
      
      event.reply('fetchDirInformationReply',res.data);
    }

  }).catch(err =>{
    console.log(err);
    
    // console.log(err.response.data);
    event.reply('replyInPopUp',{
      message : err.response.data,
      nature : 'error'
    })
  })
  
});


ipcMain.on('getDirInformation',(event,directoryInfo)=>{
  event.reply('getDirInformationReply',directoryInfo);
})

ipcMain.on('getStorageInfo',(event,storageInfo)=>{
  console.log(storageInfo);
  
  event.reply('getStorageInfoReply',storageInfo);
})

ipcMain.on('rename',(event,operationInfo)=>{
  console.log('rename');
  
});
ipcMain.on('upload',(event,operationInfo)=>{
  console.log('upload : ',operationInfo);
  dialog.showOpenDialog({properties : ['openFile']})
  .then(callbackPromise =>{
    if(!callbackPromise.canceled){
      let filePath = callbackPromise.filePaths[0];      
      let filename = filePath.split('/');
      filename = filename[filename.length - 1]
      let fileStats = fs.statSync(filePath);
      if(fileStats.isFile()){
        let fileData = fs.createReadStream(filePath);
        
        client.post('/upload',fileData,{
          headers : {
            'Content-Length' : fileStats.size,
            'Content-Type' : 'application/octet-stream',
            'Content-Disposition' : `attachment; filename=${filename}`
          }
        })
        .then(res =>{
          if(res.status == 200){
            event.reply('replyInPopUp',{
              message : 'File Uploaded Successfully',
              nature : 'success'
            });
            event.reply('uploadReply');
          }else{
            event.reply('replyInPopUp',{
              message : 'Error in Uploading',
              nature : 'error'
            })
          }
          
        })
        .catch(err=>{
          throw err;
        })
      }
    }
    
  })
  .catch(error =>{
    console.error(error);
  })
  
});
ipcMain.on('download',(event,operationInfo)=>{

});
ipcMain.on('delete',(event,operationInfo)=>{

});
ipcMain.on('createFolder',(event,operationInfo)=>{

});
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
