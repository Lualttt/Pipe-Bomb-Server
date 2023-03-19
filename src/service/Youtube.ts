import YTSR from "ytsr";
import YTDL from "ytdl-core"
import YTS from "yt-search";

import Track from "../music/Track.js";
import Exception from "../response/Exception.js";
import StreamingService from "./StreamingService.js";
import APIResponse from "../response/APIRespose.js";

export default class Youtube extends StreamingService {
    constructor() {
        super("Youtube", "yt");
    }

    public async search(query: string, page?: number): Promise<Track[]> {
        try {
            const results = await YTSR(query);

            const out: Track[] = [];
            
            results.items.forEach(data => {
                if (data.type == "video") {
                    out.push(new Track(`yt-${data.id}`, {
                        title: data.title,
                        artists: [data.author.name],
                        image: data.thumbnails[0].url
                    }));
                }
            });
            return out;
        } catch (e) {
            throw new Exception(e);
        }
    }

    public async getAudio(trackID: string): Promise<any> {
        trackID = this.convertTrackIDToLocal(trackID);

        try {
            return YTDL("https://www.youtube.com/watch?v=" + trackID, {
                filter: "audioonly",
                quality: "highestaudio"
            });
        } catch (e) {
            throw new APIResponse(400, `Invalid track ID '${trackID}'`);
        }
    }

    public async getTrack(trackID: string): Promise<Track> {
        trackID = this.convertTrackIDToLocal(trackID);

        try {
            const data = await YTDL.getInfo("https://www.youtube.com/watch?v=" + trackID);

            let thumbnail = data.thumbnail_url || null;
            if (!thumbnail && data.videoDetails.thumbnails.length) {
                thumbnail = data.videoDetails.thumbnails[0].url;
            }
            return new Track(`yt-${trackID}`, {
                title: data.videoDetails.title,
                artists: [data.videoDetails.author.name],
                image: thumbnail
            });
        } catch (e) {
            throw new Exception(e);
        }
    }

    public async getSuggestedTracks(track: Track): Promise<Track[]> {
        return []; // TODO: implement
    }
}