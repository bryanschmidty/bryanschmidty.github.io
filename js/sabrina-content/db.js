const AWS_ACCESS_KEY = 'AKIA6OC4JDB2CMLX5SEN';
const AWS_SECRET_KEY = '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';
const AWS_REGION = 'eu-central-1';
const AWS_DYNAMODB_TABLE = 'sabrina-db';



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
                "key": key,
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
                "key": key
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
});