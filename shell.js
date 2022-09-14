const { ls, pwd, cd } = require("./basics");
const { spawn } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.emitKeypressEvents(process.stdin);

try {
  process.stdin.setRawMode(true);
} catch (err) {
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
}
let cfg = 0

const fg = (pid)=>{
  cfg = pid
}
const cfgf = ()=>{
  console.log(cfg)
}

let commands = {
  "ls": ls,
  "pwd": pwd,
  "cd": cd,
  "fg":fg,
  "cfg":cfgf
};


process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'z') {
    if (cfg){
      cfg = 0
      console.log("Stopping Process and Sending to Background")      
    }
    
  } 
});


const waitForUserInput = () => {
  rl.question("$: ", cmd => {

    if (cmd == "exit") {
      rl.close();

    }
    else{
      try {
        if (cmd in commands) {
          commands[cmd]();
        }
        else if (cmd.split(" ", 1) in commands) {

          reCmd = cmd.split(" ");
          comand = reCmd[0];
          args = reCmd.slice(1, reCmd.length);
          commands[comand](...args);

        }
        else{
          reCmd = cmd.split(" ");
          comand = reCmd[0];
          args = reCmd.slice(1, reCmd.length);
          const child = spawn(comand, args);
          
          console.log("child process created " ,child.pid)
          cfg = child.pid
          
          child.stdout.on('data', (data) => {
            if( cfg === child.pid){
              console.log(`${data}`);              
            }
          });
          
          child.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
          });
          
          child.on('error', (error) => {
            console.error(`error: ${error.message}`);
          });
          
          child.on('close', (code) => {
            if(cfg = child.pid){
              cfg = 0;
            }
            console.log(`child process exited with code ${code}`);
          });
        }
      }        
      catch (err) {
        // console.log(err)
        console.log("Command not found");
      }
      waitForUserInput();
    }
  });
};
waitForUserInput();
