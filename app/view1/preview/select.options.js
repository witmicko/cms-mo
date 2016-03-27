/**
 * Created by michal on 27/03/16.
 */
var appOptions = angular.module('appOptions', []);

appOptions.service("select_options", function () {
    var options = {};
    
    options.padding_left_options= [
        {id: "rl_padding_left_05", name: "05"},
        {id: "rl_padding_left_10", name: "10"},
        {id: "rl_padding_left_15", name: "15"},
        {id: "rl_padding_left_20", name: "20"},
    ];

    options.margin_top_options= [
        {id: "rl_margin_top_05", name:"05"},
        {id: "rl_margin_top_10", name:"10"},
        {id: "rl_margin_top_15", name:"15"},
        {id: "rl_margin_top_20", name:"20"}
    ];
    options.text_align_options= [
        {id: "text-center", name: "Center"},
        {id: "text-left", name: "Left"},
        {id: "text-right", name: "Right"}
    ];
    options.text_color_options= [
        {id: "rl_text_color_black", name: "Black"},
        {id: "rl_text_color_white", name: "White"},
        {id: "rl_text_color_yellow", name: "Yellow"},
        {id: "rl_text_color_orange", name: "Orange"},
        {id: "rl_text_color_red", name: "Red"},
        {id: "rl_text_color_purple", name: "Purple"},
        {id: "rl_text_color_violet", name: "Violet"},
        {id: "rl_text_color_blue", name: "Blue"},
        {id: "rl_text_color_green", name: "Green"},
    ];
    options.rl_font_size_options= [
        {id: "rl_font_1_0", name: "1.0"},
        {id: "rl_font_1_2", name: "1.2"},
        {id: "rl_font_1_5", name: "1.5"},
        {id: "rl_font_1_8", name: "1.8"},
        {id: "rl_font_2_0", name: "2.0"},
        {id: "rl_font_2_5", name: "2.5"}
    ];
    options.font_size_options = [
        {id: "font-size:0.5em", name: "1"},
        {id: "font-size:0.6em", name: "2"},
        {id: "font-size:0.7em", name: "3"},
        {id: "font-size:0.8em", name: "4"},
        {id: "font-size:0.9em", name: "5"},
        {id: "font-size:1.0em", name: "6"},
        {id: "font-size:1.1em", name: "7"},
        {id: "font-size:1.2em", name: "8"},
        {id: "font-size:1.3em", name: "9"},
        {id: "font-size:1.4em", name: "10"},
        {id: "font-size:1.5em", name: "11"},
        {id: "font-size:1.6em", name: "12"},
        {id: "font-size:1.7em", name: "13"},
        {id: "font-size:1.8em", name: "14"},
        {id: "font-size:1.9em", name: "15"},
        {id: "font-size:2.0em", name: "16"},
        {id: "font-size:2.1em", name: "17"},
        {id: "font-size:2.2em", name: "18"},
        {id: "font-size:2.3em", name: "19"},
        {id: "font-size:2.4em", name: "20"}
    ];
    options.background_color_options = [
        {id:"rl_bkg_color_blue", name: "Blue"},
        {id:"rl_bkg_color_blue1", name: "Blue 1"},
        {id:"rl_bkg_color_yellow", name: "Yellow"},
        {id:"rl_bkg_color_red", name: "Red"},
        {id:"rl_bkg_color_clr_black", name: "Black"},
        {id:"rl_bkg_color_green", name: "Green"},
        {id:"rl_bkg_color_olive", name: "Olive"},
        {id:"rl_bkg_color_mauve", name: "Mauve"},
        {id:"rl_bkg_color_orange", name: "Orange"},
        {id:"rl_bkg_color_white", name: "White"}
    ];
    options.border_shadow_options = [
        {id: "rl_box_shadow1", name: "Yes"},
        {id: "", name: "No"}
    ];
    
    options.border_type_options = [
        {id:"rl_brd_dashed", name: "Dashed"},
        {id:"rl_brd_double", name: "Double"},
        {id:"rl_brd_dotted", name: "Dotted"},
        {id:"rl_brd_groove", name: "Groove"},
        {id:"rl_brd_hidden", name: "Hidden"},
        {id:"rl_brd_inset" , name: "Inset"},
        {id:"rl_brd_mix"   , name: "Mix"},
        {id:"rl_brd_none"  , name: "None"},
        {id:"rl_brd_outset", name: "Outset"},
        {id:"rl_brd_ridge" , name: "Ridge"},
        {id:"rl_brd_solid" , name: "Solid"}
    ];
    options.border_corner_options=[
        {id:"rl_rcorners15", name: "15"},
        {id:"rl_rcorners20", name: "20"},
        {id:"rl_rcorners25", name: "25"},
        {id:"rl_rcorners30", name: "30"}
    ];
    options.border_color_options=[
        {id:"rl_brd_clr_red", name: "Red"},
        {id:"rl_brd_clr_black", name: "Black"},
        {id:"rl_brd_clr_white", name: "White"},
        {id:"rl_brd_clr_green", name: "Green"},
        {id:"rl_brd_clr_blue", name: "Blue"}
    ];
    return options;
});