import express, {Application, Request, Response, NextFunction} from 'express';
import fs, {Stats} from 'fs';
import torrentStream from 'torrent-stream';

const app: Application = express();

app.get('/', (req: Request, res: Response) => {
	const path: string = "./assets/noice.mp4";
	const stat: Stats = fs.statSync(path);
	console.log(stat);
	const fileSize: number = stat.size;
	const range: string | undefined = req.headers.range;
	console.log(req.headers);
	if (range) {
		console.log('here--------------------------------------');
		const parts = range.replace(/bytes=/, "").split("-");
		const start = parseInt(parts[0], 10);
		const end = parts[1]
			? parseInt(parts[1], 10)
			: fileSize -1;
		const chunkSize = end -start + 1;
		const file = fs.createReadStream(path, {start, end});
		const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
		}
		res.writeHead(206, head);
		file.pipe(res);
	} else {
		console.log('herexxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
		const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
		}
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
	}
})

app.get('/downloadtest', (req: Request, res: Response) => {
	var engine = torrentStream('magnet:?xt=urn:btih:3652db1afbc5d414dbcaf5920f741ff93b1ed9e5&dn=night%5Fof%5Fthe%5Fliving%5Fdead&tr=http%3A%2F%2Fbt1.archive.org%3A6969%2Fannounce&tr=http%3A%2F%2Fbt2.archive.org%3A6969%2Fannounce&ws=http%3A%2F%2Farchive.org%2Fdownload%2F&ws=http%3A%2F%2Fia600301.us.archive.org%2F22%2Fitems%2F&ws=http%3A%2F%2Fia700301.us.archive.org%2F22%2Fitems%2F');
	
	engine.on('ready', function() {
			engine.files.forEach(function(file) {
					console.log('filename:', file.name);
					if (file.name == 'night_of_the_living_dead.mp4') {
						console.log('herexxxxxxxxxxxxxxxxxxxxx');
						var stream = file.createReadStream();
						let save = fs.createWriteStream("nightofthelivingdead.mp4");
						stream.pipe(res);
						stream.pipe(save);
					}
			});
	});
})

app.listen(5000);