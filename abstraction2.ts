//abstraction



abstract class MediaPlayer{
    protected playerName: string;

    constructor(playerName: string)
    {
        this.playerName = playerName
    }

    abstract play(): void;
    abstract pause(): void;
    abstract stop(): void;

    displayStatus(): boolean
    {
        console.log(`${this.playerName} is ready to use`)
        return true
    }

    logAction(action : string)
    {
        console.log(`${this.playerName} is going under ${action}`)
    }

}

class AudioPlayer extends MediaPlayer{

    private audioFile : string

    constructor(audioFile: string)
    {
        // need to find super keyword
        super("AudioPlayer")
        this.audioFile = audioFile
    }

    play(){
        console.log(`playing ${this.audioFile} on audioplayer`)
        
    }
    pause()
    {
        console.log(`paused ${this.audioFile} in audioplayer`)
    }
    stop()
    {
        console.log(`stopped ${this.audioFile} in audioplayer`)
    }

}

class VideoPlayer extends MediaPlayer{
    private videoFile: string
    private resolution: string

    constructor(videoFile: string , resolution: string)
    {
        super("video player")
        this.videoFile = videoFile
        this.resolution = resolution
    }

    play(){
        console.log(`playing ${this.videoFile} on video player at ${this.resolution}` )
        
    }
    pause()
    {
        console.log(`paused ${this.videoFile} in video player`)
    }
    stop()
    {
        console.log(`stopped ${this.videoFile} in video player`)
    }

}

class StreamingPlayer extends MediaPlayer{
    private streamUrl: string
    private bufferSize: number;


    constructor(streamUrl: string, bufferSize: number)
    {
        super("Stream Player")
        this.streamUrl = streamUrl;
        this.bufferSize = bufferSize
    }

    play(){
        console.log(`playing ${this.streamUrl} on stream player at ${this.bufferSize} kb` )
    }
    pause()
    {
        console.log(`paused ${this.streamUrl} in stream player`)
    }
    stop()
    {
        console.log(`stopped ${this.streamUrl} in stream player`)
    }

}

class playerController{
    private player: MediaPlayer

    constructor(player: MediaPlayer)
    {
        this.player = player
    }

    startPlayer()
    {
        this.player.displayStatus()
        this.player.play()
        // console.log(`Player Started`)
    }

    stopPlayer()
    {
        this.player.stop()
    }
    
    pausePlayer(){
        this.player.pause()
    }

}

// const audioPlayer = new AudioPlayer("Hymn for the weekend.mp3")
// const audioController = new playerController(audioPlayer)

// audioController.startPlayer()
// audioController.pausePlayer()
// audioController.stopPlayer()

const videoPlayer = new VideoPlayer("EndGame.mp4", "4k")
const videoController = new playerController(videoPlayer)

videoController.startPlayer()
videoController.pausePlayer()

console.log()

const streamCtrl = new playerController(
    new StreamingPlayer("https://stream.example.com/live", 2048));
streamCtrl.startPlayer();
streamCtrl.stopPlayer();