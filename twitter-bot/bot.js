require('dotenv').config();
const twit = require('./twit');
const fs = require('fs');
const path = require('path');
const paramsPath = path.join(__dirname, 'params.json')

function writeParams(data) {
    console.log('We are writing the params file ...", data');
    return fs.writeFileSync(paramsPath, JSON.stringify(data));
}

function readParams() {
    console.log('We are reading the params file ...');
    const data = fs.readFileSync(paramsPath);
    return JSON.parse(data.toString());
}

function getFollowersList() {
    return new Promise((resolve, reject) => {
        let params = {
            user_id: 1581334114178842631,
            screen_name: "PlayYRFR",
        };
        twit.get('followers/list', params, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        });
    });
}

var Followers = {} // Stores all account followers
async function main(handle) {
    try {
        const params = readParams();
        const data = await getFollowersList();
        const followers = data.users

        console.log('We got the followers', followers.length)
        Followers = {}

        for await (let follower of followers) {
            try {
                Followers["/" + follower.screen_name] = follower
                console.log('Got a follower! Their username is ' + follower.screen_name + ", and their display name is " + follower.name);
            } catch(e) {
                console.log('Unsuccessful follower. The error is ' + e);
            }
        }
        writeParams(params);
    } catch(e) {
        console.error(e);
    }
}

console.log('Starting the twitter bot ...');

main();
setInterval(main, 60000);

var Bot = {}
Bot.HandleFollowsAccount = function(Handle) {
    if (Followers[Handle] !== undefined) {
        console.log("Follow eligible");
        return true;
    }
    return false;
}

module.exports = Bot