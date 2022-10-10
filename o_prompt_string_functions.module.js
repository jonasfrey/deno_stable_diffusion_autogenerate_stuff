
var o_prompt_string_functions = {
    f_s_encoded: function(s){
        return encodeURIComponent(s.replaceAll(" ", "_"))
    },
    f_s_decoded: function(s){
        return decodeURIComponent(s.replaceAll("_", " "))
    }
}

export {
    o_prompt_string_functions 
}

