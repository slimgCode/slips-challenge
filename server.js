const PORT = 8080

const server = require('./app') ({
	logger:{
		level:'info'
	}
})

//start the listener
server.listen ({port: PORT}, (err) => {
	if (err){
		server.log.error(err)
		process.exit(1)
	}
})