
module.exports = function(grunt) {

	grunt.initConfig({ 
		build: {
			options: {
				browser: 'firefox netscape opera chrome facebook twitter ie opera other'.split(' '),
				device: 'wii kindle playstation nokia blackberry palm htc acer asus lenovo lg motorola phillips samsung other'.split(' '),
				os: 'android webos windows symbian blackberry other'.split(' ')
			}
		} 
	});
	grunt.loadTasks('tasks');
	grunt.registerTask('default', ['build']);

};
