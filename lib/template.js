 (function(modules) {
 	var installedModules = {};

 	function __zpack_require__(moduleId) {
 		if(installedModules[moduleId]) {
 			return installedModules[moduleId].exports;
		 }
		 
 		var module = installedModules[moduleId] = {
 			i: moduleId,
 			l: false,
 			exports: {}
 		};

 		modules[moduleId].call(module.exports, module, module.exports, __zpack_require__);
 		module.l = true;
 		return module.exports;
 	}

 	return __zpack_require__(__zpack_require__.s = "./src/pages/index.js");
 })({
		"./src/pages/index.js": function(module, exports, __zpack_require__) {
			eval("console.log(123)");
		}
 });