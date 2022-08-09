const fs = require('fs')
const slips = require('./data/slips.json')
const fastify = require('fastify')

function build(opts = {}) {
	const app = fastify(opts)

	//GET
	//send all the slips as json and a 200 status code
	app.get("/boat-slips", (req, reply) => {
		reply
			.code(200)
			.header('Content-Type', 'application/json, charset=utf-8')
			.send(slips)
	})

	//POST
	app.post("/boat-slips", (req, reply) => {
		const freeslip = slips.find(slip => slip.vacant === true)
		//if no free slip is found, send a 409 and a message
		if (!freeslip) {
			reply
				.code(409)
				.header('Content-Type', 'application/json, charset=utf-8')
				.send({
					"statusCode": 409,
					"Message": "There are no available boat slips."
				})
		}
		//if free slip is found, send a 200 and json indicating the slip number
		else {
			freeslip.vacant = false
			freeslip.vesselName = req.body.vesselName
			persistData(slips) //save the updated data to disk

			reply
				.code(200)
				.header('Content-Type', 'application/json, charset=utf-8')
				.send({ "slipNumber": freeslip.id })
		}
	})

	//PUT
	app.put("/boat-slips/:id/vacate", (req, reply) => {
		const { id } = req.params
		const occupiedslip = slips.find(slip => slip.id === parseInt(id) && slip.vacant === false)
		
		//if the requested slip is not found or is already vacant send a 409 and a message
		if (!occupiedslip) {
			reply
				.code(409)
				.header('Content-Type', 'application/json, charset=utf-8')
				.send({
					"statusCode": 409,
					"Message": `Boat slip \`${id}\` is currently vacant`
				})
		}

		//if the requested slip is found or is not vacant, set to vacant and delete the vessel name. Send a 204 and no message
		else {
			occupiedslip.vacant = true
			delete occupiedslip.vesselName
			persistData(slips)	//save the updated data to disk
			reply
				.code(204)
				.header('Content-Type', 'application/json, charset=utf-8')
				.send()
		}
	})

	return app
}


//Function to persist the data. Saves the passed json to ./data/slips.json
function persistData(jsonData) {

	fs.writeFile('./data/slips.json', JSON.stringify(jsonData), function (err) {
		if (err) throw err;
	})


}

module.exports = build
