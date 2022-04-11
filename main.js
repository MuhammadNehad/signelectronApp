
const electron = require("electron");
const {app,BrowserWindow,autoUpdater,dialog} = electron;
app.on('ready',()=>{
const bwindow = new BrowserWindow({});
bwindow.loadURL(`file:///${__dirname}/views/login.html`);
   bwindow.setMenu(null);
   createWindow(bwindow);
   updateApp = require('update-electron-app');

   updateApp({
       // repo: 'PhiloNL/electron-hello-world', // defaults to package.json
       updateInterval: '1 hour',
       notifyUser: true
   });
   autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
       dialog.showOpenDialog(bwindow,{})
       autoUpdater.quitAndInstall()
   })
});

const menuTemp = [
    {'label':'refresh'}
];

const globalShortcut = electron.globalShortcut;
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