const { app, BrowserWindow, Menu} = require("electron");

const {dialog} = require("electron");
const fs = require("fs");

let win;

function createWindow () {
      win = new BrowserWindow({
      width: 800,
      height: 500,
      maxWidth: 800,
      maxHeight: 500,
      minWidth: 800,
      minHeight: 500,
      icon: 'icon.ico',
      webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
      },
    }); 
  
    win.on('close', function() {
        win.webContents.send("saveFile");
    });

    win.removeMenu()

    win.loadFile('index.html');
}

app.whenReady().then(() => {

    createWindow();
});

app.on('window-all-closed', function () {
    
    if (process.platform !== 'darwin') app.quit();
});
