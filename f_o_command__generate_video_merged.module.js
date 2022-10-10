import { O_command, f_o_command } from "./O_command.module.js";

var f_o_command__generate_video_merged = async function(
    a_s_path_video,
    s_path_video_merged
){

    // console.log(s_path_video_merged)
    // Deno.exit(1)

    for(var s_path_video of a_s_path_video){
        try{
            var o_stat = await Deno.stat(s_path_video);
        }catch(e){
            var s_error = `${s_path_video}: required file is not existing`
            throw new Error(s_error)
        }
    }


    var s_path_file_text_tmp = `./f_o_command__generate_video_merged_input_list_for_ffmpeg_tmp.txt`
    await Deno.writeTextFile(
        s_path_file_text_tmp, 
        `${a_s_path_video.map(s=>`file '${s}'`).join("\n")}`
    )
    
    // console.log(s_path_video_merged)
    // Deno.exit(1)

    var a_s_arg = [
        // "./mp4_merge-linux64",
        // ...a_s_path_video,
        // "--out",
        // `${s_path_video_merged}`
        "ffmpeg",
        "-y",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        s_path_file_text_tmp,
        "-c",
        "copy",
        s_path_video_merged
    ]

    var o_command = await f_o_command(a_s_arg);
    console.log(o_command)
    Deno.exit(1)
    return Promise.resolve(o_command)

}

export {
    f_o_command__generate_video_merged
}