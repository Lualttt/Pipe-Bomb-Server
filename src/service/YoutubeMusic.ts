import * as YTM from "node-youtube-music";
import YTDL from "ytdl-core";
import Exception from "../response/Exception.js";

import Track from "../music/Track.js";
import StreamingService from "./StreamingService.js";
import APIResponse from "../response/APIRespose.js";
import ServiceManager from "./ServiceManager.js";
import StreamInfo from "./StreamInfo.js";

export default class YoutubeMusic extends StreamingService {
    constructor() {
        super("Youtube Music", "ym");
    }

    public async search(query: string, page?: number): Promise<Track[]> {
        try {
            const results = await YTM.searchMusics(query);
            const out: Track[] = [];

            results.forEach(data => {
                const artists: string[] = [];
                data.artists.forEach(artist => {
                    artists.push(artist.name);
                });

                out.push(new Track(`ym-${data.youtubeId}`, {
                    title: data.title,
                    artists,
                    image: data.thumbnailUrl || null
                }));
            });
            return out;
        } catch (e) {
            throw new Exception(e);
        }
    }

    public getAudio(trackID: string): Promise<StreamInfo> {
        trackID = this.convertTrackIDToLocal(trackID);

        return ServiceManager.getInstance().getService("Youtube").getAudio(trackID);
    }

    public async getTrack(trackID: string): Promise<Track> {
        trackID = this.convertTrackIDToLocal(trackID);

        return ServiceManager.getInstance().getService("Youtube").getTrack(trackID);
    }

    public async getSuggestedTracks(track: Track): Promise<Track[]> {
        const trackID = this.convertTrackIDToLocal(track.trackID);

        try {
            const results = await YTM.getSuggestions(trackID);

            const out: Track[] = [];

            results.forEach(data => {
                const artists: string[] = [];
                data.artists.forEach(artist => {
                    artists.push(artist.name);
                });

                out.push(new Track(`ym-${data.youtubeId}`, {
                    title: data.title,
                    artists,
                    image: data.thumbnailUrl || null
                }));
            });

            return out;
        } catch (e) {
            throw new Exception(e);
        }
    }
}