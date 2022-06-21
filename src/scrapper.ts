import axios from 'axios';
import fetch from 'node-fetch';
import * as fs from 'fs';

class frameScrapper {
  private juicyPostDescription: string = 'sdf';
  constructor() {}

  public async getRandomFrame(): Promise<string> {
    await axios
      .get('https://frinkiac.com/api/random')
      .then(async (res: any) => {
        const Episode = res.data.Frame.Episode;
        const Timestamp = res.data.Frame.Timestamp;
        const Title = res.data.Episode.Title;
        var subs: string = '';
        if (res.data.Subtitles != undefined)
          res.data.Subtitles.forEach((sub: { Content: any; }) => {
            subs += `\n${sub.Content}`;
          });
        this.juicyPostDescription = `${Title}. ${Episode}\n\nSubtitles: ${subs}\n#sinsonposting`;
        const imgUrl = `https://frinkiac.com/img/${Episode}/${Timestamp}.jpg`;
        await fetch(imgUrl).then(res => {
          if (res) res.body!.pipe(fs.createWriteStream(`./to-post/${Episode}-${Timestamp}.jpg`));
        });
      })
      .catch((error: any) => {
        console.log(error);
      });

    return this.juicyPostDescription;
  }
}

export default frameScrapper;
