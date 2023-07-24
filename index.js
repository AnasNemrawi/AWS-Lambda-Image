'use strict';

const aws = require('aws-sdk');
const s3 = new aws.S3();

exports.handler = async function (event, context) {

    let buckName = event['Records'][0]['s3']['bucket']['name']
    let newImg = event['Records'][0]['s3']['object']['key'];
    let imgtype = event['Records'][0]['s3']['object']['key'].split('.')[1]
    let imgsize = event['Records'][0]['s3']['object']['size']
    let datatoUpload = [];

    try {
        let data = await s3.getObject({ Bucket: buckName, Key: 'images.json' }).promise();
        datatoUpload = JSON.parse(data.Body.toString('utf-8'));
    } catch (err) {

    }

    let newImgObj = {
        name: newImg,
        type: imgtype,
        size: `${(imgsize / 1024) / 1024} MB`
    }

    console.log(datatoUpload)

    let exist = datatoUpload.findIndex(element => element.name === newImg)
    if (exist > -1) {
        datatoUpload[exist] = newImgObj
    } else datatoUpload.push(newImgObj)

    await s3.putObject({
        Bucket: buckName, Key: 'images.json', Body: JSON.stringify(datatoUpload), ContentType: 'application/json'
    }).promise();

    let res = "images.json updated"
    return res;
};
