import { f_o_command__generate_audio } from "./f_o_command__generate_audio.module.js";
import { f_o_command__generate_image } from "./f_o_command__generate_image.module.js"; 
import { f_o_command__generate_image_with_text } from "./f_o_command__generate_image_with_text.module.js"; 
import { f_o_command__generate_video } from "./f_o_command__generate_video.module.js";
import { 
    s_story_hansel_und_gretel,
    s_story_common_passwords_hashed_md5,
    s_story_wikipedia_machine_learning,
    s_story_unusual_words,
    s_story_movie_quotes
} from "./s_story.module.js";
import { f_o_command } from "./O_command.module.js";
import { o_prompt_string_functions } from "./o_prompt_string_functions.module.js";


import * as fs from "https://deno.land/std@0.159.0/fs/mod.ts";
import { O_json_db } from "http://deno.land/x/o_json_db@4.0/O_json_db.module.js"
import { f_o_command__generate_video_merged } from "./f_o_command__generate_video_merged.module.js";

var o_json_db = new O_json_db();

var f_a_s_sentence = function (
    s_story
){
    
    // replacing the special quotes
    // U+0022	QUOTATION MARK	" 	neutral (vertical), used as opening or closing quotation mark; preferred characters in English for paired quotation marks are U+201C and U+201D
    // U+0027	APOSTROPHE	' 	neutral (vertical) glyph having mixed usage; preferred character for apostrophe is U+2019; preferred characters in English for paired quotation marks are U+2018 and U+2019
    // U+0060	GRAVE ACCENT	` 	 
    // U+00B4	ACUTE ACCENT	´ 	 
    // U+2018	LEFT SINGLE QUOTATION MARK	‘ 	 
    // U+2019	RIGHT SINGLE QUOTATION MARK	’ 	this is the preferred character to use for apostrophe
    // U+201C	LEFT DOUBLE QUOTATION MARK	“ 	 
    // U+201D	RIGHT DOUBLE QUOTATION MARK	” 	  

    s_story = s_story.replaceAll("´", "\"");
    s_story = s_story.replaceAll("‘", "\"");
    s_story = s_story.replaceAll("’", "\"");
    s_story = s_story.replaceAll("“", "\"");
    s_story = s_story.replaceAll("”", "\"");


    var a_s_paragraph = s_story.split("\n");
    // var o_end_of_sentance_regex = new RegExp("[\\?\\!.]", "g"); // fuck regex man 
    var a_s_sentence = []

    var a_s_paragraph_filtered = a_s_paragraph.filter(s=>s.trim()!= "");
    
    var a_s_sentence_end_mark = [".", "?", "!"];

    for(var s_paragraph of a_s_paragraph_filtered){
        var n_index_char = 0;
        var n_index_substring_start = 0;
        var o_char_count = {
            // "'": 0,  // single quotes are used in words like "Don't" 
            "\"": 0
        };
        var b_skip = false;
        while(n_index_char < s_paragraph.length){
            var b_skip = false;

            var s_char = s_paragraph[n_index_char];
            if(!o_char_count[s_char]){
                o_char_count[s_char] = 0;
            }
            o_char_count[s_char]+=1;
            // console.log(`o_char_count["\""]`)
            // console.log(o_char_count["\""])
            // console.log(`o_char_count["'"]`)
            // console.log(o_char_count["'"])
            // console.log("s_char")
            // console.log(s_char)
            if(
                o_char_count["\""] % 2 != 0
                // ||
                // o_char_count["'"] % 2 != 0 single quotes are used in words like "Don't" 
            ){
                b_skip = true;
            }
            
            if(!b_skip){
                if(a_s_sentence_end_mark.indexOf(s_char) != -1){
                    a_s_sentence.push(s_paragraph.substring(n_index_substring_start, n_index_char+1).trim()); 
                    // console.log(s_paragraph.substring(n_index_substring_start, n_index_char+1))
                    // Deno.exit(0)
                    n_index_substring_start = n_index_char+1;
                }
            }
            n_index_char+=1;
        }
        a_s_sentence.push(s_paragraph.substring(n_index_substring_start, n_index_char+1).trim()); 

    }
    
    // var a_s_sentence = a_s_paragraph.join(" ").split(o_end_of_sentance_regex).map(s=>s.trim());
    // console.log(a_s_sentence)
    
    return a_s_sentence.filter(s=>s.trim()!="")

}

var f_n_seed = function(
    s_prompt
){
    // "Hello" => as bytes  [ 72, 101, 108, 108, 111 ] => as sum 500 , use that sum as the seed
    var a_n_byte = new TextEncoder().encode(s_prompt);
    // console.log(a_n_byte)
    var n_sum = a_n_byte.reduce((n_sum, n)=>n_sum+n)
    // console.log(n_sum)
    return n_sum;
}





var f_o_text_image_audio_video = async function(
    o_image_audio_text
){
    // console.log(o_image_audio_text);
    var s_path_video = `${f_s_file_name_without_special_chars(o_image_audio_text.s_text.split(" ").join("_"))}.mp4`;

    try{ 
        var o_stat = await Deno.stat(s_path_video);
        if(o_stat.isFile){
            console.log(`${s_path_video}; file already existing`)
        }
    }catch{
        var a_s_arg = [
    
            "ffmpeg",
            "-y",
            "-loop",
            "1",
            "-i",
            // "./outputs/txt2img-samples/He_lived_deep_in_the_forest_with_his_wife./seed_3811_00000.png",
            `${o_image_audio_text.s_path_image}`,
            "-i",
            `${o_image_audio_text.s_path_audio}`,
            // "./He_lived_deep_in_the_forest_with_his_wife..wav",
            "-c:v",
            "libx264",
            "-tune",
            "stillimage",
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            "-pix_fmt",
            "yuv420p",
            "-shortest",
            // "out.mp4",
            s_path_video
        ]
    
        var o_command = await f_o_command(a_s_arg);
        // console.log(`${s_path_video}; has been written!`)
        console.log(`${s_path_video}: file has been written!`);
    }
    // console.log(o_command);
    var o_image_audio_text_video = new O_text_image_audio_video(
        o_image_audio_text.s_text, 
        o_prompt_string_functions.f_s_encoded(o_image_audio_text.s_text),
        o_image_audio_text.s_path_image, 
        o_image_audio_text.s_path_audio, 
        s_path_video
    )
    
    return o_image_audio_text_video;
}


class O_files_info{
    constructor(
        n_o_story_n_id, 
        s_text, 
        n_seed, 
        s_path_file_image,
        s_path_file_image_with_text,
        s_path_file_audio,
        s_path_file_video,
    ){
        this.n_id = null
        this.n_o_story_n_id = n_o_story_n_id
        this.s_text = s_text
        this.n_seed = n_seed
        this.s_path_file_image = s_path_file_image
        this.s_path_file_image_with_text = s_path_file_image_with_text
        this.s_path_file_audio = s_path_file_audio
        this.s_path_file_video = s_path_file_video
    }
}
class O_story{
    constructor(
        s_story,
        s_title, 
        s_path_folder, 
        s_path_file_video
    ){
        this.n_id = null
        this.s_story = s_story
        this.s_title = s_title
        this.s_path_folder = s_path_folder, 
        this.s_path_file_video = s_path_file_video
    }
}


var f_o_story = async function(
    s_title_story,
    s_text_story, 
    f_n_seed__callback = null, 
    f_callback_to_copy_old_files = null
){

    var b_overwrite_file_image_with_text = prompt("re-generate overwrite existing files(image_with_text) ? [(y)es/(n)o]").toLowerCase() == "y"
    var b_overwrite_file_audio = prompt("re-generate overwrite existing files(audio) ? [(y)es/(n)o]").toLowerCase() == "y"
    var b_overwrite_file_video = prompt("re-generate overwrite existing files(video) ? [(y)es/(n)o]").toLowerCase() == "y"

    var a_o_story_from_db = await o_json_db.f_a_o_read(
        O_story, 
        function(o){
            return o.s_title == s_title_story
        }
    );

    var o_story = a_o_story_from_db[0];


    if(o_story == undefined){
        var o_story = new O_story(
            s_text_story,
            s_title_story,
            `${import.meta.url.split("//").pop().split("/").slice(0,-1).join("/")}/o_story_${s_title_story}`, 
            ''
        )
        var o_story = (await o_json_db.f_a_o_create(O_story, o_story))[0]
    }

    await fs.ensureDir(
        o_story.s_path_folder
    )

    var a_s_sentence = f_a_s_sentence(s_text_story);
    // console.log(a_s_sentence)
    // await Deno.writeTextFile("./a_s_sentence.json", JSON.stringify(a_s_sentence));
    // console.log(a_s_sentence)
    // Deno.exit(1)

    var a_o_files_info = [];


    for(var s_sentence of a_s_sentence){

        if(f_n_seed__callback != null){
            var n_seed = f_n_seed__callback(s_sentence)
        }else{
            var n_seed = f_n_seed(s_sentence)
        }
        
        // console.log("s_sentence------------------")
        // console.log(s_sentence)
        var a_o_files_info_from_db = await o_json_db.f_a_o_read(
            O_files_info, 
            function(o){
                return o.s_text == s_sentence
            }
        );
        var o_files_info = a_o_files_info_from_db[0];
        if(o_files_info == undefined){
            var o_files_info = new O_files_info(
                o_story.n_id,
                s_sentence, 
                n_seed,
                "",
                "", 
                "",
                ""
            )
            var o_files_info = (await o_json_db.f_a_o_create(O_files_info, o_files_info))[0]
        }


        o_files_info.s_path_file_image = `${o_story.s_path_folder}/n_o_files_info_n_id_${o_files_info.n_id}.png`

        if(f_callback_to_copy_old_files != null){
            await f_callback_to_copy_old_files(
                o_story, 
                o_files_info
            )
        }

        try{
            var o_stat = await Deno.stat(o_files_info.s_path_file_image)
            // var b_overwrite = prompt("file already existing, overwrite ? [(y)es/(n)o]").toLowerCase == "y"
        }catch(e){
            console.log(`${o_files_info.s_path_file_image}: file not existing yet`)
        
            var o_command = await f_o_command__generate_image(
                s_sentence,
                n_seed, 
                o_files_info.s_path_file_image
            )
        }
        o_files_info.s_path_file_image_with_text = `${o_story.s_path_folder}/n_o_files_info_n_id_${o_files_info.n_id}_overlayed_text.png`
        

        
        try{
            var o_stat = await Deno.stat(o_files_info.s_path_file_image_with_text)
            // var b_overwrite = prompt("file already existing, overwrite ? [(y)es/(n)o]").toLowerCase == "y"
            if(b_overwrite_file_image_with_text){

                var o_command = await f_o_command__generate_image_with_text(
                    s_sentence,
                    o_files_info.s_path_file_image, 
                    o_files_info.s_path_file_image_with_text,
                    )
            }
        }catch(e){
            console.log(`${o_files_info.s_path_file_image_with_text}: file not existing yet`)

    
            var o_command = await f_o_command__generate_image_with_text(
                s_sentence,
                o_files_info.s_path_file_image, 
                o_files_info.s_path_file_image_with_text,
            )
        }
        o_files_info.s_path_file_audio = `${o_story.s_path_folder}/n_o_files_info_n_id_${o_files_info.n_id}.wav`
        
        try{
            var o_stat = await Deno.stat(o_files_info.s_path_file_audio)
            // var b_overwrite = prompt("file already existing, overwrite ? [(y)es/(n)o]").toLowerCase == "y"
            // overwrite 
            if(b_overwrite_file_audio){
                
                var o_command = await f_o_command__generate_audio(
                    s_sentence,
                    o_files_info.s_path_file_audio
                );
            }
        }catch(e){
            console.log(`${o_files_info.s_path_file_audio}: file not existing yet`)

            
            var o_command = await f_o_command__generate_audio(
                s_sentence,
                o_files_info.s_path_file_audio
            );
        }
        o_files_info.s_path_file_video = `${o_story.s_path_folder}/n_o_files_info_n_id_${o_files_info.n_id}.mp4`
        
        try{
            var o_stat = await Deno.stat(o_files_info.s_path_file_video)
            // var b_overwrite = prompt("file already existing, overwrite ? [(y)es/(n)o]").toLowerCase == "y"
            // overwrite 
            if(b_overwrite_file_video){
                var o_command = await f_o_command__generate_video(
                    o_files_info.s_path_file_image_with_text, 
                    o_files_info.s_path_file_audio, 
                    o_files_info.s_path_file_video
                );
            }
        }catch(e){
            console.log(`${o_files_info.s_path_file_video}: file not existing yet`)

            var o_command = await f_o_command__generate_video(
                o_files_info.s_path_file_image_with_text, 
                o_files_info.s_path_file_audio, 
                o_files_info.s_path_file_video
            );
        }

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

    var a_s_path_video = a_o_files_info.map(o=>o.s_path_file_video);

    o_story.s_path_file_video = `${o_story.s_path_folder}/n_o_story_n_id_${o_story.n_id}.mp4`
    // o_story.s_path_file_video = `${o_story.s_path_folder}/n_o_story_n_id_${o_story.n_id}.mov`

    try{
        var o_stat = await Deno.stat(o_story.s_path_file_video)
        // var b_overwrite = prompt("file already existing, overwrite ? [(y)es/(n)o]").toLowerCase == "y"
        // overwrite 
        if(b_overwrite){
            var o_command = await f_o_command__generate_video_merged(
                a_s_path_video, 
                o_story.s_path_file_video
            );
        }
    }catch(e){
        console.log(`${o_story.s_path_file_video}: file not existing yet`)

        var o_command = await f_o_command__generate_video_merged(
            a_s_path_video, 
            o_story.s_path_file_video
        );
    }

    console.log("done !")
    console.log(o_story.s_path_file_video);
    Deno.exit()


}


// var o_story_hansel_und_gretel = await f_o_story(
//     "hansel_und_gretel", 
//     s_story_hansel_und_gretel,
//     f_n_seed,
//     async function(
//         o_story, 
//         o_files_info
//     ){
//         // renaming start ====================== holy shit
//         // var s_encoded_old = o_prompt_string_functions.f_s_encoded(o_files_info.s_text) 
//         // var n_matching_words_last = 0;
//         // var s_path_relative = './outputs/txt2img-samples'
//         // var s_folder_or_file2_real = ""
//         // for await (var o_folder_or_file of Deno.readDir(s_path_relative)) {
//         //     if(!o_folder_or_file.isFile){
//         //         for await (var o_folder_or_file2 of Deno.readDir(`${s_path_relative}/${o_folder_or_file.name}`)) {
//         //             // console.log(o_folder_or_file2)
//         //             var n_matching_words = 0;
//         //             if(o_folder_or_file2.name == `seed_${o_files_info.n_seed}_00000.png`){
//         //                 console.log("this")
//         //                 console.log(o_folder_or_file)
//         //                 console.log(o_folder_or_file2)
//         //                 for(var s of o_files_info.s_text.split(" ")){
//         //                     if(o_folder_or_file.name.indexOf(s) != -1){
//         //                         n_matching_words+=1;
//         //                     }
//         //                 }
//         //                 if(n_matching_words > n_matching_words_last){
//         //                     var o_folder_or_file2_real = o_folder_or_file
//         //                 }
//         //                 n_matching_words_last = n_matching_words
//         //             }
//         //         }
//         //     }
//         // }
//         // console.log(o_folder_or_file2_real.name)
//         // try{
    
//         //     await Deno.copyFile(
//         //         `./outputs/txt2img-samples/${o_folder_or_file2_real.name}/seed_${o_files_info.n_seed}_00000.png`, 
//         //         `${o_story.s_panumberth_folder}/n_o_files_info_n_id_${o_files_info.n_id}.png`
//         //     )
//         // }catch(e){
//         //     console.log(e)
//         // }
//         // renaming end   ====================== holy shit
    
//     }

// );

// var o_story_100_most_common_passwords = await f_o_story(
//     "100_most_common_passwords", 
//     s_story_common_passwords_hashed_md5, 
//     f_n_seed, 
//     async function(){

//     }
// );

// var o_story_wikipedia_machine_learning = await f_o_story(
//     "wikipedia_machine_learning", 
//     s_story_wikipedia_machine_learning, 
//     f_n_seed, 
// );


// var o_story_unusual_words = await f_o_story(
//     "unusual_words", 
//     s_story_unusual_words, 
//     f_n_seed, 
//     async function(
//         o_story, 
//         o_files_info
//     ){
//         // var s_name_folder_old = o_files_info.s_text.replaceAll(".", "");
//         // var n_seed_old = f_n_seed(s_name_folder_old);
//         // var s_name_file_old = `seed_${n_seed_old}_00000.png`;
//         // var s_path_file_old = `./outputs/txt2img-samples/${s_name_folder_old}/${s_name_file_old}`

//         // // var s_path_file_old = `./outputs/txt2img-samples/Abomasum/seed_821_00000.png`
//         // try{
//         //     await Deno.copyFile(
//         //         s_path_file_old, 
//         //         o_files_info.s_path_file_image
//         //     )
//         // }catch(o_e){
//         //     console.log(o_e)
//         // }
//         // // console.log(s_path_file_old)
//         // // console.log(o_story)
//         // // console.log(o_files_info)
//         // // Deno.exit(1)

//     }
// );




var o_story_movie_quotes = await f_o_story(
    "movie_quotes", 
    s_story_movie_quotes, 
    f_n_seed, 
    async function(
        o_story, 
        o_files_info
    ){
        // var s_name_encoded_old = o_prompt_string_functions.f_s_encoded(o_files_info.s_text);
        var s_name_encoded_old = o_files_info.s_text.replaceAll(" ", "_");
        s_name_encoded_old = window.escape(s_name_encoded_old);
        // console.log(s_name_encoded_old)
        // Deno.exit(1)
        // s_name_encoded_old = encodeURIComponent(s_name_encoded_old).replace(/[']/g, window.escape);
        var n_seed_old = f_n_seed(o_files_info.s_text);
        var s_name_file_old = `${s_name_encoded_old}_seed_${n_seed_old}_00000.png`;
        var s_path_file_old = `./create_from_movie_quotes/${s_name_encoded_old}/${s_name_file_old}`

        // var s_path_file_old = `./outputs/txt2img-samples/Abomasum/seed_821_00000.png`
        try{
            await Deno.copyFile(
                s_path_file_old, 
                o_files_info.s_path_file_image
            )
        }catch(o_e){
            console.log(o_e)
        }
        // console.log(s_path_file_old)
        // console.log(o_story)
        // console.log(o_files_info)
        // Deno.exit(1)

    }
);
