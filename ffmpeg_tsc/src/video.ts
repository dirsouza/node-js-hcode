import { readdirSync } from "fs";
import { spawn } from "child_process";
import { TVideos } from "./type";

export class Video {
  private _videos: TVideos[] = [];

  constructor() {
    readdirSync(`${__dirname}/videos/original`).forEach(file => {
      let i: number = file.lastIndexOf(".");
      let name: string = file.substr(0, i);
      let extension: string = file.substr(i + 1);

      this._videos.push({
        name,
        extension
      });
    });
  }

  get videos() {
    return this._videos.reverse();
  }

  public resize(name: string, extension: string, quality: number) {
    return new Promise((resolve: any, reject: any) => {
      const ffmpeg = spawn(`${__dirname}/ffmpeg_exec/ffmpeg`, [
        "-i",
        `${__dirname}/videos/original/${name}.${extension}`,
        "-codec:v",
        "libx264",
        "-profile:v",
        "main",
        "-preset",
        "slow",
        "-b:v",
        "400k",
        "-maxrate",
        "400k",
        "-bufsize",
        "800k",
        "-vf",
        `scale=-2:${quality}`,
        "-threads",
        "0",
        "-b:a",
        "128k",
        `${__dirname}/videos/converted/${name}_${quality}.${extension}`
      ]);

      ffmpeg.stderr.on("data", data => reject(data));
      ffmpeg.on("close", code => resolve(code));
    });
  }
}
