import {features, DashBoardState,
    RecommendationInterface, 
    ValenceCount, 
    FeatureScoresInterface, 
    TrackInterface, 
    TrackFeatureInterface, 
    TrackState, RecommendationState} from './types/dashboard'

function cleanTracksInterface(returnedItems: object[]) {
    const result: TrackInterface[] = [];
    returnedItems.forEach((item: any) => {
        const track: TrackInterface = {
            name: item.name,
            image: '',
            id: item.id, 
            artistID: item.artists[0].id,
            artists : '',
            danceability: 0,
            energy: 0,
            speechiness: 0,
            valence: 0
        }
        track.artists = item.artists.map((a:any) => a.name).toString()
        track.image = item.album.images[2].url
        result.push(track)
    });
    return result;
}

function getFeatures(trackList: TrackInterface[], responseList: TrackFeatureInterface[]) {
    const combinedFeatureScore : FeatureScoresInterface = {
        danceability: 0,
        energy: 0,
        speechiness: 0,
        valence: 0
    }
    let valenceCount : ValenceCount[] = [];
    const high: ValenceCount = {
        label: 'Super Happy',
        value: 0
    }
    const highMid: ValenceCount = {
        label: 'Happy',
        value: 0
    }
    const low: ValenceCount = {
        label: 'Depressed',
        value: 0
    }
    const lowMid: ValenceCount = {
        label: 'Sad',
        value: 0
    }
    responseList.map((respFeat) => {
        const track = trackList.find(i => i.id === respFeat.id);
        if (track) {
            features.forEach((feature: string)=> {
                track[feature] = respFeat[feature as keyof TrackFeatureInterface] ;
                combinedFeatureScore[feature as keyof FeatureScoresInterface] = 
                combinedFeatureScore[feature  as keyof FeatureScoresInterface] + respFeat[feature];
                if (feature === 'valence') {
                    if (track["valence"] <= 0.25) {
                       low['value'] += 1;
                    } else if (track["valence"] <= 0.5) {
                        lowMid['value'] += 1;
                    } else if (track["valence"] <= 0.75) {
                        highMid['value'] += 1;
                    } else {
                        high['value'] += 1;
                    }
                }
            })
        }
    })
    valenceCount = [...[low, lowMid, highMid, high]]
    Object.keys(combinedFeatureScore).map((key: string)=> {
        const average = (combinedFeatureScore[key as keyof FeatureScoresInterface]/50)*100
        combinedFeatureScore[key as keyof FeatureScoresInterface] = average;
    })
    return {'trackList': trackList, 'combinedFeature': combinedFeatureScore, 'count': valenceCount};
}


export async function getTop50Tracks(accessToken: string) {
    //get the topplaylist using the accesstoken
    const resp : TrackState = {
        status: false,
        data: []
    }
    const request = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50", {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${accessToken}`,
        },
      });
    
    if (!request.ok) {
        return resp;
    } 
    const data = await request.json();
    resp.status = true;
    resp.data = cleanTracksInterface(data.items);
    return resp;
}

 export async function getMood(accessToken: string) {
    const state : DashBoardState = {
        trackState: {
            status: false,
            data: []
        },
        featureResults: {
            status: false,
            data: {
                danceability: 0,
                energy: 0,
                speechiness: 0,
                valence: 0
            },
            count: []
        }
    }
    const top50 = await getTop50Tracks(accessToken);
    state.trackState = top50;
    if (state.trackState.status) {
        const trackIds = state.trackState.data.map((a:any) => a.id).toString()
    
        const request = await fetch("https://api.spotify.com/v1/audio-features?"+ 
        new URLSearchParams({ids: trackIds}), {
            method: "GET",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${accessToken}`,
            },
          });
        
        if (!request.ok) {
            return state;
        } 
        const data = await request.json();
        state.featureResults.status = true;
        const result = getFeatures(top50.data, data.audio_features);
        state.trackState.data = result['trackList'];
        state.featureResults.data = result['combinedFeature'];
        state.featureResults.count = result['count']
    } 
    return state;
}
function cleanRecommendationsTrack(returnedItems:  object[]) {
    const result: RecommendationInterface[] = [];
    returnedItems.forEach((item: any) => {
        const track: RecommendationInterface = {
            name: item.name,
            id: item.id, 
            artists : '',
            image: {
                height: 0,
                url: '',
                width: 0
            }
        }
        track.artists = item.artists.map((a:any) => a.name).toString()
        track.image = item.album.images[2]
        result.push(track)
    });
    return result;

}

export async function getRecommendations(accessToken: string, trackIds:  TrackInterface[]) {
    const random = Math.floor(Math.random() * 5)
    let timer = 0;
    const result: RecommendationState = {
        recommendedState: [],
        timer: timer
    }
    const trackString = trackIds.sort(() => Math.random() - 0.5).splice(0, (5-random)).map((a:any) => a.id).toString();
    const artistString = trackIds.sort(() => Math.random() - 0.5).splice(0, random).map((a:any) => a.artistID).toString();
    const request = await fetch("https://api.spotify.com/v1/recommendations?"+ 
    new URLSearchParams({
        seed_tracks: trackString,
        seed_artists: artistString,
    }), {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${accessToken}`,
        },
        next: {
            revalidate: 5000
        }
      });
    if (!request.ok) {
        console.log('something went wrong')
        if (request.status === 429) {
            console.log(request.headers.get('retry-after'))
            console.log("too many request")
            result.timer = Number(request.headers.get('retry-after'));
        }
        return result;
    } 
    
    const data = await request.json();
    console.log(data)
    result.recommendedState = cleanRecommendationsTrack(data.tracks);
    return result; 
}

export async function setClient(device_id: string, access_token: string) {
    const request = await fetch('https://api.spotify.com/v1/me/player', {
        method: "PUT",
        body: JSON.stringify({
            device_ids: [device_id]
        }),
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
    })
    if (!request.ok) {
        console.log('something went wrong')
        return false;
    } 
    const result = await request.status;
    console.log(result)
    return true;
}

export async function callPlay(device_id: string, access_token: string, trackId: string){
    const client = await setClient(device_id, access_token);
    if (!client) {
        console.log('client cant set');
        return false
    }
    const context = "spotify:track:"+ trackId;
    console.log(context)
    const request = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
        method: "PUT",
        body: JSON.stringify({ 
            uris: [context]
            }),
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      
      if (!request.ok) {
        console.log('something went wrong')
        console.log(request)
        return false;
    } 
    const result = await request.status;
    console.log(result)
    return true;
}
