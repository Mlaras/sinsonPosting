import {} from 'dotenv/config';
import { IgApiClient } from 'instagram-private-api';
import { promises as fs } from 'fs';
import * as path from 'path';
import { CronJob } from 'cron';
import frameScrapper from './scrapper';
var cronJob: CronJob;

cronJob = new CronJob('1 7,9,11,13,14,16,19,20,21,22,23 * * *', async () => {
  const scrapper = await new frameScrapper();
  try {
    const postDescription = await scrapper.getRandomFrame();
    
    const ig = new IgApiClient();
    ig.state.generateDevice(process.env.IG_USERNAME!);
    await ig.account.login(process.env.IG_USERNAME!, process.env.IG_PASSWORD!);

    // This is the part where I read the folder's files and return the first one.
    const folderChildren = await fs.readdir('to-post');
    const sinsonPostPath = folderChildren.pop();
    const full_path = 'to-post/' + sinsonPostPath;
    if (full_path != undefined) {
      const promise = fs.readFile(path.join(full_path));
      Promise.resolve(promise).then(async function(imageBuffer) {
        var oldPath = full_path;
        var newPath = 'posted/' + sinsonPostPath;
        fs.rename(oldPath, newPath);

        await ig.publish.photo({
          file: imageBuffer, // image buffer, you also can specify image from your disk using fs
          caption: postDescription, // nice caption (optional)
        });
      });
    }
  } catch (error) {}
});
cronJob.start();
