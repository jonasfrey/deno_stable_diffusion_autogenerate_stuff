import { O_command, f_o_command } from "./O_command.module.js";

var f_o_command__generate_video = async function(
    s_path_image, 
    s_path_audio, 
    s_path_video
){

    try{
        var o_stat = await Deno.stat(s_path_image);
    }catch(e){
        var s_error = `${s_path_image}: required file is not existing`
        throw new Error(s_error)
    }
    try{
        var o_stat = await Deno.stat(s_path_audio);
    }catch(e){
        var s_error = `${s_path_audio}: required file is not existing`
        throw new Error(s_error)
    }

    var a_s_arg = [

        // "ffmpeg",
        // "-y",
        // "-loop",
        // "1",
        // "-i",
        // s_path_image,
        // "-i",
        // s_path_audio,
        // "",
        // "-c:a",
        // "aac",
        // "-b:a",
        // "192k",
        // "-pix_fmt",
        // "yuv420p",
        // "-shortest",
        // s_path_video

        "ffmpeg",
        "-y",
        "-loop",
        "1",
        "-i",
        s_path_image,
        "-i",
        s_path_audio,
        "-shortest",
        "-c:a",
        "aac",
        "-b",
        "5000k",
        s_path_video

    ]

    var o_command = await f_o_command(a_s_arg);
    console.log(o_command)
    return Promise.resolve(o_command)


}

export {
    f_o_command__generate_video
}