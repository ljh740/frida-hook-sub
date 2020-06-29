function get_func_addr(module, offset) {

  var base_addr = Module.findBaseAddress(module);
  console.log("base_addr: " + base_addr);

  console.log(hexdump(ptr(base_addr), {
    length: 16,
    header: true,
    ansi: true
  }))

  var func_addr = base_addr.add(offset);
  if (Process.arch == 'arm')
    return func_addr.add(1);  //如果是32位地址+1
  else
    return func_addr;
}


// 0x0f40 用ida/hopper之类的软件获取的函数地址
var func_addr = get_func_addr('testRlease', 0x0f40);
console.log('func_addr: ' + func_addr);

console.log(hexdump(ptr(func_addr), {
  length: 16,
  header: true,
  ansi: true
}))

// 注入sub函数
Interceptor.attach(ptr(func_addr), {
  onEnter: function (args) {

    console.log("onEnter");
    var num1 = args[0];
    var num2 = args[1];

    console.log("num1: " + num1);
    console.log("num2: " + num2);

  },
  onLeave: function (retval) {

    console.log("onLeave");
    retval.replace(666);  //返回值替换成3
  }
});

// 替换sub函数
// var addPtr = get_func_addr('testRlease', 0x0f40);
// var add = new NativeFunction(addPtr, 'int', ['int', 'int']);

// // 进行替换
// Interceptor.replace(add, new NativeCallback(function (num1, num2) {

//   if ((num1 == 1) && (num2 == 1)) {
//     console.log("1+1");
//   }
//   // 调用原函数
//   return add(num1, num2);
//   //return add(2, 3); //将参数替换掉
// }, 'int', ['int', 'int']));

// 替换open函数
var openPtr = Module.getExportByName(null, 'open');
var open = new NativeFunction(openPtr, 'int', ['pointer', 'int']);

Interceptor.replace(openPtr, new NativeCallback(function (pathPtr, flags) {
  var path = pathPtr.readUtf8String();
  console.log('Opening "' + path + '"');
  var fd = open(pathPtr, flags);
  console.log('Got fd: ' + fd);
  return fd;
}, 'int', ['pointer', 'int']));
