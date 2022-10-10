import { f_generate_audio } from "./f_generate_audio.module.js";
import { f_generate_image } from "./f_generate_image.module.js"; 
import { f_generate_image_with_text } from "./f_generate_image_with_text.module.js"; 
import { s_story_hansel_und_gretel } from "./s_story.module.js";
import { f_o_command } from "./O_command.module.js";
import { o_prompt_string_functions } from "./o_prompt_string_functions.module.js";


import * as fs from "https://deno.land/std@0.159.0/fs/mod.ts";
import { O_json_db } from "http://deno.land/x/o_json_db@4.0/O_json_db.module.js"
import { f_generate_video } from "./f_generate_video.module.js";

var o_json_db = new O_json_db();


var f_o_files_info = async function(
    s_text, 
){

    // var n_seed = f_n_seed(s_text);
    var n_seed = Math.random()*10000;

    var a_o_files_info_from_db = await o_json_db.f_a_o_read(
        O_files_info, 
        function(o){
            return o.s_text == s_text
        }
    );
    var o_files_info = a_o_files_info_from_db[0];
    if(o_files_info == undefined){
        var o_files_info = new O_files_info(
            o_story.n_id,
            s_text, 
            n_seed,
            "",
            "", 
            "",
            ""
        )
        var o_files_info = (await o_json_db.f_a_o_create(O_files_info, o_files_info))[0]
    }

    
    o_files_info.s_path_file_image = `${o_story.s_path_folder}/n_o_files_info_n_id_${o_files_info.n_id}.png`

    await f_generate_image(
        s_text,
        n_seed, 
        `${o_story.s_path_folder}/n_o_files_info_n_id_${o_files_info.n_id}.png`
    )

    o_files_info.s_path_file_image_with_text = await f_generate_image_with_text(
        s_text, 
        o_files_info.s_path_file_image,
        `${o_story.s_path_folder}/n_o_files_info_n_id_${o_files_info.n_id}_overlayed_text.jpg`
    )


    o_files_info.s_path_file_audio = await f_generate_audio(
        s_text, 
        `${o_story.s_path_folder}/n_o_files_info_n_id_${o_files_info.n_id}.wav`
    );

    o_files_info.s_path_file_video = await f_generate_video(
        o_files_info.s_path_file_image, 
        o_files_info.s_path_file_audio, 
        `${o_story.s_path_folder}/n_o_files_info_n_id_${o_files_info.n_id}.mp4`
    );

    await o_json_db.f_a_o_update(
        O_files_info, 
        function(o){// filter function
            return o.n_id == o_story.n_id
        }, 
        function(o){// update function
            o = o_story
        }
    )

    a_o_files_info.push(o_files_info);

}

export { f_o_files_info }