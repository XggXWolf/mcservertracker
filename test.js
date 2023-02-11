const delay = ms => new Promise(res => setTimeout(res, ms));
var x = 0
while (true){
    await delay(1000)
    x = x + 1
    console.log(x.toString())
    break;

}