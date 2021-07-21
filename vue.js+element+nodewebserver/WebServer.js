const http = require('http');
var crypto = require('crypto');

let data = 'test';

let 学生数据 = {
    姓名: '李宏军',
    学号: '1800001'
};

let 返回格式 = {
    状态码: 0,
    数据: {

    }
}

let Tokens = {
    wujianhua: {
        时间戳: Date.now(),
        token: crypto.createHash('md5').update('wujianhua').digest('hex').toUpperCase()
    }
}

let 密码库 = {

    'lihongjun': 'lhj123'
}

function parseLoginForm(form) {
    let ret = {};
    let sequence = form.split('&');
    for (s in sequence) {
        kv = sequence[s].split('=', 2);
        ret[kv[0]] = kv[1];
    }
    return ret;
}

const server = http.createServer((req, res) => {
    let data = '';
    req.on('data', (chunk) => {
        data += chunk;
    });

    req.on('end', () => {
        console.log('请求链接1：', req.url)
        console.log('请求链接1：', req.url.split('/', 2)[1])
        let path = req.url.split('/', 2)[1];
        let path_parameter = path.split('?', 2);
        path = path_parameter[0];
        let parameter = parseLoginForm(path_parameter[1]);

        switch (path) {
            case '':
                res.writeHead(403);
                res.end();
                break;

            case 'lihongjun':
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Credentials', true);
                res.setHeader('Access-Control-Expose-Headers', '*');
                res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8', });

                let verified = false;
                for (t in Tokens) {
                    if (parameter.token == Tokens[t].token) {
                        verified = true;
                    }
                }
                if (!verified) {
                    if (密码库[parameter.username] != undefined && 密码库[parameter.username] == parameter.password) {
                        Tokens[parameter.username] = {
                            时间戳: Date.now(),
                            token: crypto.createHash('md5').update(Math.random() + Date.now() + parameter.password).digest('hex').toUpperCase()
                        }
                        verified = true;

                    } else {
                        verified = false;
                    }
                }
                if (verified) {
                    返回格式.状态码 = 0;
                    返回格式.数据.token = Tokens[parameter.username].token;
                    返回格式.数据 = 学生数据;
                } else {
                    返回格式.状态码 = -1;
                    返回格式.数据 = { 提示: '错了，自己看看吧!' };
                }
                res.end(JSON.stringify(返回格式));
                break;

            case 'login':
                res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
                res.end('<p style="font-size: 120px;">兄弟，乱输入呢!</p>');
                break;

            default:
                res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
                res.end('<p style="font-size: 120px;">兄弟，我们不理解你的意思!</p>');
        }
    });
}).listen(2020);

// while (1) {
//     for (t in Tokens) {
//         let 时间差 = Date.now() - Tokens[t].时间戳;
//         if (时间差 > 1000 * 60 * 60) {
//             delete Tokens[t];
//             console.log('Token过期了，已经删除');
//         }
//     }
// }