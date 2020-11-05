var https = require('https');
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
let online=0;
let access_token;
let idname;
rl.question('Введите ваш Access_token: ', (answer1) => {
  rl.question('Введите id или screen_name пользователя: ', (answer2) => {
    access_token=answer1;
    idname=answer2;
    rl.close();
    const platforms={
      '1':'мобильная версия',
      '2':'приложение для iPhone',
      '3':"приложение для iPad",
      '4':'приложение для Android',
      '5':'приложение для Windows Phone',
      '6':'приложение для Windows 10',
      '7':'полная версия сайта'
    }
    let option = {
        hostname: 'api.vk.com',
        headers: {
            'Content-Type': 'application/json',
        },
        path: '/method/users.get?v=5.52&access_token='+access_token+'&user_ids='+idname+'&fields=last_seen,online',
    }
    
    callback = function(response) {

        var str = '';
        response.on('data', function (chunk) {
          str += chunk;
        });
        response.on('end', function () {
          let b = JSON.parse(str);
          let time= new Date(b.response[0].last_seen.time*1000).getMinutes();
          time=(time.toString().length==1)? "0"+time:time;
          let hour= new Date(b.response[0].last_seen.time*1000).getHours();
          hour=(hour.toString().length==1)? "0"+hour:hour;
          let p= platforms[b.response[0].last_seen.platform];
          if(b.response[0].online==1 && online==1){
            fs.appendFile("testFile.txt", `Онлайн в ${hour}:${time} - ${p}\n`, function(error){});
            online=2;
          }else if(b.response[0].online==0 && online==2){
            fs.appendFile("testFile.txt", `Вышел(ла) в ${hour}:${time} - ${p}\n`, function(error){});
            online=1;
          }else if(b.response[0].online==0 && online==0){
            fs.appendFile("testFile.txt", `Вышел(ла) в ${hour}:${time} - ${p}\n`, function(error){});
            online=1;
          }else if(b.response[0].online==1 && online==0){
            fs.appendFile("testFile.txt", `Онлайн в ${hour}:${time} - ${p}\n`, function(error){});
            online=2;
          }
        });
    }
    fs.writeFile('testFile.txt', '', (err) => {});
    setInterval(()=>{
      https.request(option, callback).end();
    }, 10000);
   });
});