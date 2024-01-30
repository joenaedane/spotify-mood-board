export interface DashBoardState {
    trackState: TrackState
    featureResults : FeatureState
}

export interface TrackInterface {
    name: string,
    id: string,
    image: string,
    artistID: string,
    artists: string,
    danceability: number,
    energy: number,
    speechiness: number,
    valence: number
}

export interface TrackState {
    status: boolean
    data: TrackInterface[]
}

export interface TrackFeatureInterface {
    id: string,
    danceability: number,
    energy: number,
    speechiness: number,
    valence: number
}

export interface ValenceCount {
    value: number, 
    label: string
}

export interface FeatureScoresInterface {
    danceability: number,
    energy: number,
    speechiness: number,
    valence: number
}

export interface FeatureState {
    status: boolean
    data: FeatureScoresInterface
    count: ValenceCount[]
}

export interface RecommendImg {
    height: number, 
    url: string,
    width: number
}

export interface RecommendationInterface {
    name: string,
    id: string,
    artists: string,
    image: RecommendImg,

}

export interface RecommendationState {
    recommendedState: RecommendationInterface[],
    timer: number
}

export const features: string[] = ['danceability', 'energy', 'valence'];