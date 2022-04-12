
const {app,BrowserWindow,autoUpdater,dialog,globalShortcut} =require("electron");

updateApp =require('update-electron-app');
const log = require('electron-log');
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

app.on('ready',()=>{

 bwindow = new BrowserWindow({});
bwindow.loadURL(`file:///${__dirname}/views/login.html`);
   bwindow.setMenu(null);
   createWindow(bwindow);
//    autoUpdater.setFeedURL({url:"https://github.com/MuhammadNehad/signelectronApp/releases/tag/"})
   autoUpdater.checkForUpdates();
   
   updateApp({
       // repo: 'PhiloNL/electron-hello-world', // defaults to package.json
       updateInterval: '5 minutes',
       notifyUser: true
   });
   autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
       dialog.showOpenDialog(bwindow,{})
       autoUpdater.quitAndInstall()
   })
});
app.on("window-all-closed",()=>{
    app.quit();
});
const menuTemp = [
    {'label':'refresh'}
];

function createWindow(bwindow)
{
    globalShortcut.register('f5',()=>{
        bwindow.reload()
    })
    globalShortcut.register('CommandOrControl+R', function() {
        bwindow.reload()
        
    });
}

// const isWindows = process.platform === 'win32';
// let needsFocusFix = false;
// let triggeringProgrammaticBlur = false;

// win.on('blur', (event) => {
//   if(!triggeringProgrammaticBlur) {
//     needsFocusFix = true;
//   }
// })

// win.on('focus', (event) => {
//   if(isWindows && needsFocusFix) {
//     needsFocusFix = false;
//     triggeringProgrammaticBlur = true;
//     setTimeout(function () {
//       win.blur();
//       win.focus();
//       setTimeout(function () {
//         triggeringProgrammaticBlur = false;
//       }, 100);
//     }, 100);
//   }
// })