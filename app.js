var https = require('https');
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
let access_token;
rl.question('Введите ваш Access_token: ', (answer1) => {
  access_token=answer1;
  rl.close();
});
let online=undefined;
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
    path: '/method/users.get?v=5.52&access_token=315316cea39707e26bc004ad0a4b54bba34d28162251715a34ae14f0d275f356796e420945084dd093af8&user_ids=sad_eyes_monster&fields=last_seen,online',
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
      if(b.response[0].online==1 && online==false){
        fs.appendFile("testFile.txt", `Онлайн в  ${hour}:${time} - ${p}\n`, function(error){});
        online=true;
      }else if(b.response[0].online==0 && online==true){
        fs.appendFile("testFile.txt", `Вышла в  ${hour}:${time} - ${p}\n`, function(error){});
        online=false;
      }else if(b.response[0].online==0 && online==undefined){
        fs.appendFile("testFile.txt", `Вышла в  ${hour}:${time} - ${p}\n`, function(error){});
        online=false;
      }
    });
}
fs.writeFile('testFile.txt', '', (err) => {});//Создаем файл
setInterval(()=>{
  https.request(option, callback).end();
}, 10000);