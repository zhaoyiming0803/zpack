 (function(modules) {
 	var installedModules = {};

 	function __zympack_require__(moduleId) {
 		if(installedModules[moduleId]) {
 			return installedModules[moduleId].exports;
		 }
		 
 		var module = installedModules[moduleId] = {
 			i: moduleId,
 			l: false,
 			exports: {}
 		};

 		modules[moduleId].call(module.exports, module, module.exports, __zympack_require__);
 		module.l = true;
 		return module.exports;
 	}

 	return __zympack_require__(__zympack_require__.s = "./src/pages/index.js");
 })({
		"./src/pages/index.js": function(module, exports, __zympack_require__) {
			eval("console.log(123)");
		}
 });