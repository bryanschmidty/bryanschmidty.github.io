const AWS_ACCESS_KEY = 'AKIA6OC4JDB2CMLX5SEN';
const AWS_SECRET_KEY = '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';
const AWS_REGION = 'eu-central-1';
const AWS_DYNAMODB_TABLE = 'sabrina-db';
let prefix = 'bryan';

console.log(window.location.hostname)
if (window.location.hostname === 'localhost') {
    prefix = 'local';
}

document.addEventListener("DOMContentLoaded", function() {
    AWS.config.update({
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
        region: AWS_REGION
    });
    const dynamoDB = new AWS.DynamoDB.DocumentClient();

    window.writeDB = function(key, json) {
        const params = {
            TableName: AWS_DYNAMODB_TABLE,
            Item: {
                "key": prefix + ":" + key,
                "json": JSON.stringify(json)
            }
        };

        return new Promise((resolve, reject) => {
            dynamoDB.put(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    window.readDB = function(key) {
        const params = {
            TableName: AWS_DYNAMODB_TABLE,
            Key: {
                "key": prefix + ":" + key
            }
        };

        return new Promise((resolve, reject) => {
            dynamoDB.get(params, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    if (data.Item && data.Item.json) {
                        try {
                            resolve(JSON.parse(data.Item.json));
                        } catch (error) {
                            reject('Failed to parse JSON: ' + error);
                        }
                    } else {
                        resolve(false);
                    }
                }
            });
        });
    }

    function readCookie(name) {
        const nameEQ = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');

        for (let i = 0; i < cookieArray.length; i++) {
            let c = cookieArray[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return null;
    }

    const sabrinaDbUser = readCookie('sabrina-db-user');
    console.log('sabrina-db-user:', sabrinaDbUser);
});