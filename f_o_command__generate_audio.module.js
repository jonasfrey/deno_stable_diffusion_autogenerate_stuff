var f_o_command__generate_audio = async function(
    s_text, 
    s_path_audio
){

    // http://localhost:5500/api/tts?voice=coqui-tts%3Aen_ljspeech&lang=en&vocoder=high&denoiserStrength=0.005&text=this%20is%20a%20test%202&speakerId=&ssml=false&ssmlNumbers=true&ssmlDates=true&ssmlCurrency=true&cache=false
    var s_url = 
    `
    http://localhost:5500/api/tts
    ?voice=coqui-tts%3Aen_ljspeech
    &lang=en
    &vocoder=high
    &denoiserStrength=0.005
    &text=${s_text}
    &speakerId=
    &ssml=false
    &ssmlNumbers=true
    &ssmlDates=true
    &ssmlCurrency=true
    &cache=false`
    s_url = (s_url.split("\n").map(s=>s.trim()).join(""));
    // console.log(s_url)
    try{
        var o_resp = await fetch(s_url)

        await Deno.writeFile(
                s_path_audio,
                await o_resp.arrayBuffer(),
                { mode: 0o644 }
            );
        console.log(`${s_path_audio}: has been written`)
            
    }catch(e){
        var s_error = `
        error: ${e}, 
        make sure the 'opentts' server is running and reachable, do: 'cd {tilde}/code/opentts/ && sudo docker run -it -p 5500:5500 synesthesiam/opentts:en
        `
        throw new Error(s_error)
    }
    
    return Promise.resolve(s_path_audio)    

}


export {f_o_command__generate_audio}