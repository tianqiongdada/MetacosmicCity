var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var remoteResUrl = 'http://192.168.16.109/hotupdateDemo/';  //�滻Ϊ��Ӧ��Զ�����ص�ַ
var manifest = {
    packageUrl: remoteResUrl,
    remoteManifestUrl: remoteResUrl + 'project.manifest',
    remoteVersionUrl: remoteResUrl + 'version.manifest',
    version: '1.0.1',
    assets: {},
    searchPaths: []
};

var dest = './hotupdate/';				//��Դ·����Ĭ���ǵ�ǰĿ¼��hotupdate�ļ���
var src = './build/jsb-link/';			//��Ŀ������Դ·��

// Parse arguments
var i = 2;
while ( i < process.argv.length) {
    var arg = process.argv[i];

    switch (arg) {
    case '--url' :
    case '-u' :
        var url = process.argv[i+1];
        manifest.packageUrl = url;
        manifest.remoteManifestUrl = url + 'project.manifest';
        manifest.remoteVersionUrl = url + 'version.manifest';
        i += 2;
        break;
    case '--version' :
    case '-v' :
        manifest.version = process.argv[i+1];
        i += 2;
        break;
    case '--src' :
    case '-s' :
        src = process.argv[i+1];
        i += 2;
        break;
    case '--dest' :
    case '-d' :
        dest = process.argv[i+1];
        i += 2;
        break;
    default :
        i++;
        break;
    }
}

function readDir (dir, obj) {
    var stat = fs.statSync(dir);
    if (!stat.isDirectory()) {
        return;
    }
    var subpaths = fs.readdirSync(dir), subpath, size, md5, compressed, relative;
    for (var i = 0; i < subpaths.length; ++i) {
        if (subpaths[i][0] === '.') {
            continue;
        }
        subpath = path.join(dir, subpaths[i]);
        stat = fs.statSync(subpath);
        if (stat.isDirectory()) {
            readDir(subpath, obj);
        }
        else if (stat.isFile()) {
            // Size in Bytes
            size = stat['size'];
            md5 = crypto.createHash('md5').update(fs.readFileSync(subpath)).digest('hex');
            compressed = path.extname(subpath).toLowerCase() === '.zip';

            relative = path.relative(src, subpath);
            relative = relative.replace(/\\/g, '/');
            relative = encodeURI(relative);
            obj[relative] = {
                'size' : size,
                'md5' : md5
            };
            if (compressed) {
                obj[relative].compressed = true;
            }
        }
    }
}

var mkdirSync = function (path) {
    try {
        fs.mkdirSync(path);
    } catch(e) {
        if ( e.code != 'EEXIST' ) throw e;
    }
}

var copyFile = function(srcPath, tarPath, cb) {
    var rs = fs.createReadStream(srcPath)
    rs.on('error', function(err) {
        if (err) {
        console.log('read error', srcPath)
        }
        cb && cb(err)
    })
    
    var ws = fs.createWriteStream(tarPath)
    ws.on('error', function(err) {
        if (err) {
        console.log('write error', tarPath)
        }
        cb && cb(err)
    })
    ws.on('close', function(ex) {
        cb && cb(ex)
    })
    
    rs.pipe(ws)
}

var copyFileDir = function(srcDir, tarDir, cb) {
    fs.readdir(srcDir, function(err, files) {
        files.forEach(function(file) {
            var srcPath = path.join(srcDir, file)
            var tarPath = path.join(tarDir, file)
            
            fs.stat(srcPath, function(err, stats) {
                if (stats.isDirectory()) {
                    console.log('mkdir', tarPath)
                    fs.mkdir(tarPath, function(err) {
                    if (err) {
                    console.log(err)
                    return
                    }
                
                    copyFileDir(srcPath, tarPath)
                    })
                } else {
                    copyFile(srcPath, tarPath)
                }
            });
        });
    
        //Ϊ��ʱֱ�ӻص�
        files.length === 0 && cb && cb();
    });
}

var doWork = function () {
    // Iterate assets and src folder
    readDir(path.join(src, 'src'), manifest.assets);
    readDir(path.join(src, 'assets'), manifest.assets);
    mkdirSync(dest);

    var destFileDir = path.join(dest, 'ver-' + manifest.version);
    if (fs.existsSync(destFileDir)) {
        console.log('is have this version'); 
        return;
    } 
    mkdirSync(destFileDir);

    var destManifest = path.join(destFileDir, 'project.manifest');
    var destVersion = path.join(destFileDir, 'version.manifest');

    fs.writeFile(destManifest, JSON.stringify(manifest), (err) => {
    if (err) throw err;
    console.log('Manifest successfully generated');
    });

    delete manifest.assets;
    delete manifest.searchPaths;
    fs.writeFile(destVersion, JSON.stringify(manifest), (err) => {
    if (err) throw err;
    console.log('Version successfully generated');
    });

    mkdirSync(path.join(destFileDir, 'src'));
    mkdirSync(path.join(destFileDir, 'assets'));
    copyFileDir(path.join(src, 'src'), path.join(destFileDir, 'src'));
    copyFileDir(path.join(src, 'assets'), path.join(destFileDir, 'assets'));
};

doWork();
