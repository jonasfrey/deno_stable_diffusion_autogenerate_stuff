import {s_story_common_passwords_hashed_md5} from "./s_story.module.js"
import { f_s_prompt_encoded, f_s_prompt_decoded } from "./f_s_prompt_encoded.module.js";



var a_s = s_story_common_passwords_hashed_md5
            .split("\n")
            .filter(s=>s!="");


var s_path_story = ``
try{
    await Deno.mkdir();
}catch(o_e){
    console.log(o_e)
}
for(var a_s of s){

    var s_file_name = s.replaceAll (" ","_");
    var s_path = `./outputs/txt2img-samples/${s_file_name}`
    var s_path_new = `./outputs/txt2img-samples/${f_s_prompt_encoded(s_sentence)}`

    try{
        var o_stat = await Deno.stat(s_path);
        console.log(o_stat)
        try{
            Deno.rename(s_path, s_path_new)
        }catch(e){
            console.log(e)
        }
    }catch(e){
        console.log(e)
    }

    
}