const { test } = require('tap');
const build = require('./app');

//Test that GET /boat-slips route returns a 200
test('GET /boat-slips', async t => {
const app = build()

    const response = await app.inject({
        method: 'GET',
        url: '/boat-slips'
    })
    t.equal(response.statusCode,200,"GET /boat-slips Returns status code 200")


})

//Test that PUT /boat-slips/id/vacate route returns a 409 for non-existent slip id
test('PUT /boat-slips', async t => {
    const app = build()
    
        const response = await app.inject({
            method: 'PUT',
            url: '/boat-slips/10/vacate'
        })
        t.equal(response.statusCode,409,"PUT /boat-slips Returns status code 409")
    }) 



