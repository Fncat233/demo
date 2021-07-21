const https = require('https');

//可循环page数爬取懒加载
function getImgPageLink() {
    return new Promise((resolve, reject) => {
        https.get('https://wallhaven.cc/toplist?page=1', res => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            })

            res.on('end', () => {
                let getImagePageLink = data.match(/https:\/\/wallhaven.cc\/w\/\w{6}/g)
                resolve(getImagePageLink)
            })
        })
    })
}

const getImageLink = (imgPageLink) => {
    new Promise((resolve, reject) => {
        for (l in imgPageLink) {
            if (l >= 10) {
                break;
            }
            https.get(imgPageLink[l], res => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                })

                res.on('end', () => {
                    let getImageLink = data.match(/https:\/\/w.wallhaven.cc\/full\/\w{2}\/wallhaven-\w{6}.\w{3}/g)
                        // resolve(l)
                    console.log(getImageLink);
                    //数据处理，去重，保存
                })
            })
        }
    })
}

getImgPageLink().then((res) => {
    getImageLink(res)
})